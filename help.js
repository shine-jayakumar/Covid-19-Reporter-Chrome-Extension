/*
COVID-19 Reporter

Help.js - script for Help file - COVID-19 Reporter
Author: Shine Jayakumar
Email: shinejayakumar@yahoo.com
COVID-19 Reporter Copyright (c) 2020 Shine Jayakumar. All Rights Reserved
*/

document.addEventListener('DOMContentLoaded', function(){

    
    document.getElementById('btnSummary').addEventListener('click', function (){
        let summaryTopics = document.getElementById('summaryTopics');
    
        if(summaryTopics.style.display == ""){
            summaryTopics.style.display = "block";
        }
        else{
            summaryTopics.style.display = "";
        }
    });

    document.getElementById('btnDetailed').addEventListener('click', function (){
        let div = document.getElementById('detailed');
    
        if(div.style.display == ""){
            div.style.display = "block";
        }
        else{
            div.style.display = "";
        }
    });
    document.getElementById('btnTimeSeries').addEventListener('click', function (){
        let div = document.getElementById('timeSeries');

        if(div.style.display == ""){
            div.style.display = "block";
        }
        else{
            div.style.display = "";
        }
    });
    document.getElementById('btnAllCountries').addEventListener('click', function (){
        let div = document.getElementById('allCountries');

        if(div.style.display == ""){
            div.style.display = "block";
        }
        else{
            div.style.display = "";
        }
    });
    document.getElementById('btnOptions').addEventListener('click', function (){
        let div = document.getElementById('options');
    
        if(div.style.display == ""){
            div.style.display = "block";
        }
        else{
            div.style.display = "";
        }
    });


});

