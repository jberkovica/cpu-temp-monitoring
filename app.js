const si = require("systeminformation");
const express = require("express");
const http = require("http");
const io = require("socket.io")(http);
const path = require("path");

// setting server
const app = express();
const server = http.Server(app);
io.listen(server);

// configuration
const refreshInterval = 3000;
const periodSeconds = 60;
const periodMaxLen = (periodSeconds * 1000) / refreshInterval;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
    // TODO: take out setInterval?
    // problem:
    // what happens when we have multiple connections and we manipulate same tempInPeriod
    // define tempInPerios inside

    console.log("New connection: " + socket.id);
    const tempInPeriod = [];

    monitorCPU(socket, tempInPeriod);
});

function monitorCPU(socket, tempInPeriod) {
    setInterval(function () {
        si.cpuTemperature()
            .then(function (data) {
                const tempNow = parseFloat(data.main.toFixed(1));
                const tempAvg = parseFloat(calcAverage(tempNow, tempInPeriod).toFixed(1));

                console.log("Current temp: " + tempNow);
                console.log("Last min average: " + tempAvg);

                socket.emit("update", tempNow, tempAvg);
            })
            .catch((error) => console.error(error));
    }, refreshInterval);
}

function calcAverage(temp, tempInPeriod) {
     
    tempInPeriod.push(temp);

    // var 1
    if (tempInPeriod.length > periodMaxLen) {
        tempInPeriod.shift();
    }
    
    // var 2
    // tempInPeriod = [...tempInPeriod, temp].slice(-periodMaxLen);

    // var 3
    // tempInPeriod =
    //     tempInPeriod.length > periodMaxLen
    //         ? [...tempInPeriod, temp].slice(-periodMaxLen)
    //         : [...tempInPeriod, temp];


    console.log(tempInPeriod);

    // TODO: lambda
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    let total = tempInPeriod.reduce(reducer);

    return total / tempInPeriod.length;
}

server.listen(3000, () => {
    console.log("listening on *:3000");
});
