const fileClient = require('solid-file-client')
const auth = require('solid-auth-client');

async function login () {
	const session = await solid.auth.currentSession();
	if (!session){
		if($('#desiredIDP').val() == "")
			$('#modalIDP').modal('show');
		else
			await solid.auth.login($('#desiredIDP').val());
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
function setIDP(name){
	console.log(name);
}

async function cosroro(){}
module.exports = {
    login: login,
    logout: logout
}
