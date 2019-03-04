const fileClient = require('solid-file-client')

function createChatFolder(url) {
    fileClient.createFolder(url).then(success => {
        console.log(`Created folder ${url}.`);
      }, err => console.log(err) );
}

function writeMessage(url,content){
    fileClient.createFile(URL,content).then( fileCreated => {
        console.log(`Created file ${fileCreated}.`);
      }, err => console.log(err) );
}

function readMessage(){

}

module.exports = {
    createChatFolder: createChatFolder,
    writeMessage: writeMessage,
    readMessage: readMessage
}
