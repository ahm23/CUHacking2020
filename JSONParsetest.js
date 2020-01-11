var fs = require('fs');

var obj = JSON.parse(fs.readFileSync('Murder-on-the-2nd-Floor-Raw-Data.json', 'utf8'));

var roomsIdentified = [];
var eventType;
var doorSensor = [];
var tempData = [];
var counter1 = 0;
var counter2 = 0;

let saveData = false;
//doorSensor.push([0,0,0]);
function trackDoor(roomNumber) {
    for (var j = 0; j <= roomsIdentified.length; j++) {
        console.log(roomNumber);
        if (roomNumber == roomsIdentified[j]) {
            return 1;
        }
    }
    roomsIdentified.push(roomNumber);
    var sensorType;
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(second_key => {
            //console.log(obj[key][second_key]);
            counter1 == 0 ? sensorType = obj[key][second_key] : null;
            (counter1 == 1 && obj[key][second_key] == roomNumber) ? saveData = true : null;
            if (saveData) {
                console.log(saveData);
            }
            counter1 == 2 ? eventType = obj[key][second_key] : null;
            if (counter1 == 3 && saveData) {
                tempData.push([key, roomNumber, eventType, obj[key][second_key]]);
                doorSensor.push(tempData);
            // doorSensor[0][counter2].push([key, "210", eventType, obj[key][second_key]]);
                counter2++;
                tempData = [];
                console.log(doorSensor); 
            }
            counter1++;
            if (counter1 == 4) {
                saveData = false;
                counter1 = 0;
            }
        });
    });
}

var deathTime = 0;

trackDoor("210")
var people = [];
let roomNum = 210;
for (let i = 0; i < counter2; i++) {
    if ((new RegExp('successful')).test(doorSensor[i][0][2])) {
        people[doorSensor[i][0][3]] = true;
        console.log(doorSensor[i][0][3], people[doorSensor[i][0][3]], doorSensor[i][0][0]);
    }
    else if ((new RegExp('no keycard')).test(doorSensor[i][0][2])) {
        people[doorSensor[i][0][3]] = false;
        console.log(doorSensor[i][0][3], people[doorSensor[i][0][3]], doorSensor[i][0][0]);
    }
    else if ((new RegExp('close')).test(doorSensor[i][0][2])) {
        if (doorSensor[i - 1][0][3] != doorSensor[i][0][3]) {
            console.log("DOOR 210 LEFT OPEN @ " + doorSensor[i - 1][0][0] + " BY " + doorSensor[i - 1][0][3]);
            console.log(doorSensor[i][0][3] + " ENTERRED ROOM " + roomNum + " THROUGH OPEN DOOR AND CLOSED IT");
            if (!(interaction = timeCheck(i, roomNum, doorSensor))) {
                console.log(doorSensor[i][0][3] + " DID NOT INTERACT WITH " + doorSensor[i - 1][0][3] + " @ ROOM " + roomNum);
                var trackResponse = trackPerson(doorSensor[i][0][3]);
                (roomNum == 210 && doorSensor[i - 1][0][3] == "Veronica") ? deathTime = doorSensor[i][0][0] : null;
                var timeResponse = trackTime(doorSensor[i][0][0], doorSensor[i - 1][0][3]);
            }
            else {
                console.log(doorSensor[i][0][3] + " INTERACTED WITH " + doorSensor[i - 1][0][3] + " @ ROOM " + roomNum);
            }
        }
        people[doorSensor[i][0][3]] = 'Closed';
        console.log(doorSensor[i][0][3], people[doorSensor[i][0][3]], doorSensor[i][0][0]);
    }
}

function timeCheck(position, roomNum, doorSensor) {
    if (doorSensor[position][0][0] - 60 <= doorSensor[position - 1][0][0]) {
        return true;
    }
    else {
        return false;
    }
}

function trackPerson(name) {
    console.log(name);
    var sensorType;
    var doorNum;
    var doorsAccessed = [];
    var lineCounter = 0;
    var existingTest =  false;
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(second_key => {
            //console.log(obj[key][second_key]);
            lineCounter == 0 ? sensorType = obj[key][second_key] : null;
            lineCounter == 1 ? doorNum = obj[key][second_key] : null;
            (lineCounter == 3 && obj[key][second_key] == name) ? saveData = true : null;
            if (lineCounter == 3 && saveData && sensorType == "door sensor") {
                for (var j = 0; j <= doorsAccessed.length; j++) {
                    if (doorsAccessed[j] == doorNum) {
                        existingTest = true;
                    }
                }
                existingTest == false ? doorsAccessed.push(doorNum) : null;
                existingTest = false;
                console.log(doorsAccessed);
            }
            lineCounter++;
            if (lineCounter == 4) {
                saveData = false;
                lineCounter = 0;
            }
        });
    });
    for (var j = 0; j <= doorsAccessed.length; j++) {
        trackDoor(doorsAccessed[j]);
    }
}

function trackTime(time, victim) {
    console.log(time);
    var sensorType;
    var doorNum;
    var doorsAccessed = [];
    var lineCounter = 0;
    var existingTest =  false;
    Object.keys(obj).forEach(key => {
        if (key < time) {
            if (key + 30 >= time) {

            }
            else { return 1; }
        }
        else if (key > time) {
            if (key - 30 <= time) {

            }
            else { return 1; }
        }
        else if (key == time) {

        }
        Object.keys(obj[key]).forEach(second_key => {
            //console.log(obj[key][second_key]);
            
            lineCounter == 3 ? console.log(obj[key][second_key] + " killed " + victim) : null; 
            /*if (lineCounter == 3 && saveData && sensorType == "door sensor") {
                for (var j = 0; j <= doorsAccessed.length; j++) {
                    if (doorsAccessed[j] == doorNum) {
                        existingTest = true;
                    }
                }
                existingTest == false ? doorsAccessed.push(doorNum) : null;
                existingTest = false;
                console.log(doorsAccessed);
            }*/
            lineCounter++;
            if (lineCounter == 4) {
                saveData = false;
                lineCounter = 0;
            }
        });
    });
    for (var j = 0; j <= doorsAccessed.length; j++) {
        trackDoor(doorsAccessed[j]);
    }
}








/*for (var i = 0; i < object.length; i++) {
    var counter = json[i];
    console.log(counter.device);
}*/
