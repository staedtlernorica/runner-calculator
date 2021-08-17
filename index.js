// id OF INPUT FIELDS

// hour
// min
// sec
// distance
// distance-km
// distance-mi
// pace-min
// pace-sec
// pace-km
// pace-mi


// rounding 

function lookUpValue(id) {
    if (document.getElementById(id).type == 'text') {
        return Number(document.getElementById(id).value.trim());
    } else if (document.getElementById(id).type == 'radio') {
        return document.getElementById(id).checked;
    };
}

function changeValue(id, newVal) {
    document.getElementById(id).value = newVal;
}


timeObjects = document.getElementsByClassName('time');
distanceObjects = document.getElementsByClassName('distance');
paceObjects = document.getElementsByClassName('pace');

function baseUnit(unit = '') {

    if (unit == 'sec') {

        let time = 0;
        for (i = 0; i < timeObjects.length; i++) {

            if (!isNaN(timeObjects[i].value)) {

                if (i == 0) {
                    time = time + Number(3600 * timeObjects[i].value);
                } else if (i == 1) {
                    time = time + Number(60 * timeObjects[i].value);
                } else if (i == 2) {
                    time = time + Number(timeObjects[i].value);
                }
            }
        }
        return time;


    } else if (unit == 'meter') {

        let dist = 0;   //added in so NaN results gives 0;
        if (lookUpValue("distance-km") == true) {
            return Number(dist + (lookUpValue('distance')) * 1000);
        } else if (lookUpValue("distance-mi") == true) {
            return Number(dist+ (lookUpValue('distance')) * 1609.34);
        }

    } else if (unit == 'secPerMeter') {

        let paceSec = 0;
        for (i = 0; i < paceObjects.length; i++) {

            if (!isNaN(paceObjects[i].value)) {

                if (i == 0) {
                    paceSec = paceSec + Number(60 * paceObjects[i].value);
                } else if (i == 1) {
                    paceSec = paceSec + Number(paceObjects[i].value);
                }
            }
        }
        console.log(paceSec);
        if (lookUpValue('pace-km') == true) {
            return (paceSec / 1000);
        } else if (lookUpValue('pace-mi') == true) {
            return (paceSec / 1609.34);
        }
    }
}


function calcTime() {

    // round right here to avoid giving decimal time answers
    timeInSec = Math.round(baseUnit('meter') * baseUnit('secPerMeter'));

    hour = Math.floor(timeInSec / 3600);
    minute = Math.floor(timeInSec % 3600 / 60);
    second = Math.floor(timeInSec % 3600 % 60);
    // console.log(timeInSec, hour, minute, second)
    changeValue('hour', hour);
    changeValue('min', minute);
    changeValue('sec', second);
}


function calcDistance() {

    distInMeter = baseUnit('sec') / baseUnit('secPerMeter');

    if (lookUpValue("distance-km") == true) {
        changeValue('distance', Math.round(distInMeter/1000*100)/100);
    } else if (lookUpValue("distance-mi") == true) {
        changeValue('distance', Math.round(distInMeter/1609.34*100)/100);
    }
}


function calcPace(){

    paceInSecPerMeter = baseUnit('sec')/baseUnit('meter');


    if (lookUpValue("pace-km") == true){
        paceInMinPerKm = paceInSecPerMeter * 1000 / 60; 
        paceMin = Math.floor(paceInMinPerKm);
        // only need to round paceSec because floorubg paceMin always return integer
        paceSec = Math.round((paceInMinPerKm - paceMin)*60);
        
        // cant believe i'm doing this
        // avoid pace time of 7:60
        if (paceSec == 60){
            changeValue('pace-min', paceMin + 1);
            changeValue('pace-sec', 0);
        } else if (paceSec != 60){
            changeValue('pace-min', paceMin);
            changeValue('pace-sec', paceSec);
        }

        

    } else if (lookUpValue('pace-mi') == true){
        paceInMinPerMi = paceInSecPerMeter * 1609.34 /60;
        paceMin = Math.floor(paceInMinPerMi);
        paceSec = Math.round((paceInMinPerMi - paceSec)*60);

        if (paceSec == 60){
            changeValue('pace-min', paceMin + 1);
            changeValue('pace-sec', 0);
        } else if (paceSec != 60){
            changeValue('pace-min', paceMin);
            changeValue('pace-sec', paceSec);
        }
    }
}


function validNumber(number){

    let isNumber = !isNaN(number);
    let isPositive = false;
    let isInteger = false;

    return (isNumber && isPositive && isInteger);
}


function calculate() {


    // at least one time filled and above zero                 cond 2
    let timeFilled = (!isNaN(lookUpValue('hour')) || !isNaN(lookUpValue('min')) || !isNaN(lookUpValue('sec'))) && (lookUpValue('hour') > 0 || lookUpValue('min') > 0 || lookUpValue('sec') > 0);
    
    
    // distance filled and above zero, and checked              cond 1
    let distanceFilled = !isNaN(lookUpValue('distance')) && lookUpValue('distance') > 0;
    let distanceChecked = distanceObjects[1].checked || distanceObjects[2].checked;
    
    
    // at least one pace filled and above zero, and checked     cond 3
    let paceFilled = (!isNaN(lookUpValue('pace-min')) || !isNaN(lookUpValue('pace-sec'))) && (lookUpValue('pace-min') > 0 || lookUpValue('pace-sec') > 0);
    let paceChecked = paceObjects[2].checked || paceObjects[3].checked;
    
    
    
    // appropriate empty input fields
    let timeEmpty = lookUpValue('hour') + lookUpValue('min') + lookUpValue('sec') === 0;
    let distanceEmptyButChecked = (lookUpValue('distance') === 0) && distanceChecked;
    let paceEmptyButChecked =  (lookUpValue('pace-min') + lookUpValue('pace-sec') === 0) && paceChecked;



    

    if (timeEmpty && distanceFilled && distanceChecked && paceFilled && paceChecked){
        calcTime();
    }
    else if(paceEmptyButChecked && timeFilled && distanceFilled && distanceChecked){
        calcPace();
    }
    else if(distanceEmptyButChecked && timeFilled && paceFilled && paceChecked){
        calcDistance();
    }
    else{
        alert('Invalid inputs! Try again. \n\n Make sure there are no letters, or spaces/tabs between numbers');
    }

    // time empty
    // distance filled, above zero and checked              cond 1
    // at least one pace filled, above zero and checked     cond 3

    // pace empty but checked
    // at least one time filled, above zero                 cond 2
    // distance filled, above zero and checked              cond 1

    // distance empty but checcked
    // at least one time filled, above zero                 cond 2
    // at least one pace filled, above zero and checked     cond 3

}



function clearInputs(field) {

    for (i = 0; i < document.getElementsByClassName(field).length; i++){

        if (document.getElementsByClassName(field)[i].type == 'text'){
            document.getElementsByClassName(field)[i].value = null;
        } else if (document.getElementsByClassName(field)[i].type == 'radio'){
            document.getElementsByClassName(field)[i].checked = null; 
        }
    }
};


function clearValue(){
    clearInputs('time');
    clearInputs('distance');
    clearInputs('pace');
}