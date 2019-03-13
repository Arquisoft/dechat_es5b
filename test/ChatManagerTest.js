require('chai');
var assert = require('assert');
var chatM = require('../src/chat/scripts/chatManager.js');
const fileClient = require('solid-file-client');

const credentials = {
    "idp"      : "https://solid.community",
    "username" : "pruebaes5b",                  
    "password" : "CE.ji.JU-55", 
    "base"     : "https://pruebaes5b.solid.community",
    "test"     : "/public/test/"
}

describe('Log In', function() {
	it('Test', async function() {
		await fileClient.login(credentials);
	});
});

describe('createFolder', function() {
	 it('Create Folder', async function() {
		 await chatM.createFolder('https://pruebaes5b.solid.community/public/Prueba');
	});
});

describe('createFile', function() {
	 it('Create File', async function() {
		 await chatM.createFile('https://pruebaes5b.solid.community/public/Prueba/ficheroprueba','pruebaTest');
	});
});

/*
describe('ChatManagerTest', function () {
    it('Testing SendMenssage', async function () {
      let r =  await chatM.sendMessage();
      assert.equal(r, true);
   });
 
   it('Testing ReceiveMessage', async function () {
     let r = await chatM.receiveMessages();
     assert.typeOf(r,"Array");
   });
});*/