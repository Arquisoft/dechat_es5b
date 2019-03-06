const fileClient = require('solid-file-client')

function createChatFolder(url) {
    fileClient.createFolder(url).then(success => {
        console.log(`Created folder ${url}.`);
      }, err => console.log(err) );
}

function writeMessage(url,content){
    fileClient.createFile(url,content,"text").then( fileCreated => {
        console.log(`Created file ${fileCreated}.`);
      }, err => console.log(err) );
}


//
function checkFolderExicts(URI){

}

function sendMessage(URI,user,text){
    //already created Folder:
    //this.checkFolderExicts(URI);
    //New Folder:
    console.log("Creating folder: "+ URI+"public/SolidChat/"+user+"/" +"....");
    this.createChatFolder(URI+"public/SolidChat/"+user+"/");

    //WritingMessage
    console.log("Writting message..."+text);
    this.writeMessage(URI+"public/SolidChat/"+user+"/", text+".txt");

}

//TO-DO
function readMessage(){

}

module.exports = {
    createChatFolder: createChatFolder,
    writeMessage: writeMessage,
    readMessage: readMessage,
    sendMessage: sendMessage
}
