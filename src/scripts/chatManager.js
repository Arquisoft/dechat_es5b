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
    receiverURI: "",
	isGroup: false
}

var GROUP = {
	isGroup: true,
	name: "",
	friends: []
}

var MESSAGES = {
    userMSG: [],
    friendMSG: [],
    toShow: []
}

//SEND Message function login
async function sendMessage(text, isGroup, test) {
    var ret = false;
	console.log(isGroup);
	
    //Define folders name
    var solidChat = INFO.userURI + "public/SolidChat/";
    var folder;
	if(isGroup)
		folder = solidChat + "Groups/" + GROUP.name.replace(/ /g, "-") + "/";
	else
		folder = solidChat + INFO.receiverName.replace(/ /g, "-") + "/";
    var filename = folder + "chatld.jsonld";

    //WritingMessage
    try {
        var err3 = await podUtils.readFile(filename);
        if (!err3 || test) {
            throw ("error");
        }

        await podUtils.deleteFile(filename);

        var chat = JSON.parse(err3);
        var message = {
            "@Type": "message",
            "sender": INFO.userURI,
            "dateSent": new Date().getTime(),
            "text": text
        };
        chat.messages.push(message);
        jsonString = JSON.stringify(chat);

        ret = await podUtils.writeMsgJsonld(folder + "chatld", jsonString, ToLog);
        if (notify)
            await notiMan.writeNotification(INFO.receiverURI, INFO.user);
    } catch (error) {
        //IF folder doesnt exist: create new user folder
        try {
            var err2 = await podUtils.readFolder(folder, ToLog);
            if (!err2 || test) {
                throw ("error");
            }
        } catch (error) {
            //Check Folder SolidChat
            try {
                var err = await podUtils.readFolder(solidChat, ToLog);
                if (!err || test) {
                    throw ("error");
                }
            } catch (error) {
                //New Solid-Chat folder
                await podUtils.createFolder(solidChat, ToLog);
            }

            //New Folder:
            await podUtils.createFolder(folder, ToLog);
        }

        //chat is the full chat component in jsonld
		var chat;
		if(isGroup) {
			chat={
				"@context": "http://schema.org/",
				"@type": "Conversation",
				"people": GROUP.friends.length,
				"isGroup": true,
				"messages":[
					{
					"@Type": "message",
					"sender": INFO.userURI,
					"dateSent": new Date().getTime(),
					"text": text
					}
				]
			};
		} else {
			chat={
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
		}

        jsonString = JSON.stringify(chat);

        ret = await podUtils.writeMsgJsonld(folder + "chatld", jsonString, ToLog);
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
        //await podUtils.createFile(uFile, JSON.stringify(dict), ToLog);
        userMessages = "[]";
    }

    if (!receiveMessages) {
        //await podUtils.createFile(rFile, JSON.stringify(dict), ToLog);
        receiveMessages = "[]";
    }

    var uParsed = JSON.parse(userMessages).messages;
    var rParsed = JSON.parse(receiveMessages).messages;
    if (uParsed) {
        uParsed.forEach(element => {
            var date = new Date(Number(element.dateSent));
            var strDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
                date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            dict.push(new message("<div class=\"containerChatDarker\"><p id=\"noMarginMessge\">" + element.text + "</p><p id=\"username\">" + INFO.userName + " (you) " + strDate + "</p></div>", date));
        });
    }
    if (rParsed) {
        rParsed.forEach(element => {
            var date = new Date(Number(element.dateSent));
            var strDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
                date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
            dict.push(new message("<div class=\"containerChat\"><p id=\"noMarginMessge\">" + element.text + "</p><p id=\"username\">" + INFO.receiverName + " " + strDate + "</p></div>", date));
        });
    }
    dict.sort(function(a, b) {
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
	
	return await createGroupFolder(INFO.userURI, groupName);
}

async function createGroupFolder(basicUri, folderName){
	var created = true;
	
	//Define folders name
    var solidChat = basicUri + "public/SolidChat/";
	var groups = solidChat +"Groups/";
    var folder = groups + folderName;
	var metadataUrl = folder + '/metadata.jsonld';
	
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
		
		// If the group already exists, the new group replaces the old one
		var err4 = await podUtils.readFile(metadataUrl);
        if (err4) {
            await podUtils.deleteFile(metadataUrl);
        }

		//Define metadata object
		// Creates the metadata file for the group
		var metadata = {
			"@context": "http://schema.org/",
			"@type": "Group Chat",
			"people": GROUP.friends.length,
			"isGroup": true,
			"url": folder,
			"group": GROUP
		};

		var jsonString = JSON.stringify(metadata);
		
        ret = await podUtils.writeMsgJsonld( folder + "/metadata", jsonString, ToLog);
		
	} catch (error) {
		//CHeck Group Folder
		try {
			var err3 = await podUtils.readFolder(groups, ToLog);
			if(!err3)
				throw ("error");
		} catch(error) {
			
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
				created = await podUtils.createFolder(solidChat, ToLog);
				if(!created) return false;
				if (ToLog)
					console.log("Solid-chat folder created");
			}
			
			created = await podUtils.createFolder(groups, ToLog);
			if(!created) return false;
			if (ToLog)
				console.log("Groups folder created");
		}
		console.log('-----------------------------' + folder);
		//New Folder:
		created = await podUtils.createFolder(folder, ToLog);

		//Define metadata object
		// Creates the metadata file for the group
		var metadata = {
			"@context": "http://schema.org/",
			"@type": "Group Chat",
			"people": GROUP.friends.length,
			"isGroup": true,
			"url": folder,
			"group": GROUP
		};

		var jsonString = JSON.stringify(metadata);
		
        ret = await podUtils.writeMsgJsonld( folder + "/metadata", jsonString, ToLog);
	}
	if(created)
		return folder;
	else
		return false;
}

async function joinGroup (url) {
	var metadata = url + 'metadata.jsonld';
	metadata = await podUtils.readFile(metadata, ToLog);
	
	if(!metadata) {
		return false;
	} else {
		metadata = JSON.parse(metadata);
		var previous = GROUP;
		GROUP = metadata.group;
		
		var ret = false;
		for( var i = 0; i < metadata.people; i++){
			if(GROUP.friends[i].uri == INFO.user){
				ret = await createGroupFolder(INFO.userURI, GROUP.name);
			}
		}
		if(!ret)
			return ret;
		else {
			ret = GROUP;
			GROUP = previous;
			return ret;
		}
	}
}

async function readGroups(){
	var solidChat = INFO.userURI + "public/SolidChat/";
	var groupsFolder = solidChat +"Groups/";
	
	var groups = [];
	var group, metadata;
	var folders = await podUtils.readFolder(groupsFolder, ToLog);
	for (var i = 0; i < folders.folders.length; i++){
		group = await podUtils.readFolder(folders.folders[i].url, ToLog);
		for (var j = 0; j < group.files.length ; j++){
			if(group.files[j].name == 'metadata.jsonld') {
				metadata = await podUtils.readFile(group.files[j].url, ToLog);
				metadata = JSON.parse(metadata);
				groups.push(metadata.group);
				break;
			}
		}
	}
		
	return groups;
}

async function receiveGroupMessages() {
	var dict = [];
	
	var folder = INFO.userURI + "public/SolidChat/Groups/" + GROUP.name +'/';
	
	var friend;
	for (var i = 0; i < GROUP.friends.length; i++) {
		friend = GROUP.friends[i];
		var file = friend.utilUri + "public/SolidChat/Groups/" + GROUP.name +'/' + "chatld.jsonld";
		userMessages = await podUtils.readFile(file, ToLog); 
		
		if (!userMessages) {
			if (ToLog)
				console.log("User chat file doesnt exist");
			userMessages = "[]";
		}
		
		chat = JSON.parse(userMessages);
		parsed = chat.messages;
		
		var containerType;
		if(parsed){
			parsed.forEach(element => {
				var date = new Date(Number(element.dateSent));
				var strDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
					date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
				if(friend.uri == INFO.user)
					dict.push(new message("<div class=\"containerChatDarker\"><p id=\"noMarginMessge\">" + element.text +
						"</p><p id=\"username\">" + friend.name + " (you) " + strDate + "</p></div>", date));
				else
					dict.push(new message("<div class=\"containerChat\"><p id=\"noMarginMessge\">" + element.text + 
						"</p><p id=\"username\">" + friend.name + " " + strDate + "</p></div>", date));				
			});
		}
		
		 //Delete existing notifiations
		if (notify)
			notiMan.deleteNotification(INFO.userURI, friend.uri);
	}
	
    dict.sort(function (a, b) {
        return a.date > b.date ? 1 : a.date < b.date ? -1 : 0;
    });

    MESSAGES.toShow = [];
    dict.forEach((n) => {
        MESSAGES.toShow.push(n.text)
    });
    MESSAGES.toShow = MESSAGES.toShow.slice(-10);
	MESSAGES.toShow.unshift("<p> URL: "+ folder +"</p>");

    return MESSAGES.toShow;
}

module.exports = {
    sendMessage: sendMessage,
    receiveMessages: receiveMessages,
	createGroup: createGroup,
	joinGroup: joinGroup,
	readGroups: readGroups,
	receiveGroupMessages: receiveGroupMessages,
    INFO: INFO,
    MESSAGES: MESSAGES,
	GROUP: GROUP,
    ToLog: ToLog
}