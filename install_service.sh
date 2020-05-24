#!/bin/bash

set -ex
if [[ $EUID -ne 0 ]]; then echo "This script must be run as root" 1>&2; exit 1; fi
DIR="$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")" # Resolve the link...
STANDARD_USER=pi
SERVICE=remote_trigger.service

# Run an npm install as the standard user just to prevent permissions from getting jacked up....
sudo -u ${STANDARD_USER} "cd ${DIR} && npm install" 



cp "${DIR}/${SERVICE}" /etc/systemd/system
systemctl daemon-reload
systemctl enable ${SERVICE}
systemctl start ${SERVICE}
