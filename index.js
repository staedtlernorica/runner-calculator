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


function metricImperialFactor(inputField){
    let radioButton = $("input:radio");
    let checkedButton = { distance: '',
                            pace: ''    
                        };
    for (i = 0; i < radioButton.length; i++){
        if (radioButton[i].checked == true){
            checkedButton[radioButton[i].className] = Number(radioButton[i].value);
        }
    }
    return checkedButton[inputField];
}


function baseUnit(unit = '') {

    if (unit == 'sec') {
        let time = valueOf('hour') * 3600 + valueOf('min') * 60 + valueOf('sec');
        return time;

    } else if (unit == 'meter') {
        let outputUnit = metricImperialFactor('distance')
        return Number(valueOf('distance') * outputUnit);

    } else if (unit == 'secPerMeter') {
        let paceSecPerMeter = valueOf('pace-min') * 60 + valueOf('pace-sec');
        let outputUnit = metricImperialFactor('pace');
        return (paceSecPerMeter/outputUnit);
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
    let outputUnit = metricImperialFactor('distance');
    changeValue('distance', Math.round(distInMeter / outputUnit * 100) / 100);
}


function calcPace() {
    let paceInSecPerMeter = baseUnit('sec') / baseUnit('meter');
    let outputUnit = metricImperialFactor('pace');
    let paceInMinPerDistance = paceInSecPerMeter * outputUnit / 60;

    // floor instead of round b/c Math.round(6.7) = 7 mins rather than 6min 42sec
    let paceMin = Math.floor(paceInMinPerDistance);
    // Math.round((x)*60) vs Math.round(x)*60 b/c dont want to round to early;
    // the latter gives 1 hour/60km = 2min/mi when really 1:37min/mile
    let paceSec = Math.round((paceInMinPerDistance - paceMin) * 60);

    // avoid outputs like 7min 60sec; get 8 min 0 sec
    if (paceSec == 60) {
        paceMin = paceMin + 1;
        paceSec = 0;
    }

    changeValue('pace-min', paceMin);
    changeValue('pace-sec', paceSec);
}


function validNumber(id, checkInteger = false) {
    let number = valueOf(id);
    let isPositiveNumber = !isNaN(Number(number)) && number > 0;
    let isInteger = Number.isInteger(number);

    if (checkInteger == true) {
        return (isPositiveNumber && isInteger);
    }

    return (isPositiveNumber)
}


function calculate() {
    // at least one time filled and above zero                 cond 2    
    let timeFilled = validNumber('hour', true) || validNumber('min', true) || validNumber('sec', true);

    // distance filled and above zero, and checked              cond 1
    let distanceFilled = validNumber('distance');
    let distanceChecked = $('.distance')[1].checked || $('.distance')[2].checked;

    // at least one pace filled and above zero, and checked     cond 3
    let paceFilled = validNumber('pace-min', true) || validNumber('pace-sec', true);
    let paceChecked = $('.pace')[2].checked || $('.pace')[3].checked;


    // appropriate empty input fields
    let timeEmpty = valueOf('hour') + valueOf('min') + valueOf('sec') === 0;
    let distanceEmptyButChecked = (valueOf('distance') === 0) && distanceChecked;
    let paceEmptyButChecked = (valueOf('pace-min') + valueOf('pace-sec') === 0) && paceChecked;


    if (timeEmpty && distanceFilled && distanceChecked && paceFilled && paceChecked) {
        // time empty                                           calc time
        // distance filled, above zero and checked              cond 1
        // at least one pace filled, above zero and checked     cond 3
        calcTime();
    }
    else if (paceEmptyButChecked && timeFilled && distanceFilled && distanceChecked) {
        // pace empty but checked                               calc pace
        // at least one time filled, above zero                 cond 2
        // distance filled, above zero and checked              cond 1
        calcPace();
    }
    else if (distanceEmptyButChecked && timeFilled && paceFilled && paceChecked) {
        // distance empty but checcked                          calc dist
        // at least one time filled, above zero                 cond 2
        // at least one pace filled, above zero and checked     cond 3
        calcDistance();
    }
    else {
        alert('Invalid inputs! Try again. \n\n Make sure there are no letters, or spaces/tabs between numbers');
    }
}


function clearInputs(field) {

    for (i = 0; i < document.getElementsByClassName(field).length; i++) {

        if (document.getElementsByClassName(field)[i].type == 'text') {
            document.getElementsByClassName(field)[i].value = null;
        } else if (document.getElementsByClassName(field)[i].type == 'radio') {
            document.getElementsByClassName(field)[i].checked = null;
        }
    }
};


function clearValue() {
    clearInputs('time');
    clearInputs('distance');
    clearInputs('pace');
}