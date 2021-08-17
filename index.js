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

function valueOf(id) {
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
        if (valueOf("distance-km") == true) {
            return Number(dist + (valueOf('distance')) * 1000);
        } else if (valueOf("distance-mi") == true) {
            return Number(dist+ (valueOf('distance')) * 1609.34);
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
        if (valueOf('pace-km') == true) {
            return (paceSec / 1000);
        } else if (valueOf('pace-mi') == true) {
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

    if (valueOf("distance-km") == true) {
        changeValue('distance', Math.round(distInMeter/1000*100)/100);
    } else if (valueOf("distance-mi") == true) {
        changeValue('distance', Math.round(distInMeter/1609.34*100)/100);
    }
}


function calcPace(){
    // try to make it unit agnositc
    let paceInSecPerMeter = baseUnit('sec')/baseUnit('meter');
    let paceInMinPerDistance = 0; 

    if (valueOf("pace-km") == true){
        paceInMinPerDistance = paceInSecPerMeter * 1000 / 60; 
    } else if (valueOf('pace-mi') == true){
        paceInMinPerDistance = paceInSecPerMeter * 1609.34 / 60; 
    }

    paceMin = Math.floor(paceInMinPerDistance);
    // Math.round(()) b/c dont want to round to early;
    // else get 1 hour/60km = 2min/mi when really 1:37min/mile
    paceSec = Math.round((paceInMinPerDistance - paceMin)*60);

    if (paceSec == 60){
        changeValue('pace-min', paceMin + 1);
        changeValue('pace-sec', 0);
    } else if (paceSec != 60){
        changeValue('pace-min', paceMin);
        changeValue('pace-sec', paceSec);
    }
}


function validNumber(input, checkInteger=false){

    let number = valueOf(input);
    let isNumber = !isNaN(Number(number));
    let isPositive = number > 0;
    let isInteger = Number.isInteger(number);

    if (checkInteger == false){
        return (isNumber && isPositive)
    }
    else if (checkInteger == true){
        return (isNumber && isPositive && isInteger);
    }
}


function calculate() {
    // time empty                                           calc time
    // distance filled, above zero and checked              cond 1
    // at least one pace filled, above zero and checked     cond 3

    // pace empty but checked                               calc pace
    // at least one time filled, above zero                 cond 2
    // distance filled, above zero and checked              cond 1

    // distance empty but checcked                          calc dist
    // at least one time filled, above zero                 cond 2
    // at least one pace filled, above zero and checked     cond 3



    // at least one time filled and above zero                 cond 2    
    let timeFilled = validNumber('hour', true) || validNumber('min', true) || validNumber('sec', true);
    

    // distance filled and above zero, and checked              cond 1
    let distanceFilled = validNumber('distance');
    let distanceChecked = distanceObjects[1].checked || distanceObjects[2].checked;
    

    // at least one pace filled and above zero, and checked     cond 3
    let paceFilled = validNumber('pace-min', true) || validNumber('pace-sec', true);
    let paceChecked = paceObjects[2].checked || paceObjects[3].checked;
    
    
    // appropriate empty input fields
    let timeEmpty = valueOf('hour') + valueOf('min') + valueOf('sec') === 0;
    let distanceEmptyButChecked = (valueOf('distance') === 0) && distanceChecked;
    let paceEmptyButChecked =  (valueOf('pace-min') + valueOf('pace-sec') === 0) && paceChecked;


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