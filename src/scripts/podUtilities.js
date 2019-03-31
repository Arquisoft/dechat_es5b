const fileClient = require('solid-file-client');

async function login(credentials){
	var result;
	if(credentials == null){
		result = await fileClient.popupLogin().then(webId => {
			console.log(`Logged in as ${webId}.`);
			return true;
		}, err => { 
			console.log(err);
			return false;
		});
	} else {
		result = await fileClient.login(credentials).then( (session) => {
			console.log( `Logged in as `+session.webId);
			return true;
		}, err => {
			console.log(err);
			return false;
		});
	}
	return result;
}

//POD utility funcs
async function createChatFolder(url,ToLog) {
    return await fileClient.createFolder(url).then(success => {
			if(ToLog)
				console.log(`Created folder ${url}.`);
			return true;
		}, err => {
			console.log(err);
			return false;
		});
}

//We have to know about what returns the method fileClient.readFolder(url)
async function readFolder(url,ToLog){
    return await fileClient.readFolder(url).then(folder => {
        if(ToLog)
            console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
        return folder;
      }, err => console.log(err) );
}

async function deleteFolder(url,ToLog){
	await fileClient.deleteFolder(url).then(success => {
        if(ToLog)
            console.log(`Deleted ${url}.`);
	}, err => console.log(err) );
}

async function writeMessage(url,content,ToLog){
    await fileClient.createFile(url,content,"text/plain").then( fileCreated => {
        if(ToLog)
            console.log(`Created file ${fileCreated}.`);
      }, err => console.log(err) );
}

//We have to know about what returns the method fileClient.readFile(url)
async function readMessage(url,ToLog){
	return await fileClient.readFile(url).then(  body => {
        if(ToLog)
            //console.log(`File	content is : ${body}.`);
	  return body;
	}, err => console.log(err) );
}

//I've put this method here in case we end up using it.
async function updateMessage(url,ToLog){
	await fileClient.updateFile( url, newContent, contentType ).then( success => {
		if(ToLog)
            console.log( `Updated ${url}.`)
	}, err => console.log(err) );
}

async function deleteMessage(url,ToLog){
	await fileClient.deleteFile(url).then(success => {
	    if(ToLog)
            console.log(`Deleted ${url}.`);
	}, err => console.log(err) );
}

module.exports = {
	login: login,
	createFolder : createChatFolder,
	readFolder : readFolder,
	deleteFolder : deleteFolder,
	createFile : writeMessage,
	readFile : readMessage,
	deleteFile : deleteMessage
}