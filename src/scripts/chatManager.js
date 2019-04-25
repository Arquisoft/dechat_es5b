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

//SEND Message function login
async function sendMessage(text) {
    var ret = false;

    //Define folders name
    var solidChat = INFO.userURI + "public/SolidChat/";
    var folder = solidChat + INFO.receiverName.replace(/ /g, "-") + "/";
    var filename = folder + "/chatld.jsonld";

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
        jsonString = JSON.stringify(messages);


        ret = await podUtils.writeMsgJson(filename, jsonString, ToLog);
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

        ret = await podUtils.writeMsgJsonld(filename, jsonString, ToLog);
        if (notify)
            await notiMan.writeNotification(INFO.receiverURI, INFO.user);

    }
    return ret;
}

async function receiveMessages() {
    if (ToLog)
        console.log("ReceivingMessages")

    //Define folders name
    var uFolder = INFO.userURI + "public/SolidChat/" + INFO.receiverName.trim().replace(/ /g, "-") + "/";
    var rFolder = INFO.receiverURI + "public/SolidChat/" + INFO.userName.trim().replace(/ /g, "-") + "/";
    var uFile = uFolder + "/chatld.jsonld";
    var rFile = rFolder + "/chatld.jsonld";

    var userMessages;
    var receiveMessages;

    var dict = [];
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

    var uParsed = JSON.parse(userMessages).messages;
    var rParsed = JSON.parse(receiveMessages).messages;

    uParsed.forEach(element => {
        var date = new Date(Number(element.dateSent));
        var strDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        dict.push(new message("<div class=\"containerChatDarker\"><p id=\"noMarginMessge\">" + element.text + "</p><p id=\"username\">" + INFO.userName + " (you) " + strDate + "</p></div>", date));
    });
    rParsed.forEach(element => {
        var date = new Date(Number(element.dateSent));
        var strDate = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " +
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        dict.push(new message("<div class=\"containerChat\"><p id=\"noMarginMessge\">" + element.text + "</p><p id=\"username\">" + INFO.receiverName + " " + strDate + "</p></div>", date));
    });

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

//Function for main.js
//Return users with new msg
async function newNotifications() {
    //TO-DO----------------------------------------------------------------------------------
}

module.exports = {
    sendMessage: sendMessage,
    receiveMessages: receiveMessages,
    newNotifications: newNotifications,
    INFO: INFO,
    MESSAGES: MESSAGES,
    ToLog: ToLog
}