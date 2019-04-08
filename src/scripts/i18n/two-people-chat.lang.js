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
				"": "",
				"": "",
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
				"logOutBtn": "Cerrar sesión",
				"": "",
				"": "",
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
	$("#logOutBtn").text(lang.logOutBtn);
}

setLanguage("en_US");