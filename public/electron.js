
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
         width: 900, height: 700,minimizable:false,fullscreenable:false, title:'Sprinklr Manager',
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

//UPLOADS MESSAGE API
ipcMain.on('INSERTUPLOAD',(event,arg)=>{
    for(const rec of arg){
        const UUID = v4();
        const date =  new Date().toLocaleString('en-US', { timeZone: 'GMT' });
        const values = [UUID,date]
        let record = values.concat(rec);
        client.query('INSERT INTO fb_sprinklr_template.uploads(upload_id,upload_date,line_number,date_added,facebook_page,headline,description_dek,body_blurb,live_url,facebook_image)  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',record).then((res) => {
            //event.sender.send('LOADBIDSRESP', res.rows);
        }).catch((e) =>{
            console.log('ERROR:');
            console.error(e.stack);
            console.log(e);
        })
    }
  
})

//GRAPH MESSAGE API
ipcMain.on('LOADPIEDATA',(event,arg)=>{
    client.query('SELECT  facebook_page AS name, COUNT(*) as y FROM fb_sprinklr_template.uploads GROUP BY facebook_page').then((res) => {
        const resp = res.rows.map(elm=>{
            elm.y = Number(elm.y);
            return elm;
        })
        event.sender.send('LOADPIEDATARESP', resp);
        console.log(res.rows);
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
    })
})