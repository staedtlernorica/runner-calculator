// console.log('JS loaded');




// //potentially round up for values like x.99 
// // change name to roundTwoDecimals
// function roundTwoDigits(number) {
//     return Math.round(number * 100) / 100;
// };

// // ================== DONT TOUCH ==========================



// function paceTimeDisplay(time, unit) {

//     min = Math.floor(time);
//     second = Math.round((time - min) * 60);

//     if (unit == 'km'){
//         paceMin = (document.getElementById('pace-min').value = min);
//         paceSec = (document.getElementById('pace-sec').value = second);
//     } else if (unit == 'mi'){
//         paceMin = (document.getElementById('pace-min').value = min);
//         paceSec = (document.getElementById('pace-sec').value = second);
//     }
// };





// function findIdValue(id){
//     if (document.getElementById(id).type == 'number'){
//         return document.getElementById(id).value;
//     } else if (document.getElementById(id).type == 'radio'){
//         return document.getElementById(id).checked;
//     };
// }

// function updateIdValue(id, userValue){
//     if (document.getElementById(id).type == 'number'){
//         document.getElementById(id).value = userValue;
//     } else if (document.getElementById(id).type == 'radio'){
//         document.getElementById(id).checked = userValue;
//     };
// };


// let inputIds = {

//     hour: "hour",
//     min: "min",
//     sec: "sec",
//     distance: "distance",
//     paceMin: "pace-min",
//     paceSec: "pace-sec",
//     distanceKm: "distance-km",
//     distanceMi: "distance-mi",
//     paceKm: "pace-km",
//     paceMi: "pace-mi"
// };





// function convertToSmallestUnit(baseUnit) {

//     if (baseUnit == 'sec') {
//         return (findIdValue("hour") * 3600 + findIdValue("min") * 60 + findIdValue("sec"));

//     } else if (baseUnit == 'meter') {

//         if (findIdValue("distance-km") == true) {
//             return (findIdValue('distance') * 1000);
//         } else if (findIdValue("distance-mi") == true) {
//             return (findIdValue('distance') * 1609.34);
//         }

//     } else if (baseUnit == 'secPerMeter') {

//         let paceTime = findIdValue("pace-min") * 60 + findIdValue('pace-sec');

//         if (findIdValue('pace-km') == true) {
//             return (paceTime / 1000);
//         } else if (findIdValue('pace-mi') == true) {
//             return (paceTime / 1609.34);
//         }
//     }
// };



// let baseUnits = {

//     timeSec: convertToSmallestUnit('sec', inputIds),
//     distMeter: convertToSmallestUnit('meter', inputIds),
//     paceSecMeter: convertToSmallestUnit('secPerMeter', inputIds)
// };



// function calculate() {
//     // checkInputs();   no negative numbers either

//     if (baseUnits.timeSec == 0) {
//         // total time in seconds
//         baseUnits.timeSec = roundTwoDigits(baseUnits.paceSecMeter * baseUnits.distMeter);
//         hour = Math.floor(baseUnits.timeSec / 3600);
//         minute = Math.floor(baseUnits.timeSec % 3600 / 60);
//         second = Math.floor(baseUnits.timeSec % 3600 % 60);

//         updateIdValue('hour', hour)
//         updateIdValue('min', minute)
//         updateIdValue('sec', second)


//     } else if (baseUnits.distMeter == 0) {
//         baseUnits.distanceMeter = (baseUnits.timeSec / baseUnits.paceSecMeter);
//         distanceMetric = roundTwoDigits(baseUnits.distanceMeter / 1000);
//         distanceImp = roundTwoDigits(baseUnits.distanceMeter / 1609.34);

//         if (findIdValue('distance-km') == true) {
//             // document.getElementById('distance').value = distanceMetric;
//             updateIdValue('distance', distanceMetric);

//         } else if (findIdValue('distance-mi') == true) {
//             // document.getElementById('distance').value = distanceImp;
//             updateIdValue('distance', distanceImp);
//         }


//     } else if (baseUnits.paceSecMeter == 0) {
//         paceSecMeter = (timeSec / distMeter);
//         paceMinKm = roundTwoDigits(paceSecMeter * 1000 / 60);
//         paceMinMi = roundTwoDigits(paceSecMeter * 1609.34 / 60);

//         if (paceKm == true) {
//             paceTimeDisplay(paceMinKm, 'km');

//         } else if (paceMi == true) {
//             paceTimeDisplay(paceMinMi, 'mi');
//         };
//     };
// };



// // =================DONT TOUCH==============================


// function clearInputs(field) {

//     for (i = 0; i < document.getElementsByClassName(field).length; i++){

//         if (document.getElementsByClassName(field)[i].type == 'number'){
//             document.getElementsByClassName(field)[i].value = null;
//         } else if (document.getElementsByClassName(field)[i].type == 'radio'){
//             document.getElementsByClassName(field)[i].checked = null; 
//         }
//     }
// };




// // troubleshooting stuff

// function logCurrentInputs() {

//     console.log(hour, min, sec);
//     console.log(distance, distanceKm, distanceMi);
//     console.log(paceMin, paceSec, paceKm, paceMi);
// };

// function logCurrentBaseUnits() {

//     timeSec = convertToSmallestUnit('sec');
//     distMeter = convertToSmallestUnit('meter');
//     paceSecMeter = convertToSmallestUnit('secPerMeter');
//     console.log(`${(timeSec)} seconds, ${distMeter} meters, ${paceSecMeter} seconds per meter`);
// }
