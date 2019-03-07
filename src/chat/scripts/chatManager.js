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

function readFolder(url){
    fileClient.readFolder(url).then(folder => {
        console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
      }, err => console.log(err) );
}

function sendMessage(URI,user,text){
    var solidChat=URI+"public/SolidChat-5/";
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
    this.writeMessage(folder, text);
}

//TO-DO
function readMessage(){

}

module.exports = {
    createChatFolder: createChatFolder,
    writeMessage: writeMessage,
    readMessage: readMessage,
    sendMessage: sendMessage,
    readFolder: readFolder
}
