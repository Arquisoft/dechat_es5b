let lang;
/**
 * Update login screen language
 */
function setLanguage(locale){
	switch(locale){
		case "en-US":
			lang = {
				"title": "DeChat ES5B - User manual",
				"langSelector": "Language",
				"h1header": "DeChat_es5b User Manual",
				"h3header": "Here you can see a video about how to use our chat",
				"desktop_app": "Desktop app",
				"about_us": "About us",
				"development": "Development",
				"arc42": "Arc42 Docs"
			}
			break;
		case "es-ES":
			lang = {
				"title": "DeChat ES5B - Manual de usuario",
				"langSelector": "Idioma",
				"h1header": "DeChat_es5b Manual de Usuario",
				"h3header": "Aquí puede ver un vídeo sobre cómo utilizar nuestro chat",
				"desktop_app": "App para escritorio",
				"about_us": "Sobre nosotros",
				"development": "Desarrollo",
				"arc42": "Arc42 Docs"
			}
			break;
		case "zh-CN":
			lang = {
				"title": "DeChat ES5B - 用戶手冊",
				"langSelector": "语言",
				"h1header": "用戶手冊",
				"h3header": "在這裡，您可以看到有關如何使用聊天的視頻",
				"desktop_app": "桌面應用",
				"about_us": "關於我們",
				"development": "發展",
				"arc42": "arc42文檔"
			}
			break;
		default:
			console.error("No language set");
	}
	//Set phrases
	document.title = lang.title;
	$("#langSelector").text(lang.langSelector);
	$("#h1header").text(lang.h1header);
	$("#h3header").text(lang.h3header);
	$("#desktop_app").text(lang.desktop_app);
	$("#about_us").text(lang.about_us);
	$("#development").text(lang.development);
	$("#arc42").text(lang.arc42);
}
setLanguage("en-US");