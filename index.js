function clearInputs(className) {
    let selector = `input.${className}`;
    $(selector).val(null);
    $(selector).prop('checked', false);
};


function clearAllInputs() {
    $('input[type="text"]').val(null);
    $('input[type="radio"]').prop('checked', false);
}


// very robust against whitespaces; 1 1 32 hrs == 1132 hrs;
function value(id) {
    if ($(`#${id}`).attr('type') == 'radio'){
        return $(`#${id}`).prop('checked'); 
    }
    return Number($(`#${id}`).val().replace(/\s/g,''));
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
        let time = value('hour') * 3600 + value('min') * 60 + value('sec');
        return time;

    } else if (unit == 'meter') {
        let outputUnit = metricImperialFactor('distance')
        return Number(value('distance') * outputUnit);

    } else if (unit == 'secPerMeter') {
        let paceSecPerMeter = value('pace-min') * 60 + value('pace-sec');
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

    $('#hour').val(hour)
    $('#min').val(minute);
    $('#sec').val(second)
}


function calcDistance() {
    let distInMeter = baseUnit('sec') / baseUnit('secPerMeter');
    let outputUnit = metricImperialFactor('distance');
    let outputDistance = Math.round(distInMeter / outputUnit * 100) / 100;
    $('#distance').val(outputDistance);
}


function calcPace() {
    let paceInSecPerMeter = baseUnit('sec') / baseUnit('meter');
    let outputUnit = metricImperialFactor('pace');
    let outputPace = paceInSecPerMeter * outputUnit / 60;

    // floor instead of round b/c Math.round(6.7) = 7 mins rather than 6min 42sec
    let paceMin = Math.floor(outputPace);
    // Math.round((x)*60) vs Math.round(x)*60 b/c dont want to round to early;
    // the latter gives 1 hour/60km = 2min/mi when really 1:37min/mile
    let paceSec = Math.round((outputPace - paceMin) * 60);

    // avoid outputs like 7min 60sec; get 8 min 0 sec
    if (paceSec == 60) {
        paceMin = paceMin + 1;
        paceSec = 0;
    }

    $('#pace-min').val(paceMin);
    $('#pace-sec').val(paceSec);
}


function validNumber(id, checkInteger = false) {
    let number = value(id);
    let isPositiveNumber = !isNaN(Number(number)) && number > 0;
    let isInteger = Number.isInteger(number);

    if (checkInteger == true) {
        return (isPositiveNumber && isInteger);
    }

    return (isPositiveNumber)
}


function calculate() {
    // at least one time filled and above zero                 cond 2    
    let timeFilled = condition2 = validNumber('hour', true) || validNumber('min', true) || validNumber('sec', true);

    // distance filled and above zero, and checked              cond 1
    let distanceFilled = validNumber('distance');
    let distanceChecked = $('.distance')[1].checked || $('.distance')[2].checked;
    let condition1 = distanceFilled && distanceChecked;

    // at least one pace filled and above zero, and checked     cond 3
    let paceFilled = validNumber('pace-min', true) || validNumber('pace-sec', true);
    let paceChecked = $('.pace')[2].checked || $('.pace')[3].checked;
    let condition3 = paceFilled && paceChecked;


    // appropriate empty input fields for specific conditions
    let timeEmpty = value('hour') + value('min') + value('sec') === 0;
    let distanceEmptyButChecked = (value('distance') === 0) && distanceChecked;
    let paceEmptyButChecked = (value('pace-min') + value('pace-sec') === 0) && paceChecked;


    if (timeEmpty && condition1 && condition3) {
        // time empty                                           calc time
        // distance filled, above zero and checked              cond 1
        // at least one pace filled, above zero and checked     cond 3
        calcTime();
    }
    else if (paceEmptyButChecked && condition1 && condition2) {
        // pace empty but checked                               calc pace
        // at least one time filled, above zero                 cond 2
        // distance filled, above zero and checked              cond 1
        calcPace();
    }
    else if (distanceEmptyButChecked && condition2 && condition3) {
        // distance empty but checcked                          calc dist
        // at least one time filled, above zero                 cond 2
        // at least one pace filled, above zero and checked     cond 3
        calcDistance();
    }
    else {
        alert('Invalid inputs! Try again.');
    }
}