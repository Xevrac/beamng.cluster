const express = require('express');
const fs = require('fs');
const path = require('path');
const toml = require('toml');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const versionData = await fs.promises.readFile(path.join(__dirname, 'public/version.json'), 'utf8');
        const version = JSON.parse(versionData).version;
        const currentYear = new Date().getFullYear();

        const config = await readConfig();

        res.render('layout', {
            title: 'Home',
            version: version,
            body: 'index',
            year: currentYear
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/servers', async (req, res) => {
    try {
        const versionData = await fs.promises.readFile(path.join(__dirname, 'public/version.json'), 'utf8');
        const version = JSON.parse(versionData).version;
        const currentYear = new Date().getFullYear();

        const config = await readConfig();

        res.render('layout', {
            title: 'Servers',
            version: version,
            body: 'servers',
            year: currentYear
        });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/settings', async (req, res) => {
    try {
        const versionData = await fs.promises.readFile(path.join(__dirname, 'public/version.json'), 'utf8');
        const version = JSON.parse(versionData).version;
        const currentYear = new Date().getFullYear();

        const config = await readConfig();

        res.render('layout', {
            title: 'Settings',
            version: version,
            body: 'settings',
            serverPath: config.serverPath || '',
            year: currentYear
        });
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/servers', async (req, res) => {
    try {
        const config = await readConfig();
        const serverPath = path.join(__dirname, config.serverPath);

        const servers = await fs.promises.readdir(serverPath, { withFileTypes: true });

        const serverData = await Promise.all(servers
            .filter(dirent => dirent.isDirectory())
            .map(async (dirent) => {
                const serverConfigPath = path.join(serverPath, dirent.name, 'ServerConfig.toml');
                try {
                    const serverConfig = await fs.promises.readFile(serverConfigPath, 'utf8');
                    const configData = toml.parse(serverConfig);

                    const mapPath = configData.General.Map || 'Unknown';
                    const mapNameMatch = mapPath.match(/^\/levels\/([^\/]+)\//);
                    const mapName = mapNameMatch ? mapNameMatch[1] : 'Unknown';

                    return {
                        name: configData.General.Name || 'Unknown',
                        port: configData.General.Port || 'Unknown',
                        authKey: configData.General.AuthKey || 'Unknown', // sensitive data
                        maxPlayers: configData.General.MaxPlayers || 'Unknown',
                        map: mapName
                    };
                } catch (err) {
                    console.error(`Error reading server config for ${dirent.name}:`, err);
                    return null; 
                }
            }));

        const filteredServers = serverData.filter(server => server !== null);

        res.json(filteredServers);
    } catch (err) {
        console.error('Error fetching servers:', err);
        res.status(500).json({ error: 'Error fetching servers' });
    }
});

app.post('/update-settings', async (req, res) => {
    try {
        const configPath = path.join(__dirname, 'config.json');
        const config = JSON.parse(await fs.promises.readFile(configPath, 'utf8'));

        console.log('Form data:', req.body);

        config.serverPath = req.body.serverPath || config.serverPath;

        await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');

        res.redirect('/settings');
    } catch (err) {
        console.error('Error updating settings:', err);
        res.status(500).send('Internal Server Error');
    }
});

const readConfig = () => {
    return fs.promises.readFile(path.join(__dirname, 'config.json'), 'utf8')
        .then(data => JSON.parse(data))
        .catch(err => {
            console.error('Error reading config file:', err);
            throw err;
        });
};

app.listen(8000, () => {
    console.log('Starting development server..');
    console.log('Server is running on http://localhost:8000');
});
