const fileClient = require('solid-file-client');

//POD utility funcs
async function createChatFolder(url,ToLog) {
    await fileClient.createFolder(url).then(success => {
        if(ToLog)
            console.log(`Created folder ${url}.`);
      }, err => console.log(err) );
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
    await fileClient.createFile(url,content).then( fileCreated => {
        if(ToLog)
            console.log(`Created file ${fileCreated}.`);
      }, err => console.log(err) );
}

async function writeTurtle(url,content,ToLog){
    await fileClient.createFile(url,content,"text/turtle").then( fileCreated => {
        if(ToLog)
            console.log(`Created file ${fileCreated}.`);
      }, err => console.log(err) );
}

async function updateTurtle(url,newContent,ToLog){
	await fileClient.updateFile( url, newContent,"text/turtle" ).then( success => {
		if(ToLog)
            console.log( `Updated ${url}.`)
	}, err => console.log(err) );
}

//We have to know about what returns the method fileClient.readFile(url)
async function readMessage(url,ToLog){
	return await fileClient.readFile(url).then(  body => {
        /*if(ToLog)
            console.log(`File	content is : ${body}.`);*/
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
	createFolder : createChatFolder,
	readFolder : readFolder,
	deleteFolder : deleteFolder,
	createFile : writeMessage,
	readFile : readMessage,
    deleteFile : deleteMessage,
    writeTurtle: writeTurtle,
    updateTurtle: updateTurtle
}