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
		case "zh-CN":
			lang = {
				"title": "DeChat ES5B - 您的分散聊天室",
				"about": "关于聊天室",
				"langSelector": "语言",
				"desktopApp": "下载桌面 App",
				"h1header": "欢迎来到您的分散聊天室",
				"h2header": "使用您的 Solid POD 登录",
				"logInBtn": "登录",
				"logOutBtn": "登出",
				"chatRef": "进入聊天室",
				"h3header": "开始聊天",
				"desc1": "只需使用您的 Solid 社区帐户登录即可开始聊天。",
				"desc2": "您必须拥有可靠的社区帐户中的朋友才能聊天。",
				"h3header2": "怎么运作",
				"desc3": "我们的 deChat 是一个分散的聊天网站，建立在 Solid 之上。",
				"desc4": "有关聊天的所有个人数据都存储在您的 POD 中。",
				"modalIDPTitle": "选择您的身份提供商 (IDP) 或者 WebID",
				"modalIDPDescription": "如果要使用 Solid Community Server 登录, 将此字段留空并单击 \"使用 Solid Community 登录\"",
				"solidLogin": "使用 Solid Community 登录",
				"idpLogin": "登录"
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
