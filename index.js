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

    $("#pace-unit, #distance-unit").on('click', function () {
        changeUnit(this);
    })


    function changeUnit(unitButton) {
        $(`.${unitButton.className}`).val('');                     //clear out all distance/pace inputs 
        const kmMiText = $(`span.${unitButton.className}`);        //get km or mi part of button
       
        kmMiText.text() === 'km' ?
            ($(unitButton).val('1609.34'), kmMiText.text('mi')) :
            ($(unitButton).val('1000'), kmMiText.text('km'));

        calculate();
    }


    function calculateTime(smallest) {
        const timeInSec = Math.round(smallest.distance * smallest.pace);
        $('#hour').val(Math.floor(timeInSec / 3600));
        $('#min').val(Math.floor(timeInSec % 3600 / 60));
        $('#sec').val(Math.floor(timeInSec % 3600 % 60));
    }

    function calculateDistance(smallest, distanceUnit) {
        const distInMeter = smallest.time / smallest.pace;
        const distInUnit = Math.round(distInMeter / distanceUnit * 100) / 100;
        $('#distance').val(distInUnit);
    }

    function calculatePace(smallest, paceUnit) {
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

            distanceUnit: +($('button.distance').val()),
            paceUnit: +($('button.pace').val())
        };

        const smallest = {
            time: userInputs.hour * 3600 + userInputs.minute * 60 + userInputs.second,
            distance: userInputs.distance * userInputs.distanceUnit,
            pace: (userInputs.paceMinute * 60 + userInputs.paceSecond) / userInputs.paceUnit
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
            calculatePace(smallest, userInputs.paceUnit);
        }
        else if (timeFilled && !distanceFilled && paceFilled) {
            calculateDistance(smallest, userInputs.distanceUnit);
        }
        else {
            alert('Not enough or invalid inputs! Try again.');
        }
    }
});

    // TODO
    // highlight what was calculated
    // highlight missing/wrong input
    // quick message saying what was wrong: invalid/missing/too much
    // fortune cookie encouragements


    // if you changed the time, then clicked on calculate distance, pace is obviously kept constant; 
    // change calculate to reflect this

    // write unit test

    // make proper init in document ready