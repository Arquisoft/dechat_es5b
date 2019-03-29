const fileClient = require('solid-file-client');
const ToLog = true;

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

//SEND Message function login
async function sendMessage(text){
    //Define folders name
    var solidChat=INFO.userURI+"public/SolidChat/";
    var folder= solidChat+INFO.receiverName.replace(/ /g, "-")+"/";
	
    //Check Folder SolidChat
    if(ToLog)
        console.log("Check SolidChat Exist")
    try{
        var err = await readFolder(solidChat);
        if(!err){
            if(ToLog)
                console.log("Solid-chat folder doesnt exist");
            throw("error")
        }
    }catch(error){
        //New Solid-Chat folder
        await createChatFolder(solidChat);
        if(ToLog)
            console.log("Solid-chat folder created");
    }
    
    //IF folder doesnt exist: create new user folder
    if(ToLog)
        console.log("Check user:"+INFO.receiverName+" folder")
    try{
        var err2 = await readFolder(folder);
        if(!err2){
            if(ToLog)
                console.log("Folder doesnt exist");
            throw("error")
        }
    }catch(error){
         //New Folder:
         await createChatFolder(folder);
         if(ToLog)
            console.log('User folder created');
    }

    //WritingMessage
    if(ToLog)
        console.log("Writting message: "+text);
    await writeMessage(folder+"/"+(new Date().getTime()), text);
}

//TO-DO
async function receiveMessages(){
    if(ToLog)
        console.log("ReceivingMessages")
	//Define folders name
    var uFolder=INFO.userURI+"public/SolidChat/"+INFO.receiverName.trim().replace(/ /g, "-")+"/";
	var rFolder=INFO.receiverURI+"public/SolidChat/"+INFO.userName.trim().replace(/ /g, "-")+"/";

    //User folder
        //check new conversation (folder Exists) 
        var userFolder = await readFolder(uFolder);

        //console.log(userFolder);
		if(userFolder){
            if(ToLog)
                console.log("User folder exist");
            MESSAGES.userMSG = userFolder.files;
        }else{
            //Nothing to read -> empty list
            if(ToLog)
                console.log("User Folder do not exist");
			MESSAGES.userMSG = [];
        }
		
    //Receiver folder
        //check new conversation (folder Exists)
        //Object folder readed -> get Files list
		var receiverFolder = await readFolder(rFolder);
        //console.log(receiverFolder);
		if(receiverFolder){
            if(ToLog)
                console.log("Receiver folder exist");
            MESSAGES.friendMSG = receiverFolder.files;
        }else{
            //Nothing to read -> empty list
            if(ToLog)
                console.log("User folder do not exist");
			MESSAGES.friendMSG = [];
        }

	return order(MESSAGES.userMSG,MESSAGES.friendMSG,uFolder, rFolder);
}

async function order(userMessages, friendessages, uFolder, rFolder){
    
    var dict = [];
    class message {
        constructor(text, date) {
            this.text = text;
            this.date = date;
        }
    }

    for(var i = 0; i < 5 ; i++){
        var user = userMessages.pop();
        var friend = friendessages.pop();
        if(!(friend == undefined)){
            dict.push( new message(INFO.receiverName + ":  " + await readMessage(rFolder+friend.name),
            new Date(Number(friend.name.replace(".txt","")))));
        }
        if(!(user == undefined)){
            dict.push(new message(INFO.userName + ":  " + await readMessage(uFolder+user.name),
            new Date(Number(user.name.replace(".txt","")))));
        }
    }

    dict.sort(function(a, b) {
        return a.date>b.date ? 1 : a.date<b.date ? -1 : 0;
    });

    MESSAGES.toShow = [];
    dict.forEach( (n) => {
        MESSAGES.toShow.push(n.text)
    });
    
    return MESSAGES.toShow;
}

module.exports = {
    ToLog: ToLog,
    sendMessage: sendMessage,
    receiveMessages: receiveMessages,
    INFO: INFO,
	createFolder : createChatFolder,
	readFolder : readFolder,
	deleteFolder : deleteFolder,
	createFile : writeMessage,
	readFile : readMessage,
    deleteFile : deleteMessage,
    order : order,
    message: MESSAGES
}


//POD utility funcs

async function createChatFolder(url) {
    await fileClient.createFolder(url).then(success => {
        if(ToLog)
            console.log(`Created folder ${url}.`);
      }, err => {
		  console.log(err);
	  });
}

async function readFolder(url){
    return await fileClient.readFolder(url).then(folder => {
        if(ToLog)
            console.log(`Read ${folder.name}, it has ${folder.files.length} files.`);
        return folder;
      }, err => console.log(err) );
}

async function deleteFolder(url){
	await fileClient.deleteFolder(url).then(success => {
        if(ToLog)
            console.log(`Deleted ${url}.`);
	}, err => console.log(err) );
}

async function writeMessage(url,content){
    await fileClient.createFile(url,content,"text/plain").then( fileCreated => {
        if(ToLog)
            console.log(`Created file ${fileCreated}.`);
      }, err => console.log(err) );
}

async function readMessage(url){
	return await fileClient.readFile(url).then(  body => {
        if(ToLog)
            console.log(`File	content is : ${body}.`);
	  return body;
	}, err => console.log(err) );
}

async function updateMessage(url){
	await fileClient.updateFile( url, newContent, contentType ).then( success => {
		if(ToLog)
            console.log( `Updated ${url}.`)
	}, err => console.log(err) );
}

async function deleteMessage(url){
	await fileClient.deleteFile(url).then(success => {
	    if(ToLog)
            console.log(`Deleted ${url}.`);
	}, err => console.log(err) );
}
