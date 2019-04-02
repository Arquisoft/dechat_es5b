const $rdf = require('rdflib');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
var loginM = require('./LogInManager.js');
var chatM = require('./chatManager.js');

// Set up a local data store and associated data fetcher
const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store);

//Si ya estamos conectados, redirigimos al chat
$(document).ready(async function() {
  let session = await solid.auth.currentSession();
	if (session && window.location.href.replace(/^(?:\/\/|[^\/]+)*\//, "/").split('#')[0]=='/'){
		// esto comprueba si la sesion esta iniciada (session es true) y si la ruta es la del
		// login (window.location.href es la ruta absoluta, el replace retira http://localhost:1919 o el correspondiente dominio)
		window.location.href = "two-people-chat.html";
	}
});

// Log the user in and out on click
$('#login  button').click(() => loginM.login());
$('#logout button').click(() => loginM.logout());

$("#solidLogin").click(function() {
		  $('#desiredIDP').val('https://solid.community');
		  loginM.login();
		});

// Update components to match the user's login status
solid.auth.trackSession(session => {
  const loggedIn = !!session;
  if (loggedIn) {
	$('#user').text(session.webId);
	// Use the user's WebID as default profile
	if (!$('#profile').attr("href"))
	  $('#profile').attr("href", session.webId);
  }
  loadProfile();
});

//SendMessage Function, Send Button on click action
$('#sendButton').click(
  async function sendFunc()	 {
	  if (document.getElementById("friends").value == "") 
		  alert("Debe seleccionar un usuario."); 
	  else{
		//Message to be sent, contents of file.
		var text = $('#messageText').val();

		//Send MSG
		("Sending from:"+chatM.INFO.userName+"		To:"+chatM.INFO.receiverName+"			text:"+text);
		await chatM.sendMessage(text);
		
		//Erase input field
		$('#messageText').val('');
		  updateMessages(await chatM.receiveMessages());
	  }
  }
);

async function loadProfile() {
	if(chatM.ToLog)
	  console.log("loading Profile");
	// Load the person's data into the store
	chatM.INFO.user = $('#profile').attr("href");
	await fetcher.load(chatM.INFO.user);
	//Obtain solid community URL
	chatM.INFO.userURI = chatM.INFO.user.substr(0,(chatM.INFO.user.length-15));

	// Display their details
	chatM.INFO.userName = store.any($rdf.sym(chatM.INFO.user), FOAF('name')).toString();
	$('#fullName').text(chatM.INFO.userName);
	
	// Display their friends
	const friends = store.each($rdf.sym(chatM.INFO.user), FOAF('knows'));
	$('#friends').empty();
	friends.forEach(
	  async (friend) => {
		await fetcher.load(friend);
			$('#friends').append(
			$('<button>').attr('type', 'button').addClass("list-group-item list-group-item-action noactive").text(store.any(friend, FOAF('name'))).click(
				async function () {
					if(chatM.ToLog)
						console.log("load new receiver");
					//Store all reciever info need for future
					chatM.INFO.receiver = friend.value;
					chatM.INFO.receiverName = store.any(friend, FOAF('name')).toString().trim();
					chatM.INFO.receiverURI = chatM.INFO.receiver.substr(0,(chatM.INFO.receiver.length-15));
					
					//Add the selected marker (That blue thing..)
					$("#friends button").removeClass("active");
					$("#friends button").addClass("noactive");
					$(this).removeClass("noactive");
					$(this).addClass("active");
					//Show messages
					updateMessages(await chatM.receiveMessages());
				}
			  ));
	});
}

window.setInterval(async function(){
  updateMessages(await chatM.receiveMessages());
}, 4000);

function updateMessages(toShow){
  if(chatM.ToLog)
    console.log("Update msgs");
  var messages="";
	$('#messages').empty();
	toShow.forEach( (message) => {
	  messages=messages+message;
  });
  $('#messages').append(messages);
}