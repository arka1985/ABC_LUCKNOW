import fs from 'fs';

const filePath = 'c:/Users/arka/Rabies_Surveillance_Lucknow/bhashini.js';

try {
  let content = fs.readFileSync(filePath, 'utf8');

  // Let's find 'hi: {' and 'bn: {'
  const hiStartIndex = content.indexOf('  hi: {');
  const bnStartIndex = content.indexOf('  bn: {');

  if (hiStartIndex === -1 || bnStartIndex === -1) {
    throw new Error('Could not find hi: { or bn: { markers in bhashini.js');
  }

  const cleanHiSection = `  hi: {
    app_title: "🐶 बिनाइन कैनाइन (Benign Canine) 🐾",
    app_subtitle: "🗺️ लखनऊ नगर निगम रेबीज निगरानी केंद्र 🏥",
    role_citizen: "👤 नागरिक पोर्टल 🏡",
    role_admin: "⚙️ स्थानीय प्रशासन 🏛️",
    role_authority: "📊 स्वास्थ्य प्राधिकरण 🏢",
    
    stat_active_cases: "🚨 सक्रिय काटने के मामले",
    stat_quarantine: "🐕 निगरानी के तहत",
    stat_vaccinated: "💉 टीकाकृत पशु",
    stat_herd_immunity: "🐾 झुंड प्रतिरक्षा स्थिति",
    stat_herd_immunity_sub: "🎯 लक्ष्य: आवारा आबादी में 70%",
    
    hub_welcome: "🐶 बिनाइन कैनाइन निगरानी केंद्र में आपका स्वागत है 🐾",
    hub_select: "👋 नमस्ते! रोग ट्रैकिंग डैशबोर्ड में प्रवेश करने के लिए कृपया अपना प्रवेश द्वार चुनें:",
    hub_citizen_desc: "🏡 पशु जोखिम, काटने की रिपोर्ट करें, सहायता का अनुरोध करें, और अपना पोस्ट-एक्सपोजर प्रोफिलैक्सिस (PEP) टीकाकरण शेड्यूल ट्रैक करें 🩹।",
    hub_admin_desc: "⚙️ टीकाकृत जानवरों को पंजीकृत करें 💉, ABC (पशु जन्म नियंत्रण) अभियानों को ट्रैक करें, और एआई कुत्ता मिलान चलाएं 🤖।",
    hub_authority_desc: "📊 वास्तविक समय रंगीन जीआईएस मानचित्र, राज्यव्यापी टीकाकरण कवरेज, सक्रिय अलर्ट क्लस्टर और संगरोध लॉग की समीक्षा करें 🐕।",
    back_to_hub: "🔙 मुख्य हब पर लौटें",
    
    citizen_welcome: "👋 स्वागत है नागरिक!",
    citizen_desc: "पशु जोखिम 🐶, काटने 🩹 की रिपोर्ट करें, और अपना जीवन रक्षक पोस्ट-एक्सपोजर प्रोफिलैक्सिस (PEP) वैक्सीन शेड्यूल ट्रैक करें 💉।",
    report_btn: "🚨 पशु जोखिम / काटने की रिपोर्ट करें",
    pep_tracker_title: "🩹 मेरा PEP टीकाकरण शेड्यूल",
    pep_tracker_desc: "काटने की तारीख के आधार पर अपनी जीवन रक्षक रेबीज वैक्सीन खुराक का हिसाब रखें।",
    enter_bite_date: "📅 काटने की तारीख चुनें:",
    dose_day_0: "💉 खुराक 1 (दिन 0) - तत्काल सुरक्षा",
    dose_day_3: "💉 खुराक 2 (दिन 3) - बूस्टर 1",
    dose_day_7: "💉 खुराक 3 (दिन 7) - बूस्टर 2",
    dose_day_14: "💉 खुराक 4 (दिन 14) - बूस्टर 3",
    dose_day_28: "💉 खुराक 5 (दिन 28) - अंतिम सुरक्षा चक्र",
    dose_completed: "✅ पूर्ण",
    dose_upcoming: "⏳ आगामी",
    
    form_report_title: "📝 नया जोखिम और काटने की रिपोर्ट फॉर्म",
    form_reporter_details: "👤 1. रिपोर्टर और स्थान विवरण",
    form_full_name: "पूरा नाम",
    form_phone: "फ़ोन नंबर",
    form_auto_loc: "📍 स्वचालित भू-स्थान (GPS)",
    gps_captured: "✅ जीपीएस सफलतापूर्वक लॉक किया गया!",
    capture_gps_btn: "📍 जीपीएस निर्देशांक प्राप्त करें",
    form_exposure_details: "🐶 2. पशु जोखिम विवरण",
    form_animal_type: "पशु का प्रकार",
    form_dog: "🐕 कुत्ता",
    form_cat: "🐈 बिल्ली",
    form_monkey: "🐒 बंदर / अन्य",
    form_animal_behavior: "पशु का व्यवहार / लक्षण",
    behavior_aggressive: "😡 आक्रामक / लार टपकाना",
    behavior_normal: "😐 सामान्य / उकसाया हुआ काटना",
    behavior_sick: "😢 बीमार / सुस्त",
    form_animal_pic: "📷 पशु की तस्वीर अपलोड करें (यदि सुरक्षित हो)",
    form_victim_details: "🩹 3. पीड़ित मानव का विवरण (यदि लागू हो)",
    form_is_victim: "क्या इस जोखिम में किसी इंसान को काटना / खरोंच शामिल था?",
    form_victim_name: "पीड़ित का पूरा नाम",
    form_victim_age: "पीड़ित की उम्र",
    form_bite_severity: "काटने की गंभीरता (WHO वर्गीकरण)",
    severity_cat1: "श्रेणी I - अक्षत त्वचा पर स्पर्श / चाटना 🐶",
    severity_cat2: "श्रेणी II - खुली त्वचा को कुतरना / मामूली खरोंच 🩹",
    severity_cat3: "श्रेणी III - गहरे घाव / टूटी त्वचा पर चाटना 🚨",
    form_submit: "🚀 बिनाइन कैनाइन को रिपोर्ट सबमिट करें",
    
    admin_welcome: "⚙️ आपका स्वागत है, स्थानीय प्रशासक!",
    admin_desc: "टीकाकृत जानवरों को पंजीकृत करें 💉, ABC (पशु जन्म नियंत्रण) अभियानों को ट्रैक करें, और एआई कुत्ता मिलान चलाएं 🤖।",
    register_vacc_btn: "💉 नया टीकाकरण / ABC कार्यक्रम पंजीकृत करें",
    ai_matching_title: "🤖 एआई कुत्ता पहचान (टीकाकरण सत्यापन)",
    ai_desc: "टीकाकरण रजिस्ट्री के खिलाफ बायोमेट्रिक मिलान करने के लिए कुत्ते की तस्वीर अपलोड करें।",
    ai_upload_label: "📷 एआई स्कैन के लिए कुत्ते की तस्वीर अपलोड करें",
    ai_scan_btn: "🔍 एआई मिलान प्रोटोकॉल चलाएं",
    ai_scanning: "⚡ एआई बायोमेट्रिक स्कैनिंग चल रही है...",
    ai_result_found: "🎉 टीकाकरण डेटाबेस में एआई मिलान मिला!",
    ai_confidence: "आत्मविश्वास मिलान स्कोर",
    ai_vacc_status: "सत्यापित टीकाकरण स्थिति",
    ai_no_match: "❌ कोई मिलान नहीं मिला। नए पशु के रूप में पंजीकृत करें।",
    cnvr_status: "ABC नसबंदी स्थिति",
    cnvr_none: "💉 केवल टीकाकृत",
    cnvr_completed: "✂️ नपुंसक और टीकाकृत (ABC पूर्ण)",
    identification_marks: "शारीरिक पहचान चिन्ह (जैसे कान का निशान, पट्टा)",
    vaccine_batch: "वैक्सीन बैच आईडी",
    
    authority_welcome: "📊 सार्वजनिक स्वास्थ्य कमांड सेंटर",
    authority_desc: "वास्तविक समय रेबीज महामारी विज्ञान निगरानी, जीआईएस संगरोध ट्रैकिंग और असामान्य काटने की चेतावनी।",
    alert_feed: "🚨 लाइव असामान्य काटने के अलर्ट और हॉटस्पॉट",
    coverage_estimator: "📈 राज्य-वार टीकाकरण कवरेज अनुमानक",
    quarantine_observation: "🐕 पृथक किए गए पशु (10-दिवसीय अवलोकन लॉग)",
    days_left: "दिन शेष",
    healthy_status: "💚 स्वस्थ (कोई रेबीज लक्षण नहीं)",
    symptomatic_status: "🚨 लक्षण युक्त (अलग करें / सत्यापित करें)",
    map_layer_toggle: "🗺️ जीआईएस मानचित्र परतें टॉगल",
    layer_coverage: "🗺️ राज्य टीकाकरण कवरेज (कोरोप्लेथ)",
    layer_bite_cases: "🚨 सक्रिय काटने के मामले और हॉटस्पॉट क्लस्टर",
    layer_drives: "💉 स्थानीय ABC और टीकाकरण केंद्र",
    
    btn_close: "बंद करें",
    status_active: "सक्रिय",
    status_resolved: "हल किया हुआ",
    status_quarantined: "पृथक (संगरोध)",
    status_safe: "अवलोकन पूर्ण - सुरक्षित",
    alert_high_bite: "🚨 चेतावनी: उच्च काटने की गतिविधि क्लस्टर का पता चला",
    alert_suspected_rabies: "🚨 चेतावनी: संदिग्ध पागल जानवर की सूचना मिली",
    
    branding_text: "🐾 डॉ. अर्काप्रभा सौ और प्रो. मनीष कुमार सिंह द्वारा संकल्पित और विकसित"
  },\n`;

  const newContent = content.substring(0, hiStartIndex) + cleanHiSection + content.substring(bnStartIndex);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('bhashini.js Hindi section successfully cleaned and ABC terminology applied!');
} catch (err) {
  console.error('Error fixing bhashini.js:', err);
}
