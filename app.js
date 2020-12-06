const si = require("systeminformation");

const interval = 1000;
const periodSeconds = 60;
const tempInPeriod = [];
const periodMaxLen = (periodSeconds * 1000) / interval;

setInterval(function () {
    si.cpuTemperature()
        .then(function (data) {
            console.log("Current temp: " + data.main);
            calcAverage(data.main);
        })
        .catch((error) => console.error(error));
}, interval);

function calcAverage(temp) {
    
    if (tempInPeriod.length <= periodMaxLen) {
        tempInPeriod.push(temp);
    } else {
        tempInPeriod.shift();
        tempInPeriod.push(temp);
    }

    let total = 0;
    for (let i = 0; i < tempInPeriod.length; i++) {
        total += tempInPeriod[i];
    }
    const avg = total / tempInPeriod.length;

    console.log("Last min average: " + avg);
}
