/*
    options.js
    Holds functions for options page

    Author: Shine Jayakumar
    Email: shinejayakumar@yahoo.com
    COVID-19 Reporter Copyright (c) 2020 Shine Jayakumar. All Rights Reserved

    "options_ui": {
        "page": "options.html",
        "open_in_tab": false
    },
*/

document.addEventListener('DOMContentLoaded', function(){

loadCurrentSettings();

document.getElementById('btnSaveSettings').addEventListener('click', function(){

    const selNotStat = document.getElementById('selectNotificationStatus');
    const selRemLast = document.getElementById('selectRememberLast');
    const selTime = document.getElementById('selectTimeInt');

   setNotificationStatus(selNotStat);
   setRememberLast(selRemLast);
   setTimeInterval(selTime);

});

function setTimeInterval(selTimeInt){

    getCurrentAlarmTimePeriod(currentTP =>{
        
        let timeInterval;

        switch(selTimeInt.value){
            case 'vs':  timeInterval = 300; break;
            case 'sl':  timeInterval = 120; break;
            case 'md':  timeInterval = 60; break;
            case 'fs':  timeInterval = 30; break;
            case 'vf':  timeInterval = 15; break; 
            case 'ts':  timeInterval = 0.5; break; 
        }
        if(timeInterval != currentTP){ 
            
            removeAllAlarms(); 
            addAlarm('C19Updater', timeInterval);
            setDefaultIndicator(false);
            
            showSuccess('imgTimeInt'); 
        }
    });
}

function setNotificationStatus(selNStatus){

    chrome.storage.local.get(['nStatus'], ns=>{
 
        const notificatonStatus = selNStatus.value == "1"? true:false;
        
        if(notificatonStatus != ns.nStatus){
           
            chrome.storage.local.set({'nStatus':notificatonStatus}); 
            
            setDefaultIndicator(false);
            showSuccess('imgNStatus');
           
        }
    });
}

function setRememberLast(selRemLast){

    chrome.storage.local.get(['rememberLast'], rl=>{

        const remLast = selRemLast.value == '1'? true:false;
      
        if(remLast != rl.rememberLast){
            
            chrome.storage.local.set({'rememberLast':remLast});
            
            setDefaultIndicator(false);
            showSuccess('imgRemLast');
            
        }        
    });
}


document.getElementById('btnSetDefault').addEventListener('click', setDefaultSettings);
});

//Sets Default indicator to false
//otherwise, when background reloads, custom settings will be lost
function setDefaultIndicator(status){
    chrome.storage.local.set({'setDefault': status});
}

//Returns currently set Time Interval
function getCurrentAlarmTimePeriod(callback){

    chrome.alarms.get('C19Updater', al=>{
      
       if(al != undefined)
       {
        callback(al.periodInMinutes);
       }
    });
}   

function addAlarm(name, interval){
    chrome.alarms.create(name, {delayInMinutes: interval, periodInMinutes: interval});
}

function removeAlarm(name){

    chrome.alarms.clear(name, function(wasCleared){
        console.log(':)');
                
    });
}
function removeAllAlarms()
{
    chrome.alarms.clearAll(wasCleared =>{
        console.log(':P');
    });
}

//Set default values
function setDefaultSettings()
{
    document.getElementById('selectTimeInt').value = 'sl';
    document.getElementById('selectNotificationStatus').value = '0';
    document.getElementById('selectRememberLast').value = '0';
}

//Load currently stored values
function loadCurrentSettings()
{
    chrome.storage.local.get(['nStatus'], tInt=>{
        if(tInt.nStatus != undefined){
            document.getElementById('selectNotificationStatus').value = tInt.nStatus == true? '1':'0';
        }

    });
    chrome.storage.local.get(['rememberLast'], rLast=>{
        if(rLast.rememberLast != undefined){
            document.getElementById('selectRememberLast').value = rLast.rememberLast == true? '1':'0';
        }
    });

    getCurrentAlarmTimePeriod(tPeriod =>{
        
       const selTimeInt = document.getElementById('selectTimeInt');

        switch(tPeriod){
            case  300:  selTimeInt.value = 'vs'; break;
            case  120:  selTimeInt.value = 'sl'; break;
            case   60:  selTimeInt.value = 'md'; break;
            case   30:  selTimeInt.value = 'fs'; break;
            case   15:  selTimeInt.value = 'vf'; break; 
        }
    });

    document.getElementById('imgNStatus').style.display = "none";
    document.getElementById('imgRemLast').style.display = "none";
    document.getElementById('imgTimeInt').style.display = "none";
    
}



function showError(){
    const errDiv = document.getElementById('error');

    errDiv.style.display = "block";

    setTimeout(function (){
        errDiv.style.display = "none";
    }, 3000);
}

function showSuccess(imgId){

    document.getElementById(imgId).style.display = "block";

    setTimeout(function(){
        document.getElementById(imgId).style.display = "none"; 
    }, 2000);

}
