
const childProcess = require('child_process');

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


exports.execShellCommand = execShellCommand;