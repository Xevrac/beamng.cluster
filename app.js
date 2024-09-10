const express = require('express');
const fs = require('fs');
const path = require('path');
const toml = require('toml');
const smolToml = require('smol-toml');
const app = express();

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const versionData = await fs.promises.readFile(path.join(__dirname, 'public/version.json'), 'utf8');
        const version = JSON.parse(versionData).version;
        const currentYear = new Date().getFullYear();

        const config = await readConfig();

        res.render('layout', {
            title: 'BeamNG.cluster | Home',
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
            title: 'BeamNG.cluster | Servers',
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
            title: 'BeamNG.cluster | Settings',
            version: version,
            body: 'settings',
            serverPath: config.serverPath || '/servers/',
            environment: config.environment || 'prod',
            year: currentYear
        });
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/about', async (req, res) => {
    try {
        const versionData = await fs.promises.readFile(path.join(__dirname, 'public/version.json'), 'utf8');
        const version = JSON.parse(versionData).version;
        const currentYear = new Date().getFullYear();

        res.render('layout', {
            title: 'BeamNG.cluster | About',
            version: version,
            body: 'about',
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
                const serverDir = path.join(serverPath, dirent.name);
                const serverConfigPath = path.join(serverDir, 'ServerConfig.toml');
                try {
                    const serverConfig = await fs.promises.readFile(serverConfigPath, 'utf8');
                    const configData = toml.parse(serverConfig);

                    const mapPath = configData.General.Map || 'Unknown';
                    const mapPrefix = '/levels/';
                    const mapName = mapPath.startsWith(mapPrefix) ? mapPath.slice(mapPrefix.length) :
                        'Unknown';
                    const country = configData.General.Country || 'Unknown';

                    return {
                        name: configData.General.Name || 'Unknown',
                        port: configData.General.Port || 'Unknown',
                        authKey: configData.General.AuthKey || 'Unknown', // sensitive data
                        maxPlayers: configData.General.MaxPlayers || 'Unknown',
                        map: mapName,
                        country: country,
                        path: serverDir
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

// Work in progress - Currently not passing path properly on post
app.post('/api/save-servers', async (req, res) => {
    try {
        const serverData = req.body;

        console.log('serverData:', serverData);

        if (!Array.isArray(serverData)) {
            throw new Error('Expected serverData to be an array.');
        }

        await Promise.all(serverData.map(async (server) => {
            const serverConfigPath = path.join(server.path, 'ServerConfig.toml');
            console.log('Saving server config to path:', serverConfigPath);

            try {
                const existingConfig = await fs.promises.readFile(serverConfigPath, 'utf8');
                const configData = toml.parse(existingConfig);

                // Update configData with new values
                configData.General.Name = server.name;
                configData.General.Port = server.port;
                configData.General.AuthKey = server.authKey;
                configData.General.MaxPlayers = server.maxPlayers;
                configData.General.Map = `/levels/${server.map}`;
                configData.General.Country = server.country.trim();

                const updatedConfig = smolToml.stringify(configData);
                await fs.promises.writeFile(serverConfigPath, updatedConfig, 'utf8');
            } catch (err) {
                console.error(`Error updating server config for ${server.name}:`, err);
                throw new Error(`Failed to update config for ${server.name}`);
            }
        }));

        res.json({ success: true });
    } catch (err) {
        console.error('Error saving servers:', err);
        res.status(500).json({ success: false, error: err.message });
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
