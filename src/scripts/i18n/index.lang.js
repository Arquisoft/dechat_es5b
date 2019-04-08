let lang;
/**
 * Update login screen language
 */
function setLoginLanguage(locale){
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
			  "h3header": "Start chatting",
			  "logOutBtn": "Log out",
			  "chatRef": "Enter to chat",
			  "": "",
			  "": "",
			  "": ""
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
			  "h3header": "Chatea ahora",
			  "logOutBtn": "Cerrar sesión",
			  "chatRef": "Enter to chat",
			  "": "",
			  "": "",
			  "": ""
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
	$("#h3header").text(lang.h3header);
	$("#logOutBtn").text(lang.logOutBtn);
	$("#chatRef").text(lang.chatRef);
}

setLoginLanguage("en_US");