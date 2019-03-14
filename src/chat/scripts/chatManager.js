const fileClient = require('solid-file-client');

var INFO = 
{
  user: "",
  userName: "" ,
  userURI:"" ,
  receiver:""  ,
  receiverName:"" ,
  receiverURI:""
}

var MESSAGES = {
	userMSG: [],
	friendMSG: [],
	toShow: []
}


async function sendMessage(text){
    //Define folders name
    var solidChat=INFO.userURI+"public/SolidChat/";
    var folder= solidChat+INFO.receiverName.replace(/ /g, "-")+"/";
	
    //New Solid-Chat folder
    try{
        var err = await readFolder(solidChat);
        if(!err){
            console.log("Solid-chat folder doesnt exist");
            throw("error")
        }
    }catch(error){
        await createChatFolder(solidChat);
        console.log("Solid-chat folder created");
    }
    
    //IF folder doesnt exist: create new user folder
    try{
        var err2 = await readFolder(folder);
        if(!err2){
            console.log("Folder doesnt exist");
            throw("error")
        }
    }catch(error){
         //New Folder:
         await createChatFolder(folder);
         console.log('User folder created');
    }

    //WritingMessage
    console.log("Writting message..."+text);
    await writeMessage(folder+"/"+(new Date().getTime()), text);
}

//TO-DO
async function receiveMessages(){
	//Define folders name
    var uFolder=INFO.userURI+"public/SolidChat/"+INFO.receiverName.trim().replace(/ /g, "-")+"/";
	var rFolder=INFO.receiverURI+"public/SolidChat/"+INFO.userName.trim().replace(/ /g, "-")+"/";

    //User folder
        //check new conversation (folder Exists) 
        var userFolder = await readFolder(uFolder);
        console.log(userFolder);
		if(userFolder){
            console.log("folder exist");
            MESSAGES.userMSG = userFolder.files;
        }else{
            //Nothing to read -> empty list
            console.log("folder do not exist");
			MESSAGES.userMSG = [];
        }
		
    //Receiver folder
        //check new conversation (folder Exists)
        //Object folder readed -> get Files list
		var receiverFolder = await readFolder(rFolder);
        console.log(receiverFolder);
		if(receiverFolder){
            console.log("folder exist");
            MESSAGES.friendMSG = receiverFolder.files;
        }else{
            //Nothing to read -> empty list
            console.log("folder do not exist");
			MESSAGES.friendMSG = [];
        }
    


    // needs to be improved to get messages by date



	return order(MESSAGES.userMSG,MESSAGES.friendMSG,uFolder, rFolder);
}

async function order(userMessages, friendessages, uFolder, rFolder){
    
    var dict = [];
    class node {
        constructor(message, date) {
            this.message = message;
            this.date = date;
        }
    }

    for(var i = 0; i < 5 ; i++){
        var user = userMessages.pop();
        var friend = friendessages.pop();
        if(!(friend == undefined)){
            dict.push( new node(INFO.receiverName + ":  " + await readMessage(rFolder+friend.name),
            new Date(Number(friend.name.replace(".txt","")))));
        }
        if(!(user == undefined)){
            dict.push(new node(INFO.userName + ":  " + await readMessage(uFolder+user.name),
            new Date(Number(user.name.replace(".txt","")))));
        }
    }

    dict.sort(function(a, b) {
        return a.date>b.date ? 1 : a.date<b.date ? -1 : 0;
    });

    MESSAGES.toShow = [];
    dict.forEach( (n) => {
        MESSAGES.toShow.push(n.message)
    });
    
    return MESSAGES.toShow;
}

module.exports = {
    sendMessage: sendMessage,
    receiveMessages: receiveMessages,
    INFO: INFO
}



async function createChatFolder(url) {
    await fileClient.createFolder(url).then(success => {
        console.log(`Created folder ${url}.`);
      }, err => console.log(err) );
}

//We have to know about what returns the method fileClient.readFolder(url)
async function readFolder(url){
    return await fileClient.readFolder(url).then(folder => {
        console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
        return folder;
      }, err => console.log(err) );
}

async function deleteFolder(url){
	await fileClient.deleteFolder(url).then(success => {
	  console.log(`Deleted ${url}.`);
	}, err => console.log(err) );
}

async function writeMessage(url,content){
    await fileClient.createFile(url,content,"text/plain").then( fileCreated => {
        console.log(`Created file ${fileCreated}.`);
      }, err => console.log(err) );
}

//We have to know about what returns the method fileClient.readFile(url)
async function readMessage(url){
	return await fileClient.readFile(url).then(  body => {
	  console.log(`File	content is : ${body}.`);
	  return body;
	}, err => console.log(err) );
}

//I've put this method here in case we end up using it.
async function updateMessage(url){
	await fileClient.updateFile( url, newContent, contentType ).then( success => {
		console.log( `Updated ${url}.`)
	}, err => console.log(err) );
}

async function deleteMessage(url){
	await fileClient.deleteFile(url).then(success => {
	  console.log(`Deleted ${url}.`);
	}, err => console.log(err) );
}

