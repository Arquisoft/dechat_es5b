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
	myMessages:"",
	friendMessages:""
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
async function receiveMessage(){
	//Define folders name
    var solidChat=INFO.userURI+"public/SolidChat/";
    var folder= solidChat+INFO.receiverName.replace(/ /g, "-")+"/";
    var userMSG= [];

    //User folder
        //check new conversation (folder Exists) - Try catch
		//console.log("Reading :"+folder);
        var userFolder = await readFolder(folder);
        console.log(userFolder);
		if(userFolder){
            console.log("folder exist");
            userMSG = userFolder.files;
        }else{
            //Nothing to read -> empty list
            console.log("folder do not exist");
        }

    //Receiver folder
        //check new conversation (folder Exists)
        //Object folder readed
            //get Files list
    if(userMSG.length==0)
        console.log("No msgs found");
    else{
        console.log(userMSG);
        console.log("MSG: "+userMSG[0].content);
    }
    //Order las 10(n) msg by time order (FileName=TimeStamp)
    //Save into variable
}

module.exports = {
    sendMessage: sendMessage,
    receiveMessage: receiveMessage,
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
	await fileClient.readFile(url).then(  body => {
	  console.log(`File	content is : ${body}.`);
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

