var podUtils = require('./podUtilities.js');
var notiMan = require('./NotificationManager.js');

const ToLog = true;
const notify = false;


class message {
    constructor(text, date) {
        this.text = text;
        this.date = date;
    }
}

var INFO = {
    user: "",
    userName: "",
    userURI: "",
    receiver: "",
    receiverName: "",
    receiverURI: ""
}

var MESSAGES = {
    userMSG: [],
    friendMSG: [],
    toShow: []
}

var GROUP = {
	name: "",
	friends: []
}

//SEND Message function login
async function sendMessage(text) {
    var ret = false;

    //Define folders name
    var solidChat = INFO.userURI + "public/SolidChat/";
    var folder = solidChat + INFO.receiverName.replace(/ /g, "-") + "/";
    var filename = folder + "chatld.jsonld";

    //WritingMessage
    if (ToLog)
        console.log("Writting message: " + text);
    if (ToLog)
        console.log("Check user:" + INFO.receiverName + " chat file")
    try {
        var err3 = await podUtils.readFile(filename);
        if (!err3) {
            if (ToLog)
                console.log("Chat file doesnt exist");
            throw ("error")
        }

        await podUtils.deleteFile(filename);

        var chat = JSON.parse(err3);
        var message={
            "@Type": "message",
            "sender": INFO.userURI,
            "dateSent": new Date().getTime(),
            "text": text
            };
        chat.messages.push(message);
        jsonString = JSON.stringify(chat);

        ret = await podUtils.writeMsgJsonld( folder + "chatld", jsonString, ToLog);
        if (notify)
            await notiMan.writeNotification(INFO.receiverURI, INFO.user);
    } catch (error) {

        //IF folder doesnt exist: create new user folder
        if (ToLog)
            console.log("Check user:" + INFO.receiverName + " folder")
        try {
            var err2 = await podUtils.readFolder(folder, ToLog);
            if (!err2) {
                if (ToLog)
                    console.log("Folder doesnt exist");
                throw ("error")
            }
        } catch (error) {

            //Check Folder SolidChat
            if (ToLog)
                console.log("Check SolidChat Exist")
            try {
                var err = await podUtils.readFolder(solidChat, ToLog);
                if (!err) {
                    if (ToLog)
                        console.log("Solid-chat folder doesnt exist");
                    throw ("error")
                }
            } catch (error) {
                //New Solid-Chat folder
                await podUtils.createFolder(solidChat, ToLog);
                if (ToLog)
                    console.log("Solid-chat folder created");
            }

            //New Folder:
            await podUtils.createFolder(folder, ToLog);
            if (ToLog)
                console.log('User folder created');

        }
        if (ToLog)
            console.log("Creating chat file");
        
        //chat is the full chat component in jsonld
        var chat={
            "@context": "http://schema.org/",
            "@type": "Conversation",
			"people": 1,
			"isGroup": false,
            "messages":[
                {
                "@Type": "message",
                "sender": INFO.userURI,
                "dateSent": new Date().getTime(),
                "text": text
                }
            ]
        };

        jsonString = JSON.stringify(chat);

        ret = await podUtils.writeMsgJsonld( folder + "chatld", jsonString, ToLog);
        if (notify)
            await notiMan.writeNotification(INFO.receiverURI, INFO.user);

    }
    return ret;
}

async function receiveMessages() {
    if (ToLog)
        console.log("ReceivingMessages")
	
	var dict = [];

    //Define folders name
    var uFolder = INFO.userURI + "public/SolidChat/" + INFO.receiverName.trim().replace(/ /g, "-") + "/";
    var rFolder = INFO.receiverURI + "public/SolidChat/" + INFO.userName.trim().replace(/ /g, "-") + "/";
    var uFile = uFolder + "chatld.jsonld";
    var rFile = rFolder + "chatld.jsonld";

    var userMessages;
    var receiveMessages;

    
    userMessages = await podUtils.readFile(uFile, ToLog); 
    receiveMessages = await podUtils.readFile(rFile, ToLog);
    if (!userMessages) {
        if (ToLog)
            console.log("User chat file doesnt exist");
        //await podUtils.createFile(uFile, JSON.stringify(dict), ToLog);
        userMessages = "[]";
    }

    if (!receiveMessages) {
        if (ToLog)
            console.log("Friend chat file doesnt exist");
        //await podUtils.createFile(rFile, JSON.stringify(dict), ToLog);
        receiveMessages = "[]";
    }
	
	var uChat = JSON.parse(userMessages);
    var uParsed = uChat.messages;
	var rChat = JSON.parse(receiveMessages);
    var rParsed = rChat.messages;
	console.log(uChat.people);
    if(uParsed){
    uParsed.forEach(element => {
        var date = new Date(Number(element.dateSent));
        var strDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        dict.push(new message("<div class=\"containerChatDarker\"><p id=\"noMarginMessge\">" + element.text + "</p><p id=\"username\">" + INFO.userName + " (you) " + strDate + "</p></div>", date));
    });
    }
    if(rParsed){
    rParsed.forEach(element => {
        var date = new Date(Number(element.dateSent));
        var strDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        dict.push(new message("<div class=\"containerChat\"><p id=\"noMarginMessge\">" + element.text + "</p><p id=\"username\">" + INFO.receiverName + " " + strDate + "</p></div>", date));
    });
    }
    dict.sort(function (a, b) {
        return a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
    });

    MESSAGES.toShow = [];
    dict.forEach((n) => {
        MESSAGES.toShow.push(n.text)
    });
    MESSAGES.toShow = MESSAGES.toShow.slice(-10);

    //Delete existing notifiations
    if (notify)
        notiMan.deleteNotification(INFO.userURI, INFO.receiver);

    return MESSAGES.toShow;
}

async function createGroup(){
	var groupName = GROUP.name.replace(/ /g, "-") + "/";
	
	//Creating Group for this user and all friends
    // This user
	var ret = await createFolder(INFO.userURI, groupName);
	if(!ret) return false;
	
	for(var i = 0; i < GROUP.friends.length; i++){
		created = await createFolder(GROUP.friends[i].utilUri, groupName);
		if(!created){
			return false;
		}
	}
	
	return true;
}

//Function for main.js
//Return users with new msg
async function newNotifications() {
    //TO-DO----------------------------------------------------------------------------------
}

async function createFolder(basicUri, folderName){
	var ret = false;
	
	//Define folders name
    var solidChat = basicUri + "public/SolidChat/";
    var folder = solidChat + folderName;
	
	if (ToLog)
        console.log("Creating folder: " + folderName);
    
	//IF folder doesnt exist: create new folder
	if (ToLog)
		console.log("Check folder: " + folderName + " folder");
	try {
		var err2 = await podUtils.readFolder(folder, ToLog);
		if (!err2) {
			if (ToLog)
				console.log("Folder doesnt exist");
			throw ("error")
		}
	} catch (error) {

		//Check Folder SolidChat
		if (ToLog)
			console.log("Check SolidChat Exist")
		try {
			var err = await podUtils.readFolder(solidChat, ToLog);
			if (!err) {
				if (ToLog)
					console.log("Solid-chat folder doesnt exist");
				throw ("error")
			}
		} catch (error) {
			//New Solid-Chat folder
			await podUtils.createFolder(solidChat, ToLog);
			if (ToLog)
				console.log("Solid-chat folder created");
		}
		console.log('-----------------------------' + folder);
		//New Folder:
		ret = await podUtils.createFolder(folder, ToLog);
		if (ToLog)
			console.log('Group folder created');

	}
	return ret;
}

module.exports = {
    sendMessage: sendMessage,
    receiveMessages: receiveMessages,
    newNotifications: newNotifications,
	createGroup: createGroup,
    INFO: INFO,
    MESSAGES: MESSAGES,
	GROUP: GROUP,
    ToLog: ToLog
}