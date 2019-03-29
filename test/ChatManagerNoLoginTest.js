require('chai');
var assert = require('assert');
var podUtils = require('../src/scripts/podUtilities.js');
const fileClient = require('solid-file-client');

const credentials = {
    "idp"      : "https://solid.community",
    "username" : "pruebaes5b",                  
    "password" : "CE.ji.JU-55", 
    "base"     : "https://pruebaes5b.solid.community",
    "test"     : "/public/test/"
}

fileClient.login(credentials);

/*describe('Log In', function() {
	it('Test', async function() {
		await fileClient.login(credentials);
	});
});*/

/*describe('createFolder', function() {
	 it('Create Folder', async function() {
		 await podUtils.createFolder('https://pruebaes5b.solid.community/public/Prueba1');
	});
});*/

/*describe('createFile', function() {
	 it('Create File', async function() {
		 await podUtils.createFile('https://pruebaes5b.solid.community/public/PruebaSinLogin/ficheroprueba1','pruebaTest');
	});
});*/

describe('readFile', function() {
	 it('Read File', async function() {
		 await podUtils.readFile('https://pruebaes5b.solid.community/public/PruebaSinLogin/ficheroprueba.txt');
	});
});

describe('readFolder', function() {
	 it('Read folder', async function() {
		 await podUtils.readFolder('https://pruebaes5b.solid.community/public/PruebaSinLogin');
	});
});

describe('deleteFile', function() {
	 it('Delete File', async function() {
		 await podUtils.deleteFile('https://pruebaes5b.solid.community/public/PruebaSinLogin/ficheroprueba.txt');
	});
});

describe('deleteFolder', function() {
	 it('Delete Folder', async function() {
		 await podUtils.deleteFolder('https://pruebaes5b.solid.community/public/PruebaSinLogin/');
	});
});

/*
describe('ChatManagerTest', function () {
    it('Testing SendMenssage', async function () {
      let r =  await podUtils.sendMessage();
      assert.equal(r, true);
   });
 
   it('Testing ReceiveMessage', async function () {
     let r = await podUtils.receiveMessages();
     assert.typeOf(r,"Array");
   });
});*/