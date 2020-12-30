// status routes that are accessed via GET instead of POST

const express = require('express');
const config = require('./config.js');
const lib = require('./lib.js');

const app = express();
module.exports = app;

function buildRoute(commandObject) {
    // For a JSON object with a command and action, build a route in the server
    console.log(commandObject);
    if (commandObject.command && commandObject.url) {
        console.log(`defined status endpoint: ${commandObject.url}`);
        app.get(`/${commandObject.url}`, (req, res) => {
            console.log(`fetching ${commandObject.url}`);
            // const postBody = req.body;
            (async () => {
                let response = await lib.execShellCommand(commandObject.command);

                // Don't send the specific command back to the user...just for security reasons
                const responseObj = {
                    action: commandObject.action,
                    response: JSON.parse(response),
                };
                res.json(responseObj);
            })(); // end async()
        });
    } else {
        console.warn(`skipping endpoint: ${commandObject.url} because not enough info was defined`);
    }
}

function buildRoutes(statusList) {
    // Build routes that map the launch commands to commands that can be launched remotely
    // console.log(commandList);
    statusList.map((cmdObj) => {
        buildRoute(cmdObj);
    });
}

buildRoutes(config.statusCommands);
