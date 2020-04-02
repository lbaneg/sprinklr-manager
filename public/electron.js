
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Client } = require('pg');
const {ipcMain} = require('electron');
const { v4  } = require('uuid');

require('dotenv').config();

const client = new Client({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})
client.connect();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow;
function createWindow () { 
    const startUrl = process.env.NODE_ENV === 'development'? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    mainWindow = new BrowserWindow({
         width: 800, height: 500,minimizable:false,fullscreenable:false, title:'Sprinklr Templater',
         webPreferences: {
                nodeIntegration: true,
                preload: __dirname + '/preload.js'
            }
        });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
 
   if(process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools();
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

//BIDS MESSAGE API
ipcMain.on('LOADBIDS',(event,arg)=>{
    client.query('SELECT * FROM fb_sprinklr_template.bids').then((res) => {
        event.sender.send('LOADBIDSRESP', res.rows);
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
    })
})
ipcMain.on('DELETEBIDS',(event,arg)=>{
    for(const elm of arg){
        client.query('DELETE FROM fb_sprinklr_template.bids WHERE bid_id = ($1)',[elm.bid_id]).then((res) => {
            //event.sender.send('LOADBIDSRESP', res.rows);
        }).catch((e) =>{
            console.log('ERROR:');
            console.error(e.stack);
            console.log(e);
        })
    }
})
ipcMain.on('CREATEBID',(event,arg)=>{
    
        client.query('INSERT INTO fb_sprinklr_template.bids(site,vendor,starting_bid,campaign_budget)  VALUES($1,$2,$3,$4)',[arg.site,arg.vendor,arg.starting_bid,arg.campaign_budget]).then((res) => {
            //event.sender.send('LOADBIDSRESP', res.rows);
            // console.log(`INSERTED ${arg.site} ${arg.vendor} ${arg.starting_bid} ${arg.campaign_budget}` );
            // console.log(res.toString());
        }).catch((e) =>{
            console.log('ERROR:');
            console.error(e.stack);
            console.log(e);
        })
    
})

//AUDIENCE MESSAGE API
ipcMain.on('LOADAUD',(event,arg)=>{
    client.query('SELECT * FROM fb_sprinklr_template.audience_targets').then((res) => {
        event.sender.send('LOADAUDR', res.rows);
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
    })
})
ipcMain.on('CREATEAUD',(event,arg)=>{
    //console.log(v4.toString())
    const UUID = v4();
    client.query('INSERT INTO fb_sprinklr_template.audience_targets(audience_id,site,audience_name,age_min,age_max,gender)  VALUES($1,$2,$3,$4,$5,$6)',[UUID,arg.site,arg.audience_name,arg.age_min,arg.age_max,arg.gender]).then((res) => {
        //event.sender.send('LOADBIDSRESP', res.rows);
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
    })
})
ipcMain.on('DELETEAUD',(event,arg)=>{
    for(const elm of arg){
        client.query('DELETE FROM fb_sprinklr_template.audience_targets WHERE audience_id = ($1)',[elm.audience_id]).then((res) => {
            //event.sender.send('LOADBIDSRESP', res.rows);
        }).catch((e) =>{
            console.log('ERROR:');
            console.error(e.stack);
            console.log(e);
        })
    }
})