### Given task
Create service with only one webpage which continuously shows current system CPU temperature and last minute average. Frontend part JS/CSS/HTML with any of external libraries/frameworks, backend NodeJS/Python with any of external libraries/frameworks/modules

### Solution demo
[Demo]

### Implementation
Implementation made based on:
- [socket.io](https://socket.io/) for connecting Nodes.js and client.

- [systeminformation](https://github.com/sebhildebrandt/systeminformation) for accessing CPU temperature. 
*As per documentation it is supported on majority of OSs and was tested on Debian, Raspbian, Ubuntu distributions as well as macOS (Mavericks, Yosemite, El Captain, Sierra, High Sierra, Mojave) and some Windows 7, Windows 10, FreeBSD, OpenBSD, NetBSD and SunOS machines.*


### Install
Download project and install packages
```
npm install
```

### Run
Run application
```
node app.js
```
Open browser:
```
http://localhost:3000
```

### TODO:
- add tests
- WEB: configure refresh rate
- WEB: add bar chart