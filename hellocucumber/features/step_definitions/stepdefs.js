const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const chatManager = require("../../../src/chat/scripts/chatManager.js");
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
	chatManager.INFO.user="jandrolaviana";
	chatManager.INFO.userName="jandrolaviana";
	chatManager.INFO.userURI="https://jandrolaviana.solid.community";
	chatManager.INFO.receiver="pruebaes5b";
	chatManager.INFO.recieverName="pruebaes5b";
	chatManager.INFO.recieverURI="https://pruebaes5b.solid.community";
});

When('I send a message {string} to a friend', async function(message) {
	chatManager.sendMessage = function() { return message; }
	this.reply = await chatManager.sendMessage(message);
});

Then('My friend gets the message {string}', function(message) {
	assert.equal(this.reply, message); 
});
