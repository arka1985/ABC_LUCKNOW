// Core Application Controller - Rabies Surveillance System ("Benign Canine")
// Conceptualised & Developed by Dr. Arkaprabha Sau and Prof. Manish Kumar Singh

// Pre-defined database of canine biometric records for the AI Matcher
// Starts empty — populated by authenticated Local Administration via ABC registration form
window.AI_DOG_REGISTRY = [];

// ─────────────────────────────────────────────────────────────────────────────
// AUTHENTICATION SYSTEM
// Super Admin: Municipal Commissioner  |  ID: lmc  |  Password: lmc@2026
// Local Admin & Health Authority accounts are created/deleted by Super Admin only
// ─────────────────────────────────────────────────────────────────────────────
window.AUTH_SYSTEM = {
  // Active session — null when no one is logged in
  currentUser: null,

  // User store — super admin is pre-seeded; other accounts added by super admin
  users: [
    {
      id: 'lmc',
      password: 'lmc@2026',
      role: 'admin',           // 'admin' = Local Administration
      displayName: 'Municipal Commissioner',
      designation: 'Super Administrator — Lucknow Municipal Corporation',
      isSuperAdmin: true,
      createdAt: new Date().toISOString()
    }
  ],

  // Authenticate user — returns user object or null
  authenticate(userId, password) {
    return this.users.find(u => u.id === userId && u.password === password) || null;
  },

  // Add a new account (only super admin should call this)
  addUser(id, password, role, displayName, designation) {
    if (this.users.find(u => u.id === id)) return { ok: false, msg: `User ID "${id}" already exists.` };
    this.users.push({ id, password, role, displayName, designation, isSuperAdmin: false, createdAt: new Date().toISOString() });
    return { ok: true };
  },

  // Delete an account (cannot delete super admin)
  deleteUser(id) {
    const u = this.users.find(u => u.id === id);
    if (!u) return { ok: false, msg: 'User not found.' };
    if (u.isSuperAdmin) return { ok: false, msg: 'Cannot delete Super Administrator account.' };
    this.users = this.users.filter(u => u.id !== id);
    return { ok: true };
  },

  // Log out
  logout() {
    this.currentUser = null;
  }
};

// ── Show the login modal for a requested portal role ────────────────────────
window.showLoginModal = function(requestedRole) {
  // Remove any existing modal
  const existing = document.getElementById('auth-login-modal');
  if (existing) existing.remove();

  const roleLabel = requestedRole === 'admin' ? 'Local Administration' : 'Health Authority';
  const roleIcon  = requestedRole === 'admin' ? 'fa-user-gear' : 'fa-hospital-user';
  const roleColor = requestedRole === 'admin' ? '#7c3aed' : '#0891b2';

  const modal = document.createElement('div');
  modal.id = 'auth-login-modal';
  modal.className = 'auth-modal-overlay';
  modal.innerHTML = `
    <div class="auth-modal-card" role="dialog" aria-modal="true" aria-label="Login">
      <div class="auth-modal-header" style="border-top: 4px solid ${roleColor};">
        <div class="auth-modal-icon" style="background: ${roleColor}15; color: ${roleColor};">
          <i class="fa-solid ${roleIcon}"></i>
        </div>
        <div>
          <h2 class="auth-modal-title">${roleLabel}</h2>
          <p class="auth-modal-subtitle">Secure Authentication Required</p>
        </div>
        <button class="auth-modal-close" onclick="document.getElementById('auth-login-modal').remove()" title="Cancel">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form class="auth-modal-form" id="auth-login-form" onsubmit="window.handleLogin(event, '${requestedRole}')">
        <div class="auth-form-group">
          <label for="auth-userid"><i class="fa-solid fa-id-badge"></i> User ID</label>
          <input type="text" id="auth-userid" class="auth-input" placeholder="Enter your User ID" autocomplete="username" required>
        </div>
        <div class="auth-form-group">
          <label for="auth-password"><i class="fa-solid fa-lock"></i> Password</label>
          <div style="position:relative;">
            <input type="password" id="auth-password" class="auth-input" placeholder="Enter your password" autocomplete="current-password" required>
            <button type="button" class="auth-pwd-toggle" onclick="window.toggleAuthPwd()" title="Show/Hide password">
              <i class="fa-solid fa-eye" id="auth-pwd-eye"></i>
            </button>
          </div>
        </div>
        <div id="auth-error-msg" class="auth-error" style="display:none;"></div>
        <button type="submit" class="auth-submit-btn" style="background: ${roleColor};">
          <i class="fa-solid fa-right-to-bracket"></i> Sign In Securely
        </button>
      </form>

      <div class="auth-modal-footer">
        <i class="fa-solid fa-shield-halved"></i>
        Access restricted to authorised personnel only · Lucknow Municipal Corporation
      </div>
    </div>`;

  document.body.appendChild(modal);
  // Auto-focus user ID field
  setTimeout(() => document.getElementById('auth-userid')?.focus(), 80);
};

// ── Handle login form submission ─────────────────────────────────────────────
window.handleLogin = function(e, requestedRole) {
  e.preventDefault();
  const userId   = document.getElementById('auth-userid').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl    = document.getElementById('auth-error-msg');

  const user = window.AUTH_SYSTEM.authenticate(userId, password);

  if (!user) {
    errEl.textContent = '❌ Invalid User ID or Password. Please try again.';
    errEl.style.display = 'block';
    document.getElementById('auth-password').value = '';
    return;
  }

  // Role check: admin users can only enter admin, authority users only enter authority
  // Super admin can enter both
  if (!user.isSuperAdmin && user.role !== requestedRole) {
    errEl.textContent = `❌ Your account does not have access to the ${requestedRole === 'admin' ? 'Local Administration' : 'Health Authority'} portal.`;
    errEl.style.display = 'block';
    return;
  }

  // Login success
  window.AUTH_SYSTEM.currentUser = user;
  document.getElementById('auth-login-modal').remove();

  // Proceed into the requested portal
  window._enterPortalAuthenticated(requestedRole, user);
};

// ── Toggle password visibility ───────────────────────────────────────────────
window.toggleAuthPwd = function() {
  const input = document.getElementById('auth-password');
  const eye   = document.getElementById('auth-pwd-eye');
  if (input.type === 'password') {
    input.type = 'text';
    eye.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    eye.className = 'fa-solid fa-eye';
  }
};

// ── Enter portal after successful authentication ─────────────────────────────
window._enterPortalAuthenticated = function(role, user) {
  const hubOverlay = document.getElementById('portal-hub-overlay');
  const mainLayout = document.getElementById('portal-main-workspace');
  const sidebarPanels = document.querySelectorAll('.dashboard-panel');
  const roleButtons   = document.querySelectorAll('.role-nav-btn');

  document.body.className = `role-active-${role}`;

  hubOverlay.classList.remove('active');
  mainLayout.classList.add('active');

  roleButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-role') === role);
  });

  sidebarPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `${role}-panel`);
  });

  if (window.map && typeof window.map.invalidateSize === 'function') {
    setTimeout(() => window.map.invalidateSize(), 200);
  }

  // Show logout button & user badge in header
  renderAuthHeader(user, role);

  // If super admin, inject user management panel inside admin panel
  if (user.isSuperAdmin && role === 'admin') {
    renderUserManagementPanel();
  }

  window.dispatchNotification(
    `✅ Welcome, ${user.displayName}`,
    `Signed in as ${user.designation}`,
    'success'
  );
};

// ── Render logged-in user badge + logout button in header ────────────────────
function renderAuthHeader(user, role) {
  // Remove existing badge if any
  const existing = document.getElementById('auth-header-badge');
  if (existing) existing.remove();

  const nav = document.querySelector('.role-navigation');
  if (!nav) return;

  const badge = document.createElement('div');
  badge.id = 'auth-header-badge';
  badge.style.cssText = `
    display: flex; align-items: center; gap: 0.5rem;
    background: rgba(255,255,255,0.85); backdrop-filter: blur(8px);
    border: 1.5px solid rgba(8,145,178,0.22); border-radius: 24px;
    padding: 0.3rem 0.75rem 0.3rem 0.5rem; font-size: 0.75rem;
    color: var(--text-dark); font-weight: 600; flex-shrink: 0;
  `;
  badge.innerHTML = `
    <span style="width:28px;height:28px;border-radius:50%;background:${role==='admin'?'#7c3aed':'#0891b2'};
      display:flex;align-items:center;justify-content:center;color:white;font-size:0.75rem;">
      <i class="fa-solid ${role==='admin'?'fa-user-gear':'fa-hospital-user'}"></i>
    </span>
    <span class="bhashini-skip-translation" style="max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"
      title="${user.displayName}">${user.displayName}</span>
    <button onclick="window.logoutUser()" title="Sign Out"
      style="display:flex;align-items:center;gap:0.25rem;padding:0.2rem 0.5rem;border-radius:12px;
        background:rgba(220,38,38,0.1);color:#dc2626;border:1px solid rgba(220,38,38,0.25);
        font-size:0.7rem;font-weight:700;cursor:pointer;transition:all 0.2s ease;">
      <i class="fa-solid fa-right-from-bracket"></i> Logout
    </button>`;
  nav.insertAdjacentElement('afterend', badge);
}

// ── Logout ───────────────────────────────────────────────────────────────────
window.logoutUser = function() {
  window.AUTH_SYSTEM.logout();
  const badge = document.getElementById('auth-header-badge');
  if (badge) badge.remove();
  const mgmt = document.getElementById('user-mgmt-panel');
  if (mgmt) mgmt.remove();
  window.switchAccessPortal('hub');
  window.dispatchNotification('👋 Signed Out', 'You have been securely logged out.', 'info');
};

// ── Super Admin: User Management Panel ──────────────────────────────────────
function renderUserManagementPanel() {
  // Remove existing panel if already there
  const existing = document.getElementById('user-mgmt-panel');
  if (existing) existing.remove();

  const adminPanel = document.getElementById('admin-panel');
  if (!adminPanel) return;

  const panel = document.createElement('div');
  panel.id = 'user-mgmt-panel';
  panel.className = 'glass-card';
  panel.style.marginTop = '1rem';
  panel.innerHTML = buildUserMgmtHTML();
  adminPanel.appendChild(panel);
}

function buildUserMgmtHTML() {
  const users = window.AUTH_SYSTEM.users;
  const rows = users.map(u => `
    <tr>
      <td><code style="font-size:0.78rem;">${u.id}</code></td>
      <td>${u.displayName}</td>
      <td>
        <span style="font-size:0.65rem;padding:0.15rem 0.4rem;border-radius:4px;font-weight:800;text-transform:uppercase;
          background:${u.role==='admin'?'rgba(124,58,237,0.12)':'rgba(8,145,178,0.12)'};
          color:${u.role==='admin'?'#7c3aed':'#0891b2'};">
          ${u.role==='admin'?'Local Admin':'Health Authority'}
          ${u.isSuperAdmin?' 👑':''}
        </span>
      </td>
      <td>${u.designation}</td>
      <td>
        ${u.isSuperAdmin ? '<span style="font-size:0.7rem;color:var(--text-muted);">Protected</span>' :
          `<button onclick="window.deleteUserAccount('${u.id}')"
            style="font-size:0.68rem;padding:0.2rem 0.45rem;border-radius:4px;background:rgba(220,38,38,0.1);
              color:#dc2626;border:1px solid rgba(220,38,38,0.3);cursor:pointer;font-weight:700;">
            <i class="fa-solid fa-trash-can"></i> Remove
          </button>`}
      </td>
    </tr>`).join('');

  return `
    <h3 style="display:flex;align-items:center;gap:0.5rem;">
      <i class="fa-solid fa-users-gear text-primary"></i> User Account Management
      <span style="font-size:0.65rem;padding:0.15rem 0.5rem;border-radius:10px;background:rgba(124,58,237,0.12);
        color:#7c3aed;font-weight:800;text-transform:uppercase;">Super Admin Only</span>
    </h3>
    <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:0.75rem;">
      Create or remove Local Administration and Health Authority accounts below.
    </p>

    <div style="overflow-x:auto;">
      <table class="inventory-table" id="user-mgmt-table">
        <thead>
          <tr>
            <th>User ID</th><th>Name</th><th>Role</th><th>Designation</th><th>Action</th>
          </tr>
        </thead>
        <tbody id="user-mgmt-tbody">${rows}</tbody>
      </table>
    </div>

    <div style="margin-top:1rem;border-top:1px solid var(--glass-border);padding-top:0.85rem;">
      <h4 style="font-size:0.82rem;font-weight:800;margin-bottom:0.6rem;display:flex;align-items:center;gap:0.35rem;">
        <i class="fa-solid fa-user-plus text-primary"></i> Create New Account
      </h4>
      <form id="create-user-form" onsubmit="window.createUserAccount(event)"
        style="display:grid;grid-template-columns:1fr 1fr;gap:0.55rem;">
        <div class="form-group" style="margin:0;">
          <label style="font-size:0.72rem;">User ID</label>
          <input type="text" id="new-user-id" class="glass-input" placeholder="e.g. health01" required>
        </div>
        <div class="form-group" style="margin:0;">
          <label style="font-size:0.72rem;">Password</label>
          <input type="password" id="new-user-pwd" class="glass-input" placeholder="Set a strong password" required>
        </div>
        <div class="form-group" style="margin:0;">
          <label style="font-size:0.72rem;">Full Name / Display Name</label>
          <input type="text" id="new-user-name" class="glass-input" placeholder="e.g. Dr. Anjali Verma" required>
        </div>
        <div class="form-group" style="margin:0;">
          <label style="font-size:0.72rem;">Role</label>
          <select id="new-user-role" class="glass-select">
            <option value="admin">Local Administration</option>
            <option value="authority">Health Authority</option>
          </select>
        </div>
        <div class="form-group" style="margin:0;grid-column:1/-1;">
          <label style="font-size:0.72rem;">Designation / Title</label>
          <input type="text" id="new-user-desig" class="glass-input" placeholder="e.g. Veterinary Officer, Zone 3" required>
        </div>
        <div id="create-user-error" style="display:none;grid-column:1/-1;font-size:0.75rem;color:#dc2626;font-weight:600;"></div>
        <button type="submit" class="glass-btn primary" style="grid-column:1/-1;justify-content:center;margin-top:0.25rem;">
          <i class="fa-solid fa-user-plus"></i> Create Account
        </button>
      </form>
    </div>`;
}

window.createUserAccount = function(e) {
  e.preventDefault();
  const id    = document.getElementById('new-user-id').value.trim();
  const pwd   = document.getElementById('new-user-pwd').value;
  const name  = document.getElementById('new-user-name').value.trim();
  const role  = document.getElementById('new-user-role').value;
  const desig = document.getElementById('new-user-desig').value.trim();
  const errEl = document.getElementById('create-user-error');

  const result = window.AUTH_SYSTEM.addUser(id, pwd, role, name, desig);
  if (!result.ok) {
    errEl.textContent = '❌ ' + result.msg;
    errEl.style.display = 'block';
    return;
  }
  errEl.style.display = 'none';
  document.getElementById('create-user-form').reset();

  // Refresh the whole panel
  const panel = document.getElementById('user-mgmt-panel');
  if (panel) panel.innerHTML = buildUserMgmtHTML();

  window.dispatchNotification('✅ Account Created', `User "${id}" (${role === 'admin' ? 'Local Admin' : 'Health Authority'}) created successfully.`, 'success');
};

window.deleteUserAccount = function(id) {
  if (!confirm(`Remove account "${id}"? This action cannot be undone.`)) return;
  const result = window.AUTH_SYSTEM.deleteUser(id);
  if (!result.ok) {
    window.dispatchNotification('❌ Error', result.msg, 'danger');
    return;
  }
  const panel = document.getElementById('user-mgmt-panel');
  if (panel) panel.innerHTML = buildUserMgmtHTML();
  window.dispatchNotification('🗑️ Account Removed', `User "${id}" has been deleted.`, 'success');
};

// Helper to find the nearest ward & zone in Lucknow for coordinate tracking
function findNearestLucknowWard(lat, lng) {
  if (!window.LUCKNOW_GEOJSON) return { zone: "5", ward: "Sarojni Nagar Part 1" };

  let minDistance = Infinity;
  let bestWard = "Sarojni Nagar Part 1";
  let bestZone = "5";

  window.LUCKNOW_GEOJSON.features.forEach(feature => {
    const props = feature.properties;
    const geom = feature.geometry;

    let cLat = 26.8467;
    let cLng = 80.9462;

    if (geom.type === "Polygon" && geom.coordinates[0] && geom.coordinates[0][0]) {
      cLat = geom.coordinates[0][0][1];
      cLng = geom.coordinates[0][0][0];
    } else if (geom.type === "MultiPolygon" && geom.coordinates[0] && geom.coordinates[0][0] && geom.coordinates[0][0][0]) {
      cLat = geom.coordinates[0][0][0][1];
      cLng = geom.coordinates[0][0][0][0];
    }

    const dist = Math.pow(cLat - lat, 2) + Math.pow(cLng - lng, 2);
    if (dist < minDistance) {
      minDistance = dist;
      bestWard = props["Ward Name"] || "Unknown Ward";
      bestZone = props.Zone ? String(props.Zone) : "5";
    }
  });

  return { zone: bestZone, ward: bestWard };
}

// Robust Unified Platform Initializer
function initAll() {
  console.log("[App Engine] Launching Benign Canine Surveillance Platform...");
  
  // 1. Initialise Bhashini Multilingual floating selector
  try {
    if (typeof window.createBhashiniWidget === 'function') {
      window.createBhashiniWidget();
    } else {
      console.warn("[App Engine] Bhashini widget function not defined.");
    }
  } catch (err) {
    console.error("[App Engine] Bhashini initialization failed:", err);
  }
  
  // 2. Initialise GIS Map Engine
  try {
    if (typeof window.initMap === 'function') {
      window.initMap();
    } else {
      console.warn("[App Engine] GIS Map engine function not defined.");
    }
  } catch (err) {
    console.error("[App Engine] GIS Map engine initialization failed:", err);
  }
  
  // 3. Register Role Switching / Portal Router Listeners
  try {
    setupRoleSwitcher();
  } catch (err) {
    console.error("[App Engine] Role switcher listener setup failed:", err);
  }
  
  // 4. Register Form Submission Handlers
  try {
    setupFormHandlers();
  } catch (err) {
    console.error("[App Engine] Form handlers setup failed:", err);
  }
  
  // 5. Connect GPS Geolocation Capturer
  try {
    setupGeolocation();
  } catch (err) {
    console.error("[App Engine] Geolocation setup failed:", err);
  }
  
  // 6. Connect PEP Vaccine Schedule Calculator
  try {
    setupPEPTracker();
  } catch (err) {
    console.error("[App Engine] PEP Tracker setup failed:", err);
  }
  
  // 7. Connect AI Canine Face Scanning Tool
  try {
    setupAIScanner();
  } catch (err) {
    console.error("[App Engine] AI Face Scanner setup failed:", err);
  }

  // Load default welcome alert
  try {
    if (typeof window.dispatchNotification === 'function') {
      window.dispatchNotification("🐶 Benign Canine Active", "Welcome! Platform initialized with bright light theme and cute emojis 🐾.", "info");
    }
  } catch (err) {
    console.error("[App Engine] Welcome alert notification failed:", err);
  }
}

// Bypasses browser cache timing / local file DOMContentLoaded race conditions
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}

// Setup dynamic panel display depending on selected active access role
function setupRoleSwitcher() {
  // Portal landing card clicks
  const portalCards = document.querySelectorAll('.hub-portal-card');
  
  portalCards.forEach(card => {
    card.addEventListener('click', () => {
      const selectedRole = card.getAttribute('data-portal');
      window.switchAccessPortal(selectedRole);
    });
  });

  // Direct enter button click triggers (super robust fallback)
  const enterBtns = document.querySelectorAll('.hub-enter-btn');
  enterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.hub-portal-card');
      if (card) {
        const selectedRole = card.getAttribute('data-portal');
        window.switchAccessPortal(selectedRole);
      }
    });
  });

  // Top header quick navigation toggler links
  const roleButtons = document.querySelectorAll('.role-nav-btn');
  roleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedRole = button.getAttribute('data-role');
      window.switchAccessPortal(selectedRole);
    });
  });

  // Exit back to portal selections hub overlay link
  const backHubBtn = document.getElementById('back-to-hub-btn');
  if (backHubBtn) {
    backHubBtn.addEventListener('click', () => {
      window.switchAccessPortal('hub');
    });
  }
}

// Unified portal navigation switcher to display individual portal elements cleanly
window.switchAccessPortal = function(role) {
  const hubOverlay = document.getElementById('portal-hub-overlay');
  const mainLayout = document.getElementById('portal-main-workspace');

  // ── Auth gate: admin and authority portals require login ─────────────────
  if (role === 'admin' || role === 'authority') {
    const cu = window.AUTH_SYSTEM && window.AUTH_SYSTEM.currentUser;
    // Not logged in → show login modal
    if (!cu) {
      window.showLoginModal(role);
      return;
    }
    // Logged in but wrong role (non-super-admin switching to a different portal)
    if (!cu.isSuperAdmin && cu.role !== role) {
      window.showLoginModal(role);
      return;
    }
    // Already logged in with correct role → proceed via authenticated path
    window._enterPortalAuthenticated(role, cu);
    return;
  }
  // ─────────────────────────────────────────────────────────────────────────

  const sidebarPanels = document.querySelectorAll('.dashboard-panel');
  const roleButtons = document.querySelectorAll('.role-nav-btn');
  
  // Update body role status class for global styled properties
  document.body.className = `role-active-${role}`;
  
  if (role === 'hub') {
    // Reveal main landing portal selector hub and hide dashboards
    hubOverlay.classList.add('active');
    mainLayout.classList.remove('active');
    return;
  }
  
  // Citizen portal — no auth required
  hubOverlay.classList.remove('active');
  mainLayout.classList.add('active');
  
  roleButtons.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-role') === role);
  });

  sidebarPanels.forEach(panel => {
    panel.classList.toggle('active', panel.id === `${role}-panel`);
  });

  if (window.map && typeof window.map.invalidateSize === 'function') {
    setTimeout(() => window.map.invalidateSize(), 200);
  }

  window.dispatchNotification("Portal Entered 🐾", `You have entered the ${role.toUpperCase()} module!`, "success");
};


// Connect automatic smartphone Geolocation capture
function setupGeolocation() {
  const gpsBtn = document.getElementById('capture-gps-btn');
  const gpsStatus = document.getElementById('gps-status-indicator');
  const latInput = document.getElementById('form-latitude');
  const lngInput = document.getElementById('form-longitude');
  
  if (!gpsBtn) return;
  
  gpsBtn.addEventListener('click', () => {
    gpsStatus.textContent = "🛰️ Querying satellite coordinates...";
    gpsStatus.className = "gps-indicator loading";
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lng = position.coords.longitude.toFixed(6);
          
          latInput.value = lat;
          lngInput.value = lng;
          
          gpsStatus.textContent = `✅ GPS Locked: ${lat}, ${lng} 📍`;
          gpsStatus.className = "gps-indicator success";
          window.dispatchNotification("🛰️ Geolocation Locked", `Lock secured: ${lat}, ${lng}`, "success");
        },
        (error) => {
          // Automatic Geolocation failed - guide user to enter coordinates manually
          gpsStatus.textContent = `⚠️ GPS Failed. Please enter coordinates manually 📍`;
          gpsStatus.className = "gps-indicator warning";
          
          // Visually highlight the fields to draw user's attention
          latInput.focus();
          latInput.style.borderColor = 'var(--warning)';
          lngInput.style.borderColor = 'var(--warning)';
          setTimeout(() => {
            latInput.style.borderColor = '';
            lngInput.style.borderColor = '';
          }, 3000);
          
          window.dispatchNotification("🛰️ Geolocation Offline", "Please enter your coordinates manually in the inputs below.", "warning");
          console.warn("[Geolocation] GPS query failed or blocked. User guided to manual entry.", error);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      gpsStatus.textContent = "⚠️ GPS Not Supported. Please enter manually.";
      gpsStatus.className = "gps-indicator warning";
      latInput.focus();
    }
  });
}

// Post-Exposure Prophylaxis (PEP) Vaccine Schedule Calculator
// Post-Exposure Prophylaxis (PEP) & Re-Exposure Vaccine Schedule Calculator
function setupPEPTracker() {
  const regimenTypeSelect = document.getElementById('pep-regimen-type');
  const exposureDateInput = document.getElementById('exposure-date-input');
  const dose0DateInput = document.getElementById('vaccine-dose0-input');
  const severitySelect = document.getElementById('pep-incident-severity');
  const rigStatusSelect = document.getElementById('pep-rig-status');
  const rigContainer = document.getElementById('pep-rig-container');
  const adviceBox = document.getElementById('pep-medical-advice-box');
  const timeline = document.getElementById('pep-schedule-timeline');
  const completionBar = document.getElementById('pep-progress-fill');
  const completionText = document.getElementById('pep-progress-percentage');

  if (!exposureDateInput || !dose0DateInput || !timeline) return;

  // Sync Dose 0 date to Exposure Date by default if Dose 0 is not set yet
  exposureDateInput.addEventListener('change', () => {
    if (exposureDateInput.value && !dose0DateInput.value) {
      dose0DateInput.value = exposureDateInput.value;
    }
    calculateVaccineTimeline();
  });

  // Attach recalculate event listeners to all parameters
  [regimenTypeSelect, dose0DateInput, severitySelect, rigStatusSelect].forEach(element => {
    if (element) {
      element.addEventListener('change', calculateVaccineTimeline);
    }
  });

  function calculateVaccineTimeline() {
    const regimen = regimenTypeSelect ? regimenTypeSelect.value : 'pep';
    const exposureVal = exposureDateInput.value;
    const dose0Val = dose0DateInput.value || exposureVal;
    const severity = severitySelect ? severitySelect.value : 'Category III';
    const rigStatus = rigStatusSelect ? rigStatusSelect.value : 'no';

    if (!dose0Val) {
      timeline.innerHTML = `<p style="font-size: 0.8rem; text-align: center; color: var(--text-muted);">Please configure Dose 0 vaccination date above to calculate timelines.</p>`;
      if (adviceBox) adviceBox.innerHTML = '';
      return;
    }

    // 1. Manage RIG question container visibility
    const isCategoryIII = severity === 'Category III';
    const isPEP = regimen === 'pep';
    if (rigContainer) {
      rigContainer.style.display = (isPEP && isCategoryIII) ? 'block' : 'none';
    }

    // 2. Render Medical Advice & Critical RIG Alerts
    if (adviceBox) {
      let adviceHtml = `
        <div class="glass-card" style="background: rgba(8, 145, 178, 0.05); border-color: rgba(8, 145, 178, 0.25); padding: 0.85rem; border-radius: var(--radius-sm);">
          <strong style="color: var(--primary); font-size: 0.78rem; display: block; margin-bottom: 0.25rem;"><i class="fa-solid fa-user-doctor"></i> Mandatory Medical Consultation Guidance</strong>
          <p style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.35; margin: 0;">
            Immediate washing of bite wounds with soap and running water for 15 minutes is vital. Professional assessment at a public health center (listed below) is mandatory for active immunization and immunoglobulin infiltration.
          </p>
        </div>
      `;

      if (isPEP && isCategoryIII) {
        if (rigStatus === 'no') {
          adviceHtml += `
            <div class="glass-card animate-pulse" style="background: rgba(220, 38, 38, 0.07); border-color: rgba(220, 38, 38, 0.35); padding: 0.85rem; border-width: 1.5px; border-radius: var(--radius-sm);">
              <strong style="color: var(--danger); font-size: 0.78rem; display: block; margin-bottom: 0.25rem;"><i class="fa-solid fa-triangle-exclamation"></i> CRITICAL ALARM: IMMUNOGLOBULIN REQUIRED!</strong>
              <p style="font-size: 0.7rem; color: var(--text-dark); line-height: 1.35; font-weight: 600; margin: 0;">
                Category III transdermal bite exposures carry high viral loads and require immediate Rabies Immunoglobulin (RIG) infiltrated directly around all wounds within 7 days of Dose 0. Delaying RIG is highly dangerous! Please report to the nearest Govt. Healthcare facility immediately!
              </p>
            </div>
          `;
        } else {
          adviceHtml += `
            <div class="glass-card" style="background: rgba(16, 185, 129, 0.06); border-color: rgba(16, 185, 129, 0.35); padding: 0.85rem; border-radius: var(--radius-sm);">
              <strong style="color: var(--accent); font-size: 0.78rem; display: block; margin-bottom: 0.25rem;"><i class="fa-solid fa-circle-check"></i> Immunoglobulin (RIG) Registered</strong>
              <p style="font-size: 0.7rem; color: var(--text-muted); line-height: 1.35; margin: 0;">
                Excellent. Immunoglobulin passive protection is active alongside the active vaccine regimen. Proceed to complete all booster schedules.
              </p>
            </div>
          `;
        }
      }
      adviceBox.innerHTML = adviceHtml;
    }

    // 3. Define Doses based on Regimen
    let dosesRegimen = [];
    if (regimen === 'pep') {
      dosesRegimen = [
        { day: 0, label: "Dose 1 (Day 0) - Immediate Vaccination", desc: "Initiates active antibody creation." },
        { day: 3, label: "Dose 2 (Day 3) - Booster 1", desc: "Maintains active immune stimulation." },
        { day: 7, label: "Dose 3 (Day 7) - Booster 2", desc: "Reinforces antibody counts." },
        { day: 14, label: "Dose 4 (Day 14) - Booster 3", desc: "Strengthens cellular defense shields." },
        { day: 28, label: "Dose 5 (Day 28) - Final Safeguard", desc: "Locks in permanent long-term safety immunity." }
      ];
    } else {
      // Re-Exposure Regimen: Day 0 and Day 3 only!
      dosesRegimen = [
        { day: 0, label: "Dose 1 (Day 0) - Re-Exposure Vaccination", desc: "Triggers secondary immune memory recall instantly." },
        { day: 3, label: "Dose 2 (Day 3) - Booster Recall", desc: "Secures booster shield reinforcement." }
      ];
    }

    const baseDate = new Date(dose0Val);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today for date compare

    timeline.innerHTML = "";
    let completedCount = 0;
    let nextDoseFound = false;

    // Load checklist completions from localStorage to persist user checkboxes
    const storageKeyPrefix = `benign_pep_completed_${regimen}_${dose0Val}_`;

    dosesRegimen.forEach((dose, index) => {
      const targetDate = new Date(baseDate);
      targetDate.setDate(baseDate.getDate() + dose.day);
      targetDate.setHours(0, 0, 0, 0);

      const formattedDate = targetDate.toLocaleDateString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric'
      });

      // Retrieve completion state from localStorage, or default to checking off past doses automatically
      const storageKey = storageKeyPrefix + index;
      const isPast = targetDate < today;
      let isCompleted = localStorage.getItem(storageKey) === 'true';
      if (localStorage.getItem(storageKey) === null && isPast) {
        // Default checking off past dates
        isCompleted = true;
        localStorage.setItem(storageKey, 'true');
      }

      if (isCompleted) {
        completedCount++;
      }

      // Check if dose has been MISSED (overdue)
      const isMissed = isPast && !isCompleted;

      // Identify the Next Dose (first incomplete or future dose)
      let isNextDose = false;
      if (!isCompleted && !nextDoseFound) {
        isNextDose = true;
        nextDoseFound = true;
      }

      const statusClass = isCompleted ? 'completed' : (isMissed ? 'missed' : 'upcoming');
      
      const timelineCard = document.createElement('div');
      timelineCard.className = `pep-timeline-card ${statusClass}`;
      if (isNextDose) timelineCard.style.borderColor = 'var(--primary)';
      if (isMissed) timelineCard.style.borderColor = 'var(--danger)';

      let doseBadgeHtml = `<span class="status-badge fill-${isCompleted ? 'completed' : 'upcoming'}">${isCompleted ? 'Completed' : 'Upcoming'}</span>`;
      if (isMissed) {
        doseBadgeHtml = `<span class="status-badge" style="background: rgba(220, 38, 38, 0.15); color: var(--danger); border: 1px solid rgba(220, 38, 38, 0.3); font-weight: 800; animation: pulse-op 1.5s infinite;">OVERDUE / MISSED!</span>`;
      } else if (isNextDose) {
        doseBadgeHtml = `<span class="status-badge" style="background: rgba(8, 145, 178, 0.15); color: var(--primary); border: 1px solid rgba(8, 145, 178, 0.3); font-weight: 800;">NEXT DOSE</span>` + doseBadgeHtml;
      }

      timelineCard.innerHTML = `
        <div class="pep-card-check">
          <input type="checkbox" id="dose-chk-${index}" ${isCompleted ? 'checked' : ''} style="cursor: pointer;">
          <label for="dose-chk-${index}"></label>
        </div>
        <div class="pep-card-details">
          <h4 style="font-size: 0.82rem; font-weight: 800; color: ${isMissed ? 'var(--danger)' : 'var(--text-dark)'};">${dose.label}</h4>
          <span class="pep-date">📅 ${formattedDate} ${isNextDose ? '← Next Vaccine Appointment' : ''}</span>
          <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.15rem;">${dose.desc}</p>
        </div>
        <div class="pep-card-status" style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.25rem;">
          ${doseBadgeHtml}
        </div>
      `;

      // Bind dynamic manual checkbox completion click handlers
      const chk = timelineCard.querySelector(`#dose-chk-${index}`);
      if (chk) {
        chk.addEventListener('change', () => {
          localStorage.setItem(storageKey, chk.checked ? 'true' : 'false');
          calculateVaccineTimeline();
        });
      }

      timeline.appendChild(timelineCard);
    });

    // Update visual progress bars
    const progressPercent = Math.round((completedCount / dosesRegimen.length) * 100);
    if (completionBar) completionBar.style.width = `${progressPercent}%`;
    if (completionText) completionText.textContent = `${progressPercent}% Doses Administered`;
  }

  // Trigger default initialization
  calculateVaccineTimeline();
}

// Setup Admin Register, CNVR inputs & Citizen report form submissions
function setupFormHandlers() {
  // 1. Citizen Exposure & Bite Report Form
  const reportForm = document.getElementById('citizen-report-form');
  const hasBiteCheckbox = document.getElementById('form-has-bite');
  const victimDetailsContainer = document.getElementById('victim-details-container');
  const victimCountInput = document.getElementById('form-victim-count');
  const victimNameInput = document.getElementById('form-victim-name');
  const victimAddressInput = document.getElementById('form-victim-address');

  if (hasBiteCheckbox && victimDetailsContainer) {
    hasBiteCheckbox.addEventListener('change', () => {
      const multBox = document.getElementById('multiple-victims-box');
      const otherDetails = document.getElementById('form-other-victims-details');
      if (hasBiteCheckbox.checked) {
        victimDetailsContainer.style.display = 'flex';
        victimCountInput.required = true;
        // Name and Address are intentionally optional (not required)
        victimNameInput.required = false;
        victimAddressInput.required = false;
        
        const count = parseInt(victimCountInput.value) || 1;
        if (multBox) {
          multBox.style.display = count > 1 ? 'flex' : 'none';
          if (otherDetails) otherDetails.required = count > 1;
        }
      } else {
        victimDetailsContainer.style.display = 'none';
        victimCountInput.required = false;
        victimNameInput.required = false;
        victimAddressInput.required = false;
        if (multBox) {
          multBox.style.display = 'none';
          if (otherDetails) otherDetails.required = false;
        }
      }
    });

    // Add direct input listener to count field to dynamically show/hide multiple-victims-box!
    victimCountInput.addEventListener('input', () => {
      const count = parseInt(victimCountInput.value) || 1;
      const multBox = document.getElementById('multiple-victims-box');
      const otherDetails = document.getElementById('form-other-victims-details');
      if (hasBiteCheckbox.checked && multBox) {
        multBox.style.display = count > 1 ? 'flex' : 'none';
        if (otherDetails) otherDetails.required = count > 1;
      } else if (multBox) {
        multBox.style.display = 'none';
        if (otherDetails) otherDetails.required = false;
      }
    });
  }

  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-full-name').value || "Anonymous Citizen";
      const phone = document.getElementById('form-phone').value || "N/A";
      const animal = document.getElementById('form-animal-type').value;
      const behavior = document.getElementById('form-animal-behavior').value;
      const desc = document.getElementById('form-animal-description').value || "No behavior comments.";
      const lat = parseFloat(document.getElementById('form-latitude').value) || 26.8467;
      const lng = parseFloat(document.getElementById('form-longitude').value) || 80.9462;
      
      // Determine severity & victim details based on checkbox check
      const hasBite = hasBiteCheckbox ? hasBiteCheckbox.checked : false;
      const bittenCount = hasBite ? (parseInt(victimCountInput.value) || 1) : 0;
      const victimName = hasBite ? (victimNameInput.value || "Unknown") : "N/A";
      const victimAddress = hasBite ? (victimAddressInput.value || "Unknown") : "N/A";
      const severity = hasBite ? document.getElementById('form-bite-severity').value : "Category I";
      
      const otherVictims = hasBite && bittenCount > 1 ? (document.getElementById('form-other-victims-details').value || "No details provided.") : "N/A";
      const exposurePattern = hasBite && bittenCount > 1 ? document.getElementById('form-exposure-pattern').value : "N/A";
      
      // Resolve nearest Lucknow ward and zone programmatically
      const resolvedGeo = findNearestLucknowWard(lat, lng);

      const newBite = {
        id: window.SURVEILLANCE_DATABASE.biteCases.length + 101,
        reporter: name,
        animal: animal,
        lat: lat,
        lng: lng,
        date: new Date().toISOString().split('T')[0],
        severity: severity,
        behavior: behavior,
        description: desc,
        phone: phone,
        status: "Active",
        verified: false,
        zone: resolvedGeo.zone,
        ward: resolvedGeo.ward,
        bittenCount: bittenCount,
        victimName: victimName,
        victimAddress: victimAddress,
        otherVictims: otherVictims,
        exposurePattern: exposurePattern
      };
      
      // Translate user text description using text-to-text translator for Public Health registry
      window.translateTextToText(desc, 'en', (translatedText) => {
        newBite.description = translatedText;
        
        // Save to active database
        window.SURVEILLANCE_DATABASE.biteCases.unshift(newBite);
        
        // Refresh Map markers and hotspot warnings instantly
        window.updateMapMarkers();
        window.renderAlertClusters();
        
        // Trigger live visual radar alert on Leaflet map!
        if (typeof window.triggerVisualMapAlert === 'function') {
          window.triggerVisualMapAlert(lat, lng, name, severity, victimName, bittenCount);
        }

        // Dynamically prepend alert in authority live alerts list!
        const alertsList = document.getElementById('authority-live-alerts-list');
        if (alertsList) {
          const newItem = document.createElement('div');
          newItem.className = 'alert-feed-item animate-pop';
          newItem.innerHTML = `
            <div class="alert-feed-icon-pulsing" style="background: var(--danger);"></div>
            <div class="alert-feed-details" id="alert-feed-case-${newBite.id}">
              <h5 style="color: var(--danger); font-weight: 800; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <span>🚨 NEW ACTIVE EXPOSURE DISPATCH</span>
                <span class="badge-verification" style="font-size: 0.6rem; padding: 0.1rem 0.35rem; border-radius: 3px; background: rgba(220, 38, 38, 0.15); color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.25); font-weight: 800; text-transform: uppercase;">Unverified ⚠️</span>
              </h5>
              <p><strong>Primary Victim:</strong> ${victimName} (${bittenCount} exposed)<br>
                 ${bittenCount > 1 ? `<strong>Other Victims:</strong> ${otherVictims}<br><strong>Incident Pattern:</strong> ${exposurePattern}<br>` : ''}
                 <strong>Address:</strong> ${victimAddress}<br>
                 <strong>Reported by:</strong> ${name} | Aggressive ${animal} exposure in Zone ${resolvedGeo.zone} (${resolvedGeo.ward}).</p>
              <div style="margin-top: 0.4rem; display: flex; gap: 0.5rem; align-items: center; justify-content: space-between; width: 100%;">
                <span class="alert-time" style="margin-top: 0;">Just now</span>
                <button class="verify-action-btn" onclick="window.verifyBiteCase(${newBite.id})" style="font-size: 0.65rem; padding: 0.2rem 0.5rem; background: #7c3aed; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 700; display: flex; align-items: center; gap: 0.2rem;">
                  ✓ Verify Case
                </button>
              </div>
            </div>
          `;
          alertsList.insertBefore(newItem, alertsList.firstChild);
        }

        // Track in citizen submission history for correction/retraction
        window.citizenSubmissions = window.citizenSubmissions || [];
        window.citizenSubmissions.unshift(newBite);
        renderMySubmissions();

        // Reset Form
        reportForm.reset();
        if (victimDetailsContainer) victimDetailsContainer.style.display = 'none';
        const multBox = document.getElementById('multiple-victims-box');
        if (multBox) multBox.style.display = 'none';
        document.getElementById('gps-status-indicator').className = "gps-indicator";
        document.getElementById('gps-status-indicator').textContent = "Not Captured Yet";
        
        window.dispatchNotification("🚨 Report Propagated", "Bite exposure report sent! Lucknow Municipal Corporation (LMC) & Public Health Command notified immediately.", "danger");
      });
    });
  }

  // 2. Admin Vaccination & ABC registration Form
  const vaccForm = document.getElementById('admin-vaccination-form');
  if (vaccForm) {
    vaccForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const dogName = document.getElementById('admin-dog-name').value || "Stray Dog";
      const type = document.getElementById('admin-animal-type').value;
      const marks = document.getElementById('admin-dog-marks').value || "Ear Notch Right";
      const batch = document.getElementById('admin-vacc-batch').value || "RAB-2026-B98";
      
      // Capturing CNVR Sterilization fields
      const surgeryStatus = document.getElementById('admin-surgery-status').value;
      const surgeryDate = document.getElementById('admin-surgery-date').value || new Date().toISOString().split('T')[0];
      const vetSurgeon = document.getElementById('admin-vet-surgeon').value || "LMC Mobile Vet Squad";
      const earNotched = document.getElementById('admin-ear-notched').checked;
      
      // Place vaccinated animal at a random location near Lucknow center
      const randomizedLat = 26.8467 + (Math.random() - 0.5) * 0.1;
      const randomizedLng = 80.9462 + (Math.random() - 0.5) * 0.1;
      const resolvedGeo = findNearestLucknowWard(randomizedLat, randomizedLng);
      
      const newVacc = {
        id: window.SURVEILLANCE_DATABASE.vaccinations.length + 301,
        name: dogName,
        type: type,
        lat: parseFloat(randomizedLat.toFixed(5)),
        lng: parseFloat(randomizedLng.toFixed(5)),
        date: new Date().toISOString().split('T')[0],
        marks: marks + (earNotched ? ", ear notch complete" : ""),
        batch: batch,
        cnvr: surgeryStatus.includes("Sterilized") || surgeryStatus.includes("Released") || surgeryStatus.includes("Recovery") || surgeryStatus.includes("Sterile") ? "Sterilized & Vaccinated (ABC Complete)" : "Vaccinated Only",
        center: vetSurgeon,
        zone: resolvedGeo.zone,
        ward: resolvedGeo.ward
      };
      
      window.SURVEILLANCE_DATABASE.vaccinations.unshift(newVacc);
      
      // Dynamic live prepend to ABC observation list if surgery is involved!
      if (surgeryStatus !== "Vaccinated Only") {
        const observationList = document.getElementById('admin-steril-observation-list');
        if (observationList) {
          const itemRow = document.createElement('div');
          itemRow.className = 'quarantine-item-row animate-pop';
          itemRow.style.padding = '0.6rem';
          itemRow.style.borderColor = 'rgba(124, 58, 237, 0.2)';
          
          let statusBadgeColor = 'background: rgba(245, 158, 11, 0.1); color: var(--warning); border-color: rgba(245, 158, 11, 0.2);';
          if (surgeryStatus.includes("Sterilized") || surgeryStatus.includes("Released") || surgeryStatus.includes("Sterile")) {
            statusBadgeColor = 'background: rgba(16, 185, 129, 0.1); color: var(--accent); border-color: rgba(16, 185, 129, 0.2);';
          }
          
          itemRow.innerHTML = `
            <div class="q-left">
              <span style="font-weight:700; font-size:0.85rem;">✂️ Stray ${type === 'dog' ? 'Dog' : 'Cat'} ABC-${newVacc.id} (${dogName}) 🐾</span>
              <span style="font-size:0.75rem; color:var(--text-muted);">Surgeon: ${vetSurgeon} | Ear Notch: ${earNotched ? 'Verified ✅' : 'No'}</span>
            </div>
            <span class="day-counter-glass" style="${statusBadgeColor} font-size: 0.7rem; padding: 0.2rem 0.5rem;">${surgeryStatus.replace(' (ABC Sterile)', '').replace(' (ABC Complete)', '').replace(' (ABC Complete)', '')}</span>
          `;
          observationList.insertBefore(itemRow, observationList.firstChild);
        }
      }

      // Refresh GIS and dynamic Trend Chart!
      window.updateMapMarkers();
      if (window.renderLucknowChoropleth) {
        window.renderLucknowChoropleth();
      }
      if (window.renderTemporalTrendLine) {
        window.renderTemporalTrendLine();
      }
      
      vaccForm.reset();
      window.dispatchNotification("💉 ABC File Logged", `Registered vaccine & sterilization for ${dogName} inside ${resolvedGeo.ward} 🐶.`, "success");
    });
  }
}

// Connect AI Canine Face Scanning Tool (Simulated Biometrics)
function setupAIScanner() {
  const portals = ['citizen', 'admin', 'authority'];
  
  portals.forEach(portal => {
    const fileInput = document.getElementById(`${portal}-ai-photo-upload`);
    const triggerScanBtn = document.getElementById(`${portal === 'citizen' ? 'citizen' : portal}-run-ai-scan-btn`);
    const aiVisualBox = document.getElementById(`${portal}-ai-scanner-visual`);
    const aiResultsBox = document.getElementById(`${portal}-ai-scanner-results`);
    
    if (!fileInput || !triggerScanBtn) return;
    
    // Show image preview inside glass card on upload
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        aiVisualBox.innerHTML = `
          <div class="ai-preview-container">
            <img src="${event.target.result}" id="${portal}-ai-uploaded-img" alt="Canine Scan Frame">
            <div class="ai-laser-scanner"></div>
            <div class="ai-node-lock nw"></div>
            <div class="ai-node-lock ne"></div>
            <div class="ai-node-lock sw"></div>
            <div class="ai-node-lock se"></div>
          </div>
        `;
        triggerScanBtn.disabled = false;
        aiResultsBox.innerHTML = "";
      };
      reader.readAsDataURL(file);
    });
    
    triggerScanBtn.addEventListener('click', () => {
      triggerScanBtn.disabled = true;
      
      // Add glowing active laser scan
      const laser = aiVisualBox.querySelector('.ai-laser-scanner');
      if (laser) laser.classList.add('scanning');
      
      // Create computer vision telemetry tags
      const telemetry = document.createElement('div');
      telemetry.className = 'ai-telemetry-glass-overlay';
      telemetry.innerHTML = `
        <div class="tel-row">🐶 Processing puppy muzzle pattern...</div>
        <div class="tel-row">🩹 Checking ear notch notches...</div>
        <div class="tel-row">🛰️ Direct query to registry DB...</div>
      `;
      aiVisualBox.appendChild(telemetry);
      
      window.dispatchNotification("🤖 AI Matcher Active", "Biometric indexing running...", "info");
      
      // Simulate AI classification pipeline latency (2.5 seconds)
      setTimeout(() => {
        // Remove scanner animations
        if (laser) laser.classList.remove('scanning');
        telemetry.remove();
        
        // Pull a random pre-matched profile from AI database or new animal
        const rollMatch = Math.random();
        if (rollMatch > 0.3) {
          // MATCH FOUND! (Tommy/Moti)
          const matchProfile = window.AI_DOG_REGISTRY[Math.floor(Math.random() * window.AI_DOG_REGISTRY.length)];
          
          aiResultsBox.innerHTML = `
            <div class="ai-match-success-card animate-pop">
              <div class="ai-match-header">
                <span class="match-badge">🎉 BIOMETRIC PATTERN VERIFIED (100% SECURE)</span>
                <h3>🐕 Name: ${matchProfile.name}</h3>
              </div>
              <div class="ai-match-grid">
                <div class="ai-match-img">
                  <img src="${matchProfile.image}" alt="Registry Profile">
                  <span>Database File</span>
                </div>
                <div class="ai-match-details">
                  <p><strong>Biometric Match Score:</strong> <span class="text-success">${matchProfile.confidence} match</span></p>
                  <p><strong>Registered ID:</strong> ${matchProfile.id}</p>
                  <p><strong>Markings:</strong> ${matchProfile.marks}</p>
                  <p><strong>Last Vaccinated:</strong> ${matchProfile.last_vaccinated} (${matchProfile.vaccine_batch})</p>
                  <p><strong>CNVR Status:</strong> ${matchProfile.cnvr_status}</p>
                  <p><strong>Admin Facility:</strong> ${matchProfile.center}</p>
                </div>
              </div>
            </div>
          `;
          window.dispatchNotification("🎉 Biometrics Verified", `Canine matches profile of ${matchProfile.name} in database.`, "success");
        } else {
          // NEW UNVACCINATED ANIMAL DETECTED
          aiResultsBox.innerHTML = `
            <div class="ai-match-failed-card animate-pop">
              <h3>⚠️ NO REGISTRY FILE FOUND</h3>
              <p>This animal's face pattern, coat indicators, and ear shapes do not match any vaccinated records.</p>
              <p class="warning-text">🐶 Action suggested: Register this canine using the vaccination form above!</p>
            </div>
          `;
          window.dispatchNotification("❌ No File Found", "Canine face pattern not found. Vaccination unverified.", "warning");
        }
        triggerScanBtn.disabled = false;
      }, 2500);
    });
  });
}

// Global Custom glassmorphism Notification system
window.dispatchNotification = function(title, message, type = "info") {
  const container = document.getElementById('platform-toast-container');
  if (!container) return;
  
  const toast = document.createElement('div');
  toast.className = `glass-toast-alert type-${type} animate-slide-in`;
  toast.innerHTML = `
    <div class="toast-indicator-line"></div>
    <div class="toast-main">
      <h5>${title}</h5>
      <p>${message}</p>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;
  container.appendChild(toast);
  
  // Auto expire toast after 4.5 seconds
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 4500);
};

// ----------------------------------------------------
// PWA Progressive Web App Setup & Installation Hooks
// ----------------------------------------------------

// 1. Service Worker registration (Bypassed on local file:// protocol)
if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js?v=2.0.3')
      .then(reg => console.log('[PWA] Service Worker registered successfully!', reg))
      .catch(err => console.error('[PWA] Service Worker registration failed!', err));
  });
}

// 2. Install prompt capture event listener
let deferredPrompt = null;
const pwaInstallBtn = document.getElementById('pwa-install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent mini-infobar on mobile devices
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Make the install button visible and active
  if (pwaInstallBtn) {
    pwaInstallBtn.style.display = 'block';
  }
  console.log('[PWA Engine] Caught beforeinstallprompt event.');
});

if (pwaInstallBtn) {
  pwaInstallBtn.addEventListener('click', async () => {
    if (!deferredPrompt) {
      // Fallback manual instructions if prompt wasn't cached yet
      window.dispatchNotification(
        "Smartphone Installation Helper", 
        "Use your smartphone browser menu ('Add to Home Screen') to install standalone app immediately.", 
        "info"
      );
      return;
    }
    // Show the native browser install dialog prompt
    deferredPrompt.prompt();
    // Wait for user selection decision
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`[PWA Engine] User selection outcome: ${outcome}`);
    // Clear prompt hook
    deferredPrompt = null;
    pwaInstallBtn.style.display = 'none';
  });
}

window.addEventListener('appinstalled', (event) => {
  console.log('[PWA Engine] App installed successfully!', event);
  window.dispatchNotification("🎉 App Installed", "Benign Canine is active on your device Home Screen!", "success");
  if (pwaInstallBtn) {
    pwaInstallBtn.style.display = 'none';
  }
});

// ─── Citizen Submission History: Render & Correct ──────────────────────────
// Renders the "My Submitted Reports" panel below the citizen report form
function renderMySubmissions() {
  const panel = document.getElementById('my-submissions-panel');
  const list = document.getElementById('my-submissions-list');
  if (!panel || !list) return;

  const submissions = window.citizenSubmissions || [];
  if (submissions.length === 0) {
    panel.style.display = 'none';
    return;
  }

  panel.style.display = 'block';
  list.innerHTML = '';

  submissions.forEach((bite, idx) => {
    // Only show submissions that haven't been retracted
    if (bite._retracted) return;

    const isVerified = bite.verified;
    const canEdit = !isVerified; // Cannot edit once verified by authority

    const card = document.createElement('div');
    card.className = 'submission-history-card';
    card.style.cssText = `
      background: rgba(255,255,255,0.06);
      border: 1px solid ${isVerified ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)'};
      border-radius: 10px;
      padding: 0.7rem 0.85rem;
      font-size: 0.78rem;
    `;
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.5rem; flex-wrap:wrap;">
        <div>
          <strong style="font-size:0.82rem;">Report #${bite.id}</strong>
          <span style="font-size:0.65rem; padding:0.1rem 0.4rem; border-radius:3px; margin-left:0.4rem;
            background:${isVerified ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)'};
            color:${isVerified ? '#10b981' : '#dc2626'};
            border:1px solid ${isVerified ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.25)'};
            font-weight:800; text-transform:uppercase;">
            ${isVerified ? 'Verified ✅' : 'Unverified ⚠️'}
          </span>
        </div>
        <span style="font-size:0.65rem; color:var(--text-muted);">${bite.date}</span>
      </div>
      <p style="margin:0.3rem 0 0; color:var(--text-muted);">
        📍 ${bite.ward}, Zone ${bite.zone} &nbsp;|&nbsp; 🐾 ${bite.animal} &nbsp;|&nbsp; ${bite.severity}
      </p>
      ${isVerified ? `<p style="font-size:0.7rem; color:#f59e0b; margin-top:0.3rem; font-style:italic;">
        ⚠️ This report has been officially verified. Editing is locked.
      </p>` : `
      <div style="display:flex; gap:0.4rem; margin-top:0.5rem; flex-wrap:wrap;">
        <button onclick="window.prefillCorrectionForm(${bite.id})"
          style="font-size:0.68rem; padding:0.25rem 0.55rem; border-radius:5px; background:rgba(8,145,178,0.15);
            color:#0891b2; border:1px solid rgba(8,145,178,0.35); cursor:pointer; font-weight:700; display:flex; align-items:center; gap:0.25rem;">
          <i class="fa-solid fa-pen-to-square"></i> Edit & Resubmit
        </button>
        <button onclick="window.retractSubmission(${bite.id})"
          style="font-size:0.68rem; padding:0.25rem 0.55rem; border-radius:5px; background:rgba(239,68,68,0.1);
            color:#dc2626; border:1px solid rgba(239,68,68,0.3); cursor:pointer; font-weight:700; display:flex; align-items:center; gap:0.25rem;">
          <i class="fa-solid fa-trash-can"></i> Retract / Withdraw
        </button>
      </div>`}
    `;
    list.appendChild(card);
  });

  // If all retracted, hide panel
  if (list.children.length === 0) {
    panel.style.display = 'none';
  }
}

// Pre-fill the report form from a previous submission for easy correction
window.prefillCorrectionForm = function(id) {
  const bite = (window.citizenSubmissions || []).find(b => b.id === id);
  if (!bite) return;

  const setVal = (elId, val) => {
    const el = document.getElementById(elId);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  setVal('form-full-name', bite.reporter);
  setVal('form-phone', bite.phone);
  setVal('form-animal-type', bite.animal);
  setVal('form-animal-behavior', bite.behavior);
  setVal('form-animal-description', bite.description);
  setVal('form-latitude', bite.lat);
  setVal('form-longitude', bite.lng);

  const hasBiteCheckbox = document.getElementById('form-has-bite');
  const victimDetailsContainer = document.getElementById('victim-details-container');
  if (hasBiteCheckbox && bite.bittenCount > 0) {
    hasBiteCheckbox.checked = true;
    if (victimDetailsContainer) victimDetailsContainer.style.display = 'flex';
    setVal('form-victim-count', bite.bittenCount);
    setVal('form-victim-name', bite.victimName !== 'N/A' ? bite.victimName : '');
    setVal('form-victim-address', bite.victimAddress !== 'N/A' ? bite.victimAddress : '');
    setVal('form-bite-severity', bite.severity);
  }

  // Remove the old entry so it won't duplicate upon resubmit
  bite._retracted = true;
  renderMySubmissions();
  const idx = window.SURVEILLANCE_DATABASE.biteCases.findIndex(b => b.id === id);
  if (idx !== -1) window.SURVEILLANCE_DATABASE.biteCases.splice(idx, 1);
  if (typeof window.updateMapMarkers === 'function') window.updateMapMarkers();
  if (typeof window.renderAlertClusters === 'function') window.renderAlertClusters();

  // Scroll the form into view
  const formEl = document.getElementById('citizen-report-form');
  if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  window.dispatchNotification('✏️ Ready to Correct', 'Form pre-filled with your previous report. Make your corrections and resubmit.', 'info');
};

// Retract/Withdraw a submitted report
window.retractSubmission = function(id) {
  if (!confirm('Are you sure you want to withdraw Report #' + id + '? This action will remove it from the active surveillance map. Reports already verified by authority cannot be retracted.')) return;

  const bite = (window.citizenSubmissions || []).find(b => b.id === id);
  if (!bite) return;
  if (bite.verified) {
    window.dispatchNotification('⚠️ Locked', 'This report has already been verified by a public health authority and cannot be retracted.', 'warning');
    return;
  }

  // Mark retracted in history
  bite._retracted = true;

  // Remove from the SURVEILLANCE_DATABASE
  const idx = window.SURVEILLANCE_DATABASE.biteCases.findIndex(b => b.id === id);
  if (idx !== -1) window.SURVEILLANCE_DATABASE.biteCases.splice(idx, 1);

  // Remove from authority feed if present
  const feedEl = document.getElementById(`alert-feed-case-${id}`);
  if (feedEl) feedEl.closest('.alert-feed-item')?.remove();

  // Refresh map
  if (typeof window.updateMapMarkers === 'function') window.updateMapMarkers();
  if (typeof window.renderAlertClusters === 'function') window.renderAlertClusters();

  // Re-render submission panel
  renderMySubmissions();

  window.dispatchNotification('🗑️ Report Withdrawn', `Report #${id} has been successfully retracted from the surveillance system.`, 'success');
};

// ─── GIS Map Layer Filter Toggle (Bite/Exposure | ABC/Vaccination | Both) ────
// Global active layer state - default is 'both'
window.ACTIVE_MAP_LAYER = 'both';

window.setMapLayerFilter = function(layer) {
  window.ACTIVE_MAP_LAYER = layer;

  // Update active toggle button style
  ['both', 'bites', 'abc'].forEach(l => {
    const btn = document.getElementById(`layer-btn-${l}`);
    if (btn) btn.classList.toggle('active', l === layer);
  });

  // Refresh markers respecting the new layer state
  if (typeof window.updateMapMarkers === 'function') window.updateMapMarkers();
  if (typeof window.renderAlertClusters === 'function') window.renderAlertClusters();
};

// Dynamic Exposure Report Verification handler (Local Municipal & Health Authority compliance)
window.verifyBiteCase = function(id) {
  const bite = window.SURVEILLANCE_DATABASE.biteCases.find(b => b.id === id);
  if (bite) {
    bite.verified = true;
    
    // Refresh markers on Leaflet GIS Map
    if (typeof window.updateMapMarkers === 'function') {
      window.updateMapMarkers();
    }
    
    // Update dynamic elements in active alert feed if visible
    const feedDetails = document.getElementById(`alert-feed-case-${id}`);
    if (feedDetails) {
      const badge = feedDetails.querySelector('.badge-verification');
      if (badge) {
        badge.textContent = "Verified ✅";
        badge.style.background = "rgba(16, 185, 129, 0.15)";
        badge.style.color = "#10b981";
        badge.style.borderColor = "rgba(16, 185, 129, 0.3)";
      }
      const verifyBtn = feedDetails.querySelector('.verify-action-btn');
      if (verifyBtn) {
        verifyBtn.remove();
      }
    }
    
    window.dispatchNotification("Incident Verified ✓", `Bite exposure report #${id} verified by municipal health authority!`, "success");
  }
};
