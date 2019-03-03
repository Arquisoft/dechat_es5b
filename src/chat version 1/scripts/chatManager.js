const fileClient = SolidFileClient;

class chatManager{

    createChatFolder(url) {
        fileClient.createFolder(url).then(success => {
            console.log(`Created folder ${url}.`);
          }, err => console.log(err) );
    }

    writeMessage(url,content){
        fileClient.createFile(URL,content).then( fileCreated => {
            console.log(`Created file ${fileCreated}.`);
          }, err => console.log(err) );
    }

    readMessage(){

    }
}


var chatM = new chatManager();

