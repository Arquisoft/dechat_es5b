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

describe('readFile', function() {
	 it('Read File', async function() {
		 await chatM.readFile('https://pruebaes5b.solid.community/public/Prueba/ficheroprueba.txt');
	});
});

describe('readFolder', function() {
	 it('Read folder', async function() {
		 await chatM.readFolder('https://pruebaes5b.solid.community/public/Prueba');
	});
});

describe('deleteFile', function() {
	 it('Delete File', async function() {
		 await chatM.deleteFile('https://pruebaes5b.solid.community/public/Prueba/ficheroprueba.txt');
	});
});

describe('deleteFolder', function() {
	 it('Delete Folder', async function() {
		 await chatM.deleteFolder('https://pruebaes5b.solid.community/public/Prueba/');
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