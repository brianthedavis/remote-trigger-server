// Read the config.d path and store it in a config object
const fs = require('fs');
const path = require('path');

function loadConfig() {
    // Allow overrides from the environment
    let appDir;
    if (process.env.NODE_APPDIR) {
        appDir = process.env.NODE_APPDIR;
    } else if (require.main === undefined) {
        appDir = process.cwd();
    } else {
        appDir = path.dirname(require.main.filename);
    }
    const configDir = `${appDir}/config.d`; // Load all .json files in this path
    let config = {};

    console.debug(`Loading config files from ${configDir}`);
    fs.readdirSync(configDir).forEach((file) => {
        if (file.toLowerCase().endsWith('.json')) {
            console.debug(`   > Loading config file: ${file}`);
            const rawData = fs.readFileSync(path.join(configDir, file), { encoding: 'utf8' });
            let configObj;
            try {
                // Parse the JSON
                configObj = JSON.parse(rawData);
                config = { ...config, ...configObj }; // concatenate the configuration
            } catch (err) {
                console.error(`There has been an error parsing the JSON config file: ${file}`);
                console.error(err);
                const stack = err.stack.replace(/^[^(]+?[\n$]/gm, '')
                    .replace(/^\s+at\s+/gm, '')
                    .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@')
                    .split('\n');
                console.error(stack);
                throw (err);
            }
        }
    });
    console.debug('Loaded the following config parameters');
    console.dir(config);
    return config;
}

module.exports = loadConfig();
