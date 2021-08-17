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


function baseUnit(unit = '') {

    if (unit == 'sec') {

        let time = valueOf('hour')*3600 + valueOf('min')*60 + valueOf('sec');
        return time;

    } else if (unit == 'meter') {

        if (valueOf("distance-km") == true) {
            return Number(valueOf('distance') * 1000);
        } else if (valueOf("distance-mi") == true) {
            return Number(valueOf('distance') * 1609.34);
        }

    } else if (unit == 'secPerMeter') {

        let paceSecPerMeter = valueOf('pace-min')*60 + valueOf('pace-sec');
        if (valueOf('pace-km') == true) {
            return (paceSecPerMeter / 1000);
        } else if (valueOf('pace-mi') == true) {
            return (paceSecPerMeter / 1609.34);
        }
    }
}


function calcTime() {

    // round right here to avoid giving decimal time answers
    let timeInSec = Math.round(baseUnit('meter') * baseUnit('secPerMeter'));

    let hour = Math.floor(timeInSec / 3600);
    let minute = Math.floor(timeInSec % 3600 / 60);
    let second = Math.floor(timeInSec % 3600 % 60);

    changeValue('hour', hour);
    changeValue('min', minute);
    changeValue('sec', second);
}


function calcDistance() {

    let distInMeter = baseUnit('sec') / baseUnit('secPerMeter');

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

    let paceMin = Math.floor(paceInMinPerDistance);
    // Math.round((x)*60) vs Math.round(x)*60 b/c dont want to round to early;
    // the lattergives 1 hour/60km = 2min/mi when really 1:37min/mile
    let paceSec = Math.round((paceInMinPerDistance - paceMin)*60);

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