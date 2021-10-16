/*
COVID-19 Reporter

background.js
Author: Shine Jayakumar
Email: shinejayakumar@yahoo.com
COVID-19 Reporter Copyright (c) 2020 Shine Jayakumar. All Rights Reserved
*/

loadDB();
loadDBTimeSeries();
loadDBWorldWide();
lastUpdatedTimeStamp();

setDefaultSettings();



async function getData(url, callback){

    const response = await fetch(url);
    const rawdata = await response.json();

    if( response.status == 200 ){
        callback(rawdata);
    }
}

function loadDB(){

    const allDataURL = "https://disease.sh/v2/countries";

    getData(allDataURL, function(rawdata){
        chrome.storage.local.set({'countryData': rawdata});
    })
    .catch(err =>{
        console.log(err);
    });
}

function loadDBTimeSeries(){

    const timeSeriesURL = "https://pomber.github.io/covid19/timeseries.json";

    getData(timeSeriesURL, function(rawdata){
        chrome.storage.local.set({'timeSeries': rawdata});
    })
    .catch(err=>{
        console.log(err);
    });
}

function loadDBWorldWide()
{
    const totalCasesURL = "https://disease.sh/v2/all";

    getData(totalCasesURL, function(data){
        if(data){
            chrome.storage.local.set({'worldwide': data});            
        }
    })
    .catch(err =>{
        console.log(err);
    });
}

function lastUpdatedTimeStamp()
{
    const currentDate = new Date();
    
    chrome.storage.local.set({'lastUpdated': String(currentDate)});
    
}
function setDefaultSettings(){

    chrome.storage.local.get(['nStatus'], val=>{
        if(val.nStatus == undefined){
            chrome.storage.local.set({'nStatus': false});
        }
    });
    chrome.storage.local.get(['rememberLast'], val=>{
        if(val.rememberLast == undefined){
            chrome.storage.local.set({'rememberLast': false});
        }
    });

    chrome.alarms.get('C19Updater', al=>{
       
       if(al == undefined)
       {
         addAlarm('C19Updater', 120); 
       }
    });   

}

function addAlarm(name, interval){
    
    chrome.alarms.create(name, {delayInMinutes: interval, periodInMinutes: interval});

}

function removeAlarm(name){
    chrome.alarms.clear(name);
}


//When alarm is triggered, do this 
chrome.alarms.onAlarm.addListener(function(al){
    
    loadDB();
    loadDBTimeSeries();
    loadDBWorldWide();
    lastUpdatedTimeStamp();
    
    const notificationOptions = {
        type: "basic",
        title: "COVID-19 Reporter",
        message: "Reports updated",
        iconUrl: "img/icon128.png"
    };
    
    chrome.storage.local.get(['nStatus'], val =>{
        if(val.nStatus != undefined){
           
            if(val.nStatus == true){
                chrome.notifications.create(notificationOptions, function(){
                    console.log('Notification created');
                });
            }
        }
    });
});

chrome.runtime.onMessage.addListener(function(msg){

    loadDB();
    loadDBTimeSeries();
    loadDBWorldWide();
    lastUpdatedTimeStamp();
});

