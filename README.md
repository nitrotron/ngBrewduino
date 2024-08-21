AngualJS & Node.js based Homebrew software. Both are designed to be hosted on a Raspberry PI, which has an Arduino controller connected. The Arduino has temperature probes connected to it. 

Node.js/Express web server communicates between the Arduino and web site. Using push notificaitons it updates the Web site to trigger state events. Also stores the historical data in a sqlLite DB. 

Here is a demo video connected to a mock Arduino simulator

[![Brewduino Demo YouTube Video](https://img.youtube.com/vi/kr4w4PKmb00/0.jpg)](https://www.youtube.com/watch?v=kr4w4PKmb00)

## To Get started
1. To install the necessary packages run `npm install`
2. This will run on a sqlLite database. It will create the necessary tables. But the data directory must be created in the sites root. `~/data` Without this directory, the first read/write will crash the server.
3. To run in the test environment. First build it, then serve it with the gulp commands. gulp help lists the potential other commands. This should be run in the project root directory.
   - gulp build
   - gulp serve-dev-mock
   - gulp help
