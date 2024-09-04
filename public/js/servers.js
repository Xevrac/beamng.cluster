document.addEventListener('DOMContentLoaded', () => {
    const refreshButton = document.getElementById('refresh-servers');
    const tableBody = document.querySelector('#server-table tbody');
    const noServersMessage = document.getElementById('no-servers-message');

    function stripImBBColors(text) {
        return text.replace(/\^[a-zA-Z0-9]/g, '').trim();
    }

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
                            <td>${stripImBBColors(server.name)}</td>
                            <td>${server.port}</td>
                            <td>
                                <span class="auth-key">
                                    <i class="fa fa-clipboard" aria-hidden="true"></i>
                                    <span class="auth-key-text" title="${server.authKey}">Spoiler</span>
                                </span>
                            </td>
                            <td>${server.maxPlayers}</td>
                            <td>${server.map}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching servers:', err);
                tableBody.innerHTML = '<tr><td colspan="5">Error fetching server data.</td></tr>';
            });
    }

    function stripMapPath(mapPath) {
        const match = mapPath.match(/\/levels\/([^\/]+)\//);
        return match ? match[1] : 'Unknown Map';
    }

    function copyToClipboard(authKey, icon) {
        navigator.clipboard.writeText(authKey).then(() => {
            icon.classList.replace('fa-clipboard', 'fa-check-circle');
            icon.style.color = 'green';

            setTimeout(() => {
                icon.classList.replace('fa-check-circle', 'fa-clipboard');
                icon.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }

    tableBody.addEventListener('click', (event) => {
        const authKeyElement = event.target.closest('.auth-key');
        if (authKeyElement) {
            const authKey = authKeyElement.querySelector('.auth-key-text').getAttribute('title');
            const icon = authKeyElement.querySelector('.fa-clipboard');
            copyToClipboard(authKey, icon);
        }
    });

    if (refreshButton) {
        refreshButton.addEventListener('click', fetchServers);
    }

    fetchServers();
});
