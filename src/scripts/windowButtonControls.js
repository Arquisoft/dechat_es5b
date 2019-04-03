const {remote} = require("electron");

$("#closeElectron").click(function () {
  console.log("cerrando...");
  var ventana = remote.getCurrentWindow();
  ventana.close();
});

$("#minimizeElectron").click(function () {
  console.log("minimizando...");
  var ventana = remote.getCurrentWindow();
  ventana.minimize();
});

$("#maximizeElectron").click(function () {
  console.log("maximizando...");
  var ventana = remote.getCurrentWindow();

  //If maximized, unmaximize it, otherwise maximize
  window.isMaximized() ? window.unmaximize() : window.maximize();
});