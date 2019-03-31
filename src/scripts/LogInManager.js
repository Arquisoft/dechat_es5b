const fileClient = require('solid-file-client');
var podUtils = require('./podUtilities.js');

async function login (credentials) {
    podUtils.login(credentials);
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