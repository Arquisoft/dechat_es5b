require('chai');
var assert = require('assert');
var chatM = require('../src/scripts/chatManager.js');
var podUtils = require('../src/scripts/podUtilities.js');

const timeout = 2000;

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
        this.timeout(5000);
        credentials.password = "123456";
        assert.equal(await podUtils.login(credentials), false);
    });
    it('Login Success', async function() {
        this.timeout(4000);
        credentials.password = "CE.ji.JU-55";
        assert.equal(await podUtils.login(credentials), true);
    });
    it('logout', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.logout(), true);
    });
});

describe('Test POD Utilities', function() {
    it('Login Success', async function() {
        this.timeout(4000);
        credentials.password = "CE.ji.JU-55";
        assert.equal(await podUtils.login(credentials), true);
    });
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
    it('logout', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.logout(), true);
    });
});

describe('Test Chat Manager', function() {
    it('Login Success', async function() {
        this.timeout(4000);
        credentials.password = "CE.ji.JU-55";
        assert.equal(await podUtils.login(credentials), true);
    });

    chatM.INFO.userURI = credentials.base + "/";
    chatM.INFO.receiverURI = receiver.idp + "/";
    chatM.INFO.receiverName = receiver.username;
    const sendFolder = credentials.base + "/public/SolidChat/" + receiver.username + "/chatld.jsonld";

    it('sendMessage', async function() {
        this.timeout(timeout);
        assert.equal(await chatM.sendMessage("newMessage"), true);
        assert.notEqual(await podUtils.readFile(sendFolder, true), null);
    });
    it('receiveMessage', async function() {
        this.timeout(3000);
        var messages = await chatM.receiveMessages();
        assert.notEqual(messages[messages.length - 1].indexOf("newMessage"), -1);
    });
    it('logout', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.logout(), true);
    });
    it('sendMessage when there is no SolidChat folder', async function() {
        this.timeout(10000);

        const pepaCredentials = {
            "idp": "https://solid.community",
            "username": "pepa",
            "base": "https://pepa.solid.community",
            "password": "4152524152636352"
        }
        const pepaFolder = pepaCredentials.base + "/public/SolidChat/";

        chatM.INFO.userURI = pepaCredentials.base + "/";

        assert.equal(await podUtils.login(pepaCredentials), true);
        assert.equal(await chatM.sendMessage("pepaMessage"), true);
        var messages = await chatM.receiveMessages();
        assert.equal(messages[0].includes("pepaMessage"), true);

        assert.equal(await podUtils.deleteFile(pepaFolder + receiver.username + "/chat.txt", true), true);
        assert.equal(await podUtils.deleteFolder(pepaFolder + receiver.username + "/", true), true);
        assert.equal(await podUtils.deleteFolder(pepaFolder, true), true);

        chatM.INFO.userURI = credentials.base + "/";
    });
});