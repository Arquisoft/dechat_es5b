const fileClient = require('solid-file-client');
const auth = require('solid-auth-client');

async function login(credentials) {
    var result;
    if (credentials == null) {
        console.log('Invalid credentials');
        return false;
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
    await auth.login(idProvider);
}

async function getSession() {
    return await auth.currentSession();
}

async function logout() {
    return await fileClient.logout().then(success => {
        console.log(`Bye now!`);
        return true;
    }, err => {
        console.log(err);
        return false;
    });
}

async function createChatFolder(url, ToLog) {
    return await fileClient.createFolder(url).then(success => {
        if (ToLog)
            console.log(`Created folder ${url}.`);
        return true;
    }, err => {
        console.log(err);
        return false;
    });
}

async function readFolder(url, ToLog) {
    return await fileClient.readFolder(url).then(folder => {
        if (ToLog)
            console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
        return folder;
    }, err => {
        console.log(err);
        return null;
    });
}

async function deleteFolder(url, ToLog) {
    return await fileClient.deleteFolder(url).then(success => {
        if (ToLog)
            console.log(`Deleted ${url}.`);
        return true;
    }, err => {
        console.log(err);
        return false;
    });
}

async function writeMessage(url, content, ToLog) {
    return await fileClient.createFile(url, content).then(fileCreated => {
        if (ToLog)
            console.log(`Created file ${fileCreated}.`);
        return true;
    }, err => {
        console.log(err);
        return false;
    });
}

async function writeMsgJson(url, content, ToLog) {
	return await fileClient.createFile(url, content,"text/json").then(fileCreated => {
		if (ToLog)
			console.log(`Created file ${fileCreated}.`);
		return true;
	}, err => {
		console.log(err);
		return false;
	});
}

async function writeMsgJsonld(url, content, ToLog) {
	return await fileClient.createFile(url, content,"application/ld+json").then(fileCreated => {
		if (ToLog)
			console.log(`Created file ${fileCreated}.`);
		return true;
	}, err => {
		console.log(err);
		return false;
	});
}

async function writeTurtle(url, content, ToLog) {
    return await fileClient.createFile(url, content, "text/turtle").then(fileCreated => {
        if (ToLog)
            console.log(`Created file ${fileCreated}.`);
        return true;
    }, err => {
        console.log(err);
        return false;
    });
}

async function updateTurtle(url, newContent, ToLog) {
    return await fileClient.updateFile(url, newContent, "text/turtle").then(success => {
        if (ToLog)
            console.log(`Updated ${url}.`)
        return true;
    }, err => {
        console.log(err);
        return false;
    });
}

async function readMessage(url, ToLog) {
    return await fileClient.readFile(url).then(body => {
        if (ToLog)
            console.log(`The file exist and it has been readed.`);
        return body;
    }, err => {
        console.log(err);
        return null;
    });
}

async function deleteMessage(url, ToLog) {
    return await fileClient.deleteFile(url).then(success => {
        if (ToLog)
            console.log(`Deleted ${url}.`);
        return true;
    }, err => {
        console.log(err);
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
	writeMsgJson:writeMsgJson,
	writeMsgJsonld:writeMsgJsonld
}