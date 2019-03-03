const fileClient = SolidFileClient;

class LogInManager{

    login(){
        fileClient.popupLogin().then(webId => {
            console.log(`Logged in as ${webId}.`);
        }, err => console.log(err));
        $('#login').hide();
        $('#logout').show();
        $('#chatRef').show();
    }

    logout(){
        fileClient.logout().then( console.log( `Bye now!` ));
        $('#login').show();
        $('#logout').hide();
        $('#chatRef').hide();
    }
}


var loginM = new LogInManager();

