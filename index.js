console.log('JS loaded');

let hour = Number(document.getElementById('hour').value);
let min = Number(document.getElementById('min').value);
let sec = Number(document.getElementById('sec').value);
let distance = Number(document.getElementById('distance').value);
let pace = Number(document.getElementById('pace').value);
let distanceUnit = document.getElementById('distance-unit').value;
let paceUnit = document.getElementById('pace-unit').value;


function updateInputs() {
    hour = Number(document.getElementById('hour').value);
    min = Number(document.getElementById('min').value);
    sec = Number(document.getElementById('sec').value);
    distance = Number(document.getElementById('distance').value);
    distanceUnit = document.getElementById('distance-unit').value;
    pace = Number(document.getElementById('pace').value);
    paceUnit = document.getElementById('pace-unit').value;

};

//potentially round up for values like x.99 
function roundTwoDigits(number){
    return Math.round(number*100)/100;
};


function convertToSmallestUnit(baseUnit){
    updateInputs();

    if (baseUnit == 'sec'){
        return (hour * 3600 + min * 60 + sec);
    
    }else if (baseUnit == 'meter'){
        
        if (distanceUnit == 'km'){            
            return (distance*1000);
        } else if (distanceUnit == 'mi'){
            return (distance*1609.34);
        }

    }else if (baseUnit == 'secPerMeter'){
        
        if (paceUnit == 'min/km'){
            return (pace*60/1000);
        } else if (paceUnit == 'min/mi'){
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

        if (distanceUnit == 'km'){
            document.getElementById('distance').value = distanceKm;
        
        }else if (distanceUnit == 'mi'){
            document.getElementById('distance').value = distanceMi;
        };


    }else if (paceSecMeter == 0){
        paceSecMeter = (timeSec/distMeter);
        paceMinKm = roundTwoDigits(paceSecMeter*1000/60);
        paceMinMi = roundTwoDigits(paceSecMeter*1609.34/60);

        if (paceUnit == 'min/km'){
            document.getElementById('pace').value = paceMinKm;
        
        }else if (paceUnit == 'min/mi'){
            document.getElementById('pace').value = paceMinMi;
        };
    };
};



// troubleshooting stuff

function logCurrentInputs() {
    updateInputs();
    console.log(hour, min, sec);
    console.log(distance);
    console.log(distanceUnit);
    console.log(pace);
    console.log(paceUnit);
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
    document.getElementById('distance-unit').value = null;
    document.getElementById('pace').value = null;
    document.getElementById('pace-unit').value = null;
};