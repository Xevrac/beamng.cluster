const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const toml = require('toml');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const versionData = await fs.promises.readFile(path.join(__dirname, 'public/version.json'), 'utf8');
        const version = JSON.parse(versionData).version;

        const config = await readConfig();

        res.render('layout', {
            title: 'Home',
            version: version,
            body: 'index',
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

        const config = await readConfig();

        res.render('layout', {
            title: 'Servers',
            version: version,
            body: 'servers',
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

        const config = await readConfig();

        res.render('layout', {
            title: 'Settings',
            version: version,
            body: 'settings',
            serverPath: config.serverPath || '',
        });
    } catch (err) {
        console.error('Error fetching settings:', err);
        res.status(500).send('Internal Server Error');
    }
});

function fetchServers() {
    fetch('/api/servers')
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = ''; // Clear existing data

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="5">No servers added yet.</td></tr>';
                noServersMessage.style.display = 'block';
            } else {
                noServersMessage.style.display = 'none';
                data.forEach(server => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${server.name}</td>
                        <td>${server.port}</td>
                        <td>
                            <span class="auth-key">
                                <i class="fas fa-clipboard" data-clipboard-text="${server.authKey}" aria-hidden="true"></i>
                                <span class="auth-key-text" title="${server.authKey}">Spoiler</span>
                            </span>
                        </td>
                        <td>${server.maxPlayers}</td>
                        <td>${server.map}</td>
                    `;
                    tableBody.appendChild(row);
                });

                // Initialize clipboard functionality
                document.querySelectorAll('.auth-key .fa-clipboard').forEach(icon => {
                    icon.addEventListener('click', function() {
                        const text = this.getAttribute('data-clipboard-text');
                        navigator.clipboard.writeText(text)
                            .then(() => {
                                // Change the icon to indicate success
                                this.classList.remove('fa-clipboard');
                                this.classList.add('fa-check-circle');
                                this.style.color = 'green'; // Change color to indicate success

                                // Optionally, revert back to clipboard icon after a short time
                                setTimeout(() => {
                                    this.classList.remove('fa-check-circle');
                                    this.classList.add('fa-clipboard');
                                    this.style.color = ''; // Reset color
                                }, 2000); // Revert after 2 seconds
                            })
                            .catch(err => {
                                console.error('Failed to copy text: ', err);
                            });
                    });
                });
            }
        })
        .catch(err => {
            console.error('Error fetching servers:', err);
            tableBody.innerHTML = '<tr><td colspan="5">Error fetching server data.</td></tr>';
        });
}

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
