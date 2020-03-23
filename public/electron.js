
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Client } = require('pg');
const {ipcMain} = require('electron')

this.client = new Client({
    host: 'clickfactorydev.ccavhumaz3qp.us-west-1.rds.amazonaws.com',
    port: 5334,
    user: 'clickfactory',
    password: 'click2018',
  })
this.client.connect();
//const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow;
function createWindow () { 
    const startUrl = process.env.NODE_ENV === 'development'? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    mainWindow = new BrowserWindow({
         width: 630, height: 600, title:'Kelly`s Application',
         webPreferences: {
                nodeIntegration: true,
                preload: __dirname + '/preload.js'
            }
        });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
 
   //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('getAll',(event,arg)=>{
    console.log(arg);
    // const temp = this.client.query('SELECT* FROM clickfactorydev.answersite_bing_spend'); 
    // this.client.end();
    //console.log(temp);
    // Event emitter for sending asynchronous messages
    event.sender.send('getAll-reply', 'async pong');
})