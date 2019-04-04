var podUtils = require('./podUtilities.js');

async function login (credentials) {
    podUtils.login(credentials);
    $('#login').addClass('d-none');
    $('#logout').removeClass('d-none');
    $('#chatRef').removeClass('d-none');
}

async function logout () {
    podUtils.logout();
    $('#login').removeClass('d-none');
    $('#logout').addClass('d-none');
    $('#chatRef').addClass('d-none');
}

module.exports = {
    login: login,
    logout: logout
}