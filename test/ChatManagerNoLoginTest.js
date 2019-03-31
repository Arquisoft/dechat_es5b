require('chai');
var assert = require('assert');
var chatM = require('../src/scripts/chatManager.js');
var loginM = require('../src/scripts/LogInManager.js');
var podUtils = require('../src/scripts/podUtilities.js')
const fileClient = require('solid-file-client');

const credentials = {
    "idp"      : "https://solid.community",
    "username" : "pruebaes5b",                   
    "password" : "CE.ji.JU-55", 
    "base"     : "https://pruebaes5b.solid.community",
    "test"     : "/public/test/"
}
const testFolderUrl = credentials.base + "/public/test/";
const testFileUrl = testFolderUrl + "testfile";
const testReadFile = "https://cristina.solid.community/public/SolidChat/Cristina-Mart%C3%ADn-Rey/1552487905499.txt";

describe('Log In', function() {
	it('Test login function', async function() {
		this.timeout(4000);
		assert.equal( await podUtils.login(credentials) ,true);
	});
});

describe('Test POD Utilities', function() {
	it('createFolder', async function() {
		this.timeout(1500);
		assert.equal( await podUtils.createFolder(testFolderUrl,false) ,true);
	});
	it('createFile', async function() {
		this.timeout(800);
		assert.equal( await podUtils.createFile(testFileUrl,"test create file",true) ,true);
		assert.equal( await podUtils.readFile(testFileUrl+".txt",false) , "test create file");
	});
	it('readFile', async function() {
		this.timeout(800);
		assert.equal( await podUtils.readFile(testReadFile,false), "hola");
	});
	it('readFolder', async function() {
		this.timeout(800);
		const folder = await podUtils.readFolder(testFolderUrl,false);
		assert.equal( folder.name, "test");
		assert.equal(folder.files.length,1);
		assert.equal(testFolderUrl, "https://pruebaes5b.solid.community/public/test/");
	});
	it('deleteFile', async function() {
		this.timeout(800);
		assert.equal( await podUtils.deleteFile(testFileUrl+".txt",false), true);
		assert.equal( await podUtils.readFile(testFileUrl+".txt",false), null);
	});
});
/*

describe('deleteFolder', function(done) {
	 it('Delete Folder', async function() {
		var testPromise =  new Promise(function(resolve,reject){
			setTimeOut( function() {
				resolve(podUtils.deleteFolder());
		}, 300);
		});
		try {
			var result = await testPromise;
			expect(result).to.equal(true);
			done();
		} catch(err) {
			console.log(err);
		}
		// await chatM.deleteFolder('https://pruebaes5b.solid.community/public/PruebaSinLogin/');
	});
});


describe('ChatManagerTest', function (done) {
    it('Testing SendMenssage', async function () {
		var testPromise =  new Promise(function(resolve,reject){
			setTimeOut( function() {
				resolve(chatM.sendMessage());
		}, 300);
		});
		try {
			var result = await testPromise;
			expect(result).to.equal(true);
			done();
		} catch(err) {
			console.log(err);
		}
      //let r =  await chatM.sendMessage();
      //assert.equal(r, true);
   });
 
   it('Testing ReceiveMessage', async function () {

	var testPromise =  new Promise(function(resolve,reject){
		setTimeOut( function() {
			resolve(chatM.receiveMessages());
	}, 300);
	});
	try {
		var result = await testPromise;
		expect(result).to.equal(true);
		done();
	} catch(err) {
		console.log(err);
	}
     //let r = await chatM.receiveMessages();
     //assert.typeOf(r,"Array");
	 });

	it('Testing Order', async function () {

		var testPromise =  new Promise(function(resolve,reject){
			setTimeOut( function() {
				resolve(chatM.order());
		}, 300);
		});
		try {
			var result = await testPromise;
			expect(result).to.equal(chatM.message);
			done();
		} catch(err) {
			console.log(err);
		}
	});
});*/