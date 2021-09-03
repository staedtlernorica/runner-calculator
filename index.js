$(document).ready(function () {

    $('.calc-btn').on("click", function () {
        calculate();
    });

    $('.clear-btn').on("click", function () {
        $(`input.${this.value}`).val(null);
    });

    $('.clear-all-btn').on('click', function () {
        $('input[type="number"]').val(null);
    });

    $(".unit-btn").on('click', function () {
        changeUnit(this);
    })


    function changeUnit(unitButton) {

        if (unitButton.id === 'distance-unit') {

            unitButton.innerHTML === 'km' ?
                (unitButton.innerHTML = 'mi', distanceUnit = 1609.34) : (unitButton.innerHTML = 'km', distanceUnit = 1000);
            $(".distance").val("");
            calculate();

        } else if (unitButton.id === 'pace-unit') {
            unitButton.innerHTML === 'min/km' ?
                (unitButton.innerHTML = 'min/mi', paceUnit = 1609.34) :
                (unitButton.innerHTML = 'min/km', paceUnit = 1000);
            $(".pace").val("");
            calculate();
        }
    }

    // metric default
    let distanceUnit = 1000, paceUnit = 1000;
    let distanceMetric = true, paceMetric = true;

    function calculateTime(smallest) {
        const timeInSec = Math.round(smallest.distance * smallest.pace);
        $('#hour').val(Math.floor(timeInSec / 3600));
        $('#min').val(Math.floor(timeInSec % 3600 / 60));
        $('#sec').val(Math.floor(timeInSec % 3600 % 60));
    }

    function calculateDistance(smallest) {
        const distInMeter = smallest.time / smallest.pace;
        const distInUnit = Math.round(distInMeter / distanceUnit * 100) / 100;
        $('#distance').val(distInUnit);
    }

    function calculatePace(smallest) {
        const paceInSecPerMeter = smallest.time / smallest.distance;
        const paceInMinPerUnit = paceInSecPerMeter * paceUnit / 60;

        // floor instead of round b/c Math.round(6.7) = 7 mins rather than 6min 42sec
        const paceMin = Math.floor(paceInMinPerUnit);
        // Math.round((x)*60) vs Math.round(x)*60 b/c dont want to round to early;
        // the latter gives 1 hour/60km = 2min/mi when really 1:37min/mile
        const paceSec = Math.round((paceInMinPerUnit - paceMin) * 60);

        // avoid outputs like 7min 60sec; get 8 min 0 sec
        paceSec === 60 ? (paceMin = paceMin + 1, paceSec = 0) : null;

        $('#pace-min').val(paceMin);
        $('#pace-sec').val(paceSec);
    }


    function calculate() {
        // need + sign in front to make it a number
        const userInputs = {
            hour: +$("#hour").val(),
            minute: +$("#min").val(),
            second: +$("#sec").val(),
            distance: +$("#distance").val(),
            paceMinute: +$("#pace-min").val(),
            paceSecond: +$("#pace-sec").val(),
        };

        const smallest = {
            time: userInputs.hour * 3600 + userInputs.minute * 60 + userInputs.second,
            distance: userInputs.distance * distanceUnit,
            pace: (userInputs.paceMinute * 60 + userInputs.paceSecond) / paceUnit
        }

        const timeFilled = smallest.time > 0;
        const distanceFilled = smallest.distance > 0;
        const paceFilled = smallest.pace > 0;


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
            alert('Not enough or invalid inputs! Try again.');
        }
    }
});

    // TODO
    // highlight what was calculated
    // highlight missing/wrong input
    // quick message saying what was wrong: invalid or missing
    // fortune cookie encouragements


    // if you changed the time, then clicked on calculate distance, pace is obviously kept constant; 
    // change calculate to reflect this