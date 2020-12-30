// Routes that are accessed via POST

const express = require('express');
const config = require('./config.js');
const lib = require('./lib.js');

const app = express();
module.exports = app;

let inertMode = false; // if inertMode is set, no actual commands will be executed
if (config.app && config.app.inertMode) {
    inertMode = config.app.inertMode;
}
if (inertMode) {
    console.log('<<< INERT MODE :: NO COMMANDS WILL BE EXECUTED >>>');
}


function buildRoute(commandObject) {
    // For a JSON object with a command and action, build a route in the server
    console.log(commandObject);
    if (commandObject.command && commandObject.url) {
        console.log(`defined endpoint: ${commandObject.url}`);
        app.post(`/${commandObject.url}`, (req, res) => {
            console.log(`fetching ${commandObject.url}`);
            // const postBody = req.body;
            (async () => {
                let response;
                if (!inertMode) {
                    response = await lib.execShellCommand(commandObject.command);
                } else {
                    console.log(`INERT MODE - skipping execution of command: ${commandObject.command}`);
                    response = 'INERT MODE - COMMAND NOT EXECUTED';
                }

                let responseParsed;
                // Try to parse any boolean or integer in the response...
                try {
                    responseParsed = JSON.parse(response);
                } catch (e) {
                    responseParsed = response;
                }

                // Don't send the specific command back to the user...just for security reasons
                const responseObj = {
                    action: commandObject.action,
                    response: responseParsed,
                };
                res.json(responseObj);
            })(); // end async()
        });
    } else {
        console.warn(`skipping endpoint: ${commandObject.url} because not enough info was defined`);
    }
}

function buildRoutes(commandList) {
    // Build routes that map the launch commands to commands that can be launched remotely
    // console.log(commandList);
    commandList.map((cmdObj) => {
        buildRoute(cmdObj);
    });
}

buildRoutes(config.launchCommands);
