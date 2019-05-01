const fileClient = require('solid-file-client');
const auth = require('solid-auth-client');

async function login(credentials) {
    var result;
    if (credentials == null) {
        result = await fileClient.popupLogin().then(webId => {
            console.log(`Logged in as ${webId}.`);
            return true;
        }, err => {
            console.log(err);
            return false;
        });
    } else {
        result = await fileClient.login(credentials).then((session) => {
            console.log(`Logged in as ` + session.webId);
            return true;
        }, err => {
            console.log(err);
            return false;
        });
    }
    return result;
}

async function loginNoPopup(idProvider) {
    await solid.auth.login(idProvider);
}

async function getSession() {
    return await solid.auth.currentSession();
}

async function logout() {
    return await fileClient.logout().then(success => {
        return true;
    }, err => {
        return false;
    });
}

async function createChatFolder(url) {
    return await fileClient.createFolder(url).then(success => {
        return true;
    }, err => {
        return false;
    });
}

async function readFolder(url) {
    return await fileClient.readFolder(url).then(folder => {
        return folder;
    }, err => {
        return null;
    });
}

async function deleteFolder(url) {
    return await fileClient.deleteFolder(url).then(success => {
        return true;
    }, err => {
        return false;
    });
}

async function writeMessage(url, content) {
    return await fileClient.createFile(url, content).then(fileCreated => {
        return true;
    }, err => {
        return false;
    });
}

async function writeMsgJson(url, content, ToLog) {
    return await fileClient.createFile(url, content, "text/json").then(fileCreated => {
        return true;
    }, err => {
        return false;
    });
}

async function writeMsgJsonld(url, content) {
    return await fileClient.createFile(url, content, "application/ld+json").then(fileCreated => {
        return true;
    }, err => {
        return false;
    });
}

async function writeTurtle(url, content) {
    return await fileClient.createFile(url, content, "text/turtle").then(fileCreated => {
        return true;
    }, err => {
        return false;
    });
}

async function updateTurtle(url, newContent) {
    return await fileClient.updateFile(url, newContent, "text/turtle").then(success => {
        return true;
    }, err => {
        return false;
    });
}

async function readMessage(url) {
    return await fileClient.readFile(url).then(body => {
        return body;
    }, err => {
        return null;
    });
}

async function deleteMessage(url) {
    return await fileClient.deleteFile(url).then(success => {
        return true;
    }, err => {
        return false;
    });
}

module.exports = {
    login: login,
    logout: logout,
    loginNoPopup: loginNoPopup,
    getSession: getSession,
    createFolder: createChatFolder,
    readFolder: readFolder,
    deleteFolder: deleteFolder,
    createFile: writeMessage,
    readFile: readMessage,
    deleteFile: deleteMessage,
    writeTurtle: writeTurtle,
    updateTurtle: updateTurtle,
    writeMsgJson: writeMsgJson,
    writeMsgJsonld: writeMsgJsonld,
    writeMessage: writeMessage
}