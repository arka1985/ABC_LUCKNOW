// Core Application Controller - Rabies Surveillance System ("Benign Canine")
// Conceptualised & Developed by Dr. Arkaprabha Sau and Prof. Manish Kumar Singh

// Pre-defined database of canine biometric records for the AI Matcher
// Pre-defined database of canine biometric records for the AI Matcher
window.AI_DOG_REGISTRY = [
  { 
    id: "AI-101", 
    name: "Sheru 🐶", 
    color: "Light Golden / Brown 🐕",
    breed: "Indie Stray (Super Friendly!) 🐾",
    marks: "Right ear notch, black spot near cute nose 🩹",
    last_vaccinated: "2026-05-10",
    vaccine_batch: "RAB-2026-B98",
    cnvr_status: "Completed (ABC Complete) ✂️",
    center: "Sarojni Nagar LMC Clinic 🏥",
    confidence: "98.4%",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "AI-102", 
    name: "Moti 🐶", 
    color: "Black and Tan 🐕",
    breed: "Indie Stray (Playful Puppy) 🐾",
    marks: "Left ear notch, white chest star 🩹",
    last_vaccinated: "2026-05-15",
    vaccine_batch: "RAB-2026-B99",
    cnvr_status: "Completed (ABC Complete) ✂️",
    center: "Indiranagar Vet Depot 🏥",
    confidence: "92.1%",
    image: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: "AI-103", 
    name: "Kalu 🐶", 
    color: "Jet Black 🐕",
    breed: "Indie Stray (Very Calm) 🐾",
    marks: "Red collar, no notch 🎀",
    last_vaccinated: "2026-05-20",
    vaccine_batch: "RAB-2026-B98",
    cnvr_status: "Vaccinated Only 💉",
    center: "Gomti Nagar LMC Shelter 🏥",
    confidence: "88.7%",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=300"
  }
];

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
  
  // Enter dedicated dashboard
  hubOverlay.classList.remove('active');
  mainLayout.classList.add('active');
  
  // Active quick header navigation links
  roleButtons.forEach(btn => {
    if (btn.getAttribute('data-role') === role) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Hide all side panel dashboards and reveal only active one
  sidebarPanels.forEach(panel => {
    if (panel.id === `${role}-panel`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Refresh Map canvas size if custom map has refresh function
  if (window.map && typeof window.map.invalidateSize === 'function') {
    setTimeout(() => {
      window.map.invalidateSize();
    }, 200);
  }

  window.dispatchNotification("Portal Entered 🐾", `You have securely entered the ${role.toUpperCase()} module!`, "success");
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
        victimNameInput.required = true;
        victimAddressInput.required = true;
        
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
