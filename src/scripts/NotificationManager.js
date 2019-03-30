var podUtils = require('./podUtilities.js');

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
    //Check already exits user Notification
        //IF false write newNotification
        //If true do nothing
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
