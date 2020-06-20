// A trivial little web server that can execute system commands based on http requests
// There's no authentication here (yet) so ensure that the commands expected are safe

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
let port = 3000;
if (process.env.NODE_PORT){
    port = process.env.NODE_PORT;
}

// Enable time stamp logging on the console
require('console-stamp')(console, 'HH:MM:ss.l');
require('console-stamp')(console, { pattern: 'yyyy-mm-dd HH:MM:ss.l' });


// Add all requests to the log
function logAllRequests(req, res, next) {
    const ip = req.connection.remoteAddress;
    // const msg = "REQUEST [" + ip + "] " + req.method + " " + req.url;
    // console.debug(msg);

    console.debug(`REQUEST [${ip}] ${req.method} ${req.url} : ${res.statusCode}`);
    next(); // Passing the request to the next handler in the stack.
}

app.all('*', logAllRequests);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => res.send('Hello World!'));
app.use('/cmd', require('./cmd.js'));
app.use('/status', require('./status.js'));


app.listen(port, () => console.log(`Remote Trigger Service running at http://localhost:${port}`));
