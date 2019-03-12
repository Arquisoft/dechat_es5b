const fileClient = require('solid-file-client')

async function login () {
    await fileClient.popupLogin().then(webId => {
        console.log(`Logged in as ${webId}.`);
    }, err => console.log(err));
    $('#login').addClass('d-none');
    $('#logout').removeClass('d-none');
    $('#chatRef').removeClass('d-none');
}

async function logout () {
    await fileClient.logout().then ( console.log( `Bye now!` ));
    $('#login').removeClass('d-none');
    $('#logout').addClass('d-none');
    $('#chatRef').addClass('d-none');
}

async function cosroro(){}
module.exports = {
    login: login,
    logout: logout
}
