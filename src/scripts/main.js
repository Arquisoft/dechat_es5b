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
var friends = null;
var current = null;

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

//Creates a group with selected users
$('#groupButton').click(() =>
	$('#modalGroup').modal('show')
);

//Allows the user to join an already formed group
$('#groupJoin').click(() =>
	$('#modalJoinGroup').modal('show')
);

//Adds a friend to the creation group list
$('#modalAddFriend').click(() => {
	var name = $('#friends-to-add').find(".active").text();
	if (name != "") {
		$('#friends-to-add').find(".active").remove();
		addFriendToList(name, '#added-friends');
	}
});

//Removes a friend from the creation group list
$('#modalRemoveFriend').click(() => {
	var name = $('#added-friends').find(".active").text();
	if (name != "") {
		$('#added-friends').find(".active").remove();
		addFriendToList(name, '#friends-to-add');
	}
});

//Creates a group chat
$('#modalCreateGroup').click(async function () {
	var groupName = $('#modalGroupName').val();
	var friendsToAdd = $('#added-friends').find('button');
	var error = false;

	if (groupName == '') {
		$('#modalGroupName').attr('style', 'border-color: red;');
		error = true;
	}
	if (friendsToAdd.length == 0) {
		$('#modalAddFriend').attr('style', 'border-color: red;');
		error = true;
	}

	chatM.GROUP.name = groupName;
	var f;
	console.log(friends);
	for (var i = 0; i < friendsToAdd.length; i++) {
		f = friends.find(function (element) {
			return element.name == $(friendsToAdd[i]).text();
		});

		chatM.GROUP.friends.push({
			uri: f.uri,
			name: f.name,
			utilUri: f.uri.substr(0, (f.uri.length - 15))
		});
	}

	//Adding this user
	chatM.GROUP.friends.push({
		uri: chatM.INFO.user,
		name: chatM.INFO.userName,
		utilUri: chatM.INFO.userURI
	});

	var group = chatM.GROUP;

	if (!error) {
		restartModalDialog();
		$('#modalGroup').modal('hide');

		chatM.createGroup().then((folder) => {
			if (!folder) {
				console.log('Error Creating Group folder');
			} else {
				$('#modalUrl').text(folder);
				$('#modalUrlGroup').modal('show');

				$('#friends').append(
					$('<button>').attr('type', 'button').addClass("list-group-item list-group-item-action noactive").text(groupName).click(
						async function () {
							chatM.GROUP.name = group.name;
							chatM.GROUP.friends = group.friends;
							current = chatM.GROUP;

							//Add the selected marker (That blue thing..)
							$("#friends button").removeClass("active");
							$("#friends button").addClass("noactive");
							$(this).removeClass("noactive");
							$(this).addClass("active");
							//Show messages
							updateMessages(await chatM.receiveGroupMessages());
						}
					));
			}
		});
	}
});

//Allows the user to join an already formed group
$('#modalButtonJoin').click(() => {
	var URL = $('#toJoin').val();

	if (URL == '') {
		alert('No se ha introducido ninguna URL.');
	} else {
		chatM.joinGroup(URL).then((group) => {
			if (!group) {
				alert('Something went wrong while joining the group.');
			} else {
				$('#friends').append(
					$('<button>').attr('type', 'button').addClass("list-group-item list-group-item-action noactive").text(group.name).click(
						async function () {
							chatM.GROUP.name = group.name;
							chatM.GROUP.friends = group.friends;
							current = chatM.GROUP;

							//Add the selected marker (That blue thing..)
							$("#friends button").removeClass("active");
							$("#friends button").addClass("noactive");
							$(this).removeClass("noactive");
							$(this).addClass("active");
							//Show messages
							updateMessages(await chatM.receiveGroupMessages());
						}
					));

				$('#modalJoinGroup').modal('hide');
				$('#toJoin').val('');
			}
		});
	}
});

$('#modalCloseButton').click(() => {
	restartModalDialog();
});

//Restart the modal status
function restartModalDialog() {
	//Erase input field
	$('#modalGroupName').val('');

	//Moves all friends to the first list of the modal dialogue.
	var buttons = $('#added-friends').find('button');
	for (var i = 0; i < buttons.length; i++) {
		addFriendToList($(buttons[i]).text(), '#friends-to-add');
	}

	// The list of added friends is emptied
	$('#added-friends').empty();

	// If there has been an error, return the border to its original color.
	$('#modalGroupName').attr('style', 'border-color: #545b62;');
	$('#modalAddFriend').attr('style', 'border-color: #545b62;');
};

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
				await chatM.sendMessage(text, current.isGroup);

				//Erase input field
				$('#messageText').val('');
				if (current.isGroup)
					updateMessages(await chatM.receiveGroupMessages());
				else
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
	friends = store.each($rdf.sym(chatM.INFO.user), FOAF('knows'));
	$('#friends').empty();

	var sortedFriends = [];

	await Promise.all(friends.map(async f => {
		await fetcher.load(f);
		sortedFriends.push(new friend(f.value, await store.any(f, FOAF('name')).toString()));
	}));

	sortedFriends.sort(function (a, b) {
		return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
	});

	friends = sortedFriends;
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
	//console.log(ls);
	for (let i = 0; i < friends.length; i++) {
		console.log(friends[i]);
		if ($(ls[i]).attr('chatType') != 'group') {
			let uri = friends[i].uri.substr(0, (friends[i].uri.length - 15));
			let name = friends[i].name.trim();
			if (await chatM.checkNewMessages(uri, name) && ls[i].classList[2] == 'noactive') {
				ls[i].classList.add("noti");
				ls[i].innerHTML += '<i class="ico"></i>';
			} else {
				ls[i].classList.remove("noti");
				ls[i].innerHTML = friends[i].name;
			}
		}
	}
	//console.log($(".list-group-item-action"));
}

window.setInterval(async function () {
	await checkNotifications();
}, 5000);


async function showFriends(sortedFriends) {
	sortedFriends.forEach(
		async (friend) => {
			await fetcher.load(friend);
			$('#friends').append(
				$('<button>').attr('type', 'button').attr('chatType', 'personal').addClass("list-group-item list-group-item-action noactive").text(friend.name).click(
					async function () {
						if (chatM.ToLog)
							console.log("load new receiver");
						//Store all reciever info need for future
						chatM.INFO.receiver = friend.uri;
						chatM.INFO.receiverName = friend.name.trim();
						chatM.INFO.receiverURI = chatM.INFO.receiver.substr(0, (chatM.INFO.receiver.length - 15));
						chatM.setUpFolder();

						current = chatM.INFO;

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
			addFriendToList(friend.name, '#friends-to-add');
		});
}


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

	chatM.readGroups().then((groups) => {
		groups.forEach((group) => {
			$('#friends').append(
				$('<button>').attr('type', 'button').attr('chatType', 'group').addClass("list-group-item list-group-item-action noactive").text(group.name).click(
					async function () {
						chatM.GROUP.name = group.name;
						chatM.GROUP.friends = group.friends;
						current = chatM.GROUP;

						//Add the selected marker (That blue thing..)
						$("#friends button").removeClass("active");
						$("#friends button").addClass("noactive");
						$(this).removeClass("noactive");
						$(this).addClass("active");

						//Show messages
						updateMessages(await chatM.receiveGroupMessages());
					}
				));
		});
	});
}



window.setInterval(async function () {
	if (current.isGroup)
		updateMessages(await chatM.receiveGroupMessages());
	else
		updateMessages(await chatM.receiveMessages());
}, 2000);



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


function addFriendToList(friendName, list) {
	$(list).append(
		$('<button>').attr('type', 'button').addClass("list-group-item list-group-item-action noactive").text(friendName).click(
			async function () {
				$("#friends-to-add button").removeClass("active");
				$("#friends-to-add button").addClass("noactive");
				$(this).removeClass("noactive");
				$(this).addClass("active");
			}
		));
}
