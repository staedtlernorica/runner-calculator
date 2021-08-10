console.log('JS loaded');

let hour = Number(document.getElementById('hour').value);
let min = Number(document.getElementById('min').value);
let sec = Number(document.getElementById('sec').value);
let distance = Number(document.getElementById('distance').value);
let pace = Number(document.getElementById('pace').value);

let distanceKm = document.getElementById('distance-km').checked;
let distanceMi = document.getElementById('distance-mi').checked;
let paceKm = document.getElementById('pace-km').checked;
let pacemi = document.getElementById('pace-mi').checked;


function updateInputs() {
    hour = Number(document.getElementById('hour').value);
    min = Number(document.getElementById('min').value);
    sec = Number(document.getElementById('sec').value);
    distance = Number(document.getElementById('distance').value);
    pace = Number(document.getElementById('pace').value);

    distanceKm = document.getElementById('distance-km').checked;
    distanceMi = document.getElementById('distance-mi').checked;
    paceKm = document.getElementById('pace-km').checked;
    paceMi = document.getElementById('pace-mi').checked;
};

//potentially round up for values like x.99 
function roundTwoDigits(number){
    return Math.round(number*100)/100;
};


function paceTimeDisplay(time){

    min = Math.floor(time);
    second = Math.round((time - min)*60);
    return (`${min}:${second}`)
};


function convertToSmallestUnit(baseUnit){
    updateInputs();

    if (baseUnit == 'sec'){
        return (hour * 3600 + min * 60 + sec);
    
    }else if (baseUnit == 'meter'){
        
        if (distanceKm == true){            
            return (distance*1000);
        } else if (distanceMi == true){
            return (distance*1609.34);
        }

    }else if (baseUnit == 'secPerMeter'){
        
        if (paceKm == true){
            return (pace*60/1000);
        } else if (paceMi == true){
            return (pace*60/1609.34);
        } 
    }
};

// convert everything to meters, seconds, seconds/meter
let timeSec = convertToSmallestUnit('sec');
let distMeter = convertToSmallestUnit('meter');
let paceSecMeter = convertToSmallestUnit('secPerMeter');


function updateAll(){
    updateInputs();
    timeSec = convertToSmallestUnit('sec');
    distMeter = convertToSmallestUnit('meter');
    paceSecMeter = convertToSmallestUnit('secPerMeter');
};

// advance features
// if user calculated hour, now all three inptus have something
// if user click distance and pace, time inputs automatically clear out




function calculate(){
    updateAll();
    // checkInputs();   no negative numbers either

    if (timeSec == 0){
        // total time in seconds
        timeSec = roundTwoDigits(paceSecMeter*distMeter) ;
        hour = Math.floor(timeSec/3600);
        minute = Math.floor(timeSec%3600/60);
        second = Math.floor(timeSec%3600%60);
         
        document.getElementById('hour').value = hour;
        document.getElementById('min').value = minute;
        document.getElementById('sec').value = second;


    } else if (distMeter == 0){
        distanceMeter = (timeSec/paceSecMeter);
        distanceKm = roundTwoDigits(distanceMeter/1000);
        distanceMi = roundTwoDigits(distanceMeter/1609.34);

        if (distanceKm == true){
            document.getElementById('distance').value = distanceKm;
        
        }else if (distanceMi == true){
            document.getElementById('distance').value = distanceMi;
        };


    }else if (paceSecMeter == 0){
        paceSecMeter = (timeSec/distMeter);
        paceMinKm = roundTwoDigits(paceSecMeter*1000/60);
        paceMinMi = roundTwoDigits(paceSecMeter*1609.34/60);

        if (paceKm == true){
            document.getElementById('pace').value = (paceMinKm);
        
        }else if (paceMi == true){
            document.getElementById('pace').value = (paceMinMi);
        };
    };
};



// troubleshooting stuff

function logCurrentInputs() {
    updateInputs();
    console.log(hour, min, sec);
    console.log(distance);
    console.log(distanceKm);
    console.log(distanceMi);
    console.log(pace);
    console.log(paceKm);
    console.log(paceMi);
};

function logCurrentBaseUnits(){
    updateInputs();
    timeSec = convertToSmallestUnit('sec');
    distMeter = convertToSmallestUnit('meter');
    paceSecMeter = convertToSmallestUnit('secPerMeter');
    console.log(`${(timeSec)} seconds, ${distMeter} meters, ${paceSecMeter} seconds per meter`);
}

function clearValue() {
    document.getElementById('hour').value = null;
    document.getElementById('min').value = null;
    document.getElementById('sec').value = null;
    document.getElementById('distance').value = null;
    document.getElementById('distance-km').checked = false;
    document.getElementById('distance-mi').checked = false;
    document.getElementById('pace').value = null;
    document.getElementById('pace-km').checked = false;
    document.getElementById('pace-mi').checked = false;
};