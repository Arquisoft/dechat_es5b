const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
var loginM = require('./LogInManager.js');
var chatM = require('./chatManager.js');
const userDataUrl = 'https://martinreycristina.solid.community/public/micarpeta';


 // Set up a local data store and associated data fetcher
 const store = $rdf.graph();
 const fetcher = new $rdf.Fetcher(store);


// Log the user in and out on click
$('#login  button').click(() => loginM.login());
$('#logout button').click(() => loginM.logout());

// Update components to match the user's login status
solid.auth.trackSession(session => {
  const loggedIn = !!session;
  if (loggedIn) {
    $('#user').text(session.webId);
    // Use the user's WebID as default profile
    if (!$('#profile').val())
      $('#profile').val(session.webId);
  }
});

$('#view').click(async function loadProfile() {
  // Set up a local data store and associated data fetcher
  //const store = $rdf.graph();
  //const fetcher = new $rdf.Fetcher(store);
  //DEFINED ON HEADER

  // Load the person's data into the store
  const person = $('#profile').val();
  await fetcher.load(person);

  // Display their details
  const fullName = store.any($rdf.sym(person), FOAF('name'));
  $('#fullName').text(fullName && fullName.value);

  // Display their friends
  const friends = store.each($rdf.sym(person), FOAF('knows'));
  $('#friends').empty();
  friends.forEach(async (friend) => {
    await fetcher.load(friend);
    const fullName = store.any(friend, FOAF('name'));
    $('#friends').append(
      $('<li>').append(
        $('<a>').text(fullName && fullName.value || friend.value)
          .click(() => $('#profile').val(friend.value))
          .click(loadProfile)));
    $('#friends').append(
      $('<a>').text('Send Message')
        .click(()=> chatM.createChatFolder(userDataUrl)));
  });
});


$('#sendButton').click(async function sendFunc()  {
  //Obtain solid community URL
  var person = $('#profile').val();
  var URI = person.substr(0,(person.length-15));

  //Obtener el nombre del usuario, Sera tilizado como nombre de la carpeta
  var user = store.any($rdf.sym($('#profile').val()), FOAF('name'));

  //Mensaje a enviar, contenido de fichero
  var text = $('#messageText').val();

  console.log("URI:"+URI+"      User:"+user+"          text:"+text);
  chatM.sendMessage(URI,user,text);
});

/**
 * This method generates a unique url for a resource based on a given base url.
 * @param baseurl: the base url for the url of the resource.
 * @returns {Promise<string>}: a promise that resolves with a unique url.
 */
async function generateUniqueUrlForResource(baseurl) {
  let count =1;
  let url = baseurl + '#' + '1234';

  try {
    let d = this.getObjectFromPredicateForResource(url, namespaces.rdf + 'type');

    // We assume that if this url doesn't have a type, the url is unused.
    // Ok, this is not the most fail-safe thing.
    // TODO: check if there are any triples at all.
    while (d) {
      url = baseurl + '#' + (count+1);
      d = await this.getObjectFromPredicateForResource(url, namespaces.rdf + 'type');
    }
  } catch (e) {
    // this means that response of data[url] returns a 404
    // TODO might be called when you have no access, should check
  } finally {
    return url;
  }
}
