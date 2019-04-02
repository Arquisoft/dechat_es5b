require('chai');
var assert = require('assert');
var chatM = require('../src/scripts/chatManager.js');
var podUtils = require('../src/scripts/podUtilities.js');

const timeout = 800;

var credentials = {
    "idp": "https://solid.community",
    "username": "pruebaes5b",
    "base": "https://pruebaes5b.solid.community",
    "test": "/public/test/"
}

const receiver = {
    "idp": "https://cristina.solid.community",
    "username": "cristinamartin",
    "testReadFile": "https://cristina.solid.community/public/SolidChat/Cristina-Mart%C3%ADn-Rey/1552487905499.txt"
}

const testFolderUrl = credentials.base + "/public/test/";
const testFileUrl = testFolderUrl + "testfile";

describe('Log In', function() {
	it('Login Fail', async function() {
        this.timeout(4000);
		credentials.password = "123456";
        assert.equal(await podUtils.login(credentials), false);
    });
    it('Login Success', async function() {
        this.timeout(4000);
		credentials.password = "CE.ji.JU-55";
        assert.equal(await podUtils.login(credentials), true);
    });
});

describe('Test POD Utilities', function() {
    it('createFolder', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.createFolder(testFolderUrl, true), true);
    });
    it('createFile', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.createFile(testFileUrl + ".txt", "test create file", true), true);
        assert.equal(await podUtils.readFile(testFileUrl + ".txt", true), "test create file");
    });
    it('readFile', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.readFile(receiver.testReadFile, true), "hola");
    });
    it('readFolder', async function() {
        this.timeout(timeout);
        const folder = await podUtils.readFolder(testFolderUrl, true);
        assert.equal(folder.name, "test");
        assert.equal(folder.files.length, 1);
        assert.equal(testFolderUrl, "https://pruebaes5b.solid.community/public/test/");
    });
    it('deleteFile', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.deleteFile(testFileUrl + ".txt", true), true);
        assert.equal(await podUtils.readFile(testFileUrl + ".txt", true), null);
    });
    it('deleteFolder', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.deleteFolder(testFolderUrl, true), true);
        assert.equal(await podUtils.readFolder(testFolderUrl, true), null);
    });
});

describe('Test Chat Manager', function() {
	chatM.INFO.userURI = credentials.base + "/";
	chatM.INFO.receiverURI = receiver.idp + "/";
	chatM.INFO.receiverName = receiver.username;
	const sendFolder = credentials.base + "/public/SolidChat/" + receiver.username + "/chat.txt";
	
    it('sendMessage', async function() {
        this.timeout(timeout);
        
		var parsed;
        var folder = await podUtils.readFile(sendFolder, true);
        if (!folder) {
            var length = 0;
        } else {
			parsed = JSON.parse(folder);
            var length = parsed.length;
        }
        assert.equal(await chatM.sendMessage("newMessage"), true);
        folder = JSON.parse(await podUtils.readFile(sendFolder, true));
        assert.equal(folder.length, length + 1);
    });

    it('receiveMessage', async function() {
        this.timeout(timeout);
        var messages = await chatM.receiveMessages();
        assert.equal(messages.length, 10);
		assert.equal(messages[9].includes("newMessage"),true);
    });
});