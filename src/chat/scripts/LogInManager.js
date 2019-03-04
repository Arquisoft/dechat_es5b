const fileClient = require('solid-file-client')

function login () {
    fileClient.popupLogin().then(webId => {
        console.log(`Logged in as ${webId}.`);
    }, err => console.log(err));
    $('#login').hide();
    $('#logout').show();
    $('#chatRef').show();
}

function logout () {
    fileClient.logout().then ( console.log( `Bye now!` ));
    $('#login').show();
    $('#logout').hide();
    $('#chatRef').hide();
}

module.exports = {
    login: login,
    logout: logout
}
