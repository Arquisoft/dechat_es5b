const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const chatManager1 = require("../../../src/chat/scripts/chatManager.js");
const chatManager2 = require("../../../src/chat/scripts/chatManager.js");
const fc = require("solid-file-client"); // <<<<<--------------------------------
const OK = 1;							// <<<<<--------------------------------

function isItFriday(today) {
  if (today === "Friday") {
    return "TGIF";
  } else {
    return "Nope";
  }
}

Given('today is {string}', function (givenDay) {
  this.today = givenDay;
});

When('I ask whether it\'s Friday yet', function () {
  this.actualAnswer = isItFriday(this.today);
});

Then('I should be told {string}', function (expectedAnswer) {
  assert.equal(this.actualAnswer, expectedAnswer);
});

Given('I\'m using the chat', function() {
	chatManager1.INFO.user="jandrolaviana";
	chatManager1.INFO.receiver="pruebaes5b";
});

When('I send a message {string} to a friend', async function(message) {
	chatManager1.sendMessage = function() { return message; }
	this.reply = await chatManager1.sendMessage(message);
});

Then('My friend gets the message {string}', function(message) {
	assert.equal(this.reply, message); 
});

Given('I\'m using the chat app', function() {
	chatManager1.INFO.user="jandrolaviana";			// ME
	chatManager1.INFO.receiver="pruebaes5b";		// MY FRIEND
	chatManager1.MESSAGES.userMSG=["Hey my friend", "Good thanks"];
	chatManager1.MESSAGES.friendMSG=["Hi!", "How are you?"];

	chatManager2.INFO.user="jandrolaviana";			// ME
	chatManager2.INFO.receiver="martinreycristina";	// MY FRIEND
	chatManager2.MESSAGES.userMSG=["Hey Cristina", "Good thanks"];
	chatManager2.MESSAGES.friendMSG=["Hi!", "How are you?"];
});

When('I\'m chatting with {string}', async function(friendName) {
	var ok = false;
	if(chatManager1.INFO.receiver === friendName)
		ok = true;
	else if(chatManager2.INFO.receiver === friendName)
		ok = true;
	assert.equal(ok, true);
});

Then('I recieve a message {string} from my friend {string}', function(message, friendName) {
	var ok = containsMessageAndFriend(chatManager1, message, friendName);
	if(ok === true)
		assert.equal(ok, true);
	else {
		ok = containsMessageAndFriend(chatManager2, message, friendName);
		assert.equal(ok, true);
	}
});

function containsMessageAndFriend(cm, message, friendName) {
	var i;
	for(i=0; i<cm.MESSAGES.friendMSG.length; i++)
		if(cm.MESSAGES.friendMSG[i] === message && cm.INFO.receiver === friendName)
			return true;
	return false;
}
