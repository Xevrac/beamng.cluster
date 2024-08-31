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

                    // Add event listeners for clipboard copy
                    document.querySelectorAll('.auth-key').forEach(element => {
                        const authKey = element.querySelector('.auth-key-text').getAttribute('title');
                        const icon = element.querySelector('.fa-clipboard');

                        const copyToClipboard = () => {
                            navigator.clipboard.writeText(authKey).then(() => {
                                // Change icon to indicate success
                                icon.classList.replace('fa-clipboard', 'fa-check-circle');
                                icon.style.color = 'green';

                                setTimeout(() => {
                                    // Reset icon after a short delay
                                    icon.classList.replace('fa-check-circle', 'fa-clipboard');
                                    icon.style.color = '';
                                }, 2000);
                            }).catch(err => {
                                console.error('Failed to copy text: ', err);
                            });
                        };

                        // Add event listener to both the icon and the text
                        element.addEventListener('click', copyToClipboard);
                        element.querySelector('.auth-key-text').addEventListener('click', copyToClipboard);
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching servers:', err);
                tableBody.innerHTML = '<tr><td colspan="5">Error fetching server data.</td></tr>';
            });
    }

    function stripMapPath(mapPath) {
        // Extract just the central part of the map path
        const match = mapPath.match(/\/levels\/([^\/]+)\//);
        return match ? match[1] : 'Unknown Map';
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', fetchServers);
    }

    // Initial fetch
    fetchServers();
});
