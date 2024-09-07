document.addEventListener('DOMContentLoaded', () => {

    // Display different content conditionally per view
    const isHomePage = window.location.pathname === '/';

    const refreshButton = document.getElementById('refresh-servers');
    const tableBody = document.querySelector('#server-table tbody');
    const noServersMessage = document.getElementById('no-servers-message');

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
                        let authKeyCell = ''; // Default to empty if on the homepage

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
                            ? server.country.toLowerCase()
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
                tableBody.innerHTML = '<tr><td colspan="6">Error fetching server data.</td></tr>';
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
