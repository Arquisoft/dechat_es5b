var podUtils = require('./podUtilities.js');

const ToLog=true;

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
        var err = await podUtils.readFolder(solidChat,ToLog);
        if(!err){
            if(ToLog)
                console.log("Solid-chat folder doesnt exist");
            throw("error")
        }
    }catch(error){
        //New Solid-Chat folder
        await podUtils.createFolder(solidChat,ToLog);
        if(ToLog)
            console.log("Solid-chat folder created");
    }
    
    //IF folder doesnt exist: create new user folder
    if(ToLog)
        console.log("Check user:"+INFO.receiverName+" folder")
    try{
        var err2 = await podUtils.readFolder(folder,ToLog);
        if(!err2){
            if(ToLog)
                console.log("Folder doesnt exist");
            throw("error")
        }
    }catch(error){
         //New Folder:
         await podUtils.createFolder(folder,ToLog);
         if(ToLog)
            console.log('User folder created');
    }

    //WritingMessage
    if(ToLog)
        console.log("Writting message: "+text);
    await podUtils.createFile(folder+"/"+(new Date().getTime()), text, ToLog);
}

async function receiveMessages(){
    if(ToLog)
        console.log("ReceivingMessages")
	//Define folders name
    var uFolder=INFO.userURI+"public/SolidChat/"+INFO.receiverName.trim().replace(/ /g, "-")+"/";
	var rFolder=INFO.receiverURI+"public/SolidChat/"+INFO.userName.trim().replace(/ /g, "-")+"/";

    //User folder
        //check new conversation (folder Exists) 
        var userFolder = await podUtils.readFolder(uFolder, ToLog);

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
		var receiverFolder = await podUtils.readFolder(rFolder, ToLog);
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
            dict.push( new message(INFO.receiverName + ":  " + await podUtils.readFile(rFolder+friend.name, ToLog),
            new Date(Number(friend.name.replace(".txt","")))));
        }
        if(!(user == undefined)){
            dict.push(new message(INFO.userName + ":  " + await podUtils.readFile(uFolder+user.name, ToLog),
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
    sendMessage: sendMessage,
    receiveMessages: receiveMessages,
    INFO: INFO,
	ToLog: ToLog
}
