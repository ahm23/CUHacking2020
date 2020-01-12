var fs = require('fs');
var filename = 'Murder-on-the-2nd-Floor-Raw-Data.json';
var obj = JSON.parse(fs.readFileSync(filename, 'utf8'));
const murderRoom = 210;
var suspects = [];
var suspects2 = [];
var namesUsed = 'Names';
var unusualTimestamps = [];

// Start script by tracking door events and then analyzing the discrepencies identified
trackDoor(murderRoom, null, null, function (num) {
    trackFloorActivity(2, unusualTimestamps[num][1], unusualTimestamps[num][2]);
    trackStairwell(unusualTimestamps[num][1], unusualTimestamps[num][2]);
    for (var z = 0; z < suspects.length; z++) {
        if (suspects.length == 0) {
            break;
        }
        else if (namesUsed.indexOf(suspects[z][0][0]) == -1) {
            namesUsed.concat(suspects[z][0][0]);
            trackPersonInteraction(suspects[z][0][0], unusualTimestamps[num][1]);
        }
        else {
            console.log(suspects[z][0][0]);
        }
    }
});

// Calculate and Display Final Results
var total = 0;
for (var a = 0; a < suspects2.length; a++) {
    total += suspects2[a][1];
}
var greatest = 0;
var greatestName = '';
console.log("RESULTS");
console.log("------------------------");
for (var b = 0; b < suspects2.length; b++) {
    if (suspects2[b][1] > greatest) {
        greatest = suspects2[b][1];
        greatestName = suspects2[b][0];
    }
    console.log(suspects2[b][0] + ": " + (((suspects2[b][1] / total)*100).toFixed(1)) + "%");
}
console.log("------------------------");
console.log("The killer is most likely to be " + greatestName + " with a probability of " + (((greatest / total)*100).toFixed(1)) + "% \n");

// Track the actions at a door and identify discrepencies
function trackDoor(doorID, startTime, endTime, cb) {
    var sensorType = null;
    let tempDoor = null;
    var doorEvent = '';
    var lineIncrement = 0;
    let timestampIncrement = 0;
    let counter = 0;
    let complete = false;
    let criminalClose = '';
    Object.keys(obj).forEach(key => {
        Object.keys(obj[key]).forEach(second_key => {
            lineIncrement == 0 ? sensorType = obj[key][second_key] : null;
            if (sensorType == "door sensor") {
                lineIncrement == 1 ? tempDoor = obj[key][second_key] : null;
                lineIncrement == 2 ? doorEvent = obj[key][second_key] : null;
                if (lineIncrement == 3 && tempDoor == doorID && (doorEvent == "successful keycard unlock" || doorEvent == "unlocked no keycard")) {
                     if (!(normalClose = searchClose(key, doorID, obj[key][second_key], false))) {
                        unusualTimestamps.push(new Array(obj[key][second_key], key, searchClose(key, doorID, obj[key][second_key], true), 0));
                        for (var k = 0; k < timestampIncrement; k++) {
                            unusualTimestamps[k][3]++;
                        }
                        cb(timestampIncrement);
                        timestampIncrement++;
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
        counter++;
    });
}

// Track actions on a floor to identify initial suspects
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

// Search for a door closure to complete the common cycle of doorOpen => doorClose
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
                    }
                }
                else {
                    returnVal = key;
                    returnedToPosition = false;
                    if (obj[key]["guest-id"] != "Marc-Andre") {
                        var tempLimit = suspects2.length;
                        for (var x = 0; x <= tempLimit; x++) {
                            if (suspects2[x]) {
                                if (suspects2[x][0] == obj[key]["guest-id"]) {
                                    suspects2[x][1] += 100;
                                    break;
                                }
                            }
                            else if (x == tempLimit) {
                                suspects2.push([obj[key]["guest-id"], 100]);
                            }
                        }
                    }
                    else {
                        var tempLimit = suspects2.length;
                        for (var x = 0; x <= tempLimit; x++) {
                            if (suspects2[x]) {
                                if (suspects2[x][0] == obj[key]["guest-id"]) {
                                    suspects2[x][1] += 25;
                                    break;
                                }
                            }
                            else if (x == tempLimit) {
                                suspects2.push([obj[key]["guest-id"], 25]);
                            }
                        }
                    }
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

// Track the probable interactions of a person with the victim from a specific timepoint
function trackPersonInteraction(name, startTime) {
    var sensorType = null;
    let sensorID = null;
    var sensorEvent = '';
    var lineIncrement = 0;
    Object.keys(obj).forEach(key => {
        if (parseInt(startTime) < parseInt(key)) {
            Object.keys(obj[key]).forEach(second_key => {
                lineIncrement == 0 ? sensorType = obj[key][second_key] : null;
                lineIncrement == 1 ? sensorID = obj[key][second_key] : null;
                lineIncrement == 2 ? sensorEvent = obj[key][second_key] : null;
                if (lineIncrement == 3 && obj[key][second_key] == name && name != "n/a") {
                    if (parseInt(key) < parseInt(startTime) + 60 && parseInt(startTime) < parseInt(key)) {
                        var tempLimit = suspects2.length;
                        for (var x = 0; x <= tempLimit; x++) {
                            if (suspects2[x]) {
                                if (suspects2[x][0] == name) {
                                    suspects2[x][1] += 100;
                                    break;
                                }
                            }
                            else if (x == tempLimit) {
                                suspects2.push([name, 100]);
                            }
                        }
                    }
                    else {
                        var tempLimit = suspects2.length;
                        for (var x = 0; x <= tempLimit; x++) {
                            if (suspects2[x]) {
                                if (suspects2[x][0] == name) {
                                    suspects2[x][1] += 1;
                                    break;
                                }
                            }
                            else if (x == tempLimit) {
                                suspects2.push([name, 1]);
                            }
                        }
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

// Track movements going up and down the stairwell
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
                    if (sensorType == "motion sensor" || sensorType == "door sensor") {
                        if (sensorID == 250 || sensorID == "elevator" || sensorID == 150) {
                            if (suspects[obj[key][second_key]]) {
                                suspects[obj[key][second_key]][5]++;
                            }
                            else {
                                suspects.push([[obj[key][second_key], key, sensorType, sensorID, sensorEvent, 0]]);
                            }
                        }
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