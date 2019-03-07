const fileClient = require('solid-file-client')

function sendMessage(URI,user,text){
    var solidChat=URI+"public/SolidChat/";
    var folder= solidChat+user+"/";

    //New Solid-Chat folder
    try{
        var err = this.readFolder(solidChat);
        if(!err){
            console.log("Solid-chat folder doesnt exist");
            throw("error")
        }
    }catch(error){
        this.createChatFolder(solidChat);
        console.log("Solid-chat folder created");
    }
    
    //IF folder doesnt exist: create new user folder
    try{
        var err2=this.readFolder(folder);
        if(!err2){
            console.log("Folder doesnt exist");
            throw("error")
        }
    }catch(error){
         //New Folder:
         this.createChatFolder(folder);
         console.log('User folder created');
    }

    //WritingMessage
    console.log("Writting message..."+text);
    this.writeMessage(folder+"/"+(new Date().getTime()), text);
}

//TO-DO
function receiveMessage(){
	
}

module.exports = {
    createChatFolder: createChatFolder,
    sendMessage: sendMessage,
    receiveMessage: receiveMessage
}

function createChatFolder(url) {
    fileClient.createFolder(url).then(success => {
        console.log(`Created folder ${url}.`);
      }, err => console.log(err) );
}

//We have to know about what returns the method fileClient.readFolder(url)
function readFolder(url){
    fileClient.readFolder(url).then(folder => {
        console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
      }, err => console.log(err) );
}

function deleteFolder(url){
	fileClient.deleteFolder(url).then(success => {
	  console.log(`Deleted ${url}.`);
	}, err => console.log(err) );
}

function writeMessage(url,content){
    fileClient.createFile(url,content,"txt").then( fileCreated => {
        console.log(`Created file ${fileCreated}.`);
      }, err => console.log(err) );
}

//We have to know about what returns the method fileClient.readFile(url)
function readMessage(url){
	fileClient.readFile(url).then(  body => {
	  console.log(`File	content is : ${body}.`);
	}, err => console.log(err) );
}

//I've put this method here in case we end up using it.
function updateMessage(url){
	fileClient.updateFile( url, newContent, contentType ).then( success => {
		console.log( `Updated ${url}.`)
	}, err => console.log(err) );
}

function deleteMessage(url){
	fileClient.deleteFile(url).then(success => {
	  console.log(`Deleted ${url}.`);
	}, err => console.log(err) );
}
