require('chai');
var assert = require('assert');
var chatM = require('../src/scripts/chatManager.js');
var podUtils = require('../src/scripts/podUtilities.js');
var notiMa = require('../src/scripts/NotificationManager.js');

const timeout = 4000;

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
const testFolderUrlTtl = credentials.base + "/public/testTtl/";
const testFileUrlTtl = testFolderUrlTtl + "testttlfile";
const notiMaUrl = "https://pruebaes5b.solid.community/inbox/";

describe('Log In and Session', function() {
    it('Login Fail', async function() {
        this.timeout(5000);
        credentials.password = "123456";
        assert.equal(await podUtils.login(credentials), false);
    });
    it('Login Success', async function() {
        this.timeout(timeout);
        credentials.password = "CE.ji.JU-55";
        assert.equal(await podUtils.login(credentials), true);
    });
    it('logout', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.logout(), true);
    });
    it('Login using null credentials', async function() {
        assert.equal(await podUtils.login(null), false);
    });
    it('Invalid, nonexistent session', async function() {
        assert.equal(await podUtils.getSession(), null);
    });
});

describe('Test POD Utilities', function() {
    it('Login Success', async function() {
        this.timeout(timeout);
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
        assert.equal(await podUtils.writeMsgJson(testFileUrl + ".json", "test json file", true), true);
        assert.equal(await podUtils.readFile(testFileUrl + ".json", true), "test json file");
        assert.equal(await podUtils.writeMsgJson(testFileUrl + ".jsonld", "test jsonld file", true), true);
        assert.equal(await podUtils.readFile(testFileUrl + ".jsonld", true), "test jsonld file");
    });
    it('readFile', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.readFile(receiver.testReadFile, true), "hola");
    });
    it('readFolderWithContent', async function() {
        this.timeout(timeout);
        var folder = await podUtils.readFolder(testFolderUrl, true);
        assert.equal(folder.name, "test");
        assert.equal(folder.files.length, 3);
        assert.equal(testFolderUrl, "https://pruebaes5b.solid.community/public/test/");
    });
    it('deleteFile', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.deleteFile(testFileUrl + ".txt", true), true);
        assert.equal(await podUtils.readFile(testFileUrl + ".txt", true), null);
        assert.equal(await podUtils.deleteFile(testFileUrl + ".json", true), true);
        assert.equal(await podUtils.readFile(testFileUrl + ".json", true), null);
        assert.equal(await podUtils.deleteFile(testFileUrl + ".jsonld", true), true);
        assert.equal(await podUtils.readFile(testFileUrl + ".jsonld", true), null);
    });
    it('readEmptyFolder', async function() {
        this.timeout(timeout);
        var folder = await podUtils.readFolder(testFolderUrl, true);
        assert.equal(folder.name, "test");
        assert.equal(folder.files.length, 0);
        assert.equal(testFolderUrl, "https://pruebaes5b.solid.community/public/test/");
    });
    it('deleteFolder', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.deleteFolder(testFolderUrl, true), true);
        assert.equal(await podUtils.readFolder(testFolderUrl, true), null);
    });
    it('createTurtle', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.writeTurtle(testFileUrlTtl, ":timeStamp\na msg:message ;\nmsg:text \"#El Mensaje\" .", true), true);
    });
    it('updateExistentTurtle', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.updateTurtle(testFileUrlTtl, ":timeStamp\na msg:message ;\nmsg:text \"#Nuevo Mensaje\" .", true),
            true);
    });
    it('updateNonEexistentTurtle', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.updateTurtle("file.ttl", ":timeStamp\na msg:message ;\nmsg:text \"#No existe\" .", true),
            false);
    });
    it('logout', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.logout(), true);
    });
});

describe('Test Chat Manager', function() {
    it('Login Success', async function() {
        this.timeout(timeout);
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
        assert.equal(await chatM.sendMessage("pepaMessage", true), true);
        var messages = await chatM.receiveMessages();
        assert.equal(messages[0].includes("pepaMessage"), true);

        assert.equal(await podUtils.deleteFile(pepaFolder + receiver.username + "/chat.txt", true), true);
        assert.equal(await podUtils.deleteFolder(pepaFolder + receiver.username + "/", true), true);
        assert.equal(await podUtils.deleteFolder(pepaFolder, true), true);

        chatM.INFO.userURI = credentials.base + "/";
        assert.equal(await podUtils.logout(), true);
    });
});

describe('Notification Manager', function() {
    it('Login Success', async function() {
        this.timeout(timeout);
        credentials.password = "CE.ji.JU-55";
        assert.equal(await podUtils.login(credentials), true);
    });
    it('createNotificationsTtl', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.readFile(credentials.base + "/inbox/SolidChatNot.ttl", true), null);
        assert.notEqual(await notiMa.readAllNotification(credentials.base + "/"), null);
    });
    it('writeNotification', async function() {
        this.timeout(timeout);
        assert.equal(await notiMa.writeNotification(credentials.base + "/", receiver.username), true);
    });
    it('readAllNotifications', async function() {
        this.timeout(timeout);
        assert.notEqual(await notiMa.readAllNotification(credentials.base + "/"), null);
    });
    it('readContentFolder', async function() {
        this.timeout(timeout);
        var folder = await podUtils.readFolder(notiMaUrl, true);
        assert.notEqual(folder.files.length, 0);
    });
    it('deleteNotification', async function() {
        this.timeout(6000);
        assert.equal(await notiMa.deleteNotification(credentials.base + "/", receiver.username), true);
    });
    it('deleteFile', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.deleteFile(credentials.base + "/inbox/SolidChatNot.ttl", true), true);
        assert.equal(await podUtils.readFile(credentials.base + "/inbox/SolidChatNot.ttl", true), null);
    });
    it('logout', async function() {
        this.timeout(timeout);
        assert.equal(await podUtils.logout(), true);
    });
});