let lang;
/**
 * Update login screen language
 */
function setLanguage(locale){
	switch(locale){
		case "en_US":
			lang = {
				"title": "DeChat ES5B - Your decentralized chat",
				"about": "About the chat",
				"langSelector": "Language",
				"desktopApp": "Download desktop app",
				"h1header": "Welcome to our descentralized chat",
				"h2header": "Log in with your Solid POD!",
				"logInBtn": "Log in",
				"logOutBtn": "Log out",
				"chatRef": "Enter to chat",
				"h3header": "Start chatting",
				"desc1": "Just log in with your Solid community account and start chatting.",
				"desc2": "You must have friends in your solid community account to be able to chat.",
				"h3header2": "How it works",
				"desc3": "Our deChat is a decentralized chat site, build on top of Solid.",
				"desc4": "All personal data about the chat is stored on your POD.",
				"modalIDPTitle": "Select your Identity Provider (IDP) or WebID",
				"modalIDPDescription": "If you want to login using Solid Community Server, leave this field empty and click \"Login with Solid Community\"",
				"solidLogin": "Log in with Solid Community",
				"idpLogin": "Log in"
			}
			break;
		case "es_ES":
			lang = {
				"title": "DeChat ES5B - Chatea con tus amigos de forma descentralizada",
				"about": "Acerca de",
				"langSelector": "Idioma",
				"desktopApp": "Descarga la aplicación",
				"h1header": "Bienvenido a nuestro chat descentralizado",
				"h2header": "Inicia sesión con tu POD de SOLID",
				"logInBtn": "Inicia sesión",
				"logOutBtn": "Cerrar sesión",
				"chatRef": "Enter to chat",
				"h3header": "Chatea ahora",
				"desc1": "Simplemente inicia sesión en tu cuenta de SOLID usando tu POD y comienza a chatear.",
				"desc2": "Debes tener una cuenta de SOLID para poder chatear.",
				"h3header2": "Como funciona",
				"desc3": "Nuestro DeChat es un Chat descentralizado construido sobre SOLID",
				"desc4": "Toda u información personal está almacenada en tu pod",
				"modalIDPTitle": "Selecciona tu Proveedor de Identidad (IDP) o WebID",
				"modalIDPDescription": "Si deseas iniciar sesión utilizando el servidor de Solid Community, deja esto en blanco y pulsa \"Entrar con Solid Community\"",
				"solidLogin": "Entrar con Solid Community",
				"idpLogin": "Iniciar sesión"
			}
			break;
		default:
			console.error("No language set");
	}
	//Set navbar phrases
	document.title = lang.title;
	$("#about").text(lang.about);
	$("#langSelector").text(lang.langSelector);
	$("#desktopApp").text(lang.desktopApp);
	$("#h1header").text(lang.h1header);
	$("#h2header").text(lang.h2header);
	$("#logInBtn").text(lang.logInBtn);
	$("#logOutBtn").text(lang.logOutBtn);
	$("#chatRef").text(lang.chatRef);
	$("#h3header").text(lang.h3header);
	$("#desc1").text(lang.desc1);
	$("#desc2").text(lang.desc2);
	$("#h3header2").text(lang.h3header2);
	$("#desc3").text(lang.desc3);
	$("#desc4").text(lang.desc4);
	$("#modalIDPTitle").text(lang.modalIDPTitle);
	$("#modalIDPDescription").text(lang.modalIDPDescription);
	$("#solidLogin").text(lang.solidLogin);
	$("#idpLogin").text(lang.idpLogin);
}

setLanguage("en_US");