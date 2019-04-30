const $rdf = require('rdflib');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
var chatM = require('./chatManager.js');
var loginM = require('./LogInManager.js');

// Set up a local data store and associated data fetcher
const store = $rdf.graph();
const fetcher = new $rdf.Fetcher(store);

class friend {
	constructor(uri, name) {
		this.uri = uri;
		this.name = name;
	}
}

//Show modal on login button click
$('#login  button').click(() => $('#modalIDP').modal('show'));

// Logout on button click
$('#logout button').click(() => loginM.logout());

//"Login with SOLID Community" should redirect to solid.community login page
$("#solidLogin").click(function () {
	$('#desiredIDP').val('https://solid.community');
	loginM.login();
});

//Login with desired IDP button
$("#idpLogin").click(function () {
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
	async function sendFunc() {
		//await checkNotifications();
		if (document.getElementById("friends").value == "")
			alert("Debe seleccionar un usuario.");
		else {
			//Message to be sent, contents of file.
			var text = $('#messageText').val();
			if (!(text.trim().length === 0)) {
				//Send MSG
				console.log("Sending from:" + chatM.INFO.userName + "		To:" + chatM.INFO.receiverName + "			text:" + text);
				await chatM.sendMessage(text);

				//Erase input field
				$('#messageText').val('');
				updateMessages(await chatM.receiveMessages());
			}
		}
	}
);

$('#filtro-nombre').on(
	'input', async function (e) {
		var sortedFriends = await getFriends(), filteredFriends = [];
		var nombreFiltro = $("#filtro-nombre").val();

		for (i = 0; i < sortedFriends.length; i++) {
			if (sortedFriends[i].name.toLowerCase().indexOf(nombreFiltro.toLowerCase()) != -1) {
				filteredFriends.push(sortedFriends[i]);
			}
		}
		showFriends(filteredFriends);
	}
);

async function getFriends() {
	const friends = store.each($rdf.sym(chatM.INFO.user), FOAF('knows'));
	$('#friends').empty();

	var sortedFriends = [];

	await Promise.all(friends.map(async f => {
		await fetcher.load(f);
		sortedFriends.push(new friend(f.value, await store.any(f, FOAF('name')).toString()));
	}));

	sortedFriends.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	return sortedFriends;
}

async function getFriendsAlternative() {
	const friends = store.each($rdf.sym(chatM.INFO.user), FOAF('knows'));

	var sortedFriends = [];

	await Promise.all(friends.map(async f => {
		await fetcher.load(f);
		sortedFriends.push(new friend(f.value, await store.any(f, FOAF('name')).toString()));
	}));

	sortedFriends.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	return sortedFriends;
}

async function checkNotifications() {
	let friends = await getFriendsAlternative();
	let ls = $(".list-group-item-action");
	console.log(ls);
	for (let i = 0; i < ls.length; i++) {
		let uri = friends[i].uri.substr(0, (friends[i].uri.length - 15));
		let name = friends[i].name.trim();
		if (await chatM.checkNewMessages(uri, name)) {
			ls[i].classList.add("noti");
			ls[i].innerHTML += '<i class="ico"></i>';
		}else{
			ls[i].classList.remove("noti");
			ls[i].innerHTML = friends[i].name;
		}
	}
	console.log($(".list-group-item-action"));
}

window.setInterval(async function () {
	await checkNotifications();
}, 8000);

//.append($('<button>').attr('type', 'ico').addClass("ico").text(""))
async function showFriends(sortedFriends) {
	sortedFriends.forEach(
		async (friend) => {
			let notification = false;
			console.log(friend.uri.substr(0, (friend.uri.length - 15)));
			/*if (await chatM.checkNewMessages(friend.uri.substr(0, (friend.uri.length - 15)), friend.name.trim())) {
				notification = true;
			}*/
			console.log("el resultado es: " + notification);
			await fetcher.load(friend);
			let = clase = "";
			if (notification) {
				clase = "noti";
			}
			$('#friends').append(
				$('<button>').attr('type', 'button').addClass("list-group-item list-group-item-action noactive " + clase).text(friend.name).click(
					async function () {
						if (chatM.ToLog)
							console.log("load new receiver");
						//Store all reciever info need for future
						chatM.INFO.receiver = friend.uri;
						chatM.INFO.receiverName = friend.name.trim();
						chatM.INFO.receiverURI = chatM.INFO.receiver.substr(0, (chatM.INFO.receiver.length - 15));

						//Add the selected marker (That blue thing..)
						$("#friends button").removeClass("active");
						$("#friends button").addClass("noactive");
						$(this).removeClass("noactive");
						$(this).addClass("active");
						//Show messages
						updateMessages(await chatM.receiveMessages());
						await checkNotifications();
					}
				));

		});
}

window.setInterval(async function () {
	updateMessages(await chatM.receiveMessages());
}, 3000);

async function loadProfile() {
	if (chatM.ToLog)
		console.log("loading Profile");
	// Load the person's data into the store
	chatM.INFO.user = $('#profile').attr("href");
	await fetcher.load(chatM.INFO.user);
	//Obtain solid community URL
	chatM.INFO.userURI = chatM.INFO.user.substr(0, (chatM.INFO.user.length - 15));

	// Display their details
	chatM.INFO.userName = store.any($rdf.sym(chatM.INFO.user), FOAF('name')).toString();
	$('#fullName').text(chatM.INFO.userName);

	// Execute a function when the user releases a key on the keyboard
	document.getElementById('messageText').addEventListener("keyup", function (event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			// Cancel the default action, if needed
			event.preventDefault();
			// Trigger the button element with a click
			$('#sendButton').click();
		}
	});

	// Display their friends
	showFriends(await getFriends());
}




function updateMessages(toShow) {
	if (chatM.ToLog)
		console.log("Update msgs");
	var messages = "";
	$('#messages').empty();
	toShow.forEach((message) => {
		messages = messages + message;
	});
	$('#messages').append(messages);
}
