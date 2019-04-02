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
        var userList = readAllNotification(receiverURI);
        
        
        //UpdateList
        for(var i=0; i<userList.length;i++){
            if(userList[i]==user)
                var existe=0;
        }

        if(existe!=0)
            userList.push(user);
        //AddUsers
        var text= "    noti:news";
        for(var i=0; i<userList.length;i++){
            text+= " \""+userList[i]+"\",";
        }
        text=text.slice(0,-1);
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
async function readAllNotification(receiverURI){
    //Read Notification file
    var receiverInbox = receiverURI+"inbox/";
    var fileURL = receiverInbox+notAppend+".ttl";
    var file = await podUtils.readFile(fileURL,true);

    var userList=[];
    if(file){
        //Return all user with notifications
        var usersText = file.split("\"");
        for(var i=0; i<usersText.length ; i=i+2){
            userList.push(usersText[i]);
        }
    }   
    return userList;
}

module.exports = {
	deleteNotification : deleteNotification,
	writeNotification : writeNotification,
	readAllNotification : readAllNotification
}
