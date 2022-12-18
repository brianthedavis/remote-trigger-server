# remote-trigger-server

This is a super-simple node.js app that relays HTTP requests into commands executed on the host.  
It's designed to be configurable, allowing invocation of specific command lines via a simple POST command instead of more complex remote SSH commands.

Obviously, there are massive security ramifications to this, so it's really only intended for internal, local, and trusted deployments; or you can wrap this with
two way SSL or fancier authentication mechanisms to limit access.

Given the open nature of its implementation, the commands that are executable are limited to those specified within `config.d/launchCommands.json` or, more specifically, the `launchCommands`
configuration key (that's loaded by concatenating all the files within `config.d`).  No parameters are allowed to be passed in.

## Configuration

Within `config.d/launchCommands.json` under the `launchCommands` key, each entry maps a url such as POST to `http://localhost:3000/cmd/start_snapclient` to a command on the host such as `systemctl start snapclient`.

```json
    "launchCommands":
    [
        {
            "url": "start_snapclient",
            "command": "systemctl start snapclient",
            "action": "Starting the snapclient process",
            "desc": ""
        },
        {
            "url": "stop_snapclient",
            "command": "systemctl stop snapclient",
            "action": "Stopping the snapclient process",
            "desc": ""
        },
```

The commands are run with the same user as the remote-trigger-server, so if you want to run priveleged commands, you'll need to run as root.

There are also status commands that allow you to return the response of a command line such as a GET to `http://localhost:3000/status/is_snapclient_running`, and the STDOUT of the command executed will be 
returned via the HTTP response.

```json
    "statusCommands":[
        {
            "url": "is_snapclient_running",
            "command": "/home/pi/scripts/automation/is_snapclient_running.sh",
            "action": "Query whether Snapclient is running or not",
            "desc": ""
        }
    ],
```


# Running
```
npm install
node app

```

# Installing
The `install_service.sh` script will copy the `remote_trigger.service file to `/etc/systemd/system directory on a linux host and enable this application to run as a daemon. 
You can certainly dockerize it, however your commands will be limited to those within the container itself.

The primary use case I used this for (somewhat obviously based on the files in the `config.d`) is to enable/disable snapclient on a raspberry pi remotely to stream music from a central snapserver instance.  

# Testing
curl -X POST localhost:3000/cmd/test && echo ""


# Linting
npm run lint

# Monitor the code to restart on code change
sudo npm install nodemon -g

nodemon app.js


# Initial config to install eslint locally
https://eslint.org/docs/user-guide/getting-started
```
npm install eslint --save-dev
npx eslint --init
```
