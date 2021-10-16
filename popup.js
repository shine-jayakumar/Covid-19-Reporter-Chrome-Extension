/*
COVID-19 Reporter

popup.js
Author: Shine Jayakumar
Email: shinejayakumar@yahoo.com
COVID-19 Reporter Copyright (c) 2020 Shine Jayakumar. All Rights Reserved
*/

document.addEventListener("DOMContentLoaded", function(event) {

    checkLastUpdated(); 
    loadCountries();
    loadCountriesTimeSeries();
    populateLastUpdated();
   
   
    //Checks if user chose to remember last opened tab
    chrome.storage.local.get(['rememberLast'], data=>{
        if(data.rememberLast != undefined && data.rememberLast == true){
            checkLastTabOpened();
        }
        else{
            openCurrentTab('summary', 'btnSummary');
            loadTotalCases();
        }
    });


});


function populateLastUpdated(){

    chrome.storage.local.get(['lastUpdated'], function(data){
        if(data.lastUpdated != undefined){
            document.getElementById('lastUpdated').textContent = `Last Updated: ${data.lastUpdated}`;
        }
    });
}
//Checks Last Tab Opened and sets the tab and loads data
function checkLastTabOpened(){

     chrome.storage.local.get(['lastOpened'], data=>{
        
        if(data.lastOpened != undefined){
            
            openCurrentTab(data.lastOpened.lastDiv, data.lastOpened.lastTab);

            const lastCountry = data.lastOpened.lastCountry;

            switch(data.lastOpened.lastDiv){

                case 'summary':         showCountry(true);
                                        showCountryTimeSeries(false);
                                        showGlobe(true);

                                        if(lastCountry != null && lastCountry != ""){
                                            loadSummary(lastCountry);
                                            setDropDown('selectCountry', lastCountry)
                                            rememberLastTab(data.lastOpened.lastDiv, data.lastOpened.lastTab, lastCountry);
                                        }
                                        else{
                                            loadTotalCases();
                                            rememberLastTab(data.lastOpened.lastDiv, data.lastOpened.lastTab, null);
                                        }
                                        break;

                case 'detailed':        showCountry(true);
                                        showCountryTimeSeries(false);
                                        showGlobe(false);
                                        

                                        if(lastCountry != null && lastCountry != ""){
                                            loadDetailed(lastCountry);
                                            setDropDown('selectCountry', lastCountry)
                                            rememberLastTab(data.lastOpened.lastDiv, data.lastOpened.lastTab, lastCountry);
                                        }
                                        else{
                                            rememberLastTab(data.lastOpened.lastDiv, data.lastOpened.lastTab, null);
                                        }
                                        break;

                case 'timeSeries':      showCountry(false);
                                        showCountryTimeSeries(true);
                                        showGlobe(false);

                                        if(lastCountry != null && lastCountry != ""){
                                            loadTimeSeries(lastCountry);
                                            setDropDown('selectCountryTimeSeries', lastCountry)
                                            rememberLastTab(data.lastOpened.lastDiv, data.lastOpened.lastTab, lastCountry);
                                        }
                                        else{
                                            rememberLastTab(data.lastOpened.lastDiv, data.lastOpened.lastTab, null);
                                        }
                                        break;

                case 'allCountries':    showCountry(false);
                                        showCountryTimeSeries(false);
                                        showGlobe(false);

                                        loadAllCountries();
                                        rememberLastTab(data.lastOpened.lastDiv, data.lastOpened.lastTab, null);
                                        break;
            }
            
        }
        else{
            openCurrentTab('summary', 'btnSummary');
            loadTotalCases();
        }
    });
}

//Shows/Hides select drop-down for Country
function showCountry(yes){
    if(yes){
        document.getElementById('selectCountry').style.display = 'block';
    }
    else{
        document.getElementById('selectCountry').style.display = 'none';
    }
}
//Shows/Hides select drop-down for Time Series
function showCountryTimeSeries(yes){
    if(yes){
        document.getElementById('selectCountryTimeSeries').style.display = 'block';
    }
    else{
        document.getElementById('selectCountryTimeSeries').style.display = 'none';
    }
}
//Shows/Hides globe
function showGlobe(yes){
    if(yes){
        document.getElementById('globe').style.display = 'block';
    }
    else{
        document.getElementById('globe').style.display = 'none';
    }
}
//Used in CheckLastTabOpened to set the drop-down's country
function setDropDown(selectId, value){
    document.getElementById(selectId).value = value;
}


//Set the lastOpened key to track the last tab
function rememberLastTab(div, tab, country){

    chrome.storage.local.set({'lastOpened': {lastDiv: div, lastTab: tab, lastCountry: country}});
    
}

//Check the last updated time; if > 24 hrs, initiate a manual update
function checkLastUpdated()
{
    chrome.storage.local.get(['lastUpdated'], function(data){
       
        if(data.lastUpdated != undefined){
            const previousDate = new Date(data.lastUpdated);
            const currentDate = new Date();
            const timeDiff = ((currentDate - previousDate)/1000)/3600;

            if(timeDiff > 2){
                chrome.runtime.sendMessage({'manualUpdate': true});
            }
        }
        else{
            chrome.runtime.sendMessage({'manualUpdate': true});
        }
    });
}

//WorldWide 
function loadTotalCases(){

    chrome.storage.local.get(['worldwide'], function(data){
       if(data.worldwide != undefined){
            const table = document.getElementById('countrySummary');

            table.querySelector('tr th').textContent = 'Worldwide';
            table.querySelector('tr:nth-child(3) td:nth-child(1)').textContent =  data.worldwide.cases;
            table.querySelector('tr:nth-child(3) td:nth-child(2)').textContent =  data.worldwide.recovered;
            table.querySelector('tr:nth-child(3) td:nth-child(3)').textContent =  data.worldwide.deaths;
        }
    });
}

//populates drop-down for summary and detailed
function loadCountries()
{
    const select = document.getElementById('selectCountry');

    chrome.storage.local.get(['countryData'], function(rawdata){

        if(rawdata.countryData != undefined){   
            
            const countries = [];
            
            //filtering countries
            rawdata.countryData.forEach(row => {
                countries.push(row.country);
            });

            countries.sort();

            //creating options with the sorted list
            countries.forEach( row =>{

                let option = document.createElement('option');
                option.value = row;
                option.textContent = row;     
                select.appendChild(option);
            });
                
        }
    });

}

//Populates drop-down options specific to Time Series
function loadCountriesTimeSeries(){
    
    const select = document.getElementById('selectCountryTimeSeries');

    chrome.storage.local.get(['timeSeries'], function(rawdata){

        if(rawdata.timeSeries != undefined){   
            
            const countries = [];

            for( let key in rawdata.timeSeries){
                countries.push(key);
            }
            countries.forEach( row =>{

                let option = document.createElement('option');
                option.value = row;
                option.textContent = row;     
                select.appendChild(option);
            });
        }
    });
}

//Process Select Country drop-down
document.getElementById('selectCountry').addEventListener('change', function(e){

    const countryToFind = document.getElementById('selectCountry').value;
    
    const tablinks = document.querySelectorAll('.tablinks');
    
    let activeTab;

    //Find active tab
    tablinks.forEach(link =>{
        if((link.className).includes('active')){
                activeTab = link;
        }
    });

    switch(activeTab.id){
        case 'btnSummary':      if(countryToFind){
                                    loadSummary(countryToFind);
                                    rememberLastTab('summary', 'btnSummary', countryToFind);
                                }
                                break;
                            
        case 'btnDetailed':     if(countryToFind){
                                    loadDetailed(countryToFind);
                                    rememberLastTab('detailed', 'btnDetailed', countryToFind);
                                }
                                break;        
    }
});
//Process Select Country TimeSeries drop-down
document.getElementById('selectCountryTimeSeries').addEventListener('change', function(e){
    
    const countryToFind = document.getElementById('selectCountryTimeSeries').value;
    loadTimeSeries(countryToFind);
    rememberLastTab('timeSeries', 'btnTimeSeries', countryToFind);
});

//Div handler for tabs
function openCurrentTab(currentTabContentId, currentButtonId){
    
    const tabcontent = document.querySelectorAll('.tabcontent');
    const tablinks = document.querySelectorAll('.tablinks');

    //hide all tabcontents
    tabcontent.forEach(tab => { tab.style.display = "none"; });

    //hide all buttons
    tablinks.forEach(link => { link.className = link.className.replace(" active", " "); })

    document.getElementById(currentTabContentId).style.display = "block";
    document.getElementById(currentButtonId).className += " active";
}

//Loads summary for a country
function loadSummary(countryToFind){

    chrome.storage.local.get(['countryData'], function(rawdata){

        if(rawdata.countryData != undefined){
            let countryFound = rawdata.countryData.find(row => row.country == countryToFind);

            if(countryFound)
            {
                const table = document.getElementById('countrySummary');

                const header = table.querySelector('tr th');
                const sup = document.createElement('sup');
                const img = document.createElement('img');
                img.setAttribute('height', 22);
                img.setAttribute('width', 32);
                img.setAttribute('src', countryFound.countryInfo.flag);
                sup.appendChild(img);
                header.textContent = countryFound.country;
                header.appendChild(sup);
                // ********* Following line had been reviewed ***********
                // innerHTML changed
                //table.querySelector('tr th').innerHTML = `${countryFound.country}<sup><img src="${countryFound.countryInfo.flag}" width="32" height="22" /></sup>`;
                table.querySelector('tr:nth-child(3) td:nth-child(1)').textContent =  `${countryFound.cases}`;
                table.querySelector('tr:nth-child(3) td:nth-child(2)').textContent =  `${countryFound.recovered}`;
                table.querySelector('tr:nth-child(3) td:nth-child(3)').textContent =  `${countryFound.deaths}`;
            }
        }
    });
}

//Loads detailed report for a country
function loadDetailed(countryToFind){
   
    chrome.storage.local.get(['countryData'], function(rawdata){

        if(rawdata.countryData != undefined){

            let countryFound = rawdata.countryData.find(row => row.country == countryToFind);

            if(countryFound)
            {
                const tableDetailed = document.getElementById('countryDetailed');
                const header = tableDetailed.querySelector('tr th');
                const sup = document.createElement('sup');
                const img = document.createElement('img');

                // populating flag
                img.setAttribute('height', 22);
                img.setAttribute('width', 32);
                img.setAttribute('src', countryFound.countryInfo.flag);
                // adding flag to <sup>
                sup.appendChild(img); 
                //adding sup to header of the row
                header.textContent = countryFound.country;
                header.appendChild(sup);
                //Header - Country
               // tableDetailed.querySelector('tr th').innerHTML = `${countryFound.country}<sup><img src="${countryFound.countryInfo.flag}" width="32" height="22" /></sup>`;
                //Cases - New 
                tableDetailed.querySelector('tr:nth-child(4) td:nth-child(1)').textContent =  `${countryFound.todayCases}`;
                //Cases - Active
                tableDetailed.querySelector('tr:nth-child(4) td:nth-child(2)').textContent =  `${countryFound.active}`;
                //Cases - Critical
                tableDetailed.querySelector('tr:nth-child(4) td:nth-child(3)').textContent =  `${countryFound.critical}`;
                //Cases - Total
                tableDetailed.querySelector('tr:nth-child(4) td:nth-child(4)').textContent =  `${countryFound.cases}`;
                //Recovered
                tableDetailed.querySelector('tr:nth-child(4) td:nth-child(5)').textContent =  `${countryFound.recovered}`;
                //Deaths - New
                tableDetailed.querySelector('tr:nth-child(4) td:nth-child(6)').textContent =  `${countryFound.todayDeaths}`;
                //Deaths - Total
                tableDetailed.querySelector('tr:nth-child(4) td:nth-child(7)').textContent =  `${countryFound.deaths}`;
                
                //Cases/Million
                document.getElementById('casesPerMil').textContent = countryFound.casesPerOneMillion;
                // tableDetailed.querySelector('tr:nth-child(5) td:nth-child(1)').innerHTML =  `Cases/Million: <span class="strong">${countryFound.casesPerOneMillion}</span>`;

                //Deaths/Million
                document.getElementById('deathsPerMil').textContent = countryFound.deathsPerOneMillion;
                // tableDetailed.querySelector('tr:nth-child(5) td:nth-child(2)').innerHTML =  `Deaths/Million: <span class="strong">${countryFound.deathsPerOneMillion}</span>`;
                
                let recoveryPercentage = (parseInt(countryFound.recovered)/parseInt(countryFound.cases)) * 100;
                let deathsPercentage = (parseInt(countryFound.deaths)/parseInt(countryFound.cases)) * 100;

                //Recovery %
                document.getElementById('recoveryPerc').textContent = recoveryPercentage.toFixed(2);
                //tableDetailed.querySelector('tr:nth-child(6) td:nth-child(1)').innerHTML =  `Recovery Percentage: <span class="strong">${recoveryPercentage.toFixed(2)}%</span>`;
                //Deaths %
                document.getElementById('deathPerc').textContent = deathsPercentage.toFixed(2);
                //tableDetailed.querySelector('tr:nth-child(6) td:nth-child(2)').innerHTML =  `Death Percentage: <span class="strong">${deathsPercentage.toFixed(2)}%</span>`;
            }
        }
    });
}

//Loads data for all countries
function loadAllCountries(){

    chrome.storage.local.get(['countryData'], function(rawdata){

        if(rawdata.countryData != undefined){
            const cData = rawdata.countryData;
            //descending order
            cData.sort( (a,b) => { return b.cases - a.cases;});
    
            const tableAll = document.getElementById('countryAll');
            const allRows = tableAll.querySelectorAll('tr');
            
            //removes all previous rows from last result, barring row with th (heading)
            for(let i=1; i<allRows.length; i++){
                tableAll.removeChild(allRows[i]);
            }
            
            let index = 1;
            cData.forEach(row =>{
                
                if(String(row.country).toUpperCase() != "WORLD"){ //sometimes API includes 'World' as a country
                                    
                    let tr = document.createElement('tr');
                    let cellIndex = document.createElement('td') ;
                    let cellCountry = document.createElement('td') ;
                    let cellCases = document.createElement('td') ;
                    let cellRecovered = document.createElement('td') ;
                    let cellDeaths = document.createElement('td') ;
        
                    cellIndex.textContent = index;
                    cellCountry.textContent = row.country;
                    cellCases.textContent = row.cases;
                    cellRecovered.textContent = row.recovered;
                    cellDeaths.textContent = row.deaths;
        
                    tr.appendChild(cellIndex);
                    tr.appendChild(cellCountry);
                    tr.appendChild(cellCases);
                    tr.appendChild(cellRecovered);
                    tr.appendChild(cellDeaths);
                    
                    tableAll.appendChild(tr);
                    index++;
                }
            });
        }
      
    });
}

//Prepares Charts based on the country's dats
function loadTimeSeries(countryToFind){

    chrome.storage.local.get(['timeSeries'], function(rawdata){

        if(rawdata.timeSeries != undefined){
            const timeSeries = rawdata.timeSeries[countryToFind];
               
            const dates = [];
            const confirmed = [];
            const recovered = [];        
            const deaths = [];
    
            timeSeries.forEach(row => {
                dates.push(row.date);
                confirmed.push(parseInt(row.confirmed));
                recovered.push(parseInt(row.recovered));
                deaths.push(parseInt(row.deaths));
            });
    
            const chartCanvas = document.getElementById('chartTimeSeries');
            
            Chart.defaults.global.defaultFontFamily = 'Rubik';
            Chart.defaults.global.defaultFontSize = 10;
            Chart.defaults.global.defaultFontColor = '#FFFFFF';
            Chart.defaults.global.responsive = false;
    
            if( window.lineChart != undefined){
                window.lineChart.destroy();
            }
            window.lineChart = new Chart(chartCanvas,{
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: 'Cases',
                            data: confirmed,
                            fill: false,
                          //  backgroundColor: 'red',
                            borderColor: ['rgb(255, 255, 0)'],
                            lineTension: 0.2,
                            borderWidth: 1.5
                        },
                        {
                            label: 'Recovered',
                            data: recovered,
                            fill: false,
                            lineTension: 0.2,
                            borderColor: ['rgb(0, 255, 153)'],
                            borderWidth: 1.5
                        },
                        {
                            label: 'Deaths',
                            data: deaths,
                            fill: false,
                            lineTension: 0.2,
                            borderColor: ['rgb(255, 102, 102)'],
                            borderWidth: 1.5
                        }
                    ]
                },
                options:{
                    title: {
                        display: true,
                        text: "COVID-19 Cases - " + countryToFind,
                        fontFamily: 'Monda', //'Josefin Sans' - for legend
                        fontSize: 16
                    },
                    legend: {
                        display: true,
                        position: "right",
                        labels: {
                            boxWidth:10
                        }
                    },
                    //stacked - start with 0 as minimum value for y-axis
                    scales:{
                        yAxes: [{
                            stacked: true,
                            gridLines:{
                                display: true,
                                color: '#FFFFFF',
                                lineWidth: 1,
                                zeroLineColor: 'blue',
                                zeroLineWidth: 2,
                                drawBorder: false // this to remove the ghost line that appears
                                                  // when you add zeroLine x-axis
                            }
                           
                        }],
                        xAxes: [{             
                           gridLines:{
                                display: true,
                                zeroLineColor: 'blue',
                                zeroLineWidth: 1,
                                color: 'transparent'
                            }
                        }]
                    }
    
                }
            });
    
        }
   
        
    });
}

//Process Tabs
function processTab(currentTab){
    
    const countryToFind = document.getElementById('selectCountry').value;   

    switch(currentTab){

        case 'btnSummary':      //Hide drop-down for Time Series
                                document.getElementById('selectCountry').style.display = 'block';
                                document.getElementById('selectCountryTimeSeries').style.display = 'none';
                                document.getElementById('globe').style.display = 'block';    

                                if(countryToFind != null && countryToFind != ""){
                                    loadSummary(countryToFind);
                                    rememberLastTab('summary', 'btnSummary', countryToFind);
                                }
                                else{
                                   loadTotalCases(); 
                                   rememberLastTab('summary', 'btnSummary', null);
                                }
                                
                                break;
                            
        case 'btnDetailed':     //Show drop-down specified to Summary and Detained
                                document.getElementById('selectCountry').style.display = 'block';
                                document.getElementById('selectCountryTimeSeries').style.display = 'none';
                                document.getElementById('globe').style.display = 'none';

                                if(countryToFind != null && countryToFind != ""){
                                    loadDetailed(countryToFind);                               
                                   rememberLastTab('detailed', 'btnDetailed', countryToFind);
                                }
                                else{
                                   rememberLastTab('detailed', 'btnDetailed', null);
                                }
                                
                                break;

        case 'btnTimeSeries':   //Show Drop-Down specific to Time Series
                                const dropDownTimeSeries = document.getElementById('selectCountryTimeSeries');
                                document.getElementById('selectCountry').style.display = 'none';  
                                document.getElementById('globe').style.display = 'none';
                                dropDownTimeSeries.style.display = 'block'; 

                                if(dropDownTimeSeries.value  != ""){
                                    rememberLastTab('timeSeries', 'btnTimeSeries', null);
                                }
                                else{
                                    rememberLastTab('timeSeries', 'btnTimeSeries', dropDownTimeSeries.value);
                                }
                                
                                                                                
                                break;

        case 'btnAll':         //Display none of the drop-down of countries
                                document.getElementById('selectCountry').style.display = 'none'; 
                                document.getElementById('selectCountryTimeSeries').style.display = 'none';
                                document.getElementById('globe').style.display = 'none';
                                document.getElementById('searchCountry').value="";
                                loadAllCountries();
                                rememberLastTab('allCountries', 'btnAll', null);
                                break;
    }

}

//Search function for All Countries
function filterCountries() {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue;

    // input = document.getElementById("searchCountry");
    filter = document.getElementById('searchCountry').value.toUpperCase();
   
    outputTable = document.getElementById("countryAll");
    
    tr = outputTable.getElementsByTagName("tr");
   
    // Look through the table
    for (i = 0; i < tr.length; i++) {

      td = tr[i].getElementsByTagName("td")[1]; //2nd cell

      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}

function createSpan(value, class_){
    const span = document.createElement('span');

    if(class_ != undefined){
        span.setAttribute('class', class_);
    }
    span.textContent = value;

    return span;
}

function help(){
    let params = `scrollbars=yes,resizable=yes,status=no,location=no,toolbar=no,menubar=no,
    width=600,height=300,left=100,top=100`;

open('help.html', 'C19RepHelp', params);
}
document.getElementById('btnHelp').addEventListener('click', help);

document.getElementById('searchCountry').addEventListener('keyup', filterCountries);

document.getElementById('btnSummary').addEventListener('click', function(){
    openCurrentTab('summary', 'btnSummary');
    processTab('btnSummary');
});

document.getElementById('btnDetailed').addEventListener('click', function(){
    openCurrentTab('detailed', 'btnDetailed');
    processTab('btnDetailed');
});

document.getElementById('btnTimeSeries').addEventListener('click', function(){
    openCurrentTab('timeSeries', 'btnTimeSeries');
    processTab('btnTimeSeries');
});
document.getElementById('btnAll').addEventListener('click', function(){
    openCurrentTab('allCountries', 'btnAll');
    processTab('btnAll');
});

document.getElementById('globe').addEventListener('click', function(){
    loadTotalCases();
});


