const fs = require('fs');
const path = require('path');

function getConfig() {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
        console.error('Config file not found, using default configuration.');
        return {}; // Return empty object or default values here if config.json missing
    }
}

module.exports = getConfig;
