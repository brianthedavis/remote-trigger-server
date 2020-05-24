// build routes in the server to be executed

const express = require('express');
const childProcess = require('child_process');
const config = require('./config.js');

const app = express();
module.exports = app;

let inertMode = false; // if inertMode is set, no actual commands will be executed
if (config.app && config.app.inertMode) {
    inertMode = config.app.inertMode;
}
if (inertMode) {
    console.log('<<< INERT MODE :: NO COMMANDS WILL BE EXECUTED >>>');
}


/**
 * Executes a shell command and return it as a Promise.
 * https://medium.com/@ali.dev/how-to-use-promise-with-exec-in-node-js-a39c4d7bbf77
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execShellCommand(cmd) {
    return new Promise((resolve) => {
        console.debug(`Executing command: [${cmd}]`);
        childProcess.exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
            }
            console.debug(`stdout: ${stdout}\nstderr: ${stderr}`);
            resolve(stdout || stderr);
        });
    });
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
                    response = await execShellCommand(commandObject.command);
                } else {
                    console.log(`INERT MODE - skipping execution of command: ${commandObject.command}`);
                    response = 'INERT MODE - COMMAND NOT EXECUTED';
                }

                // Don't send the specific command back to the user...just for security reasons
                const responseObj = {
                    action: commandObject.action,
                    response,
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
