const si = require("systeminformation");
const express = require("express");
const http = require("http");
const io = require("socket.io")(http);

// setting server
const app = express();
const server = http.Server(app);
io.listen(server);

// configuration
const refreshInterval = 3000;
const periodSeconds = 60;
const tempInPeriod = [];
const periodMaxLen = (periodSeconds * 1000) / refreshInterval;

// accessing static css file
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log("a user connected");

    setInterval(function () {
        si.cpuTemperature()
            .then(function (data) {
                const tempNow = data.main.toFixed(1);
                const tempAvg = calcAverage(data.main).toFixed(1);

                console.log("Current temp: " + tempNow);
                console.log("Last min average: " + tempAvg);

                socket.emit("update", tempNow, tempAvg);
            })
            .catch((error) => console.error(error));
    }, refreshInterval);
});

function calcAverage(temp) {
    // calculate average for given period
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
    return avg;
}

server.listen(3000, () => {
    console.log("listening on *:3000");
});
