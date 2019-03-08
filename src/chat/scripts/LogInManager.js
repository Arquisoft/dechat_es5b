const fileClient = require('solid-file-client')

async function login () {
    await fileClient.popupLogin().then(webId => {
        console.log(`Logged in as ${webId}.`);
    }, err => console.log(err));
    $('#login').hide();
    $('#logout').show();
    $('#chatRef').show();
}

async function logout () {
    await fileClient.logout().then ( console.log( `Bye now!` ));
    $('#login').show();
    $('#logout').hide();
    $('#chatRef').hide();
}

module.exports = {
    login: login,
    logout: logout
}
