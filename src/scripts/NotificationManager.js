var podUtils = require('./podUtilities.js');
const notAppend="SolidChatNot";
//Method for Delete readed Notifications (Current user open)
async function deleteNotification(userInbox, reciver){
    //Read user inbox
    //Check for reciver notification
        //If true delete
        //Else end
}

//Method for write new Notification on send Msg
async function writeNotification(receiverURI, user){
    var receiverInbox = receiverURI+"inbox/";
        //List all user
        lista = readAllNotification();

        //UpdateList
        //TO-DO

        //AddUsers
        var text= "    noti:news";
        text+= " \"user\" ";
        text+= " .";

        //Write final Notification
        var noti = "@prefix : <#> . \n"
        noti+= "@prefix noti: <http://schema.org/> . \n"
        noti+= "@prefix user: <"+receiverURI+"/> . \n"
        noti+= "\n"
        noti+= ":notifications \n"
        noti+= "   a noti:Notification ; \n"
        noti+= text;
        
        await podUtils.deleteFile(receiverInbox+notAppend+".ttl", false);
        await podUtils.writeTurtle(receiverInbox+notAppend, noti, false);
}
//Methor for constantly reading new Notifications from others chat
async function readAllNotification(){
    //Read Notification file
    //Return all user with notifications
}

module.exports = {
	deleteNotification : deleteNotification,
	writeNotification : writeNotification,
	readAllNotification : readAllNotification
}
