function clearInputs(className) {
    $(`input.${className}`).val(null);
};

function clearAllInputs() {
    $('input[type="number"]').val(null);
}

function changeUnit(unitButton) {

    if (unitButton.id === 'distance-unit') {
        unitButton.innerHTML === 'km' ? (unitButton.innerHTML = 'mi', distanceUnit = 1609.34) : (unitButton.innerHTML = 'km', distanceUnit = 1000);

    } else if (unitButton.id === 'pace-unit') {
        unitButton.innerHTML === 'min/km' ? (unitButton.innerHTML = 'min/mi', paceUnit = 1609.34) : (unitButton.innerHTML = 'min/km', paceUnit = 1000);
    }
}


let distanceUnit = 1000;
let paceUnit = 1000;

function calculateTime(smallest) {
    let timeInSec = Math.round(smallest.distance * smallest.pace);

    $('#hour').val(Math.floor(timeInSec / 3600));
    $('#min').val(Math.floor(timeInSec % 3600 / 60));
    $('#sec').val(Math.floor(timeInSec % 3600 % 60));
}

function calculateDistance(smallest) {
    let distInMeter = smallest.time / smallest.pace;
    let outputDistance = Math.round(distInMeter / distanceUnit * 100) / 100;
    $('#distance').val(outputDistance);
}

function calculatePace(smallest) {
    let paceInSecPerMeter = smallest.time / smallest.distance;
    let decimalPace = paceInSecPerMeter * paceUnit / 60;

    // floor instead of round b/c Math.round(6.7) = 7 mins rather than 6min 42sec
    let paceMin = Math.floor(decimalPace);
    // Math.round((x)*60) vs Math.round(x)*60 b/c dont want to round to early;
    // the latter gives 1 hour/60km = 2min/mi when really 1:37min/mile
    let paceSec = Math.round((decimalPace - paceMin) * 60);

    // avoid outputs like 7min 60sec; get 8 min 0 sec
    paceSec === 60 ? (paceMin = paceMin + 1, paceSec = 0) : null;

    $('#pace-min').val(paceMin);
    $('#pace-sec').val(paceSec);
}


function correctInputs(userInputs) {
    let correctScore = 0;
    for (let key in userInputs){
        //add 1 to correctScore if input is 0 or higher
        userInputs[key] >= 0 ? correctScore++ : null;   

        // add 1 to correctScore if all inputs except distance is integer (dev choice)
        if (key !== 'distance' && Number.isInteger(userInputs[key])){
            correctScore++;
        }
    }
    if(correctScore === 11){
        return true;
    }
    return false;
}


function calculate() {
    // need + sign in front to make it a number
    let userInputs = {
        hour: +$("#hour").val(),
        minute: +$("#min").val(),
        second: +$("#sec").val(),
        distance: +$("#distance").val(),
        paceMinute: +$("#pace-min").val(),
        paceSecond: +$("#pace-sec").val(),
    };

    let smallest = {
        time: userInputs.hour * 3600 + userInputs.minute * 60 + userInputs.second,
        distance: userInputs.distance * distanceUnit,
        pace: (userInputs.paceMinute * 60 + userInputs.paceSecond) / paceUnit
    }

    let timeFilled = smallest.time > 0;
    let distanceFilled = smallest.distance > 0;
    let paceFilled = smallest.pace > 0;

    // check for correct inputs, then correct conditions
    if (correctInputs(userInputs)) {

        // have 3 shared conditions and 3 specific conditions
        // time unfilled,   distance filled,    pace filled
        // time filled,     distance filled,    pace unfilled
        // time filled,     distance unfilled,  pace filled
        if (!timeFilled && distanceFilled && paceFilled) {
            calculateTime(smallest);
        }
        else if (timeFilled && distanceFilled && !paceFilled) {
            calculatePace(smallest);
        }
        else if (timeFilled && !distanceFilled && paceFilled) {
            calculateDistance(smallest);
        }
        else {
            alert('Invalid inputs! Try again.');
        }
    }
}