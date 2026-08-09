if (typeof angular !== 'undefined') {
    angular.module('colonyManagementApp', []);
}

let currentUser = null;
let currentBuildingId = null;
let selectedFlatId = null;
let dashboardIntervalId = null;

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
    document.getElementById('authView').style.display = 'flex';
    document.getElementById('appView').style.display = 'none';
}

function showAppView() {
    document.getElementById('authView').style.display = 'none';
    document.getElementById('appView').style.display = 'flex';
    document.getElementById('displayUsername').textContent = currentUser.username;
    document.getElementById('displayRole').textContent = currentUser.role || 'RESIDENT';

    const isAdmin = currentUser && currentUser.role === 'ADMIN';

    document.getElementById('nav-dashboard').style.display = isAdmin ? 'flex' : 'none';
    document.getElementById('nav-users').style.display = isAdmin ? 'flex' : 'none';
    document.getElementById('nav-persons').style.display = isAdmin ? 'flex' : 'none';

    if (isAdmin) {
        switchNav('dashboard');
    } else {
        switchNav('buildings');
    }
}



function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegBtn = document.getElementById('tabRegBtn');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabLoginBtn.classList.add('active');
        tabRegBtn.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabLoginBtn.classList.remove('active');
        tabRegBtn.classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('authError');
    errorEl.style.display = 'none';

    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            currentUser = await res.json();
            showAppView();
        } else {
            const msg = await res.text();
            errorEl.textContent = msg || 'Login failed';
            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.textContent = 'Server connection error';
        errorEl.style.display = 'block';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const errorEl = document.getElementById('authError');
    errorEl.style.display = 'none';

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (res.ok) {
            alert('Registration successful! Please login.');
            switchAuthTab('login');
            document.getElementById('loginUsername').value = username;
            document.getElementById('loginPassword').value = password;
        } else {
            const msg = await res.text();
            errorEl.textContent = msg || 'Registration failed';
            errorEl.style.display = 'block';
        }
    } catch (err) {
        errorEl.textContent = 'Server connection error';
        errorEl.style.display = 'block';
    }
}

async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    currentUser = null;
    showAuthView();
}

function switchNav(section) {
    const isAdmin = currentUser && currentUser.role === 'ADMIN';

    if (!isAdmin && (section === 'dashboard' || section === 'users' || section === 'persons')) {
        section = 'buildings';
    }

    if (dashboardIntervalId) {
        clearInterval(dashboardIntervalId);
        dashboardIntervalId = null;
    }

    const sections = ['dashboard', 'buildings', 'users', 'assets', 'persons'];
    sections.forEach(s => {
        const secEl = document.getElementById(`sec-${s}`);
        const navEl = document.getElementById(`nav-${s}`);
        if (secEl) secEl.style.display = (s === section) ? 'block' : 'none';
        if (navEl) {
            if (s === section) navEl.classList.add('active');
            else navEl.classList.remove('active');
        }
    });

    if (section === 'dashboard' && isAdmin) {
        loadDashboardStats();
        dashboardIntervalId = setInterval(loadDashboardStats, 5000);
    }
    if (section === 'buildings') loadBuildingsSection();
    if (section === 'users' && isAdmin) loadUserManagement();
    if (section === 'assets') loadAssetSection();
    if (section === 'persons' && isAdmin) loadPersonsList();
}

async function loadDashboardStats() {
    try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
            const data = await res.json();
            document.getElementById('statBuildings').textContent = data.buildingCount || 0;
            document.getElementById('statFlats').textContent = data.flatCount || 0;
            document.getElementById('statResidents').textContent = data.residentCount || 0;
            document.getElementById('statOwners').textContent = data.ownerCount || 0;
            document.getElementById('statTenants').textContent = data.tenantCount || 0;
            document.getElementById('statSubTenants').textContent = data.subTenantCount || 0;
            document.getElementById('statAssets').textContent = data.assetCount || 0;
            document.getElementById('statUsers').textContent = data.userCount || 0;
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadBuildingsSection() {
    const isAdmin = currentUser && currentUser.role === 'ADMIN';

    const addBuildingPanel = document.getElementById('addBuildingPanel');
    if (addBuildingPanel) addBuildingPanel.style.display = isAdmin ? 'block' : 'none';

    try {
        const res = await fetch('/api/buildings');
        const buildings = await res.json();
        const container = document.getElementById('buildingListGrid');
        container.innerHTML = '';

        if (buildings.length === 0) {
            container.innerHTML = '<p style="color:var(--text-secondary)">No buildings created yet.</p>';
            document.getElementById('floorLayoutContainer').innerHTML = '<p style="color:var(--text-secondary)">No building selected.</p>';
            return;
        }

        buildings.forEach(b => {
            const card = document.createElement('div');
            card.className = 'building-card';
            if (currentBuildingId === b.id) card.style.borderColor = 'var(--accent-blue)';

            const adminButtonsHtml = isAdmin ? `
                <div style="display:flex; gap:6px">
                    <button onclick="event.stopPropagation(); openEditBuildingModal(${b.id}, '${b.name}', ${b.floorCount}, ${b.unitsPerFloor})" style="background:var(--bg-input); color:var(--accent-blue); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer">Edit</button>
                    <button onclick="event.stopPropagation(); deleteBuilding(${b.id})" style="background:rgba(244,63,94,0.2); color:var(--accent-rose); border:none; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer">Delete</button>
                </div>
            ` : '';

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:flex-start">
                    <h3 style="color:var(--accent-blue); font-size:1.1rem; margin-bottom:8px">🏢 ${b.name}</h3>
                    ${adminButtonsHtml}
                </div>
                <p style="color:var(--text-secondary); font-size:0.85rem">Floors: <b>${b.floorCount}</b> | Units/Floor: <b>${b.unitsPerFloor}</b></p>
                <p style="color:var(--text-secondary); font-size:0.8rem; margin-top:4px">Total Flats: ${b.floorCount * b.unitsPerFloor}</p>
            `;
            card.onclick = () => selectBuilding(b);
            container.appendChild(card);
        });

        if (buildings.length > 0 && !currentBuildingId) {
            selectBuilding(buildings[0]);
        } else if (currentBuildingId) {
            const found = buildings.find(b => b.id === currentBuildingId);
            if (found) renderFloorLayout(found);
            else if (buildings.length > 0) selectBuilding(buildings[0]);
        }
    } catch (e) {
        console.error(e);
    }
}

async function handleCreateBuilding(e) {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Only admin can add buildings');
        return;
    }

    const name = document.getElementById('bldgName').value;
    const floorCount = parseInt(document.getElementById('bldgFloors').value);
    const unitsPerFloor = parseInt(document.getElementById('bldgUnits').value);

    try {
        const res = await fetch('/api/buildings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, floorCount, unitsPerFloor })
        });
        if (res.ok) {
            const newBldg = await res.json();
            document.getElementById('createBuildingForm').reset();
            currentBuildingId = newBldg.id;
            loadBuildingsSection();
            loadDashboardStats();
        } else {
            const msg = await res.text();
            alert('Failed to create building: ' + (msg || res.statusText));
        }
    } catch (err) {
        alert('Failed to create building');
    }
}

function openEditBuildingModal(id, name, floorCount, unitsPerFloor) {
    document.getElementById('editBuildingId').value = id;
    document.getElementById('editBuildingName').value = name;
    document.getElementById('editBuildingFloors').value = floorCount;
    document.getElementById('editBuildingUnits').value = unitsPerFloor;
    document.getElementById('editBuildingModal').classList.add('show');
}

function closeEditBuildingModal() {
    document.getElementById('editBuildingModal').classList.remove('show');
}

async function handleSaveEditedBuilding(e) {
    e.preventDefault();
    const id = document.getElementById('editBuildingId').value;
    const name = document.getElementById('editBuildingName').value;
    const floorCount = parseInt(document.getElementById('editBuildingFloors').value);
    const unitsPerFloor = parseInt(document.getElementById('editBuildingUnits').value);

    try {
        const res = await fetch(`/api/buildings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, floorCount, unitsPerFloor })
        });

        if (res.ok) {
            closeEditBuildingModal();
            loadBuildingsSection();
            loadDashboardStats();
        } else {
            alert('Failed to update building');
        }
    } catch (err) {
        alert('Error updating building');
    }
}

async function deleteBuilding(id) {
    if (!confirm('Are you sure you want to delete this building and all its flats?')) return;
    try {
        const res = await fetch(`/api/buildings/${id}`, { method: 'DELETE' });
        if (res.ok) {
            if (currentBuildingId === id) currentBuildingId = null;
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
    loadBuildingsSection();
    renderFloorLayout(building);
}

async function renderFloorLayout(building) {
    const isAdmin = currentUser && currentUser.role === 'ADMIN';
    document.getElementById('selectedBuildingTitle').textContent = `🏢 Floor Layout & Resident Occupancy: ${building.name}`;
    const floorContainer = document.getElementById('floorLayoutContainer');
    floorContainer.innerHTML = '<p style="color:var(--text-secondary)">Loading floor layout...</p>';

    try {
        const [flatsRes, occupanciesRes] = await Promise.all([
            fetch('/api/flats'),
            fetch('/api/occupancies')
        ]);

        const flats = await flatsRes.json();
        const occupancies = await occupanciesRes.json();

        const buildingFlats = flats.filter(f => f.building && f.building.id === building.id);

        const floorsMap = {};
        for (let i = 1; i <= building.floorCount; i++) {
            floorsMap[i] = [];
        }
        buildingFlats.forEach(f => {
            if (!floorsMap[f.floorNumber]) floorsMap[f.floorNumber] = [];
            floorsMap[f.floorNumber].push(f);
        });

        floorContainer.innerHTML = '';

        for (let floorNum = building.floorCount; floorNum >= 1; floorNum--) {
            const floorFlats = floorsMap[floorNum] || [];
            const floorRow = document.createElement('div');
            floorRow.className = 'floor-row';

            let flatsHtml = '';
            floorFlats.forEach(flat => {
                const occ = occupancies.find(o => o.flat && o.flat.id === flat.id);
                let occBadge = '<span class="occupant-badge badge-vacant">VACANT</span>';
                let occDetails = '<em>No resident assigned</em>';

                if (occ) {
                    const resident = occ.person;
                    const occType = occ.occupancyType || occ.OccupancyType || 'OCCUPIED';
                    let badgeClass = 'badge-owner';
                    if (occType === 'TENANT') badgeClass = 'badge-tenant';
                    if (occType === 'SUB_TENANT') badgeClass = 'badge-subtenant';

                    occBadge = `<span class="occupant-badge ${badgeClass}">${occType}</span>`;

                    let rentedFromStr = '';
                    if (occ.rentedFrom) {
                        rentedFromStr = `<br><small style="color:var(--accent-amber)">Rented From: ${occ.rentedFrom.fullName || 'Landlord'}</small>`;
                    }

                    occDetails = `
                        <strong>${resident ? resident.fullName : 'Occupant'}</strong><br>
                        Phone: ${resident ? resident.phone : 'N/A'}
                        ${rentedFromStr}
                    `;
                }

                const assignBtnHtml = isAdmin ? `
                    <button class="btn-assign-flat" onclick="openAssignModal(${flat.id}, '${flat.flatName}')">
                        ${occ ? 'Edit Occupant' : '+ Add Resident'}
                    </button>
                ` : '';

                flatsHtml += `
                    <div class="flat-card">
                        <div class="flat-card-title">
                            <span>🔑 ${flat.flatName}</span>
                            ${occBadge}
                        </div>
                        <div class="occupant-details">
                            ${occDetails}
                        </div>
                        ${assignBtnHtml}
                    </div>
                `;
            });

            floorRow.innerHTML = `
                <div class="floor-header">Floor ${floorNum} (${floorFlats.length} Flats)</div>
                <div class="flat-cards-wrapper">
                    ${flatsHtml}
                </div>
            `;
            floorContainer.appendChild(floorRow);
        }
    } catch (e) {
        console.error(e);
        floorContainer.innerHTML = '<p style="color:var(--accent-rose)">Failed to load floor layout.</p>';
    }
}

async function openAssignModal(flatId, flatName) {
    selectedFlatId = flatId;
    document.getElementById('modalFlatName').textContent = flatName;
    document.getElementById('assignModal').classList.add('show');
    
    const typeSelect = document.getElementById('resOccupancyType');
    if (typeSelect) toggleOwnerOption(typeSelect.value);
    toggleOwnerMode('select');
    toggleResidentMode('select');

    const residentSelectRadio = document.querySelector('input[name="residentMode"][value="select"]');
    if (residentSelectRadio) residentSelectRadio.checked = true;

    try {
        const res = await fetch('/api/persons');
        const persons = await res.json();
        
        const residentSelect = document.getElementById('residentSelect');
        if (residentSelect) {
            residentSelect.innerHTML = '<option value="">-- Select Resident --</option>';
            persons.forEach(p => {
                const info = p.phone ? ` (${p.phone})` : '';
                residentSelect.innerHTML += `<option value="${p.id}">${p.fullName}${info}</option>`;
            });
        }

        const select = document.getElementById('rentedFromSelect');
        if (select) {
            select.innerHTML = '<option value="">-- Select Owner --</option>';
            persons.forEach(p => {
                const info = p.phone ? ` (${p.phone})` : '';
                select.innerHTML += `<option value="${p.id}">${p.fullName}${info}</option>`;
            });
        }
    } catch (e) { }
}

function closeAssignModal() {
    document.getElementById('assignModal').classList.remove('show');
    document.getElementById('assignModalForm').reset();
    toggleOwnerOption('OWNER');
}

function toggleOwnerOption(type) {
    const ownerSection = document.getElementById('ownerSection');
    if (ownerSection) {
        ownerSection.style.display = (type === 'TENANT' || type === 'SUB_TENANT') ? 'block' : 'none';
    }
}

function toggleOwnerMode(mode) {
    const selectGroup = document.getElementById('ownerSelectGroup');
    const newGroup = document.getElementById('ownerNewGroup');
    if (mode === 'select') {
        if (selectGroup) selectGroup.style.display = 'block';
        if (newGroup) newGroup.style.display = 'none';
    } else {
        if (selectGroup) selectGroup.style.display = 'none';
        if (newGroup) newGroup.style.display = 'grid';
    }
}

function toggleResidentMode(mode) {
    const selectGroup = document.getElementById('residentSelectGroup');
    const newGroup = document.getElementById('residentNewGroup');
    const resSelect = document.getElementById('residentSelect');
    const resFullName = document.getElementById('resFullName');
    const resPhone = document.getElementById('resPhone');
    
    if (mode === 'select') {
        if (selectGroup) selectGroup.style.display = 'block';
        if (newGroup) newGroup.style.display = 'none';
        if (resSelect) resSelect.required = true;
        if (resFullName) resFullName.required = false;
        if (resPhone) resPhone.required = false;
    } else {
        if (selectGroup) selectGroup.style.display = 'none';
        if (newGroup) newGroup.style.display = 'grid';
        if (resSelect) resSelect.required = false;
        if (resFullName) resFullName.required = true;
        if (resPhone) resPhone.required = true;
    }
}

async function handleAssignOccupant(e) {
    e.preventDefault();

    const residentRadio = document.querySelector('input[name="residentMode"]:checked');
    const residentMode = residentRadio ? residentRadio.value : 'select';
    
    const occupancyType = document.getElementById('resOccupancyType').value;

    try {
        let personId = null;

        if (residentMode === 'new') {
            const fullName = document.getElementById('resFullName').value;
            const phone = document.getElementById('resPhone').value;
            
            const personRes = await fetch('/api/persons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, phone, personId: phone })
            });
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
        if (occupancyType === 'TENANT' || occupancyType === 'SUB_TENANT') {
            const ownerRadio = document.querySelector('input[name="ownerMode"]:checked');
            const ownerMode = ownerRadio ? ownerRadio.value : 'select';

            if (ownerMode === 'new') {
                const newOwnerName = document.getElementById('newOwnerName').value;
                const newOwnerPhone = document.getElementById('newOwnerPhone').value;
                if (newOwnerName && newOwnerPhone) {
                    const ownerRes = await fetch('/api/persons', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fullName: newOwnerName, phone: newOwnerPhone, personId: newOwnerPhone })
                    });
                    const ownerPerson = await ownerRes.json();
                    rentedFromId = ownerPerson.id;
                }
            } else {
                const selectVal = document.getElementById('rentedFromSelect').value;
                if (selectVal) rentedFromId = parseInt(selectVal);
            }
        }

        const payload = {
            occupancyType: occupancyType,
            flat: { id: selectedFlatId },
            person: { id: personId },
            rentedFrom: rentedFromId ? { id: rentedFromId } : null
        };

        const occRes = await fetch('/api/occupancies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (occRes.ok) {
            closeAssignModal();
            loadBuildingsSection();
            loadDashboardStats();
        } else {
            alert('Failed to assign occupant');
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
    const password = document.getElementById('addPassword').value;
    const role = document.getElementById('addRole').value;

    try {
        const res = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, role, enabled: true })
        });

        if (res.ok) {
            closeAddUserModal();
            loadUserManagement();
            loadDashboardStats();
        } else {
            const msg = await res.text();
            alert('Failed to add user: ' + (msg || res.statusText));
        }
    } catch (err) {
        alert('Error adding user');
    }
}

async function loadUserManagement() {
    try {
        const res = await fetch('/api/users');
        const users = await res.json();
        const tbody = document.getElementById('userTableBody');
        tbody.innerHTML = '';

        users.forEach(u => {
            const tr = document.createElement('tr');
            const statusBtnClass = u.enabled ? 'btn-enabled' : 'btn-disabled';
            const statusText = u.enabled ? 'ENABLED' : 'DISABLED';

            tr.innerHTML = `
                <td><b>${u.username}</b></td>
                <td>${u.email}</td>
                <td>
                    <select onchange="changeUserRole(${u.id}, this.value)" style="background:var(--bg-input); color:var(--text-primary); border:1px solid var(--border-color); padding:4px 8px; border-radius:6px">
                        <option value="ADMIN" ${u.role === 'ADMIN' ? 'selected' : ''}>ADMIN</option>
                        <option value="RESIDENT" ${u.role === 'RESIDENT' ? 'selected' : ''}>RESIDENT</option>
                        <option value="STAFF" ${u.role === 'STAFF' ? 'selected' : ''}>STAFF</option>
                    </select>
                </td>
                <td>
                    <button class="btn-toggle-status ${statusBtnClass}" onclick="toggleUserStatus(${u.id})">
                        ${statusText}
                    </button>
                </td>
                <td>
                    <div style="display:flex; gap:6px">
                        <button onclick="openEditUserModal(${u.id}, '${u.username}', '${u.email}', '${u.role}')" style="background:var(--bg-input); color:var(--accent-blue); border:1px solid var(--border-color); padding:4px 8px; border-radius:6px; font-size:0.8rem; cursor:pointer">Edit</button>
                        <button onclick="deleteUser(${u.id})" style="background:rgba(244,63,94,0.2); color:var(--accent-rose); border:1px solid rgba(244,63,94,0.3); padding:4px 8px; border-radius:6px; font-size:0.8rem; cursor:pointer">Delete</button>
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
        const res = await fetch(`/api/users/${userId}/toggle-status`, { method: 'PUT' });
        if (res.ok) loadUserManagement();
    } catch (e) {
        alert('Failed to toggle status');
    }
}

async function changeUserRole(userId, newRole) {
    try {
        const res = await fetch(`/api/users/${userId}/role`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: newRole })
        });
        if (res.ok) alert('Role updated successfully!');
    } catch (e) {
        alert('Failed to update role');
    }
}

function openEditUserModal(id, username, email, role) {
    document.getElementById('editUserId').value = id;
    document.getElementById('editUsername').value = username;
    document.getElementById('editEmail').value = email;
    document.getElementById('editRole').value = role;
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
    const password = document.getElementById('editPassword').value;

    try {
        const payload = { username, email, role };
        if (password && password.trim().length > 0) payload.password = password;

        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            closeEditUserModal();
            loadUserManagement();
            loadDashboardStats();
        } else {
            alert('Failed to update user details');
        }
    } catch (err) {
        alert('Error updating user');
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user account?')) return;
    try {
        const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
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
    if (assetAdminRow) assetAdminRow.style.display = isAdmin ? 'grid' : 'none';

    const assetActionTh = document.getElementById('assetActionTh');
    if (assetActionTh) assetActionTh.style.display = isAdmin ? 'table-cell' : 'none';

    try {
        const [assetsRes, assignmentsRes] = await Promise.all([
            fetch('/api/assets'),
            fetch('/api/asset-assignments')
        ]);

        const assets = await assetsRes.json();
        const assignments = await assignmentsRes.json();

        if (isAdmin) {
            const assetSelect = document.getElementById('assignAssetSelect');
            if (assetSelect) {
                assetSelect.innerHTML = '<option value="">-- Select Asset --</option>';
                assets.forEach(a => {
                    assetSelect.innerHTML += `<option value="${a.id}">${a.name} (${a.type})</option>`;
                });
            }
        }

        const tbody = document.getElementById('assetAssignTableBody');
        tbody.innerHTML = '';

        if (!Array.isArray(assignments) || assignments.length === 0) {
            const colSpan = isAdmin ? 5 : 4;
            tbody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align:center; color:var(--text-secondary)">No active person assignments.</td></tr>`;
            return;
        }

        assignments.forEach(as => {
            const tr = document.createElement('tr');
            const actionTd = isAdmin ? `
                <td>
                    <button onclick="deleteAssetAssignment(${as.id})" style="background:rgba(244,63,94,0.2); color:var(--accent-rose); border:none; padding:4px 10px; border-radius:6px; font-size:0.8rem; cursor:pointer">
                        Unassign
                    </button>
                </td>
            ` : '';

            tr.innerHTML = `
                <td><b>${as.asset ? as.asset.name : 'N/A'}</b></td>
                <td><span class="occupant-badge badge-tenant">${as.asset ? as.asset.type : 'N/A'}</span></td>
                <td>${as.person ? as.person.fullName : 'N/A'} (ID: ${as.person ? as.person.personId : 'N/A'})</td>
                <td><b>${as.jobRole || 'Assignee'}</b></td>
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
    if (!currentUser || currentUser.role !== 'ADMIN') {
        alert('Only admin can add assets');
        return;
    }

    const name = document.getElementById('assetName').value;
    const type = document.getElementById('assetType').value;

    try {
        const res = await fetch('/api/assets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type })
        });
        if (res.ok) {
            document.getElementById('createAssetForm').reset();
            loadAssetSection();
            loadDashboardStats();
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
    const fullName = document.getElementById('assetPersonName').value;
    const phone = document.getElementById('assetPersonPhone').value;
    const personId = document.getElementById('assetPersonId').value;
    const jobRole = document.getElementById('assetJobRole').value;

    if (!assetId) {
        alert('Please select an asset to assign!');
        return;
    }

    try {
        const personRes = await fetch('/api/persons', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, phone, personId })
        });

        if (!personRes.ok) {
            alert('Failed to register person details');
            return;
        }
        const person = await personRes.json();

        const assignRes = await fetch('/api/asset-assignments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jobRole: jobRole,
                asset: { id: parseInt(assetId) },
                person: { id: person.id }
            })
        });

        if (assignRes.ok) {
            document.getElementById('assignAssetForm').reset();
            loadAssetSection();
            alert('Person assigned to asset successfully!');
        } else {
            const errText = await assignRes.text();
            alert('Failed to assign person to asset: ' + errText);
        }
    } catch (e) {
        alert('Error creating asset assignment');
    }
}

async function deleteAssetAssignment(id) {
    try {
        const res = await fetch(`/api/asset-assignments/${id}`, { method: 'DELETE' });
        if (res.ok) loadAssetSection();
    } catch (e) {
        alert('Failed to delete assignment');
    }
}

async function loadPersonsList() {
    try {
        const res = await fetch('/api/persons');
        const persons = await res.json();
        const tbody = document.getElementById('personTableBody');
        tbody.innerHTML = '';

        persons.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${p.id}</td>
                <td><b>${p.fullName}</b></td>
                <td>${p.phone || 'N/A'}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) { }
}

