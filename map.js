// Premium Custom Leaflet Interactive Map Module - Rabies Surveillance System ("Benign Canine")
// Localized & Optimized for Lucknow Municipality (Leaflet Background Layer + GeoJSON Wards)
// Conceptualised & Developed by Dr. Arkaprabha Sau and Prof. Manish Kumar Singh

// Global scope variables preserved for full app.js compatibility
window.map = null;
window.geojsonLayer = null;
window.markersLayer = null;
window.activeAlertsLayer = null;

// Mock database of active surveillance data inside Lucknow Municipality
window.SURVEILLANCE_DATABASE = {
  biteCases: [
    { id: 101, reporter: "Preeti Sharma", animal: "dog", lat: 26.8467, lng: 80.9462, date: "2026-05-26", severity: "Category III", behavior: "Aggressive / Salivating", description: "Aggressive street dog near Hazratganj crossing bit my leg.", phone: "9876543210", status: "Active", verified: true, zone: "1", ward: "Hazratganj" },
    { id: 102, reporter: "Rohan Das", animal: "dog", lat: 26.7640, lng: 80.9160, date: "2026-05-27", severity: "Category II", behavior: "Aggressive / Salivating", description: "Brown stray dog bit a vegetable vendor in Sharda Nagar market.", phone: "9830012345", status: "Active", verified: false, zone: "5", ward: "Sharda Nagar" },
    { id: 103, reporter: "Aniket Sen", animal: "cat", lat: 26.7910, lng: 80.8860, date: "2026-05-25", severity: "Category II", behavior: "Sick / Lethargic", description: "Stray white kitten scratched child near Hind Nagar park.", phone: "9123456789", status: "Active", verified: true, zone: "5", ward: "Hind Nagar" },
    { id: 104, reporter: "S. Bajpai", animal: "dog", lat: 26.8530, lng: 80.9990, date: "2026-05-28", severity: "Category III", behavior: "Aggressive / Salivating", description: "Highly aggressive salivating dog near Gomti Nagar Extension park.", phone: "9940123456", status: "Active", verified: true, zone: "4", ward: "Gomti Nagar" },
    { id: 105, reporter: "K. Srivastava", animal: "monkey", lat: 26.8660, lng: 80.9020, date: "2026-05-24", severity: "Category I", behavior: "Normal / Provoked Bite", description: "Temple monkey grabbed bag and bit my finger near Chowk.", phone: "9845098765", status: "Resolved", verified: true, zone: "6", ward: "Chowk" },
    { id: 106, reporter: "M. Shukla", animal: "dog", lat: 26.7550, lng: 80.8520, date: "2026-05-28", severity: "Category III", behavior: "Aggressive / Salivating", description: "Aggressive street dog bit pedestrian near Sarojni Nagar Part 1.", phone: "9840192837", status: "Active", verified: true, zone: "5", ward: "Sarojni Nagar Part 1" },
    { id: 107, reporter: "R. Trivedi", animal: "dog", lat: 26.8730, lng: 80.9980, date: "2026-05-27", severity: "Category II", behavior: "Sick / Lethargic", description: "Stray dog bite near Indiranagar Sector 14 market.", phone: "9988776655", status: "Active", verified: true, zone: "7", ward: "Indiranagar" }
  ],
  quarantines: [
    { id: 201, name: "Stray Dog (ID: Q891) 🐶", lat: 26.7910, lng: 80.8860, start_date: "2026-05-22", day: 7, behavior: "Healthy (No Rabies Symptoms) 💚", location: "Kanha Upvan LMC Shelter", marks: "Right ear notch, brown coat", updater: "Dr. A. Verma", zone: "5", ward: "Hind Nagar" },
    { id: 202, name: "Street Cat (ID: Q892) 🐈", lat: 26.8467, lng: 80.9462, start_date: "2026-05-25", day: 4, behavior: "Symptomatic (Isolate / Verify) 🚨", location: "Hazratganj Vet Clinic", marks: "White collar, black tail", updater: "Dr. S. Patil", zone: "1", ward: "Hazratganj" },
    { id: 203, name: "Street Dog (ID: Q893) 🐶", lat: 26.8530, lng: 80.9990, start_date: "2026-05-20", day: 9, behavior: "Healthy (No Rabies Symptoms) 💚", location: "Gomti Nagar LMC Shelter", marks: "Yellow collar, black spots", updater: "Dr. B. Roy", zone: "4", ward: "Gomti Nagar" }
  ],
  vaccinations: [
    { id: 301, name: "Sheru", type: "dog", lat: 26.7550, lng: 80.8520, date: "2026-05-10", marks: "Ear Notch Right", batch: "RAB-2026-B98", cnvr: "Sterilized & Vaccinated (ABC Complete)", center: "Sarojni Nagar LMC Clinic", zone: "5", ward: "Sarojni Nagar Part 1" },
    { id: 302, name: "Moti", type: "dog", lat: 26.7640, lng: 80.9160, date: "2026-05-15", marks: "Left Ear Notch, Red collar", batch: "RAB-2026-B99", cnvr: "Sterilized & Vaccinated (ABC Complete)", center: "Sharda Nagar Shelter", zone: "5", ward: "Sharda Nagar" },
    { id: 303, name: "Kalu", type: "dog", lat: 26.8467, lng: 80.9462, date: "2026-05-20", marks: "Black collar", batch: "RAB-2026-B98", cnvr: "Vaccinated Only", center: "Hazratganj LMC Drive", zone: "1", ward: "Hazratganj" },
    { id: 304, name: "Lucy", type: "dog", lat: 26.8530, lng: 80.9990, date: "2026-05-22", marks: "Ear Notch Right, spotted tail", batch: "RAB-2026-C01", cnvr: "Sterilized & Vaccinated (ABC Complete)", center: "Gomti Nagar LMC Hub", zone: "4", ward: "Gomti Nagar" },
    { id: 305, name: "Rocky", type: "dog", lat: 26.8660, lng: 80.9020, date: "2026-05-21", marks: "Green collar", batch: "RAB-2026-C02", cnvr: "Sterilized & Vaccinated (ABC Complete)", center: "Chowk Health Clinic", zone: "6", ward: "Chowk" },
    { id: 306, name: "Bruno", type: "dog", lat: 26.8730, lng: 80.9980, date: "2026-05-22", marks: "Right Ear Notch", batch: "RAB-2026-C01", cnvr: "Sterilized & Vaccinated (ABC Complete)", center: "Indiranagar LMC Depot", zone: "7", ward: "Indiranagar" }
  ],
  drives: [
    { id: 401, title: "Mass Dog Vaccination Drive", host: "LMC Zone 1 Authority", lat: 26.8467, lng: 80.9462, date: "2026-05-30", details: "Target: 300 street dogs in Zone 1 (Hazratganj & vicinity)." },
    { id: 402, title: "ABC Campaign Sharda Nagar", host: "LMC Vet Squad", lat: 26.7640, lng: 80.9160, date: "2026-06-01", details: "Catch Neuter Vaccinate Return drive in Sharda Nagar Sector 5." }
  ]
};

// Premium SVG Outlines for interactive map markers
window.ANIMAL_CLIPARTS = {
  dog: `<i class="fa-solid fa-dog" style="color: #dc2626;"></i>`,
  cat: `<i class="fa-solid fa-cat" style="color: #ea580c;"></i>`,
  monkey: `<i class="fa-solid fa-paw" style="color: #ec4899;"></i>`,
  quarantine: `<i class="fa-solid fa-shield-virus" style="color: #ea580c;"></i>`,
  vaccination: `<i class="fa-solid fa-syringe" style="color: #10b981;"></i>`
};

// Official 8 Zones of Lucknow Municipality with native geospatial descriptions
const LUCKNOW_MUNICIPAL_ZONES = [
  { id: "1", name: "Zone 1 (Hazratganj / Central)", color: "rgba(8, 145, 178, 0.35)", hoverColor: "rgba(8, 145, 178, 0.55)", borderColor: "#0891b2", coverage: 78, activeBites: 2 },
  { id: "2", name: "Zone 2 (Aishbagh / North-West)", color: "rgba(124, 58, 237, 0.35)", hoverColor: "rgba(124, 58, 237, 0.55)", borderColor: "#7c3aed", coverage: 58, activeBites: 0 },
  { id: "3", name: "Zone 3 (Aliganj / North)", color: "rgba(14, 116, 144, 0.35)", hoverColor: "rgba(14, 116, 144, 0.55)", borderColor: "#0e7490", coverage: 71, activeBites: 0 },
  { id: "4", name: "Zone 4 (Gomti Nagar / East)", color: "rgba(139, 92, 246, 0.35)", hoverColor: "rgba(139, 92, 246, 0.55)", borderColor: "#8b5cf6", coverage: 82, activeBites: 1 },
  { id: "5", name: "Zone 5 (Alambagh / Sarojini Nagar)", color: "rgba(16, 185, 129, 0.35)", hoverColor: "rgba(16, 185, 129, 0.55)", borderColor: "#10b981", coverage: 49, activeBites: 3 },
  { id: "6", name: "Zone 6 (Chowk / Old City)", color: "rgba(245, 158, 11, 0.35)", hoverColor: "rgba(245, 158, 11, 0.55)", borderColor: "#f59e0b", coverage: 65, activeBites: 1 },
  { id: "7", name: "Zone 7 (Indiranagar / North-East)", color: "rgba(234, 88, 12, 0.35)", hoverColor: "rgba(234, 88, 12, 0.55)", borderColor: "#ea580c", coverage: 62, activeBites: 1 },
  { id: "8", name: "Zone 8 (Lucknow South)", color: "rgba(236, 72, 153, 0.35)", hoverColor: "rgba(236, 72, 153, 0.55)", borderColor: "#ec4899", coverage: 45, activeBites: 0 }
];

// Global scope initialization of Leaflet map and overlays
window.initMap = function() {
  console.log("[GIS Map Engine] Initializing Leaflet map with Lucknow boundary overlays...");
  
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;

  // 1. Inject custom premium CSS rules directly into head for custom Leaflet features
  const styleId = 'custom-leaflet-map-styles';
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement('style');
    styleSheet.id = styleId;
    styleSheet.innerHTML = `
      .custom-leaflet-icon-container {
        pointer-events: auto;
      }
      .leaflet-custom-pin {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .leaflet-custom-pin:hover {
        transform: scale(1.25);
        box-shadow: 0 6px 15px rgba(0,0,0,0.25);
        z-index: 1000;
      }
      .leaflet-custom-pin i {
        font-size: 0.95rem;
      }
      
      /* Glassmorphic Leaflet Popups */
      .leaflet-custom-popup-wrapper .leaflet-popup-content-wrapper {
        background: rgba(255, 255, 255, 0.96);
        border: 1.5px solid rgba(8, 145, 178, 0.25);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.12);
        padding: 0;
      }
      .leaflet-custom-popup-wrapper .leaflet-popup-content {
        margin: 0;
        padding: 0;
      }
      .leaflet-custom-popup-wrapper .leaflet-popup-close-button {
        top: 8px;
        right: 8px;
        color: #64748b !important;
        font-size: 1.1rem;
        font-weight: bold;
      }
      .leaflet-custom-popup-wrapper .leaflet-popup-close-button:hover {
        color: #0f172a !important;
      }
      
      /* Dynamic Pulsing Geographic Hotspot Circles */
      @keyframes leaflet-pulse {
        0% { stroke-width: 1.5px; fill-opacity: 0.05; }
        50% { stroke-width: 3.5px; fill-opacity: 0.22; }
        100% { stroke-width: 1.5px; fill-opacity: 0.05; }
      }
      .leaflet-pulsing-hotspot {
        animation: leaflet-pulse 2.5s infinite ease-in-out;
      }

      /* Make sure leaflet-tooltip looks neat */
      .leaflet-tooltip {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: #f8fafc;
        border-radius: 6px;
        padding: 6px 10px;
        font-family: inherit;
        font-size: 0.75rem;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      /* Premium Glassmorphism Leaflet Zoom Control at Top-Right */
      .leaflet-control-zoom {
        border: 1.5px solid rgba(8, 145, 178, 0.22) !important;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        border-radius: 8px !important;
        overflow: hidden;
      }
      .leaflet-control-zoom-in, .leaflet-control-zoom-out {
        background: rgba(255, 255, 255, 0.96) !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        color: #0891b2 !important;
        border-bottom: 1px solid rgba(8, 145, 178, 0.15) !important;
        font-weight: 800 !important;
        font-size: 1.1rem !important;
        transition: all 0.2s ease !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
        background: #0891b2 !important;
        color: white !important;
      }
    `;
    document.head.appendChild(styleSheet);
  }

  // 2. Initialize the Leaflet map (deactivate standard zoom control placement)
  window.map = L.map('map', {
    center: [26.8467, 80.9462], // Center coordinates of Lucknow Municipality
    zoom: 13, // Increased default zoom level by 2 points (from 11)
    zoomControl: false, // We will manually place it on the top-right
    minZoom: 9,
    maxZoom: 18
  });

  // 3. Load a beautiful CartoDB Voyager basemap
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors © CARTO'
  }).addTo(window.map);

  // 4. Manually add custom zoom control to the topright corner (clear of left-side filter overlay)
  L.control.zoom({ position: 'topright' }).addTo(window.map);

  // 5. Setup layered marker containers
  window.markersLayer = L.layerGroup().addTo(window.map);
  window.activeAlertsLayer = L.layerGroup().addTo(window.map);

  // 6. Draw the Lucknow ward boundaries using the loaded geojson data
  if (window.LUCKNOW_GEOJSON) {
    console.log("[GIS Map Engine] Lucknow Wards Boundary Data found. Loading GeoJSON...");
    
    window.geojsonLayer = L.geoJSON(window.LUCKNOW_GEOJSON, {
      style: function(feature) {
        const zoneId = String(feature.properties.Zone || feature.properties.zone);
        const zoneObj = LUCKNOW_MUNICIPAL_ZONES.find(z => z.id === zoneId) || { coverage: 50 };
        const coverage = zoneObj.coverage;
        
        // HSL deterministic pastel color scheme based on vaccine coverage
        const coverageColor = coverage >= 70 ? 'rgba(16, 185, 129, 0.35)' : 
                              coverage >= 50 ? 'rgba(245, 158, 11, 0.35)' : 
                                               'rgba(239, 68, 68, 0.35)';
        const strokeColor = coverage >= 70 ? '#10b981' : 
                            coverage >= 50 ? '#f59e0b' : 
                                             '#ef4444';
        return {
          fillColor: coverageColor,
          weight: 1.8,
          opacity: 0.9,
          color: strokeColor,
          fillOpacity: 0.45
        };
      },
      onEachFeature: function(feature, layer) {
        const wardName = feature.properties["Ward Name"] || feature.properties.ward_name || "Unknown Ward";
        const zoneId = String(feature.properties.Zone || feature.properties.zone);
        const zoneObj = LUCKNOW_MUNICIPAL_ZONES.find(z => z.id === zoneId) || { coverage: 50 };
        
        // Bind sticky tooltips for hover data display
        layer.bindTooltip(`
          <strong>📍 ${wardName}</strong><br>
          🏢 Zone: ${zoneId}<br>
          💉 ABC Sterilization Coverage: <strong>${zoneObj.coverage}%</strong>
        `, { sticky: true });
        
        layer.on({
          mouseover: function(e) {
            const lyr = e.target;
            lyr.setStyle({
              fillOpacity: 0.7,
              weight: 3.5,
              color: '#0891b2'
            });
          },
          mouseout: function(e) {
            window.geojsonLayer.resetStyle(e.target);
          },
          click: function(e) {
            // Cascade select filters in map-filter-bar
            const filterZoneEl = document.getElementById('filter-zone');
            const filterWardEl = document.getElementById('filter-ward');
            if (filterZoneEl) {
              filterZoneEl.value = zoneId;
              
              // Trigger change event to load Wards list
              const event = new Event('change');
              filterZoneEl.dispatchEvent(event);
              
              // Delay setting ward so cascading options build
              setTimeout(() => {
                if (filterWardEl) {
                  filterWardEl.value = wardName;
                  const event2 = new Event('change');
                  filterWardEl.dispatchEvent(event2);
                }
              }, 80);
            }
            
            // Show premium analytical modal
            showWardAnalyticsModal(wardName, zoneId, zoneObj.coverage);
          }
        });
      }
    }).addTo(window.map);

    // DEZOOM maps on default load beautifully to show all of Lucknow LMC
    try {
      const bounds = window.geojsonLayer.getBounds();
      const targetZoom = window.map.getBoundsZoom(bounds, false, [130, 130]) + 2;
      window.map.setView(bounds.getCenter(), targetZoom); // Increased default zoom level by 2 points
      // Allow slight comfortable scrolling but lock limits within boundaries
      window.map.setMaxBounds(bounds.pad(0.2));
    } catch (err) {
      console.warn("[GIS Map Engine] Fitting boundaries failed:", err);
    }
  } else {
    console.warn("[GIS Map Engine] Lucknow boundary spatial dataset not found. Loading coordinates directly.");
  }

  // Bind dropdown filters and generate baseline layers
  window.buildCascadingFilters();
  window.updateMapMarkers();
  window.renderAlertClusters();
  window.renderTemporalTrendLine();

  // Intercept the invalidateSize size trigger from app.js to fly to bounds and dezoom!
  const originalInvalidate = window.map.invalidateSize;
  window.map.invalidateSize = function(options) {
    originalInvalidate.call(window.map, options);
    console.log("[GIS Map Engine] map.invalidateSize() called. Re-dezooming to Lucknow Municipality bounds...");
    setTimeout(() => {
      try {
        if (window.geojsonLayer) {
          const bounds = window.geojsonLayer.getBounds();
          const targetZoom = window.map.getBoundsZoom(bounds, false, [130, 130]) + 2;
          window.map.setView(bounds.getCenter(), targetZoom); // Increased default zoom level by 2 points
        }
      } catch (err) {
        console.warn("[GIS Map Engine] Refitting bounds on visibility resize failed:", err);
      }
    }, 100);
  };

  // Trigger size refit initially
  window.map.invalidateSize();
};

// Global filter change handler inside map.js (completely eliminates legacy console errors!)
window.onFilterChange = function() {
  console.log("[GIS Map Engine] Filtering triggers executing...");
  window.updateMapMarkers();
  window.renderAlertClusters();
  window.renderTemporalTrendLine();
};

// Dynamic dropdown filters builder - Fully Populated from Lucknow GeoJSON
window.buildCascadingFilters = function() {
  const filterZoneEl = document.getElementById('filter-zone');
  const filterWardEl = document.getElementById('filter-ward');
  const applyFiltersBtn = document.getElementById('apply-filters-btn');
  const clearFiltersBtn = document.getElementById('clear-filters-btn');
  
  if (!filterZoneEl || !filterWardEl) return;

  // Global zone-wards map
  window.ZONE_WARDS_MAP = {};

  // 1. Dynamic Extraction: Load all actual wards of Lucknow from LUCKNOW_GEOJSON
  if (window.LUCKNOW_GEOJSON && window.LUCKNOW_GEOJSON.features) {
    console.log(`[GIS Map Engine] Parsing all ${window.LUCKNOW_GEOJSON.features.length} GeoJSON features to populate filters...`);
    window.LUCKNOW_GEOJSON.features.forEach(feature => {
      const props = feature.properties || {};
      const zoneId = String(props.Zone || props.zone || "");
      const wardName = props["Ward Name"] || props.ward_name || props.ward || "";
      
      if (zoneId && wardName) {
        if (!window.ZONE_WARDS_MAP[zoneId]) {
          window.ZONE_WARDS_MAP[zoneId] = new Set();
        }
        window.ZONE_WARDS_MAP[zoneId].add(wardName);
      }
    });
  }

  // 2. Add Baseline Fallback for mock records
  const fallbackWards = [
    { zone: "1", ward: "Hazratganj" },
    { zone: "4", ward: "Gomti Nagar" },
    { zone: "5", ward: "Sarojni Nagar Part 1" },
    { zone: "5", ward: "Sarojni Nagar Part 2" },
    { zone: "5", ward: "Sharda Nagar" },
    { zone: "5", ward: "Hind Nagar" },
    { zone: "6", ward: "Chowk" },
    { zone: "7", ward: "Indiranagar" }
  ];

  fallbackWards.forEach(item => {
    if (!window.ZONE_WARDS_MAP[item.zone]) {
      window.ZONE_WARDS_MAP[item.zone] = new Set();
    }
    window.ZONE_WARDS_MAP[item.zone].add(item.ward);
  });

  // Populate Zones Selector
  filterZoneEl.innerHTML = '<option value="All">All Zones</option>';
  LUCKNOW_MUNICIPAL_ZONES.forEach(zone => {
    const opt = document.createElement('option');
    opt.value = zone.id;
    opt.textContent = `Zone ${zone.id}`;
    filterZoneEl.appendChild(opt);
  });

  // Spatial Panning Function: Immediately pan & zoom to the selected filters boundary
  window.panToSelectedFilters = function() {
    if (!window.map || !window.geojsonLayer) return;

    const zoneVal = filterZoneEl.value;
    const wardVal = filterWardEl.value;

    console.log(`[GIS Map Engine] Panning request received. Zone: ${zoneVal}, Ward: ${wardVal}`);

    // If "All Wards" and "All Zones" are selected, dezoom back out to show the WHOLE Lucknow Municipality
    if (zoneVal === 'All' && wardVal === 'All') {
      try {
        const bounds = window.geojsonLayer.getBounds();
        const targetZoom = window.map.getBoundsZoom(bounds, false, [130, 130]) + 2;
        window.map.flyTo(bounds.getCenter(), targetZoom, { duration: 1.5 }); // Increased default zoom level by 2 points
      } catch (err) {}
      return;
    }

    // 1. If a specific Ward is selected, zoom and fly directly to that Ward
    if (wardVal !== 'All') {
      let targetLayer = null;
      window.geojsonLayer.eachLayer(layer => {
        const props = layer.feature.properties || {};
        const wardName = props["Ward Name"] || props.ward_name || props.ward || "";
        if (wardName === wardVal) {
          targetLayer = layer;
        }
      });

      if (targetLayer) {
        try {
          window.map.flyToBounds(targetLayer.getBounds(), { padding: [55, 55], maxZoom: 15, duration: 1.2 });
        } catch (err) {}
      }
      return;
    }

    // 2. If a specific Zone is selected (but Ward is 'All'), pan to highlight that entire Zone boundary
    if (zoneVal !== 'All') {
      const zoneLayers = [];
      window.geojsonLayer.eachLayer(layer => {
        const props = layer.feature.properties || {};
        const zoneId = String(props.Zone || props.zone || "");
        if (zoneId === zoneVal) {
          zoneLayers.push(layer);
        }
      });

      if (zoneLayers.length > 0) {
        try {
          const group = L.featureGroup(zoneLayers);
          window.map.flyToBounds(group.getBounds(), { padding: [60, 60], duration: 1.3 });
        } catch (err) {}
      }
    }
  };

  // Listener for dropdown select Zone - only updates cascades (Apply button handles filter trigger)
  filterZoneEl.addEventListener('change', () => {
    const selectedZone = filterZoneEl.value;

    filterWardEl.innerHTML = '<option value="All">All Wards</option>';
    if (selectedZone === 'All') {
      filterWardEl.disabled = true;
    } else {
      filterWardEl.disabled = false;
      const wards = Array.from(window.ZONE_WARDS_MAP[selectedZone] || []).sort();
      wards.forEach(ward => {
        const opt = document.createElement('option');
        opt.value = ward;
        opt.textContent = ward;
        filterWardEl.appendChild(opt);
      });
    }
  });

  // Explicit click listener for APPLY button to trigger all filtering & spatial flying!
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("[GIS Map Engine] APPLY button clicked. Executing filter updates & map panning...");
      window.onFilterChange();
      window.panToSelectedFilters();
    });
  }
  
  // Connect clear filters button to robustly reset selectors & fly out immediately
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("[GIS Map Engine] RESET button clicked. Clearing all selectors...");
      
      // Clear dropdowns in UI
      filterZoneEl.value = 'All';
      filterWardEl.innerHTML = '<option value="All">All Wards</option>';
      filterWardEl.disabled = true;
      
      if (document.getElementById('filter-year')) document.getElementById('filter-year').value = 'All';
      if (document.getElementById('filter-month')) document.getElementById('filter-month').value = 'All';
      if (document.getElementById('filter-date')) document.getElementById('filter-date').value = '';
      
      // Trigger update and zoom out immediately
      window.onFilterChange();
      window.panToSelectedFilters();
    });
  }
};

// Render Active Bite Cases, Active Observations & Vaccinations as custom Leaflet markers
window.updateMapMarkers = function() {
  if (!window.map || !window.markersLayer) return;
  
  // Clear existing pins
  window.markersLayer.clearLayers();

  const filteredBites = window.filterDataset ? window.filterDataset(window.SURVEILLANCE_DATABASE.biteCases, 'date') : window.SURVEILLANCE_DATABASE.biteCases;
  const filteredQuarantines = window.filterDataset ? window.filterDataset(window.SURVEILLANCE_DATABASE.quarantines, 'start_date') : window.SURVEILLANCE_DATABASE.quarantines;
  const filteredVaccinations = window.filterDataset ? window.filterDataset(window.SURVEILLANCE_DATABASE.vaccinations, 'date') : window.SURVEILLANCE_DATABASE.vaccinations;

  // PREMIUM ENHANCEMENT: Update sidebar stats metrics dynamically as filters apply!
  const activeBitesCountEl = document.getElementById('stat-active-bites');
  const quarantinesCountEl = document.getElementById('stat-quarantines');
  if (activeBitesCountEl) {
    activeBitesCountEl.textContent = filteredBites.length;
  }
  if (quarantinesCountEl) {
    quarantinesCountEl.textContent = filteredQuarantines.length;
  }

  // 1. Render Active Bite Cases (Red Pins)
  filteredBites.forEach(item => {
    const iconHtml = `<div class="leaflet-custom-pin" style="border-color: #dc2626; color: #dc2626;">${window.ANIMAL_CLIPARTS[item.animal] || window.ANIMAL_CLIPARTS.dog}</div>`;
    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon-container',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([item.lat, item.lng], { icon: customIcon });
    
    // Bind detailed glassmorphism popup
    const verifyBtnHtml = (!item.verified && (document.body.classList.contains('role-active-admin') || document.body.classList.contains('role-active-authority'))) ? `
      <button class="popup-action-btn verify-btn" onclick="window.verifyBiteCase(${item.id})" style="font-size:0.7rem; width:100%; padding:0.35rem; border-radius:6px; cursor:pointer; background: #7c3aed; color: white; border: none; margin-top: 0.35rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 0.2rem;">
        ✓ Verify Incident Report
      </button>
    ` : "";

    const popupContent = `
      <div class="glass-popup-card">
        <div class="glass-popup-header" style="display: flex; align-items: center; justify-content: space-between; gap: 0.4rem; flex-wrap: wrap;">
          <div style="display: flex; gap: 0.3rem; align-items: center;">
            <span class="animal-tag ${item.animal}">🐾 ${item.animal.toUpperCase()}</span>
            <span class="verification-badge ${item.verified ? 'verified' : 'unverified'}" style="font-size: 0.6rem; padding: 0.15rem 0.35rem; border-radius: 4px; font-weight: 800; text-transform: uppercase; background: ${item.verified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${item.verified ? '#10b981' : '#dc2626'}; border: 1px solid ${item.verified ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};">
              ${item.verified ? 'Verified ✅' : 'Unverified ⚠️'}
            </span>
          </div>
          <span class="severity-badge ${item.severity.replace(' ', '-').toLowerCase()}">${item.severity}</span>
        </div>
        <div class="glass-popup-body">
          <h3 style="font-size:0.95rem; font-weight:800; margin-bottom:0.25rem;">Report #${item.id} 📝</h3>
          <p><strong>👤 Reporter:</strong> ${item.reporter}</p>
          <p><strong>📅 Date:</strong> ${item.date}</p>
          <p><strong>🚨 Behavior:</strong> ${item.behavior}</p>
          <p class="description" style="font-size:0.75rem; font-style:italic; margin-top:0.25rem;">"${item.description}"</p>
          <p style="font-size:0.7rem; color:var(--text-muted); margin-top:0.3rem;">📍 Zone ${item.zone} | ${item.ward}</p>
        </div>
        <div class="glass-popup-footer" style="margin-top:0.5rem; display: flex; flex-direction: column; gap: 0.25rem;">
          <button class="popup-action-btn" onclick="startCitizenPEP('${item.date}')" style="font-size:0.7rem; width:100%; padding:0.35rem; border-radius:6px; cursor:pointer;">🩹 Track Exposure (PEP)</button>
          ${verifyBtnHtml}
        </div>
      </div>
    `;
    marker.bindPopup(popupContent, { maxWidth: 250, className: 'leaflet-custom-popup-wrapper' });
    window.markersLayer.addLayer(marker);
  });

  // 2. Render Quarantined Animals (Orange Observation Pins)
  filteredQuarantines.forEach(item => {
    const iconHtml = `<div class="leaflet-custom-pin" style="border-color: #ea580c; color: #ea580c;">${window.ANIMAL_CLIPARTS.quarantine}</div>`;
    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon-container',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([item.lat, item.lng], { icon: customIcon });
    const popupContent = `
      <div class="glass-popup-card quarantine">
        <div class="glass-popup-header">
          <span class="quarantine-tag" style="background:rgba(234,88,12,0.1); color:#ea580c; font-size:0.6rem; padding:0.15rem 0.35rem; border-radius:4px; font-weight:800;">🐕 QUARANTINE</span>
          <span class="day-badge" style="font-size:0.6rem; font-weight:800;">⏳ Day ${item.day} of 10</span>
        </div>
        <div class="glass-popup-body" style="margin-top:0.4rem;">
          <h3 style="font-size:0.9rem; font-weight:800;">${item.name}</h3>
          <p><strong>🚨 Status:</strong> ${item.behavior}</p>
          <p><strong>🏥 Facility:</strong> ${item.location}</p>
          <p><strong>🩹 Marks:</strong> ${item.marks}</p>
          <p><strong>🩺 Vet:</strong> ${item.updater}</p>
          <p style="font-size:0.7rem; color:var(--text-muted); margin-top:0.3rem;">📍 Zone ${item.zone} | ${item.ward}</p>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent, { maxWidth: 250, className: 'leaflet-custom-popup-wrapper' });
    window.markersLayer.addLayer(marker);
  });

  // 3. Render Vaccinated & ABC Secured Animals (Green Star Pins)
  filteredVaccinations.forEach(item => {
    const iconHtml = `<div class="leaflet-custom-pin" style="border-color: #10b981; color: #10b981;">${window.ANIMAL_CLIPARTS.vaccination}</div>`;
    const customIcon = L.divIcon({
      html: iconHtml,
      className: 'custom-leaflet-icon-container',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([item.lat, item.lng], { icon: customIcon });
    const popupContent = `
      <div class="glass-popup-card vaccinated">
        <div class="glass-popup-header">
          <span class="vaccinated-tag" style="background:rgba(16,185,129,0.1); color:#10b981; font-size:0.6rem; padding:0.15rem 0.35rem; border-radius:4px; font-weight:800;">✅ ABC SECURED</span>
        </div>
        <div class="glass-popup-body" style="margin-top:0.4rem;">
          <h3 style="font-size:0.9rem; font-weight:800;">🐶 "${item.name}" (${item.type})</h3>
          <p><strong>📅 Date:</strong> ${item.date}</p>
          <p><strong>✂️ Status:</strong> ${item.cnvr}</p>
          <p><strong>🩹 Marks:</strong> ${item.marks}</p>
          <p><strong>🧪 Batch:</strong> ${item.batch}</p>
          <p style="font-size:0.7rem; color:var(--text-muted); margin-top:0.3rem;">📍 Zone ${item.zone} | ${item.ward}</p>
        </div>
      </div>
    `;
    marker.bindPopup(popupContent, { maxWidth: 250, className: 'leaflet-custom-popup-wrapper' });
    window.markersLayer.addLayer(marker);
  });
};

// Render Surge alerts as pulsing geographic concentric Leaflet circles
window.renderAlertClusters = function() {
  if (!window.map || !window.activeAlertsLayer) return;
  
  // Clear existing active surge layers
  window.activeAlertsLayer.clearLayers();

  const filteredBites = window.filterDataset ? window.filterDataset(window.SURVEILLANCE_DATABASE.biteCases, 'date') : window.SURVEILLANCE_DATABASE.biteCases;

  // Render pulsing ring hotspot for Zone 5 (Sharda Nagar) if bites count is high
  const zone5BiteCount = filteredBites.filter(b => b.zone === "5").length;
  if (zone5BiteCount >= 2) {
    const ring = L.circle([26.7640, 80.9160], {
      radius: 650, // geographical radius in meters
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.12,
      weight: 2,
      className: 'leaflet-pulsing-hotspot'
    });
    window.activeAlertsLayer.addLayer(ring);
  }

  // Render pulsing ring hotspot for Zone 1 (Hazratganj)
  const zone1BiteCount = filteredBites.filter(b => b.zone === "1").length;
  if (zone1BiteCount >= 1) {
    const ring = L.circle([26.8467, 80.9462], {
      radius: 450,
      color: '#f59e0b',
      fillColor: '#f59e0b',
      fillOpacity: 0.12,
      weight: 2,
      className: 'leaflet-pulsing-hotspot'
    });
    window.activeAlertsLayer.addLayer(ring);
  }
};

// Modal view to show detailed stats per Ward clicked on choropleth boundary
function showWardAnalyticsModal(wardName, zone, coverage) {
  if (document.getElementById('analytics-modal')) {
    document.getElementById('analytics-modal').remove();
  }

  const overlay = document.createElement('div');
  overlay.className = 'glass-modal-overlay active';
  overlay.id = 'analytics-modal';
  
  const statusColor = coverage >= 70 ? 'success' : coverage >= 50 ? 'warning' : 'danger';
  const statusEmoji = coverage >= 70 ? '✅' : coverage >= 50 ? '⚠️' : '🚨';
  const herdStatusText = coverage >= 70 ? 'Herd Immunity Target Achieved! 🐾' : 'Below Safe Herd Immunity Threshold (70%) 🚨';
  
  overlay.innerHTML = `
    <div class="glass-modal-card">
      <div class="glass-modal-header">
        <h2>📍 ${wardName.toUpperCase()} Municipal Report</h2>
        <button class="modal-close-btn" onclick="document.getElementById('analytics-modal').remove()">×</button>
      </div>
      <div class="glass-modal-body">
        <div class="state-anal-grid">
          <div class="anal-metric-card">
            <h4>💉 Stray Vaccine Coverage</h4>
            <div class="anal-metric-value text-${statusColor}">${coverage}%</div>
            <div class="coverage-bar-container">
              <div class="coverage-bar fill-${statusColor}" style="width: ${coverage}%"></div>
            </div>
            <p class="anal-metric-label text-muted">${statusEmoji} ${herdStatusText}</p>
          </div>
          
          <div class="anal-metric-card">
            <h4>📈 LMC Zone Parameter</h4>
            <div class="anal-metric-value text-primary">Zone ${zone}</div>
            <p>Managed under Lucknow Municipal Corporation (LMC) veterinary directives and Animal Birth Control (ABC) sterilization programs.</p>
          </div>
        </div>
        
        <div class="state-actions-list" style="margin-top: 1.5rem;">
          <h3>🩺 LMC Veterinary ABC Squad Directives</h3>
          <ul>
            <li>✂️ ABC sterilization deployment: <strong>Active in this zone</strong></li>
            <li>🩹 Post-Exposure Prophylaxis clinic stocks: <strong>Verified secure in nearest hospitals</strong></li>
            <li>🏫 Community educational vaccine drives: <strong>Scheduled this month 🐶</strong></li>
          </ul>
        </div>
      </div>
      <div class="glass-modal-footer">
        <button class="glass-btn primary" onclick="document.getElementById('analytics-modal').remove()">Acknowledge Directive</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// Global button proxy triggers inside popups
window.startCitizenPEP = function(dateStr) {
  if (typeof window.switchAccessPortal === 'function') {
    window.switchAccessPortal('citizen');
  }
  
  const dateInput = document.getElementById('exposure-date-input');
  if (dateInput) {
    dateInput.value = dateStr;
    const event = new Event('change');
    dateInput.dispatchEvent(event);
    
    const trackerSection = document.getElementById('pep-tracker-box');
    if (trackerSection) {
      trackerSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

// Unified filtering logic for date, month, year, zone, and ward selectors
window.filterDataset = function(dataset, dateField = 'date') {
  const filterYear = document.getElementById('filter-year') ? document.getElementById('filter-year').value : 'All';
  const filterMonth = document.getElementById('filter-month') ? document.getElementById('filter-month').value : 'All';
  const filterDate = document.getElementById('filter-date') ? document.getElementById('filter-date').value : '';
  const filterZone = document.getElementById('filter-zone') ? document.getElementById('filter-zone').value : 'All';
  const filterWard = document.getElementById('filter-ward') ? document.getElementById('filter-ward').value : 'All';

  return dataset.filter(item => {
    // 1. Geographic Filters
    if (filterZone !== 'All' && String(item.zone) !== filterZone) {
      return false;
    }
    if (filterWard !== 'All' && item.ward !== filterWard) {
      return false;
    }

    // 2. Date/Temporal Filters
    const itemDateStr = item[dateField];
    if (!itemDateStr) return true;

    const [year, month, day] = itemDateStr.split('-');

    // Specific Date filter
    if (filterDate) {
      return itemDateStr === filterDate;
    }

    // Year Filter
    if (filterYear !== 'All' && year !== filterYear) {
      return false;
    }

    // Month Filter
    if (filterMonth !== 'All' && month !== filterMonth) {
      return false;
    }

    return true;
  });
};

// Renders an interactive vector SVG line chart representing case load week-by-week
window.renderTemporalTrendLine = function() {
  const canvas = document.getElementById('trend-chart-canvas');
  if (!canvas) return;

  const activeTab = document.querySelector('.trend-tab.active');
  const metric = activeTab ? activeTab.getAttribute('data-metric') : 'bites';

  const counts = [0, 0, 0, 0, 0];
  let chartColor = '#ef4444'; // Red for bites
  let chartLabel = 'Bites';

  if (metric === 'bites') {
    const filteredBites = window.filterDataset ? window.filterDataset(window.SURVEILLANCE_DATABASE.biteCases, 'date') : window.SURVEILLANCE_DATABASE.biteCases;
    filteredBites.forEach(item => {
      const day = parseInt(item.date.split('-')[2]) || 15;
      if (day <= 7) counts[0]++;
      else if (day <= 14) counts[1]++;
      else if (day <= 21) counts[2]++;
      else if (day <= 28) counts[3]++;
      else counts[4]++;
    });
    chartColor = '#ef4444';
    chartLabel = 'Bites';
  } else {
    const filteredVaccinations = window.filterDataset ? window.filterDataset(window.SURVEILLANCE_DATABASE.vaccinations, 'date') : window.SURVEILLANCE_DATABASE.vaccinations;
    filteredVaccinations.forEach(item => {
      const day = parseInt(item.date.split('-')[2]) || 15;
      if (day <= 7) counts[0]++;
      else if (day <= 14) counts[1]++;
      else if (day <= 21) counts[2]++;
      else if (day <= 28) counts[3]++;
      else counts[4]++;
    });
    chartColor = '#10b981'; // Green for ABC Complete
    chartLabel = 'Sterilizations';
  }

  // SVG parameters
  const width = 290;
  const height = 90;
  const paddingX = 20;
  const paddingY = 15;
  
  const roundedCounts = counts.map(c => Math.round(c * 10) / 10);
  const maxVal = Math.max(...roundedCounts, 3); // minimum scale index of 3
  
  const points = roundedCounts.map((val, idx) => {
    const x = paddingX + (idx * (width - 2 * paddingX) / (counts.length - 1));
    const y = height - paddingY - (val * (height - 2 * paddingY) / maxVal);
    return { x, y, val };
  });

  // Draw smooth cubic bezier curves
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const cpX1 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
    const cpY1 = points[i-1].y;
    const cpX2 = points[i-1].x + (points[i].x - points[i-1].x) / 2;
    const cpY2 = points[i].y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${points[i].x} ${points[i].y}`;
  }

  // Generate interactive node circles and labels
  let nodesHtml = '';
  points.forEach((pt, idx) => {
    nodesHtml += `
      <circle cx="${pt.x}" cy="${pt.y}" r="4.5" fill="${chartColor}" stroke="white" stroke-width="2" style="cursor: pointer;">
        <title>Week ${idx+1} ${chartLabel}: ${pt.val}</title>
      </circle>
      <text x="${pt.x}" y="${height - 2}" font-size="7" font-weight="800" fill="#475569" text-anchor="middle">W${idx+1}</text>
      <text x="${pt.x}" y="${pt.y - 7}" font-size="7.5" font-weight="800" fill="${chartColor}" text-anchor="middle">${pt.val}</text>
    `;
  });

  canvas.innerHTML = `
    <svg class="trend-svg" viewBox="0 0 ${width} ${height}" style="width: 100%; max-width: 600px; height: 100%;">
      <!-- Gradient Fill under path -->
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${chartColor}" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="${chartColor}" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      
      <!-- Area fill path -->
      <path d="${pathD} L ${points[points.length-1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z" fill="url(#chartGrad)"/>
      
      <!-- Stroke trendline path -->
      <path d="${pathD}" fill="none" stroke="${chartColor}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
      
      <!-- Horizontal Baseline -->
      <line x1="${points[0].x}" y1="${height - paddingY}" x2="${points[points.length-1].x}" y2="${height - paddingY}" stroke="rgba(0,0,0,0.06)" stroke-width="1.5"/>
      
      <!-- Interactive nodes -->
      ${nodesHtml}
    </svg>
  `;
};

// Dynamic Visual Alert Trigger on the Leaflet Map
window.triggerVisualMapAlert = function(lat, lng, reporter, severity, victimName, bittenCount) {
  if (!window.map || !window.activeAlertsLayer) return;

  console.log(`[GIS Map Engine] Dispatching visual map radar sweep at [${lat}, ${lng}] for ${reporter}`);

  // Create highly pulsing concentric circles for new active exposure
  const ring1 = L.circle([lat, lng], {
    radius: 400,
    color: '#ef4444',
    fillColor: '#ef4444',
    fillOpacity: 0.15,
    weight: 3.5,
    className: 'leaflet-pulsing-hotspot'
  });

  const ring2 = L.circle([lat, lng], {
    radius: 200,
    color: '#dc2626',
    fillColor: '#dc2626',
    fillOpacity: 0.25,
    weight: 2,
    className: 'leaflet-pulsing-hotspot'
  });

  // Add rings to active alerts layer so they are visible
  window.activeAlertsLayer.addLayer(ring1);
  window.activeAlertsLayer.addLayer(ring2);

  // Bind popup details directly to the visual alert rings
  const popupContent = `
    <div class="glass-popup-card" style="border-color: #ef4444;">
      <div class="glass-popup-header" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border-radius: 8px 8px 0 0; padding: 0.4rem 0.6rem; font-weight: 800; font-size: 0.72rem;">
        🚨 EMERGENCY EXPOSURE ALARM
      </div>
      <div class="glass-popup-body" style="padding: 0.75rem;">
        <h4 style="font-weight: 800; font-size: 0.85rem; color: var(--text-dark); margin-bottom: 0.25rem;">Active Case Alert Filed</h4>
        <p style="font-size: 0.75rem; color: var(--text-muted); line-height: 1.35;">
          <strong>Reporter:</strong> ${reporter}<br>
          <strong>Victim:</strong> ${victimName} (${bittenCount} exposed)<br>
          <strong>Severity:</strong> <span class="severity-badge ${severity.replace(' ', '-').toLowerCase()}">${severity}</span>
        </p>
        <p style="font-size: 0.68rem; color: #b91c1c; font-weight: 700; margin-top: 0.4rem;">
          LMC Veterinary ABC Squad & Public Health dispatch notifications have been broadcasted!
        </p>
      </div>
    </div>
  `;

  ring2.bindPopup(popupContent, { maxWidth: 260, className: 'leaflet-custom-popup-wrapper' }).openPopup();

  // Smoothly fly map zoom-in directly to the incident sector!
  try {
    window.map.setView([lat, lng], 14, {
      animate: true,
      duration: 1.5
    });
  } catch (err) {
    console.warn("[GIS Map Engine] Pan view failed:", err);
  }

  // Auto clean visual radar rings after 12 seconds to prevent map clutter
  setTimeout(() => {
    try {
      window.activeAlertsLayer.removeLayer(ring1);
      window.activeAlertsLayer.removeLayer(ring2);
    } catch (e) {}
  }, 12000);
};
