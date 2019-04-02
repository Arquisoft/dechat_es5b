const fileClient = require('solid-file-client')
const auth = require('solid-auth-client');

async function login () {
	const session = await solid.auth.currentSession();
	if (!session){
		await solid.auth.login('https://solid.community');
	}else{
		console.log(`Logged in as ${session.webId}`);
		$('#login').addClass('d-none');
		$('#logout').removeClass('d-none');
		$('#chatRef').removeClass('d-none');
	}
    return true;
}

async function logout () {
	solid.auth.logout().then(() => console.log("Sesión cerrada"));
    $('#login').removeClass('d-none');
    $('#logout').addClass('d-none');
    $('#chatRef').addClass('d-none');
    return true;
}

async function cosroro(){}
module.exports = {
    login: login,
    logout: logout
}
