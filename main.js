const { app, BrowserWindow } = require('electron');
require('./App.js');

// Mantén una referencia global del objeto window, si no lo haces, la ventana 
// se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.
let mainWindow;
let loginWindow;

function startup () {
	// Crea la ventana del navegador.
	mainWindow = new BrowserWindow({ width: 1280, height: 720, frame: true });
	
	//Limpiamos cookies
	mainWindow.webContents.session.clearStorageData([], function (data) {
		console.log("Cookies: " + data);
	});
	
	// y carga el archivo index.html de la aplicación.
	mainWindow.loadURL('http://localhost:1919');

	// Emitido cuando la ventana es cerrada.
	mainWindow.on('closed', () => {
	// Elimina la referencia al objeto window, normalmente	guardarías las ventanas
	// en un vector si tu aplicación soporta múltiples ventanas, este es el momento
	// en el que deberías borrar el elemento correspondiente.
	mainWindow = null;
	});
};

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.on('ready', startup);

// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  if (process.platform !== 'darwin') {
	app.quit();
  }
})

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (mainWindow === null) {
	startup();
  }
})

// En este archivo puedes incluir el resto del código del proceso principal de
// tu aplicación. También puedes ponerlos en archivos separados y requerirlos aquí.
