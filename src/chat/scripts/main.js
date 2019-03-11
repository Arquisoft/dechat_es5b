const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
var loginM = require('./LogInManager.js');
var chatM = require('./chatManager.js');

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
    if (!$('#profile').text())
      $('#profile').text(session.webId);
  }
  loadProfile();
});

$('#sendButton').click(
  async function sendFunc()  {
	  if (document.getElementById("friends").value == "") 
		  alert("Debe seleccionar un usuario."); 
	  else{
	    //Obtain solid community URL
      chatM.INFO.URI = chatM.INFO.person.substr(0,(chatM.INFO.person.length-15));

	    //Get user name, It will be used as the folder name.
	    //var user = store.any($rdf.sym(chatM.INFO.receiver), FOAF('name')).toString().replace(/ /g, "");

	    //Message to be sent, contents of file.
	    var text = $('#messageText').val();

	    console.log("URI:"+chatM.INFO.URI+"      User:"+chatM.INFO.receiver+"          text:"+text);
	    chatM.sendMessage(text);
	  }
  }
);

//------------------------------------- FUNCTIONS ---------------------------------------------

async function loadProfile() {
    // Load the person's data into the store
    chatM.INFO.person = $('#profile').text();
    await fetcher.load(chatM.INFO.person);


    // Display their details
    chatM.INFO.userName = store.any($rdf.sym(chatM.INFO.person), FOAF('name'));
    $('#fullName').text(chatM.INFO.userName);
    
    // Display their friends
    const friends = store.each($rdf.sym(chatM.INFO.person), FOAF('knows'));
    $('#friends').empty();
    friends.forEach(
      async (friend) => {
        await fetcher.load(friend);
		    $('#friends').append(
            $('<option>').text(store.any(friend, FOAF('name')))
            .click(
                () => {
                  chatM.INFO.receiver = store.any(friend, FOAF('name'));
                  alert(chatM.INFO.receiver);
                }
              ));
    });
}

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
