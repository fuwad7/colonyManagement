if (typeof angular !== 'undefined') {
    angular.module('colonyManagementApp', []);
}

let currentUser = null;
let currentBuildingId = null;
let selectedFlatId = null;
let dashboardIntervalId = null;
let layoutClosedByUser = false;

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

async function checkAuth() {
    try {
        const res = await fetch('/api/auth/me');

        if (res.ok) {
            currentUser = await res.json();
            showAppView();
        } else {
            showAuthView();
        }
    } catch (e) {
        showAuthView();
    }
}

function showAuthView() {
    if (dashboardIntervalId) {
        clearInterval(dashboardIntervalId);
        dashboardIntervalId = null;
    }

    const authError = document.getElementById('authError');
    if (authError) {
        authError.style.display = 'none';
        authError.textContent = '';
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();

    const registerForm = document.getElementById('registerForm');
    if (registerForm) registerForm.reset();

    document.getElementById('authView').style.display = 'flex';
    document.getElementById('appView').style.display = 'none';

    // Route logic for auth views
    const path = window.location.pathname;
    if (path === '/register') {
        switchAuthTab('register');
        history.replaceState({ section: 'register' }, '', '/register');
    } else {
        switchAuthTab('login');
        history.replaceState({ section: 'login' }, '', '/login');
    }
}

function showAppView() {
    document.getElementById('authView').style.display = 'none';
    document.getElementById('appView').style.display = 'flex';

    document.getElementById('displayUsername').textContent =
        currentUser.username;

    const displayRole = document.getElementById('displayRole');
    if (displayRole) {
        displayRole.textContent = currentUser.role || 'RESIDENT';
    }

    const isAdmin =
        currentUser && currentUser.role === 'ADMIN';
    const isResident =
        currentUser && currentUser.role === 'RESIDENT';

    document.getElementById('nav-dashboard').style.display = isResident ? 'none' : 'flex';
    document.getElementById('nav-colonies').style.display = 'flex';
    document.getElementById('nav-buildings').style.display = 'flex';
    document.getElementById('nav-assets').style.display = 'flex';
    document.getElementById('nav-persons').style.display = isResident ? 'none' : 'flex';

    document.getElementById('nav-users').style.display =
        isAdmin ? 'flex' : 'none';

    // Start on the requested route or default
    const currentPath = window.location.pathname;
    let defaultPath = isResident ? '/buildings' : '/dashboard';
    
    // Redirect if logged in user is on /login or /register
    if (currentPath === '/login' || currentPath === '/register' || currentPath === '/') {
        navigateTo(defaultPath, true);
    } else if (isResident && (currentPath === '/' || currentPath === '/dashboard' || currentPath === '/persons' || currentPath === '/users')) {
        navigateTo('/buildings', true);
    } else {
        navigateTo(currentPath || defaultPath, true);
    }
}

function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegBtn = document.getElementById('tabRegBtn');

    const authError = document.getElementById('authError');
    if (authError) {
        authError.style.display = 'none';
        authError.textContent = '';
    }

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';

        tabLoginBtn.classList.add('active');
        tabRegBtn.classList.remove('active');

        if (window.location.pathname !== '/login') {
            history.pushState({ section: 'login' }, '', '/login');
        }
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';

        tabLoginBtn.classList.remove('active');
        tabRegBtn.classList.add('active');

        if (window.location.pathname !== '/register') {
            history.pushState({ section: 'register' }, '', '/register');
        }
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const username =
        document.getElementById('loginUsername').value;

    const password =
        document.getElementById('loginPassword').value;

    const errorEl =
        document.getElementById('authError');

    errorEl.style.display = 'none';

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (res.ok) {
            currentUser = await res.json();
            if (window.i18n && window.i18n.setLanguage) {
                await window.i18n.setLanguage('en');
            } else if (typeof window.setLanguage === 'function') {
                await window.setLanguage('en');
            } else {
                localStorage.setItem('appLang', 'en');
            }
            showAppView();
        } else {
            const msg = await res.text();

            errorEl.textContent =
                msg || 'Login failed';

            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.textContent =
            'Server connection error';

        errorEl.style.display = 'block';
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username =
        document.getElementById('regUsername').value;

    const email =
        document.getElementById('regEmail').value;

    const phone =
        document.getElementById('regPhone').value;

    const password =
        document.getElementById('regPassword').value;

    const errorEl =
        document.getElementById('authError');

    errorEl.style.display = 'none';

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                phone,
                password
            })
        });

        if (res.ok) {
            alert(
                'Registration successful! Please login.'
            );

            switchAuthTab('login');

            document.getElementById(
                'loginUsername'
            ).value = username;

            document.getElementById(
                'loginPassword'
            ).value = password;
        } else {
            const msg = await res.text();

            errorEl.textContent =
                msg || 'Registration failed';

            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.textContent =
            'Server connection error';

        errorEl.style.display = 'block';
    }
}

async function handleLogout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST'
        });
    } catch (e) {
        console.error(
            'Logout request failed:',
            e
        );
    }

    currentUser = null;

    if (dashboardIntervalId) {
        clearInterval(dashboardIntervalId);
        dashboardIntervalId = null;
    }

    showAuthView();
}

function switchNav(section) {
    const isAdmin =
        currentUser &&
        currentUser.role === 'ADMIN';
    const isResident =
        currentUser &&
        currentUser.role === 'RESIDENT';

    if (!isAdmin && section === 'users') {
        section = 'dashboard';
    }

    if (isResident && (section === 'dashboard' || section === 'persons' || section === 'users')) {
        section = 'buildings';
    }

    if (dashboardIntervalId) {
        clearInterval(dashboardIntervalId);
        dashboardIntervalId = null;
    }

    const sections = [
        'dashboard',
        'colonies',
        'buildings',
        'users',
        'assets',
        'persons'
    ];

    sections.forEach(s => {
        const secEl =
            document.getElementById(`sec-${s}`);

        const navEl =
            document.getElementById(`nav-${s}`);

        if (secEl) {
            secEl.style.display =
                s === section
                    ? 'block'
                    : 'none';
        }

        if (navEl) {
            if (s === section) {
                navEl.classList.add('active');
            } else {
                navEl.classList.remove('active');
            }
        }
    });

    if (section === 'dashboard') {
        loadDashboardStats();

        dashboardIntervalId =
            setInterval(
                loadDashboardStats,
                5000
            );
    }

    if (section === 'colonies') {
        loadColoniesSection();
    }

    if (section === 'buildings') {
        loadBuildingsSection();
    }

    if (
        section === 'users' &&
        isAdmin
    ) {
        loadUserManagement();
    }

    if (section === 'assets') {
        loadAssetSection();
    }

    if (section === 'persons') {
        loadPersonsList();
    }
}

function navigateTo(
    pathName,
    replaceHistory = false
) {
    let section =
        (pathName || '')
            .replace(/^\/+/, '');

    if (
        !section ||
        section === 'dashboard'
    ) {
        section = 'dashboard';
    }

    const isAdmin =
        currentUser &&
        currentUser.role === 'ADMIN';
    const isResident =
        currentUser &&
        currentUser.role === 'RESIDENT';

    if (!isAdmin && section === 'users') {
        section = 'dashboard';
    }

    if (isResident && (section === 'dashboard' || section === 'persons' || section === 'users')) {
        section = 'buildings';
    }

    // Stop old dashboard polling
    if (dashboardIntervalId) {
        clearInterval(
            dashboardIntervalId
        );

        dashboardIntervalId = null;
    }

    const finalPath =
        `/${section}`;

    if (replaceHistory) {
        history.replaceState(
            { section },
            '',
            finalPath
        );
    } else {
        history.pushState(
            { section },
            '',
            finalPath
        );
    }

    switchNav(section);
}

document.addEventListener(
    'click',
    (event) => {
        const targetLink =
            event.target.closest(
                'a[href^="/"]'
            );

        if (!targetLink) {
            return;
        }

        if (
            targetLink.target === '_blank'
        ) {
            return;
        }

        if (
            targetLink.hasAttribute(
                'download'
            )
        ) {
            return;
        }

        event.preventDefault();

        const path =
            targetLink.getAttribute(
                'href'
            );

        if (path) {
            navigateTo(path);
        }
    }
);

document.addEventListener(
    'DOMContentLoaded',
    () => {

        const path =
            window.location.pathname;

        if (currentUser) {
            const isResident = currentUser.role === 'RESIDENT';
            const defaultPath = isResident ? '/buildings' : '/dashboard';
            
            if (isResident && (path === '/' || path === '/dashboard' || path === '/persons' || path === '/users')) {
                navigateTo('/buildings', true);
            } else {
                navigateTo(path || defaultPath, true);
            }
        }
    }
);

window.addEventListener(
    'popstate',
    (event) => {
        if (!currentUser) {
            const path = window.location.pathname;
            if (path === '/register') {
                switchAuthTab('register');
            } else {
                switchAuthTab('login');
            }
            return;
        }

        if (
            event.state &&
            event.state.section
        ) {
            if (event.state.section === 'login' || event.state.section === 'register') {
                const defaultPath = currentUser.role === 'RESIDENT' ? '/buildings' : '/dashboard';
                navigateTo(defaultPath, true);
            } else {
                switchNav(
                    event.state.section
                );
            }
        } else {
            navigateTo(
                window.location.pathname,
                true
            );
        }
    }
);

async function loadDashboardStats() {
    try {
        const res =
            await fetch(
                '/api/dashboard/stats'
            );

        if (res.ok) {
            const data =
                await res.json();

            const statColoniesEl = document.getElementById('statColonies');
            if (statColoniesEl) {
                statColoniesEl.textContent = data.colonyCount || 0;
            }

            document.getElementById(
                'statBuildings'
            ).textContent =
                data.buildingCount || 0;

            document.getElementById(
                'statFlats'
            ).textContent =
                data.flatCount || 0;

            document.getElementById(
                'statResidents'
            ).textContent =
                data.residentCount || 0;

            document.getElementById(
                'statOwners'
            ).textContent =
                data.ownerCount || 0;

            document.getElementById(
                'statTenants'
            ).textContent =
                data.tenantCount || 0;

            document.getElementById(
                'statSubTenants'
            ).textContent =
                data.subTenantCount || 0;

            document.getElementById(
                'statAssets'
            ).textContent =
                data.assetCount || 0;

            document.getElementById(
                'statUsers'
            ).textContent =
                data.userCount || 0;
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadBuildingsSection() {
    const isAdmin =
        currentUser &&
        currentUser.role === 'ADMIN';

    const addBuildingPanel =
        document.getElementById(
            'addBuildingPanel'
        );

    if (addBuildingPanel) {
        addBuildingPanel.style.display =
            isAdmin ? 'block' : 'none';
    }

    try {
        const colRes = await fetch('/api/colonies');
        if (colRes.ok) {
            const colonies = await colRes.json();
            const sel = document.getElementById('bldgColonySelect');
            if (sel) {
                const currentVal = sel.value;
                sel.innerHTML = '<option value="">-- Select Colony --</option>';
                colonies.forEach(c => {
                    const opt = document.createElement('option');
                    opt.value = c.id;
                    opt.textContent = c.name;
                    sel.appendChild(opt);
                });
                if (currentVal) sel.value = currentVal;
            }
        }
    } catch (e) {
        console.error('Error loading colony dropdown:', e);
    }

    try {
        const res =
            await fetch('/api/buildings');

        const buildings =
            await res.json();

        const container =
            document.getElementById(
                'buildingListGrid'
            );

        container.innerHTML = '';

        if (
            buildings.length === 0
        ) {
            container.innerHTML =
                '<p style="color:var(--text-secondary)">No buildings created yet.</p>';

            document.getElementById(
                'floorLayoutContainer'
            ).innerHTML =
                '<p style="color:var(--text-secondary)">No building selected.</p>';

            return;
        }

        buildings.forEach(b => {
            const card =
                document.createElement(
                    'div'
                );

            card.className =
                'building-card';

            if (
                currentBuildingId ===
                b.id
            ) {
                card.style.borderColor =
                    'var(--accent-blue)';
            }

            const adminButtonsHtml =
                isAdmin
                    ? `
                        <div style="display:flex; gap:6px">
                            <button
                                onclick="event.stopPropagation(); openEditBuildingModal(${b.id}, '${b.name}', ${b.floorCount}, ${b.unitsPerFloor})"
                                style="background:var(--bg-input); color:var(--accent-blue); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer" title="Edit Building">
                                ✏️ Edit
                            </button>

                            <button
                                onclick="event.stopPropagation(); deleteBuilding(${b.id})"
                                style="background:rgba(244,63,94,0.2); color:var(--accent-rose); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer" title="Delete Building">
                                🗑️ Delete
                            </button>
                        </div>
                    `
                    : '';

            const colonyName = b.colony ? b.colony.name : 'Unassigned Colony';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start">

                    <h3 style="color:var(--accent-blue); font-size:1.1rem; margin-bottom:8px">
                        ${b.name}
                    </h3>

                    ${adminButtonsHtml}
                </div>

                <p style="color:var(--accent-emerald); font-size:0.8rem; margin-bottom:4px; font-weight:600">
                    🏘️ ${colonyName}
                </p>

                <p style="color:var(--text-secondary); font-size:0.85rem">
                    Floors:
                    <b>${b.floorCount}</b>
                    |
                    Units/Floor:
                    <b>${b.unitsPerFloor}</b>
                </p>

                <p style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px">
                    Total Flats:
                    ${b.floorCount * b.unitsPerFloor}
                </p>
            `;

            card.onclick = () => selectBuilding(b);
            container.appendChild(card);
        });

        if (!layoutClosedByUser) {
            const found =
                buildings.find(
                    b =>
                        b.id ===
                        currentBuildingId
                );

            if (found) {
                renderFloorLayout(found);
            } else if (
                buildings.length > 0
            ) {
                selectBuilding(
                    buildings[0]
                );
            }
        }
    } catch (e) {
        console.error(e);
    }
}

async function handleCreateBuilding(e) {
    e.preventDefault();

    if (
        !currentUser ||
        currentUser.role !== 'ADMIN'
    ) {
        alert(
            'Only admin can add buildings'
        );
        return;
    }

    const colonyId = document.getElementById('bldgColonySelect').value;
    const name =
        document.getElementById(
            'bldgName'
        ).value;

    const floorCount =
        parseInt(
            document.getElementById(
                'bldgFloors'
            ).value
        );

    const unitsPerFloor =
        parseInt(
            document.getElementById(
                'bldgUnits'
            ).value
        );

    try {
        const res =
            await fetch(
                '/api/buildings',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        floorCount,
                        unitsPerFloor,
                        colony: colonyId ? { id: parseInt(colonyId) } : null
                    })
                }
            );

        if (res.ok) {
            const newBldg =
                await res.json();

            document.getElementById(
                'createBuildingForm'
            ).reset();

            currentBuildingId =
                newBldg.id;

            loadBuildingsSection();
            loadDashboardStats();
        } else {
            const msg =
                await res.text();

            alert(
                'Failed to create building: ' +
                (msg ||
                    res.statusText)
            );
        }
    } catch (err) {
        alert(
            'Failed to create building'
        );
    }
}

function openEditBuildingModal(
    id,
    name,
    floorCount,
    unitsPerFloor
) {
    document.getElementById(
        'editBuildingId'
    ).value = id;

    document.getElementById(
        'editBuildingName'
    ).value = name;

    document.getElementById(
        'editBuildingFloors'
    ).value = floorCount;

    document.getElementById(
        'editBuildingUnits'
    ).value = unitsPerFloor;

    document.getElementById(
        'editBuildingModal'
    ).classList.add('show');
}

function closeEditBuildingModal() {
    document.getElementById(
        'editBuildingModal'
    ).classList.remove('show');
}

async function handleSaveEditedBuilding(e) {
    e.preventDefault();

    const id =
        document.getElementById(
            'editBuildingId'
        ).value;

    const name =
        document.getElementById(
            'editBuildingName'
        ).value;

    const floorCount =
        parseInt(
            document.getElementById(
                'editBuildingFloors'
            ).value
        );

    const unitsPerFloor =
        parseInt(
            document.getElementById(
                'editBuildingUnits'
            ).value
        );

    try {
        const res =
            await fetch(
                `/api/buildings/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        floorCount,
                        unitsPerFloor
                    })
                }
            );

        if (res.ok) {
            closeEditBuildingModal();
            loadBuildingsSection();
            loadDashboardStats();
        } else {
            alert(
                'Failed to update building'
            );
        }
    } catch (err) {
        alert(
            'Error updating building'
        );
    }
}

async function deleteBuilding(id) {
    if (
        !confirm(
            'You want to delete this building and all its flats?'
        )
    ) {
        return;
    }

    try {
        const res =
            await fetch(
                `/api/buildings/${id}`,
                {
                    method: 'DELETE'
                }
            );

        if (res.ok) {
            if (
                currentBuildingId === id
            ) {
                currentBuildingId = null;
            }

            loadBuildingsSection();
            loadDashboardStats();
        } else {
            alert('Failed to delete building');
        }
    } catch (e) {
        alert('Error deleting building');
    }
}

async function selectBuilding(building) {
    currentBuildingId = building.id;

    layoutClosedByUser = false;

    loadBuildingsSection();
    renderFloorLayout(building);
}

function formatNumber(n) {
    if (window.i18n && window.i18n.getCurrentLang() === 'bn') {
        const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return n.toString().split('').map(d => bnDigits[parseInt(d)] || d).join('');
    }
    return n;
}

function formatFloorTitle(floorNum) {
    const isBn = window.i18n && window.i18n.getCurrentLang() === 'bn';
    if (isBn) {
        const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        const numStr = floorNum.toString().split('').map(d => bnDigits[parseInt(d)]).join('');
        let suffix = 'ম';
        const lastDigit = floorNum % 10;
        const lastTwo = floorNum % 100;
        if (lastTwo >= 11 && lastTwo <= 19) {
            suffix = 'তম';
        } else if (lastDigit === 1) {
            suffix = 'ম';
        } else if (lastDigit === 2 || lastDigit === 3) {
            suffix = 'য়';
        } else if (lastDigit === 4) {
            suffix = 'র্থ';
        } else if (lastDigit === 6) {
            suffix = 'ষ্ঠ';
        } else {
            suffix = 'ম';
        }
        return `${numStr}${suffix} তলা`;
    } else {
        const s = ["th", "st", "nd", "rd"];
        const v = floorNum % 100;
        const ord = floorNum + (s[(v - 20) % 10] || s[v] || s[0]);
        return `${ord} Floor`;
    }
}

async function renderFloorLayout(building) {
    const isAdmin =
        currentUser &&
        currentUser.role === 'ADMIN';

    const layoutTitlePrefix = window.i18n ? window.i18n.t('FLOOR_LAYOUT_OCCUPANCY') : 'Floor Layout & Resident Occupancy:';
    document.getElementById(
        'selectedBuildingTitle'
    ).textContent =
        `${layoutTitlePrefix} ${building.name}`;

    const closeBtn =
        document.getElementById(
            'closeFloorLayoutBtn'
        );

    if (closeBtn) {
        closeBtn.style.display =
            'block';
    }

    const floorContainer =
        document.getElementById(
            'floorLayoutContainer'
        );

    floorContainer.innerHTML =
        `<p style="color:var(--text-secondary)">${window.i18n ? window.i18n.t('LOADING_FLOOR_LAYOUT') : 'Loading floor layout...'}</p>`;

    try {
        const [
            flatsRes,
            occupanciesRes
        ] = await Promise.all([
            fetch('/api/flats'),
            fetch('/api/occupancies')
        ]);

        const flats =
            await flatsRes.json();

        const occupancies =
            await occupanciesRes.json();

        const buildingFlats =
            flats.filter(
                f =>
                    f.building &&
                    f.building.id ===
                    building.id
            );

        const floorsMap = {};

        for (
            let i = 1;
            i <= building.floorCount;
            i++
        ) {
            floorsMap[i] = [];
        }

        buildingFlats.forEach(f => {
            if (
                !floorsMap[
                f.floorNumber
                ]
            ) {
                floorsMap[
                    f.floorNumber
                ] = [];
            }

            floorsMap[
                f.floorNumber
            ].push(f);
        });

        floorContainer.innerHTML =
            '';

        for (
            let floorNum =
                building.floorCount;
            floorNum >= 1;
            floorNum--
        ) {
            const floorFlats =
                floorsMap[floorNum] ||
                [];

            const floorRow =
                document.createElement(
                    'div'
                );

            floorRow.className =
                'floor-row';

            let flatsHtml = '';

            floorFlats.forEach(
                flat => {
                    const occ =
                        occupancies.find(
                            o =>
                                o.flat &&
                                o.flat.id ===
                                flat.id
                        );

                    const vacantTxt = window.i18n ? window.i18n.t('BADGE_VACANT') : 'VACANT';
                    const noOccTxt = window.i18n ? window.i18n.t('NO_OCCUPANT') : 'No Occupant assigned';
                    let occBadge =
                        `<span class="occupant-badge badge-vacant">${vacantTxt}</span>`;

                    let occDetails =
                        `<em>${noOccTxt}</em>`;

                    if (occ) {
                        const resident =
                            occ.person;

                        const occType =
                            occ.occupancyType ||
                            occ.OccupancyType ||
                            'OCCUPIED';

                        let badgeClass =
                            'badge-owner';

                        if (
                            occType ===
                            'TENANT'
                        ) {
                            badgeClass =
                                'badge-tenant';
                        }

                        if (
                            occType ===
                            'SUB_TENANT'
                        ) {
                            badgeClass =
                                'badge-subtenant';
                        }

                        const translatedBadge = window.i18n ? window.i18n.t(occType) : occType;
                        occBadge =
                            `<span class="occupant-badge ${badgeClass}">${translatedBadge}</span>`;

                        let rentedFromStr =
                            '';

                        if (
                            occ.rentedFrom
                        ) {
                            const rentedFromLabel = window.i18n ? window.i18n.t('RENTED_FROM') : 'Rented From:';
                            const landlordLabel = window.i18n ? window.i18n.t('LANDLORD_LABEL') : 'Landlord';
                            rentedFromStr =
                                `<br><small style="color:var(--accent-amber)">${rentedFromLabel} ${occ.rentedFrom.fullName || landlordLabel}</small>`;
                        }
                        const occLabel = window.i18n ? window.i18n.t('OCCUPANT_LABEL') : 'Occupant';
                        const phoneLabel = window.i18n ? window.i18n.t('PHONE_LABEL') : 'Phone:';
                        const naLabel = window.i18n ? window.i18n.t('NA_LABEL') : 'N/A';

                        occDetails = `
                            <strong>
                                ${resident
                                ? resident.fullName
                                : occLabel
                            }
                            </strong>
                            <br>
                            ${phoneLabel}
                            ${resident
                                ? resident.phone
                                : naLabel
                            }
                            ${rentedFromStr}
                        `;
                    }
                    const editOccTxt = window.i18n ? window.i18n.t('BTN_EDIT_OCCUPANT') : 'Edit Occupant';
                    const removeTxt = window.i18n ? window.i18n.t('BTN_REMOVE') : 'Remove';
                    const addOccTxt = window.i18n ? window.i18n.t('BTN_ADD_OCCUPANT') : 'Add Occupant';

                    const assignBtnHtml =
                        isAdmin
                            ? (
                                occ
                                    ? `
                                        <div style="display:flex; gap:6px; margin-top:8px">
                                            <button
                                                class="btn-assign-flat"
                                                onclick="openAssignModal(${flat.id}, '${flat.flatName}')"
                                                style="margin-top:0; flex:1">
                                                ${editOccTxt}
                                            </button>
                                            <button
                                                onclick="removeOccupant(${occ.id})"
                                                style="background:#fee2e2; border:1px solid #fca5a5; color:#b91c1c; padding:4px 8px; border-radius:4px; font-size:0.75rem; font-weight:bold; cursor:pointer">
                                                ${removeTxt}
                                            </button>

                                        </div>
                                    `
                                    : `
                                        <button
                                            class="btn-assign-flat"
                                            onclick="openAssignModal(${flat.id}, '${flat.flatName}')"
                                            style="margin-top:8px">
                                            ${addOccTxt}
                                        </button>
                                    `
                            )
                            : '';

                    flatsHtml += `
                        <div class="flat-card">
                            <div class="flat-card-title">
                                <span>${flat.flatName}
                                </span>${occBadge}</div>
                            <div class="occupant-details">
                                ${occDetails}
                            </div>${assignBtnHtml}</div>`;
                }
            );

            const formattedFloorTitle = formatFloorTitle(floorNum);
            const flatsSuffix = window.i18n ? window.i18n.t('FLATS_COUNT_SUFFIX') : 'Flats';
            const formattedCount = formatNumber(floorFlats.length);

            floorRow.innerHTML = `
                <div class="floor-header">
                    ${formattedFloorTitle}
                    (${formattedCount} ${flatsSuffix})
                </div>

                <div class="flat-cards-wrapper">
                    ${flatsHtml}
                </div>
            `;

            floorContainer.appendChild(
                floorRow
            );
        }
    } catch (e) {
        console.error(e);

        const failText = window.i18n ? window.i18n.t('FAILED_FLOOR_LAYOUT') : 'Failed to load floor layout.';
        floorContainer.innerHTML = `<p style="color:var(--accent-rose)">${failText}</p>`;
    }
}

function closeFloorLayout() {
    currentBuildingId = null;

    layoutClosedByUser = true;

    document.getElementById(
        'selectedBuildingTitle').textContent =
        window.i18n ? window.i18n.t('BUILDING_LAYOUT') : 'Floor Layout';

    const closeBtn = document.getElementById('closeFloorLayoutBtn');

    if (closeBtn) {
        closeBtn.style.display = 'none';
    }

    const selectBldgTxt = window.i18n ? window.i18n.t('SELECT_BUILDING') : 'Select a building to view layout.';
    document.getElementById('floorLayoutContainer'
    ).innerHTML = `<p style="color:var(--text-secondary)">${selectBldgTxt}</p>`;

    loadBuildingsSection();
}

async function removeOccupant(occId) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Only admin can remove occupant');
        return;
    }

    if (
        !confirm('You want to remove this Occupant?')
    ) {
        return;
    }

    try {
        const res = await fetch(
                `/api/occupancies/${occId}`,
                {
                    method: 'DELETE'
                }
            );

        if (res.ok) {
            loadBuildingsSection();
            loadDashboardStats();
        } else {
            alert('Failed to remove Occupant');
        }
    } catch (err) {
        console.error(err);

        alert('Error removing Occupant');
    }
}

async function openAssignModal(
    flatId,
    flatName) {
    selectedFlatId = flatId;

    document.getElementById('modalFlatName').textContent = flatName;

    document.getElementById('assignModal').classList.add('show');

    const typeSelect = document.getElementById('resOccupancyType');

    if (typeSelect) {
        toggleOwnerOption(
            typeSelect.value
        );
    }

    toggleOwnerMode('select');
    toggleResidentMode('select');

    const residentSelectRadio = document.querySelector('input[name="residentMode"][value="select"]');

    if (residentSelectRadio) {
        residentSelectRadio.checked = true;}

    try {
        const res = await fetch('/api/persons');

        const persons = await res.json();

        const residentSelect = document.getElementById('residentSelect');

        if (residentSelect) {
            const selectResTxt = (window.i18n && window.i18n.t) ? window.i18n.t('SELECT_RESIDENT') : '-- Select Resident --';
            residentSelect.innerHTML = `<option value="">${selectResTxt}</option>`;

            persons.forEach(p => {
                const info = p.phone
                        ? ` (${p.phone})`
                        : '';

                residentSelect.innerHTML += `<option value="${p.id}">${p.fullName}${info}</option>`;
            });
        }

        const select = document.getElementById('rentedFromSelect');

        if (select) {
            const selectOwnerTxt = (window.i18n && window.i18n.t) ? window.i18n.t('SELECT_OWNER') : '-- Select Owner --';
            select.innerHTML = `<option value="">${selectOwnerTxt}</option>`;

            persons.forEach(p => {
                const info = p.phone
                        ? ` (${p.phone})`
                        : '';

                select.innerHTML += `<option value="${p.id}">${p.fullName}${info}</option>`;
            });
        }
    } catch (e) {
        console.error('Failed to load persons:', e);
    }
}

function closeAssignModal() {
    document.getElementById('assignModal').classList.remove('show');

    document.getElementById('assignModalForm').reset();

    toggleOwnerOption('OWNER');
}

function toggleOwnerOption(type) {
    const ownerSection = document.getElementById('ownerSection');

    if (ownerSection) {
        ownerSection.style.display =
            (
                type === 'TENANT' ||
                type === 'SUB_TENANT'
            )
                ? 'block'
                : 'none';
    }
}

function toggleOwnerMode(mode) {
    const selectGroup = document.getElementById('ownerSelectGroup');

    const newGroup = document.getElementById('ownerNewGroup');

    if (mode === 'select') {
        if (selectGroup) {
            selectGroup.style.display = 'block';
        }

        if (newGroup) {
            newGroup.style.display = 'none';
        }
    } else {
        if (selectGroup) {
            selectGroup.style.display = 'none';
        }

        if (newGroup) {
            newGroup.style.display = 'grid';
        }
    }
}

function toggleResidentMode(mode) {
    const selectGroup = document.getElementById('residentSelectGroup');

    const newGroup = document.getElementById('residentNewGroup'
        );

    const resSelect = document.getElementById('residentSelect'
        );

    const resFullName = document.getElementById('resFullName'
        );

    const resPhone = document.getElementById('resPhone');

    if (mode === 'select') {
        if (selectGroup) {
            selectGroup.style.display = 'block';
        }

        if (newGroup) {
            newGroup.style.display = 'none';
        }

        if (resSelect) {
            resSelect.required = true;
        }

        if (resFullName) {
            resFullName.required = false;
        }

        if (resPhone) {
            resPhone.required = false;
        }
    } else {
        if (selectGroup) {
            selectGroup.style.display = 'none';
        }

        if (newGroup) {
            newGroup.style.display = 'grid';
        }

        if (resSelect) {
            resSelect.required = false;
        }

        if (resFullName) {
            resFullName.required = true;
        }

        if (resPhone) {resPhone.required = true;
        }
    }
}

function toggleAssetPersonMode(mode) {
    const selectGroup = document.getElementById('assetPersonSelectGroup');

    const newGroup = document.getElementById('assetPersonNewGroup');

    const personSelect = document.getElementById('assignPersonSelect');

    const personName = document.getElementById('assetPersonName');

    const personPhone = document.getElementById('assetPersonPhone');

    const personId = document.getElementById('assetPersonId');

    if (mode === 'select') {
        if (selectGroup) {
            selectGroup.style.display = 'block';
        }

        if (newGroup) {
            newGroup.style.display = 'none';
        }

        if (personSelect) {
            personSelect.required = true;
        }

        if (personName) {
            personName.required = false;
        }

        if (personPhone) {
            personPhone.required = false;
        }

        if (personId) {
            personId.required = false;
        }
    } else {
        if (selectGroup) {
            selectGroup.style.display = 'none';
        }

        if (newGroup) {
            newGroup.style.display = 'block';
        }

        if (personSelect) {
            personSelect.required = false;
        }

        if (personName) {
            personName.required = true;
        }

        if (personPhone) {
            personPhone.required = true;
        }

        if (personId) {
            personId.required = true;
        }
    }
}

async function handleAssignOccupant(e) {
    e.preventDefault();

    const residentRadio = document.querySelector('input[name="residentMode"]:checked');

    const residentMode = residentRadio ? residentRadio.value : 'select';

    const occupancyType = document.getElementById('resOccupancyType').value;

    try {
        let personId = null;

        if (
            residentMode === 'new'
        ) {
            const fullName = document.getElementById('resFullName').value;

            const phone = document.getElementById('resPhone').value;

            const personRes = await fetch(
                    '/api/persons',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body: JSON.stringify({
                            fullName,
                            phone,
                            personId: phone
                        })
                    }
                );

            if (!personRes.ok) {
                alert('Failed to create resident');
                return;
            }

            const person = await personRes.json();
            personId = person.id;
        } else {
            const selectVal = document.getElementById('residentSelect').value;

            if (selectVal) {
                personId = parseInt(selectVal);
            }
        }

        if (!personId) {
            alert('Please select or create a resident');
            return;
        }

        let rentedFromId = null;

        if (
            occupancyType === 'TENANT' || occupancyType === 'SUB_TENANT'
        ) {
            const ownerRadio = document.querySelector('input[name="ownerMode"]:checked');

            const ownerMode = ownerRadio ? ownerRadio.value : 'select';

            if (
                ownerMode === 'new'
            ) {
                const newOwnerName = document.getElementById('newOwnerName').value;

                const newOwnerPhone = document.getElementById('newOwnerPhone').value;

                if (
                    newOwnerName && newOwnerPhone
                ) {
                    const ownerRes = await fetch(
                            '/api/persons',
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },
                                body: JSON.stringify({
                                    fullName:
                                        newOwnerName,
                                    phone:
                                        newOwnerPhone,
                                    personId:
                                        newOwnerPhone
                                })
                            }
                        );

                    if (!ownerRes.ok) {
                        alert('Failed to create owner');
                        return;
                    }

                    const ownerPerson = await ownerRes.json();

                    rentedFromId = ownerPerson.id;
                }
            } else {
                const selectVal = document.getElementById(
                        'rentedFromSelect').value;

                if (selectVal) {
                    rentedFromId =
                        parseInt(
                            selectVal
                        );
                }
            }
        }

        const payload = {
            occupancyType:
                occupancyType,

            flat: {
                id: selectedFlatId
            },

            person: {
                id: personId
            },

            rentedFrom:
                rentedFromId
                    ? {
                        id: rentedFromId
                    }
                    : null
        };

        const occRes = await fetch(
                '/api/occupancies',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        if (occRes.ok) {
            closeAssignModal();

            loadBuildingsSection();
            loadDashboardStats();
        } else {
            const msg = await occRes.text();

            alert('Failed to assign occupant: ' + (msg || occRes.statusText));
        }
    } catch (err) {
        console.error(err);

        alert('Error saving occupant details');
    }
}

function openAddUserModal() {
    document.getElementById('addUserForm').reset();

    document.getElementById('addUserModal').classList.add('show');
}

function closeAddUserModal() {
    document.getElementById('addUserModal').classList.remove('show');
}

async function handleSaveNewUser(e) {
    e.preventDefault();

    const username = document.getElementById('addUsername').value;

    const email = document.getElementById('addEmail').value;

    const phone = document.getElementById('addPhone').value;

    const password = document.getElementById('addPassword').value;

    const role = document.getElementById('addRole').value;

    try {
        const res = await fetch(
                '/api/users',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        phone,
                        password,
                        role,
                        enabled: true
                    })
                }
            );

        if (res.ok) {
            closeAddUserModal();

            loadUserManagement();
            loadDashboardStats();
        } else {
            const msg = await res.text();

            alert('Failed to add user: ' +
                (
                    msg || res.statusText
                )
            );
        }
    } catch (err) {
        alert(
            'Error adding user'
        );
    }
}

async function loadUserManagement() {
    try {
        const res =
            await fetch(
                '/api/users'
            );

        const users = await res.json();

        const tbody = document.getElementById('userTableBody');

        tbody.innerHTML = '';

        users.forEach(u => {
            const tr = document.createElement('tr');

            const statusBtnClass = u.enabled ? 'btn-enabled' : 'btn-disabled';

            const statusText = u.enabled ? 'ENABLED' : 'DISABLED';

            tr.innerHTML = `
                <td>
                    <b>${u.username}</b>
                </td>

                <td>
                    ${u.email}
                </td>

                <td>
                    ${u.phone || 'N/A'}
                </td>

                <td>
                    <select
                        data-old-role="${u.role}"
                        onchange="changeUserRole(${u.id}, this, '${escapeQuote(u.username)}')"
                        style="background:var(--bg-input); color:var(--text-primary); border:1px solid var(--border-color); padding:4px 8px; border-radius:6px">

                        <option value="ADMIN"
                            ${u.role === 'ADMIN' ? 'selected' : ''}>
                            ADMIN
                        </option>

                        <option value="RESIDENT"
                            ${u.role === 'RESIDENT' ? 'selected' : ''}>
                            RESIDENT
                        </option>

                        <option value="STAFF"
                            ${u.role === 'STAFF' ? 'selected' : ''}>
                            STAFF
                        </option>

                    </select>
                </td>

                <td>
                    <button
                        class="btn-toggle-status ${statusBtnClass}"
                        onclick="toggleUserStatus(${u.id})">
                        ${statusText}
                    </button>
                </td>

                <td>
                    <div style="display:flex; gap:6px">

                        <button
                            onclick="openEditUserModal(${u.id}, '${u.username}', '${u.email}', '${u.role}', '${u.phone || ''}')"
                            style="background:var(--bg-input); color:var(--accent-blue); border:1px solid var(--border-color); padding:4px 8px; border-radius:6px; font-size:0.8rem; cursor:pointer" title="Edit User">
                            ✏️ Edit
                        </button>

                        <button
                            onclick="deleteUser(${u.id})"
                            style="background:rgba(244,63,94,0.2); color:var(--accent-rose); border:1px solid rgba(244,63,94,0.3); padding:4px 8px; border-radius:6px; font-size:0.8rem; cursor:pointer" title="Delete User">
                            🗑️ Delete
                        </button>

                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

async function toggleUserStatus(userId) {
    try {
        const res = await fetch(
                `/api/users/${userId}/toggle-status`,
                {
                    method: 'PUT'
                }
            );

        if (res.ok) {
            loadUserManagement();
        }
    } catch (e) {
        alert('Failed to toggle status');
    }
}

async function changeUserRole(
    userId,
    selectEl,
    username
) {
    const newRole = selectEl.value;
    const oldRole = selectEl.getAttribute('data-old-role') || 'previous role';

    if (newRole === oldRole) {
        return;
    }

    const confirmed = confirm(`Are you sure you want to change the role of user "${username}" from ${oldRole} to ${newRole}?`);

    if (!confirmed) {
        selectEl.value = oldRole;
        return;
    }

    try {
        const res = await fetch(
                `/api/users/${userId}/role`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({
                        role: newRole
                    })
                }
            );

        if (res.ok) {
            selectEl.setAttribute('data-old-role', newRole);
            alert(`Role for "${username}" updated to ${newRole} successfully!`);
        } else {
            alert('Failed to update role.');
            selectEl.value = oldRole;
        }
    } catch (e) {
        alert('Failed to update role due to server error.');
        selectEl.value = oldRole;
    }
}

function openEditUserModal(id, username, email, role, phone) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editUsername').value = username;

    document.getElementById('editEmail').value = email;

    document.getElementById('editRole').value = role;

    document.getElementById('editPhone').value = phone || '';

    document.getElementById('editPassword').value = '';

    document.getElementById('editUserModal').classList.add('show');
}

function closeEditUserModal() {
    document.getElementById('editUserModal').classList.remove('show');
}

async function handleSaveEditedUser(e) {
    e.preventDefault();

    const id = document.getElementById('editUserId').value;

    const username = document.getElementById('editUsername').value;

    const email = document.getElementById('editEmail').value;

    const role = document.getElementById('editRole').value;

    const phone = document.getElementById('editPhone').value;

    const password = document.getElementById('editPassword').value;

    try {
        const payload = {
            username,
            email,
            role,
            phone
        };

        if (password && password.trim().length > 0) {
            payload.password = password;
        }

        const res = await fetch(
                `/api/users/${id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );

        if (res.ok) {
            closeEditUserModal();

            loadUserManagement();
            loadDashboardStats();
        } else {
            alert('Failed to update user details');
        }
    } catch (err) {alert('Error updating user');}
}

async function deleteUser(userId) {
    if (
        !confirm('Are you sure you want to delete this account?')
    ) {
        return;
    }

    try {
        const res = await fetch(
                `/api/users/${userId}`,
                {method: 'DELETE'}
            );

        if (res.ok) {
            loadUserManagement();
            loadDashboardStats();
        } else {
            alert('Failed to delete user');
        }
    } catch (e) {
        alert('Error deleting user');
    }
}

async function loadAssetSection() {
    const isAdmin = currentUser && currentUser.role === 'ADMIN';

    const assetAdminRow = document.getElementById('assetAdminRow');

    if (assetAdminRow) {
        assetAdminRow.style.display = isAdmin ? 'grid' : 'none';
    }

    const assetActionTh = document.getElementById('assetActionTh');

    if (assetActionTh) {
        assetActionTh.style.display = isAdmin
                ? 'table-cell'
                : 'none';
    }

    try {
        const [
            assetsRes,
            assignmentsRes,
            personsRes
        ] = await Promise.all([
            fetch('/api/assets'),
            fetch('/api/asset-Assignment'),
            fetch('/api/persons')
        ]);

        const assets = await assetsRes.json();

        const assignments = await assignmentsRes.json();

        const persons = await personsRes.json();

        if (isAdmin) {
            const assetSelect = document.getElementById('assignAssetSelect');

            if (assetSelect) {
                assetSelect.innerHTML = '<option value="">-- Select Asset --</option>';

                assets.forEach(a => {assetSelect.innerHTML += `<option value="${a.id}">${a.name} (${a.type})</option>`;});
            }

            const personSelect = document.getElementById('assignPersonSelect');

            if (personSelect) {
                personSelect.innerHTML = '<option value="">-- Select Person --</option>';

                persons.forEach(p => {
                    const info = p.phone
                            ? ` (${p.phone})`
                            : '';

                    personSelect.innerHTML += `<option value="${p.id}">${p.fullName}${info}</option>`;
                });
            }

            const selectRadio = document.querySelector('input[name="assetPersonMode"][value="select"]');

            if (selectRadio) {selectRadio.checked = true;}

            toggleAssetPersonMode('select');
        }

        const tbody = document.getElementById('assetAssignTableBody');

        tbody.innerHTML = '';

        if (
            !Array.isArray(assignments) || assignments.length === 0
        ) {
            const colSpan = isAdmin ? 5 : 4;

            tbody.innerHTML =
                `<tr>
                    <td colspan="${colSpan}"
                        style="text-align:center; color:var(--text-secondary)">
                        No active person assignments.
                    </td>
                </tr>`;

            return;
        }

        assignments.forEach(as => {
            const tr = document.createElement('tr');

            const actionTd = isAdmin ? `
                        <td>
                            <button
                                onclick="deleteAssetAssignment(${as.id})"
                                style="background:rgba(244,63,94,0.2); color:var(--accent-rose); border:none; padding:4px 10px; border-radius:6px; font-size:0.8rem; cursor:pointer">
                                Unassign
                            </button>
                        </td>
                    `
                    : '';

            tr.innerHTML = `
                <td>
                    <b>
                        ${as.asset
                    ? as.asset.name
                    : 'N/A'
                }
                    </b>
                </td>

                <td>
                    <span class="occupant-badge badge-tenant">
                        ${as.asset
                    ? as.asset.type
                    : 'N/A'
                }
                    </span>
                </td>

                <td>
                    ${as.person
                    ? as.person.fullName
                    : 'N/A'
                }
                    (
                    ID:
                    ${as.person
                    ? as.person.personId
                    : 'N/A'
                }
                    )
                </td>

                <td>
                    <b>
                        ${as.jobRole || 'Assignee'}
                    </b>
                </td>

                ${actionTd}
            `;

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

async function handleCreateAsset(e) {
    e.preventDefault();

    if (!currentUser || currentUser.role !== 'ADMIN'
    ) {
        alert('Only admin can add assets');
        return;
    }

    const name = document.getElementById('assetName').value;

    const type = document.getElementById('assetType').value;

    try {
        const res = await fetch(
                '/api/assets',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        type
                    })
                }
            );

        if (res.ok) {document.getElementById('createAssetForm').reset();

            loadAssetSection();
            loadDashboardStats();
        } else {
            const msg = await res.text();

            alert('Failed to create asset: ' + (msg || res.statusText)
            );
        }
    } catch (e) {
        alert('Failed to create asset');
    }
}

async function handleAssignAssetToPerson(e) {
    e.preventDefault();

    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Only admin can assign persons to assets');
        return;
    }
    const assetId = document.getElementById('assignAssetSelect').value;

    const jobRole = document.getElementById('assetJobRole').value;

    if (!assetId) {
        alert('Please select an asset to assign!');
        return;
    }

    const modeRadio = document.querySelector('input[name="assetPersonMode"]:checked');

    const personMode = modeRadio
            ? modeRadio.value
            : 'select';

    try {
        let finalPersonId = null;

        if (
            personMode === 'new'
        ) {
            const fullName = document.getElementById('assetPersonName').value;

            const phone = document.getElementById('assetPersonPhone').value;

            const personId = document.getElementById('assetPersonId').value;

            const personRes = await fetch(
                    '/api/persons',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body: JSON.stringify({
                            fullName,
                            phone,
                            personId
                        })
                    }
                );

            if (!personRes.ok) {
                alert('Failed to register person details');
                return;
            }

            const person = await personRes.json();

            finalPersonId = person.id;
        } else {
            const selectVal = document.getElementById('assignPersonSelect').value;

            if (!selectVal) {
                alert('Please select a person to assign!');
                return;
            }

            finalPersonId = parseInt(selectVal);
        }

        const assignRes = await fetch(
                '/api/asset-Assignment',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({jobRole,
                        asset: {
                            id: parseInt(assetId)
                        },
                        person: {
                            id: finalPersonId
                        }
                    })
                }
            );

        if (assignRes.ok) {
            document.getElementById('assignAssetForm').reset();

            const selectRadio = document.querySelector('input[name="assetPersonMode"][value="select"]'
                );

            if (selectRadio) {selectRadio.checked = true;
            }

            toggleAssetPersonMode(
                'select'
            );

            await loadAssetSection();

            alert('Person assigned to asset successfully!');
        } else {
            const errText = await assignRes.text();

            alert('Failed to assign person to asset: ' + errText);
        }
    } catch (e) {
        console.error(e);

        alert('Error creating asset assignment: ' + (e.message || e));
    }
}

async function deleteAssetAssignment(
    id
) {
    try {
        const res = await fetch(
                `/api/asset-Assignment/${id}`,
                {
                    method: 'DELETE'
                }
            );

        if (res.ok) {
            await loadAssetSection();
        }
    } catch (e) {
        alert('Failed to delete assignment');
    }
}

async function loadPersonsList() {
    try {
        const res =
            await fetch(
                '/api/persons'
            );

        const persons =
            await res.json();

        const tbody =
            document.getElementById(
                'personTableBody'
            );

        tbody.innerHTML = '';

        persons.forEach(p => {
            const tr =
                document.createElement(
                    'tr'
                );

            tr.innerHTML =
                `<td>#${p.id}</td>
                 <td><b>${p.fullName}</b></td>
                 <td>${p.phone || 'N/A'}</td>`;

            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
    }
}

function openProfileModal() {
    const modal = document.getElementById('profileModal');

    if (!modal) {
        console.error('Profile modal not found.');
        return;
    }

    loadProfileData();

    modal.classList.add('show');
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');

    if (!modal) {
        return;
    }

    modal.classList.remove('show');
}

function loadProfileData() {
    if (!currentUser) {
        console.warn('No logged-in user found.');
        return;
    }

    const username = currentUser.username || 'User';

    const email = currentUser.email || '-';

    const phone = currentUser.phone || '-';

    const role = currentUser.role || 'RESIDENT';

    const firstLetter = username
            .charAt(0)
            .toUpperCase();

    const profileAvatar = document.getElementById('profileAvatar'
        );

    if (profileAvatar) {
        profileAvatar.textContent = firstLetter;
    }

    const profileModalAvatar = document.getElementById('profileModalAvatar'
        );

    if (profileModalAvatar) {
        profileModalAvatar.textContent = firstLetter;
    }

    const profileModalName = document.getElementById('profileModalName'
        );

    if (profileModalName) {profileModalName.textContent = username;
    }

    const profileModalRole = document.getElementById('profileModalRole'
        );

    if (profileModalRole) {
        profileModalRole.textContent = role;
    }

    const profileUsername = document.getElementById('profileUsername'
        );

    if (profileUsername) {
        profileUsername.textContent = username;
    }

    const profileEmail = document.getElementById('profileEmail'
        );

    if (profileEmail) {
        profileEmail.textContent = email;
    }

    const profilePhone = document.getElementById('profilePhone'
        );

    if (profilePhone) {
        profilePhone.textContent = phone;
    }

    const profileRole = document.getElementById('profileRole'
        );

    if (profileRole) {profileRole.textContent = role;
    }
}

function openEditProfile() {
    if (!currentUser) {
        console.warn('No logged-in user found.');
        return;
    }

    document.getElementById('editProfileUsername').value = currentUser.username || '';

    document.getElementById('editProfileEmail').value = currentUser.email || '';

    document.getElementById('editProfilePhone').value = currentUser.phone || '';

    document.getElementById('editProfilePassword').value = '';

    document.getElementById('editProfileCurrentPassword').value = '';

    closeProfileModal();

    document.getElementById('editProfileModal'
    ).classList.add('show');
}

function closeEditProfile() {
    const modal = document.getElementById('editProfileModal');

    if (!modal) {
        return;
    }

    modal.classList.remove('show');
}

async function saveEditProfile(e) {e.preventDefault();

    if (!currentUser) {alert('No logged-in user found.');
        return;
    }

    const username = document.getElementById('editProfileUsername').value.trim();

    const email = document.getElementById('editProfileEmail').value.trim();

    const phone = document.getElementById('editProfilePhone').value.trim();

    const password = document.getElementById('editProfilePassword').value;

    const currentPassword = document.getElementById('editProfileCurrentPassword').value;

    if (
        !username ||
        !email ||
        !phone
    ) {
        alert('Please fill in all fields.');
        return;
    }

    if (password && password.trim().length > 0) {
        if (!currentPassword || currentPassword.trim().length === 0) {
            alert('Current password is required to change password.');
            return;
        }
    }
    try {
        const res = await fetch('/api/users/profile',
                {method: 'PUT',
                    headers: {'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        email,
                        phone,
                        password,
                        currentPassword
                    })
                }
            );

        if (!res.ok) {const message = await res.text();
            alert('Failed to update profile: ' + (message || res.statusText));
                return;}

        const refreshed = await refreshCurrentUser();

        if (!refreshed) {
            alert('Profile updated, but the latest user information could not be loaded.');
            return;
        }
        closeEditProfile();
        openProfileModal();

    } catch (error) {
        console.error('Profile update error:', error);
        alert('An error occurred while updating your profile.');
    }
}

async function refreshCurrentUser() {
    try {
        const res = await fetch('/api/auth/me');

        if (!res.ok) {
            console.error('Failed to refresh current user.');
            return false;
        }

        currentUser = await res.json();

        const usernameElement = document.getElementById('displayUsername');

        if (usernameElement) {usernameElement.textContent = currentUser.username || 'User';}

        const roleElement = document.getElementById('displayRole');

        if (roleElement) {roleElement.textContent = currentUser.role || 'RESIDENT';}
        return true;

    } catch (error) {
        console.error('Failed to refresh current user:', error);
        return false;
    }
}

function escapeQuote(str) {
    if (!str) return '';
    return String(str).replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

async function loadColoniesSection() {
    try {
        const res = await fetch('/api/colonies');
        if (!res.ok) return;
        const colonies = await res.json();
        const tbody = document.getElementById('colonyTableBody');
        if (!tbody) return;
        tbody.innerHTML = '';
        if (colonies.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-secondary); padding:20px">No colonies found. Create one above!</td></tr>`;
            return;
        }

        const isAdmin = currentUser && currentUser.role === 'ADMIN';

        colonies.forEach(colony => {
            const tr = document.createElement('tr');
            const bldgCount = colony.buildings ? colony.buildings.length : 0;
            const safeName = escapeQuote(colony.name);
            const safeLoc = escapeQuote(colony.location || '');
            const safeDesc = escapeQuote(colony.description || '');

            tr.innerHTML = `
                <td>#${colony.id}</td>
                <td style="font-weight:600; color:var(--accent-emerald)">${colony.name}</td>
                <td>${colony.location || '-'}</td>
                <td>${colony.description || '-'}</td>
                <td><span style="background:rgba(16,185,129,0.15); color:var(--accent-emerald); padding:2px 8px; border-radius:12px; font-weight:600; font-size:0.8rem">${bldgCount} Buildings</span></td>
                <td>
                    ${isAdmin ? `
                        <button onclick="openEditColonyModal(${colony.id}, '${safeName}', '${safeLoc}', '${safeDesc}')" style="background:var(--bg-input); color:var(--accent-blue); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer; margin-right:4px" title="Edit Colony">✏️ Edit</button>
                        <button onclick="deleteColony(${colony.id})" style="background:rgba(244,63,94,0.2); color:var(--accent-rose); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer" title="Delete Colony">🗑️ Delete</button>
                    ` : '<span style="color:var(--text-secondary); font-size:0.8rem">View Only</span>'}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error('Error loading colonies:', e);
    }
}

async function handleCreateColony(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Only admins can create colonies.');
        return;
    }
    const name = document.getElementById('colonyName').value;
    const location = document.getElementById('colonyLocation').value;
    const description = document.getElementById('colonyDescription').value;

    try {
        const res = await fetch('/api/colonies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, location, description })
        });
        if (res.ok) {
            document.getElementById('createColonyForm').reset();
            loadColoniesSection();
        } else {
            alert('Failed to create colony.');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while creating colony.');
    }
}

function openEditColonyModal(id, name, location, description) {
    document.getElementById('editColonyId').value = id;
    document.getElementById('editColonyName').value = name;
    document.getElementById('editColonyLocation').value = location;
    document.getElementById('editColonyDescription').value = description;
    document.getElementById('editColonyModal').style.display = 'flex';
}

function closeEditColonyModal() {
    document.getElementById('editColonyModal').style.display = 'none';
}

async function handleUpdateColony(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Only admins can edit colonies.');
        return;
    }
    const id = document.getElementById('editColonyId').value;
    const name = document.getElementById('editColonyName').value;
    const location = document.getElementById('editColonyLocation').value;
    const description = document.getElementById('editColonyDescription').value;

    try {
        const res = await fetch(`/api/colonies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, location, description })
        });
        if (res.ok) {
            closeEditColonyModal();
            loadColoniesSection();
        } else {
            alert('Failed to update colony.');
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteColony(id) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Only admins can delete colonies.');
        return;
    }
    if (!confirm('Are you sure you want to delete this colony?')) return;
    try {
        const res = await fetch(`/api/colonies/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadColoniesSection();
        } else {
            alert('Failed to delete colony.');
        }
    } catch (err) {
        console.error(err);
    }
}

// Dropdown profile
function toggleProfileDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('profileDropdownContent');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

function closeProfileDropdown() {
    const dropdown = document.getElementById('profileDropdownContent');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('profileDropdownContent');
    if (dropdown && dropdown.classList.contains('show')) {
        const toggleBtn = document.querySelector('.dropdown-toggle');
        if (toggleBtn && !dropdown.contains(event.target) && !toggleBtn.contains(event.target)) {
            closeProfileDropdown();
        }
    }
});

// update floor layout on lang change
window.addEventListener('languageChanged', function () {
    if (typeof currentBuildingId !== 'undefined' && currentBuildingId) {
        fetch('/api/buildings/' + currentBuildingId)
            .then(res => res.json())
            .then(building => renderFloorLayout(building))
            .catch(() => {});
    }
});