const fs = require('fs');
const path = require('path');

function getConfig() {
    const configPath = path.join(__dirname, 'config.json');
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } else {
        throw new Error('Config file not found');
    }
}

module.exports = getConfig;
