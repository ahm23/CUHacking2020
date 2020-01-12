var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('Murder-on-the-2nd-Floor-Raw-Data.json', 'utf8'));
const murderRoom = 210;
var suspects = [];
var unusualTimestamps = [];

trackDoor(murderRoom, null, null, function (num) {
    trackFloorActivity(2, unusualTimestamps[num][1], unusualTimestamps[num][2]);
    trackStairwell(unusualTimestamps[num][1], unusualTimestamps[num][2]);
});




function trackDoor(doorID, startTime, endTime, cb) {
    var sensorType = null;
    let tempDoor = null;
    var doorEvent = '';
    var lineIncrement = 0;
    let timestampIncrement = 0;
    let counter = 0;
    let complete = false;
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(second_key => {
            lineIncrement == 0 ? sensorType = obj[key][second_key] : null;
            if (sensorType == "door sensor") {
                lineIncrement == 1 ? tempDoor = obj[key][second_key] : null;
                lineIncrement == 2 ? doorEvent = obj[key][second_key] : null;
                if (lineIncrement == 3 && tempDoor == doorID && (doorEvent == "successful keycard unlock" || doorEvent == "unlocked no keycard")) {
                     if (!(normalClose = searchClose(key, doorID, obj[key][second_key], false))) {
                        console.log("DOOR WAS NOT CLOSED: " + key + " | " + obj[key][second_key]);
                        unusualTimestamps.push(new Array(obj[key][second_key], key, searchClose(key, doorID, obj[key][second_key], true), 0));
                        for (var k = 0; k < timestampIncrement; k++) {
                            unusualTimestamps[k][3]++;
                        }
                        cb(timestampIncrement);
                        timestampIncrement++;
                        console.log(unusualTimestamps);
                     }
                }
            }
            lineIncrement++;
            if (lineIncrement == 4) {
                sensorType = null;
                tempDoor = null;
                doorEvent = '';
                lineIncrement = 0;
            }
        });
 /*       console.log(obj.length);
        if (counter == obj.length) {
            console.log("bruh");
            cb();
        }*/
        counter++;
    });
}

function trackFloorActivity(floorNum, startTime, endTime) {
    var sensorType = null;
    let sensorID = null;
    var sensorEvent = '';
    var lineIncrement = 0;
    Object.keys(obj).forEach(key => {
        if (parseInt(startTime) < parseInt(key) && parseInt(key) < parseInt(endTime)) {
            Object.keys(obj[key]).forEach(second_key => {
                lineIncrement == 0 ? sensorType = obj[key][second_key] : null;
                lineIncrement == 1 ? sensorID = obj[key][second_key] : null;
                lineIncrement == 2 ? sensorEvent = obj[key][second_key] : null;
                if (lineIncrement == 3) {
                    if (sensorType == "door sensor") {
                        if (sensorID.startsWith("2") && sensorID != "250") {
                            if (suspects[obj[key][second_key]]) {
                                suspects[obj[key][second_key]][5]++;
                            }
                            else {
                                suspects.push([[obj[key][second_key], key, sensorType, sensorID, sensorEvent, 0]]);
                            }
                            console.log(suspects);
                        }
                    }
                    else if (sensorType == "") {

                    }
                }
                lineIncrement++;
                if (lineIncrement == 4) {
                    sensorType = null;
                    sensorID = null;
                    sensorEvent = '';
                    lineIncrement = 0;
                }
            });
        }
    });
}



function searchClose(timestamp, doorID, indentity, returnKey) {
    var returnedToPosition = false;
    var returnVal = false;
    var complete = false;
    var counter;
    Object.keys(obj).forEach(key => {
        if (returnedToPosition) {
            if (obj[key]["device-id"] == doorID && obj[key]["event"] == "door closed") {
                if (returnKey == false) {
                    if (parseInt(key) < parseInt(timestamp) + 10) {
                        returnVal = true;
                        returnedToPosition = false;
                        console.log("DOOR WAS CLOSED: " + key + " | " + obj[key]["guest-id"]);
                    }
                }
                else {
                    returnVal = key;
                    returnedToPosition = false;
                    console.log("DOOR WAS CLOSED: " + key + " | " + obj[key]["guest-id"]);
                }
            }
        }
        key == timestamp ? returnedToPosition = true : null;
        if (counter == obj.length) {
            complete = true;
        }
        counter++;
    });
    if (complete == true) {
        return returnVal;
    }
}



function trackPerson(startTime, endTime) {

}

function trackStairwell(startTime, endTime) {
    var sensorType = null;
    let sensorID = null;
    var sensorEvent = '';
    var lineIncrement = 0;
    Object.keys(obj).forEach(key => {
        if (parseInt(startTime) < parseInt(key) && parseInt(key) < parseInt(endTime)) {
            Object.keys(obj[key]).forEach(second_key => {
                lineIncrement == 0 ? sensorType = obj[key][second_key] : null;
                lineIncrement == 1 ? sensorID = obj[key][second_key] : null;
                lineIncrement == 2 ? sensorEvent = obj[key][second_key] : null;
                if (lineIncrement == 3) {
                    if (sensorType == "motion sensor") {
                        if (sensorID == "250" || sensorID == "elevator") {
                            if (suspects[obj[key][second_key]]) {
                                suspects[obj[key][second_key]][5]++;
                            }
                            else {
                                suspects.push([[obj[key][second_key], key, sensorType, sensorID, sensorEvent, 0]]);
                            }
                            console.log(suspects);
                        }
                    }
                    else if (sensorType == "") {

                    }
                }
                lineIncrement++;
                if (lineIncrement == 4) {
                    sensorType = null;
                    sensorID = null;
                    sensorEvent = '';
                    lineIncrement = 0;
                }
            });
        }
    });
}