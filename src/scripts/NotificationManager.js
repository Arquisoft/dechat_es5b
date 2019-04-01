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
async function writeNotification(receiverInbox, user){
    //Read reiver inbox
    var file= receiverInbox+notAppend+".ttl"
    var readFile = await podUtils.readFile(file,false);
    var base = "@prefix : <#> . \n";
         base+= "@prefix noti: <http://schema.org/> . \n";
         base+= "@prefix user: <https://user.solid.community/> . \n";
         base+= "\n";
         base+= ":notifications \n";
         base+= "   a noti:Notification ; \n";
    try{
        
        if(!readFile){
            throw("error")
        }
    }catch(error){
         //New File(Only header)
         await podUtils.writeTurtle(receiverInbox+notAppend, base, false);
    }

    //Check already exits user Notification
        lista = readAllNotification();
        //IF false write newNotification
        
        //If true do nothing
        var text= "    noti:news";
        text+= " \"user\" ";
        text+= " .";
        var base = "@prefix : <#> . \n"
         base+= "@prefix noti: <http://schema.org/> . \n"
         base+= "@prefix user: <https://user.solid.community/> . \n"
         base+= "\n"
         base+= ":notifications \n"
         base+= "   a noti:Notification ; \n"
         base+= text;
        await podUtils.writeTurtle(receiverInbox+"Notification", base, false);
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
