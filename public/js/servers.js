document.addEventListener('DOMContentLoaded', () => {

    // Display different content conditionally per view
    const isHomePage = window.location.pathname === '/';

    const refreshButton = document.getElementById('refresh-servers');
    const editButton = document.getElementById('edit-servers');
    const saveButton = document.getElementById('save-servers');
    const tableBody = document.querySelector('#server-table tbody');
    const noServersMessage = document.getElementById('no-servers-message');
    let isEditMode = false;

    const validCountries = [
        'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ',
        'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR',
        'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL',
        'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO',
        'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FM', 'FO', 'FR', 'GA', 'GB',
        'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GT', 'GU', 'GW',
        'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IR',
        'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW',
        'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC',
        'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT',
        'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP',
        'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PT',
        'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH',
        'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC',
        'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TZ', 'UA',
        'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'YE',
        'YT', 'ZA', 'ZM', 'ZW'
    ];

    function createInputCell(value, type = 'text') {
        return `<td><input type="${type}" value="${value}" /></td>`;
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;
        const rows = tableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (isEditMode) {
                // Convert cells to input fields
                cells.forEach(cell => {
                    const text = cell.innerText || cell.textContent;
                    cell.innerHTML = createInputCell(text);
                });
            } else {
                // Convert input fields back to text
                cells.forEach(cell => {
                    const input = cell.querySelector('input');
                    if (input) {
                        cell.innerHTML = input.value;
                    }
                });
            }
        });

        saveButton.style.display = isEditMode ? 'inline-block' : 'none';
    }

    function saveServers() {
        const rows = tableBody.querySelectorAll('tr');
        const serverData = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && !cells[0].querySelector('input')) {
                // Skip rows that are not editable
                return;
            }

            const server = {
                name: cells[1].querySelector('input')?.value || cells[1].innerText,
                port: cells[2].querySelector('input')?.value || cells[2].innerText,
                authKey: cells[3].querySelector('input')?.value || cells[3].innerText,
                maxPlayers: cells[4].querySelector('input')?.value || cells[4].innerText,
                map: cells[5].querySelector('input')?.value || cells[5].innerText,
                country: cells[0].querySelector('input')?.value || cells[0].innerText
            };

            serverData.push(server);
        });

        console.log('Sending serverData:', serverData);

        fetch('/api/save-servers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Servers updated successfully.');
                } else {
                    alert('Error updating servers.');
                }
            })
            .catch(err => {
                console.error('Error saving servers:', err);
                alert('Error saving servers.');
            });
    }

    function stripImBBColors(text) {
        return text.replace(/\^[a-zA-Z0-9]/g, '').trim();
    }

    function fadeOutRows(tableBody, duration) {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.transition = `opacity ${duration}ms`;
            row.style.opacity = 0;
        });
    }

    function fadeInRows(tableBody, duration) {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            row.style.transition = `opacity ${duration}ms`;
            row.style.opacity = 1;
        });
    }

    function fetchServers() {
        const serverTable = document.getElementById('server-table');
        const tableBody = serverTable ? serverTable.querySelector('tbody') : null;
        const noServersMessage = document.getElementById('no-servers-message');

        if (tableBody) {
            fadeOutRows(tableBody, 400);

            setTimeout(() => {
                fetch('/api/servers')
                    .then(response => response.json())
                    .then(data => {
                        tableBody.innerHTML = ''; // Clear existing data

                        if (data.length === 0) {
                            tableBody.innerHTML = '<tr id="no-servers-message"><td colspan="6">No servers added yet.</td></tr>';
                            if (noServersMessage) {
                                noServersMessage.style.display = 'block';
                            }
                        } else {
                            if (noServersMessage) {
                                noServersMessage.style.display = 'none';
                            }
                            data.forEach(server => {
                                let authKeyCell = '';

                                if (!isHomePage) {
                                    authKeyCell = `
                                <td>
                                    <span class="auth-key">
                                        <i class="fa fa-clipboard" aria-hidden="true"></i>
                                        <span class="auth-key-text" title="${server.authKey}">Spoiler</span>
                                    </span>
                                </td>`;
                                }

                                const countryCode = server.country && validCountries.includes(server.country.toUpperCase())
                                    ? server.country.toUpperCase()
                                    : 'null';

                                const row = document.createElement('tr');
                                row.innerHTML = `
                                <td class="flag-icon">
                                    <img src="/images/flags/${countryCode}.png" alt="${server.country || 'Null'} flag">
                                </td>
                                <td>${stripImBBColors(server.name)}</td>
                                <td>${server.port}</td>
                                ${authKeyCell}
                                <td>${server.maxPlayers}</td>
                                <td>${server.map}</td>
                            `;
                                tableBody.appendChild(row);
                            });
                        }
                    })
                    .catch(err => {
                        console.error('Error fetching servers:', err);
                        tableBody.innerHTML = '<tr><td colspan="6">Error loading servers.</td></tr>';
                    })
                    .finally(() => {
                        fadeInRows(tableBody, 400);
                    });
            }, 400);
        }
    }

    if (refreshButton) {
        refreshButton.addEventListener('click', fetchServers);
    }

    if (editButton) {
        editButton.addEventListener('click', toggleEditMode);
    }

    if (saveButton) {
        saveButton.addEventListener('click', saveServers);
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
