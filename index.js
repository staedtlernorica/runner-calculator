function clearInputs(className) {
    let selector = `input.${className}`;
    $(selector).val(null);
    $(selector).prop('checked', false);
};

function clearAllInputs() {
    $('input[type="text"]').val(null);
    $('input[type="radio"]').prop('checked', false);
}


// very robust against spaces/tabs; 1 1 32 hrs == 1132 hrs;
function value(object) {
    // return Number($(`#${id}`).val().replace(/\s/g,''));
    return Number(object.val().replace(/\s/g, ''));
}


// remove = 1000 when done
let distanceUnit = 1000;
let paceUnit = 1000;


function calculate() {
    let userInputs = {
        hour: value($("#hour")),
        minute: value($("#min")),
        second: value($("#sec")),
        timeAboveZero: value($("#hour")) + value($("#min")) + value($("#sec")),
        timeInSeconds: value($("#hour"))*3600 + value($("#min"))*60 + value($("#sec")),
        distance: value($("#distance")),  
        paceMinute: value($("#pace-min")),
        paceSecond: value($("#pace-sec")),
        // maybe eliminate paceAboveZero and timeAboveZero, redundant
        paceAboveZero: value($("#pace-min")) + value($("#pace-sec")),
        paceInSecondsPerMeter: value($("#pace-min")) * 60 + value($("#pace-sec"))
    };

    let smallest = {
        time: userInputs.hour * 3600 + userInputs.minute * 60 + userInputs.second,
        distance: userInputs.distance * distanceUnit,
        pace: (userInputs.paceMinute * 60 + userInputs.paceSecond) / paceUnit
    }

    console.log(userInputs);

    let timeFilled = userInputs.timeAboveZero > 0;

    let distanceChecked = userInputs.distanceUnit != 0;
    let distanceFilled = userInputs.distance > 0;
    let distanceCheckedFilled = distanceChecked && distanceFilled;
    let distanceCheckedEmpty = distanceChecked && !distanceFilled;

    let paceChecked = userInputs.paceUnit != 0;
    let paceFilled = userInputs.paceAboveZero > 0;
    let paceCheckedFilled = paceChecked && paceFilled;
    let paceCheckedEmpty = paceChecked && !paceFilled;

    // have 3 shared conditions and 3 specific conditions
    if (!timeFilled && distanceCheckedFilled && paceCheckedFilled) {

        let timeInSec = Math.round(smallest.distance * smallest.pace);
        console.log(smallest);
        console.log(timeInSec);

        $('#hour').val(Math.floor(timeInSec / 3600));
        $('#min').val(Math.floor(timeInSec % 3600 / 60));
        $('#sec').val(Math.floor(timeInSec % 3600 % 60));
    }
    else if (paceCheckedEmpty && timeFilled && distanceCheckedFilled) {

        let paceInSecPerMeter = smallest.time / smallest.distance;
        let decimalPace = paceInSecPerMeter * paceUnit / 60;

        // floor instead of round b/c Math.round(6.7) = 7 mins rather than 6min 42sec
        let paceMin = Math.floor(decimalPace);
        // Math.round((x)*60) vs Math.round(x)*60 b/c dont want to round to early;
        // the latter gives 1 hour/60km = 2min/mi when really 1:37min/mile
        let paceSec = Math.round((decimalPace - paceMin) * 60);

        // avoid outputs like 7min 60sec; get 8 min 0 sec
        if (paceSec == 60) {
            paceMin = paceMin + 1;
            paceSec = 0;
        }

        $('#pace-min').val(paceMin);
        $('#pace-sec').val(paceSec);
    }
    else if (distanceCheckedEmpty && timeFilled && paceCheckedFilled) {

        let distInMeter = smallest.time / smallest.pace;
        let outputDistance = Math.round(distInMeter / distanceUnit * 100) / 100;
        console.log(distInMeter, outputDistance);
        $('#distance').val(outputDistance);
    }
    else {
        alert('Invalid inputs! Try again.');
    }
}

        // time empty                                           calc time
        // distance filled, above zero and checked              cond 1
        // at least one pace filled, above zero and checked     cond 3

        // pace empty but checked                               calc pace
        // at least one time filled, above zero                 cond 2
        // distance filled, above zero and checked              cond 1

        // distance empty but checcked                          calc dist
        // at least one time filled, above zero                 cond 2
        // at least one pace filled, above zero and checked     cond 3



// function validNumber(id, checkInteger = false) {
//     let number = value(id);
//     let isPositiveNumber = !isNaN(Number(number)) && number > 0;
//     let isInteger = Number.isInteger(number);

//     if (checkInteger == true) {
//         return (isPositiveNumber && isInteger);
//     }

//     return (isPositiveNumber)
// }

