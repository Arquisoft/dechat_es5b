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
        var List=[];
        List = await readAllNotification(receiverURI);
        
        //-----------------------------
        var existe=0;
        //UpdateList
        for(var i=0; i<List.length;i++){
            if(List[i]==user)
                existe=1;
        }

        if(existe==0)
            List.push(user);

        
        //------------------------------

        //AddUsers
        var text= "    noti:news";
        for(var i=0; i<List.length;i++){
            text+= " \""+List[i]+"\",";
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
        for(var i=0; i<usersText.length ; i++){
            if(i%2==1){
                userList.push(usersText[i]);
            }
            
        }
    }   
    return userList;
}

module.exports = {
	deleteNotification : deleteNotification,
	writeNotification : writeNotification,
	readAllNotification : readAllNotification
}
