var podUtils = require('./podUtilities.js');

async function login() {
	let session = await podUtils.getSession();
	if (session == null){
		console.log("sesion true:" + session);
		if($('#desiredIDP').val() == "")
			$('#modalIDP').modal('show');
		else
			podUtils.loginNoPopup($('#desiredIDP').val());
	}else{
		console.log("sesion false:" + session);
		$('#login').addClass('d-none');
		$('#logout').removeClass('d-none');
		$('#chatRef').removeClass('d-none');
	}
}

async function logout() {
    podUtils.logout();
    $('#login').removeClass('d-none');
    $('#logout').addClass('d-none');
    $('#chatRef').addClass('d-none');
}
function setIDP(name){
	console.log(name);
}

module.exports = {
    login: login,
    logout: logout
}