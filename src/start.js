const electron = require("electron");
const { ipcMain } = require("electron");
const Promise = require("bluebird");

const { shell } = require("electron");

Promise.config({
  warnings: {
    wForgottenReturn: false
  }
});
const app = electron.app;
const path = require("path");

const fs = require("fs-extra");
const isDev = require("electron-is-dev");

const BrowserWindow = electron.BrowserWindow;

let mainWindow;

ipcMain.on("renameFile", (event, arg) => {
  fs.rename(arg.old.path, arg.new.path, function(err) {
    if (err) throw err;
    console.log("renamed complete");
  });
});

ipcMain.on("deleteFile", (event, arg) => {
  fs.unlink(arg, err => {
    if (err) throw err;
    console.log("file deleted");
  });
});

ipcMain.on("openFile", (event, arg) => {
  shell.openItem(arg);
});

if(isDev){
const debug = require("electron-debug");

debug();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
