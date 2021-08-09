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


function convertToSmallestUnit(baseUnit){
    updateInputs();

    if (baseUnit == 'sec'){
        return (hour * 3600 + min * 60 + sec)
    }
    if (baseUnit == 'meter'){
        return (distance*1000)
    }
    if (baseUnit == 'secPerMeter'){
        return (pace*60/1000)
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


//potentially round up for values like x.99 
function roundTwoDigits(number){
    return Math.round(number*100)/100;
};


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
        distanceMeter = roundTwoDigits(timeSec/paceSecMeter);
        distanceKm = distanceMeter/1000;
        distanceMi = roundTwoDigits(distanceMeter/1609.34);

        if (distanceUnit == 'km'){
            document.getElementById('distance').value = distanceKm;
        
        }else if (distanceUnit == 'mi'){
            document.getElementById('distance').value = distanceMi;
        };

    }else if (paceSecMeter == 0){
        paceSecMeter = roundTwoDigits(timeSec/distMeter);
        paceMinKm = paceSecMeter*1000/60;
        paceMinMi = roundTwoDigits(paceSecMeter*1609.34/60);

        if (paceUnit == 'min/km'){
            document.getElementById('pace').value = paceMinKm;
        
        }else if (paceUnit == 'min/mi'){
            document.getElementById('pace').value = paceMinMi;
            
        };
    };
};




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