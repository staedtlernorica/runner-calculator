$(document).ready(function () {

    $('.calc-btn').on("click", function () {
        calculate();
    });

    $('.clear-btn').on("click", function () {
        $(`input#${this.value}`).val(null);
    });

    $('.clear-all-btn').on('click', function () {
        $('input[type="number"]').val(null);
    });

    $("#pace-unit, #distance-unit").on('click', function () {
        changeUnit(this);
    })


    function changeUnit(unitButton) {

        $(`#${unitButton.className}`).val('')                     //clear out all distance/pace inputs 
        const kmMiText = $(`span.${unitButton.className}`)        //get km or mi part of button

        console.log(unitButton.className)

        kmMiText.text() === 'km' ?
            ($(unitButton).val('1609.34'), kmMiText.text('mi')) :
            ($(unitButton).val('1000'), kmMiText.text('km'));

        calculate();


    }


    function calculateTime(distance, pace) {
        const timeInSec = Math.round(distance * pace);

        const hour = (Math.floor(timeInSec / 3600));
        let min = (Math.floor(timeInSec % 3600 / 60));
        let sec = (Math.floor(timeInSec % 3600 % 60));

        // convert :2 -> :02
        min = String(min).padStart(2, 0)
        sec = String(sec).padStart(2, 0)

        $("#time").val(`${hour}:${min}:${sec}`)
    }



    function calculateDistance(time, pace, distanceUnit) {
        const distInMeter = time / pace;
        const distInUnit = Math.round(distInMeter / distanceUnit * 100) / 100;
        $('#distance').val(distInUnit);
    }



    function calculatePace(time, distance, paceUnit) {
        const paceInSecPerMeter = time / distance;
        const paceInMinPerUnit = paceInSecPerMeter * paceUnit / 60;

        // floor instead of round b/c Math.round(6.7) = 7 mins rather than 6min 42sec
        let paceMin = Math.floor(paceInMinPerUnit);
        // Math.round((x)*60) vs Math.round(x)*60 b/c dont want to round to early;
        // the latter gives 1 hour/60km = 2min/mi when really 1:37min/mile
        let paceSec = Math.round((paceInMinPerUnit - paceMin) * 60);

        // avoid outputs like 7min 60sec; get 8 min 0 sec
        paceSec === 60 ? (paceMin = paceMin + 1, paceSec = 0) : null;

        paceMin = String(paceMin).padStart(2, 0)
        paceSec = String(paceSec).padStart(2, 0)

        $('#pace').val(`${paceMin}:${paceSec}`)
    }


    function parseTimeInput(time) {
        event.preventDefault();
        let timeList = time.split(":").map((number) => {
            return Number(number)
        })

        let timeInSeconds;

        // 2 => minutes + seconds => pace
        // 3 => hours + + mins + secs => time
        timeList.length === 2 ?
            timeInSeconds = timeList[0] * 60 + timeList[1] :
            timeInSeconds = timeList[0] * 3600 + timeList[1] * 60 + timeList[2]

        // console.log(timeList, timeInSeconds)

        return timeInSeconds
    }


    function calculate() {
        // need + sign in front to make it a number
        const userInputs = {
            // hour: +$("#hour").val(),
            // minute: +$("#min").val(),
            // second: +$("#sec").val(),
            time: parseTimeInput($("#time").val()),
            distance: +$("#distance").val(),
            pace: parseTimeInput($("#pace").val()),
            // paceMinute: +$("#pace-min").val(),
            // paceSecond: +$("#pace-sec").val(),

            distanceUnit: +($('button.distance').val()),
            paceUnit: +($('button.pace').val())
        };

        // console.log(userInputs.time, userInputs.distance, userInputs.pace)

        const smallest = {
            time: parseTimeInput($("#time").val()),
            distance: userInputs.distance * userInputs.distanceUnit,
            pace: parseTimeInput($("#pace").val()) / userInputs.paceUnit
        }

        // const timeFilled = smallest.time > 0;
        // const distanceFilled = smallest.distance > 0;
        // const paceFilled = smallest.pace > 0;

        const timeInSec = parseTimeInput($("#time").val())
        const distanceInMeterOrFeet = userInputs.distance * userInputs.distanceUnit
        const paceInSec = parseTimeInput($("#pace").val()) / userInputs.paceUnit


        console.log(timeInSec, distanceInMeterOrFeet, paceInSec)

        // have 3 shared conditions and 3 specific conditions
        // time unfilled,   distance filled,    pace filled
        // time filled,     distance filled,    pace unfilled
        // time filled,     distance unfilled,  pace filled
        if (!timeInSec && distanceInMeterOrFeet && paceInSec) {
            calculateTime(distanceInMeterOrFeet, paceInSec);
        }
        else if (timeInSec && distanceInMeterOrFeet && !paceInSec) {
            calculatePace(timeInSec, distanceInMeterOrFeet, userInputs.paceUnit);
        }
        else if (timeInSec && !distanceInMeterOrFeet && paceInSec) {
            calculateDistance(timeInSec, paceInSec, userInputs.distanceUnit);
        }
        else {
            console.log('Not enough or invalid inputs! Try again.');

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


// input mask
// https://stackoverflow.com/a/57542023/6030118

$(function () {
    $('input[id$="time"]').inputmask(
        "99:59:59", {
        placeholder: "00:00:00",
        insertMode: false,
        showMaskOnHover: false,
        //hourFormat: 12,
        definitions: {
            '5': {
                validator: "[0-5]",
                cardinality: 1
            }
        }
    }
    )
});


$(function () {
    $('input[id$="pace"]').inputmask(
        "99:59", {
        placeholder: "00:00",
        insertMode: false,
        showMaskOnHover: false,
        //hourFormat: 12,
        definitions: {
            '5': {
                validator: "[0-5]",
                cardinality: 1
            }
        }
    }
    )
});



