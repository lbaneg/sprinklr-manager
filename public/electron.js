
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Pool } = require('pg');
const {ipcMain} = require('electron');
const { v4  } = require('uuid');

require('dotenv').config();

const pool = new Pool({
  host: 'clickfactorydev.ccavhumaz3qp.us-west-1.rds.amazonaws.com',
  port: '5432',
  user: 'clickfactory',
  database:'clickfactorydev',
  password: 'click2018'
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let mainWindow;
function createWindow () { 
    const startUrl = process.env.NODE_ENV === 'development'? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
    mainWindow = new BrowserWindow({
         width: 1200, 
         height: 700,
         title:'Sprinklr Manager',
         webPreferences: {
                nodeIntegration: true,
                preload: __dirname + '/preload.js'
            }
        });
    mainWindow.loadURL(startUrl);
    mainWindow.on('closed', function () {
      mainWindow = null;
    });
 
   if(process.env.NODE_ENV === 'development') mainWindow.openDevTools();
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
        app.quit();
        pool.end();
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
const RESPONSE = {
    status:'',
    data:null,
    message:''
}
//BIDS MESSAGE API
ipcMain.on('LOADBIDS',(event,arg)=>{
    pool.query('SELECT * FROM fb_sprinklr_template.bids').then((res) => {
        event.sender.send('LOADBIDSRESP', res.rows);
        
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
        event.sender.send('LOADPIEDATARESP', e);
        
    })
})
ipcMain.on('EDITBID',(event,arg)=>{
    pool.query('UPDATE fb_sprinklr_template.bids SET site=$1,vendor=$2,starting_bid=$3,campaign_budget=$4,platform=$5 WHERE bid_id=$6',[arg.site,arg.vendor,arg.starting_bid,arg.campaign_budget,arg.platform,arg.bid_id]).then((res) => {
        loadBids(event);
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
        event.sender.send('LOADBIDSRESP', e);
    })
})
ipcMain.on('DELETEBIDS',(event,arg)=>{
    for(const elm of arg){
        pool.query('DELETE FROM fb_sprinklr_template.bids WHERE bid_id = ($1)',[elm.bid_id]).then((res) => {
            //event.sender.send('LOADBIDSRESP', res.rows);
            loadBids(event);
        }).catch((e) =>{
            console.log('ERROR:');
            console.error(e.stack);
            console.log(e);
            event.sender.send('LOADBIDSRESP', e);
        })
    }
})
ipcMain.on('CREATEBID',(event,arg)=>{
        const UUID = v4();       
        pool.query('INSERT INTO fb_sprinklr_template.bids(site,vendor,starting_bid,campaign_budget,bid_id,platform)  VALUES($1,$2,$3,$4,$5,$6)',[arg.site,arg.vendor,arg.starting_bid,arg.campaign_budget,UUID,arg.platform]).then((res) => {
            //event.sender.send('LOADBIDSRESP', res.rows);
            // console.log(`INSERTED ${arg.site} ${arg.vendor} ${arg.starting_bid} ${arg.campaign_budget}` );
            // console.log(res.toString());
            loadBids(event);
        }).catch((e) =>{
            console.log('ERROR:');
            console.error(e.stack);
            console.log(e);
            event.sender.send('LOADBIDSRESP', e);
        })
})
ipcMain.on('LOADSELECTBIDS',(event,arg)=>{
    console.log(arg.site,arg.platform);
    pool.query('SELECT * FROM fb_sprinklr_template.bids WHERE site= $1 AND platform = $2',[arg.site,arg.platform]).then((res) => {
        console.log(res.rows);
        event.sender.send('LOADSELECTBIDSRESP', res.rows);
        
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
        
    })
})
//AUDIENCE MESSAGE API
ipcMain.on('LOADAUD',(event,arg)=>{
    pool.query('SELECT * FROM fb_sprinklr_template.audience_targets').then((res) => {
        event.sender.send('LOADAUDR', res.rows);
        
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
        event.sender.send('LOADPIEDATARESP', e);
        
    })
})
ipcMain.on('CREATEAUD',(event,arg)=>{
    //console.log(v4.toString())
    const UUID = v4();
    pool.query('INSERT INTO fb_sprinklr_template.audience_targets(audience_id,site,audience_name,age_min,age_max,gender,sprinklr_targeting_id)  VALUES($1,$2,$3,$4,$5,$6,$7)',[UUID,arg.site,arg.audience_name,arg.age_min,arg.age_max,arg.gender,arg.sprinklr_targeting_id]).then((res) => {
        //event.sender.send('LOADBIDSRESP', res.rows);
        loadAud(event);
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
        event.sender.send('LOADPIEDATARESP', e);
        
    })
})
ipcMain.on('DELETEAUD',(event,arg)=>{
    for(const elm of arg){
        pool.query('DELETE FROM fb_sprinklr_template.audience_targets WHERE audience_id = ($1)',[elm.audience_id]).then((res) => {
            //event.sender.send('LOADBIDSRESP', res.rows);
            loadAud(event);
        }).catch((e) =>{
            console.log('ERROR:');
            console.error(e.stack);
            console.log(e);
            event.sender.send('LOADPIEDATARESP', e);
        })
    }
})
ipcMain.on('EDITAUD',(event,arg)=>{
    pool.query('UPDATE fb_sprinklr_template.audience_targets SET site=$1,audience_name=$2,age_min=$3,age_max=$4,gender=$5,sprinklr_targeting_id=$6 WHERE audience_id=$7',[arg.site,arg.audience_name,arg.age_min,arg.age_max,arg.gender,arg.sprinklr_targeting_id,arg.audience_id]).then((res) => {
        //event.sender.send('LOADBIDSRESP', res.rows);
        loadAud(event);
        
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
        event.sender.send('LOADAUDR', e);
    })
})
ipcMain.on('LOADAUDIANCETARGETS',(event,arg)=>{
    const response = {...RESPONSE};
    if(!Array.isArray(arg)) arg = [arg]; //ADD BETTER ERROR HANDLEING
    pool.query('SELECT * FROM fb_sprinklr_template.audience_targets WHERE site = $1',arg).then((res) => {
        response.status = 'ok';
        response.data = res.rows;
        response.message = `${res.command}`;
        event.sender.send('LOADAUDIANCETARGETSRESP', response);
    }).catch((e) =>{
        response.status = 'error';
        response.data = `${e.stack}`;
        response.message = `${e.message}`;
        console.log(JSON.stringify(response));
        event.sender.send('LOADPIEDATARESP', e);
        
    }) 
})

//UPLOADS MESSAGE API
ipcMain.on('INSERTUPLOAD',(event,arg)=>{
    const response = {...RESPONSE};
    for(const rec of arg){
        const UUID = v4();
        const date =  new Date().toLocaleString('en-US', { timeZone: 'GMT' });
        const values = [UUID,date]
        let record = values.concat(rec);
        pool.query('INSERT INTO fb_sprinklr_template.uploads(upload_id,upload_date,line_number,date_added,facebook_page,headline,description_dek,body_blurb,live_url,facebook_image)  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',record).then((res) => {
            //event.sender.send('LOADBIDSRESP', res.rows);
            
        }).catch((e) =>{
            response.status = 'error';
            response.data = `${e.stack}`;
            response.message = `${e.message}`;
            event.sender.send('insert-upload-response', response); //NOT Implemented yet
            
        })
    }
  
})

//GRAPH MESSAGE API
ipcMain.on('LOADPIEDATA',(event,arg)=>{
    const response = {...RESPONSE};
    pool.query('SELECT  facebook_page AS name, COUNT(*) as y FROM fb_sprinklr_template.uploads GROUP BY facebook_page').then((res) => {
        const resp = res.rows.map(elm=>{
            elm.y = Number(elm.y);
            return elm;
        })
        response.status = 'ok';
        response.data = resp;
        response.message = `${res.command}`;
        event.sender.send('LOADPIEDATARESP',  response);
    }).catch((e) =>{
        response.status = 'error';
        response.data = `${e.stack}`;
        response.message = `${e.message}`;
        event.sender.send('LOADPIEDATARESP', response);
    })
})

function loadAud(event){//RELOADS UI WITH UPDATED DATA 
    pool.query('SELECT * FROM fb_sprinklr_template.audience_targets').then((res) => {
        event.sender.send('LOADAUDR', res.rows);
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
        event.sender.send('LOADAUDR', e);
    })
}
function loadBids(event){
    pool.query('SELECT * FROM fb_sprinklr_template.bids').then((res) => {
        event.sender.send('LOADBIDSRESP', res.rows);
        
    }).catch((e) =>{
        console.log('ERROR:');
        console.error(e.stack);
        console.log(e);
        event.sender.send('LOADBIDSRESP', e);
        
    })
}