import type { en } from './en';

export const hi: typeof en = {
  common: {
    save: 'सेव करें',
    cancel: 'रद्द करें',
    back: 'पीछे',
    next: 'आगे',
    submit: 'सबमिट करें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    search: 'खोजें',
    loading: 'लोड हो रहा है...',
    refresh: 'रिफ्रेश करें',
    viewDetails: 'विवरण देखें',
    applyNow: 'अभी आवेदन करें',
    close: 'बंद करें',
    all: 'सभी',
    verified: 'प्रमाणित',
    status: 'स्थिति',
    action: 'कार्रवाई',
    required: 'आवश्यक',
    optional: 'वैकल्पिक'
  },
  nav: {
    dashboard: 'डैशबोर्ड',
    cropDoctor: 'क्रॉप डॉक्टर',
    govtSchemes: 'सरकारी योजनाएं',
    alerts: 'सूचनाएं और सलाह',
    marketPrices: 'बाज़ार भाव',
    community: 'समुदाय',
    profile: 'मेरी प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट'
  },
  topbar: {
    welcomeRegion: 'क्षेत्र',
    notifications: 'सूचनाएं',
    unread: 'अपठित',
    markAllRead: 'सभी को पढ़ा हुआ चिन्हित करें',
    viewAllAlerts: 'सभी कृषि अलर्ट देखें'
  },
  dashboard: {
    title: 'किसान सलाहकार डैशबोर्ड',
    subtitle: 'वास्तविक समय मौसम जानकारी और खाद्य सुरक्षा निर्देश',
    regionSelect: 'ज़िला क्षेत्र चुनें',
    puneDistrict: 'पुणे ज़िला',
    nashikDistrict: 'नासिक ज़िला',
    
    cdHeroTag: 'AI फसल स्वास्थ्य जांच',
    cdHeroTitle: '🌱 क्रॉप डॉक्टर',
    cdHeroDesc: 'फसल की फोटो अपलोड करें और AI से बीमारी की पहचान व उपचार मार्गदर्शन पाएं।',
    cdHeroDiagnoseBtn: 'फसल की जांच करें',
    cdHeroHistoryBtn: 'पुराने रिकॉर्ड देखें',

    schemesHeroTag: '🏛️ सरकारी योजनाएं और सब्सिडी',
    schemesHeroTitle: 'किसानों के लिए सरकारी योजनाएं',
    schemesHeroDesc: 'पीएम-किसान, 90% सौर पंप सब्सिडी, ड्रिप सिंचाई और ऋण माफी सहित 13+ योजनाओं की जानकारी लें।',
    schemesHeroBtn: '13 योजनाएं देखें',

    greetingMorning: 'शुभ प्रभात',
    greetingAfternoon: 'शुभ दोपहर',
    greetingEvening: 'शुभ संध्या',
    heroSubtitle: 'आज आपके खेतों में क्या हो रहा है, यहाँ देखें।',
    agriculturalMotto: 'बेहतर जानकारी। सही निर्णय। स्वस्थ फसलें।',
    
    totalLandArea: 'कुल भूमि क्षेत्र',
    activeCrops: 'सक्रिय फसलें',
    unreadAlerts: 'अनपढ़ी चेतावनियाँ',
    eligibleSchemes: 'पात्र योजनाएं',
    marketWatch: 'बाजार भाव नजर',
    checkEligibility: 'पात्रता जांचें',
    
    todaysWeatherTitle: 'आज का मौसम',
    rainChance: 'बारिश की संभावना',
    humidity: 'आर्द्रता की मात्रा',
    windSpeed: 'हवा की गति',
    viewDetailedForecast: 'विस्तृत मौसम पूर्वानुमान देखें',
    
    criticalAlertsTitle: 'महत्वपूर्ण चेतावनियाँ',
    affectedCropsLabel: 'प्रभावित फसलें:',
    severityHigh: 'उच्च गंभीर',
    viewAll: 'सभी देखें',
    
    yourFarmsTitle: 'आपके खेत',
    addFarmBtn: '+ नया खेत जोड़ें',
    ownedLabel: 'स्वामित्व',
    leasedLabel: 'लीज़/पट्टे पर',
    noFarmsMsg: 'अभी तक कोई खेत नहीं जोड़ा गया है।',
    addFarmPrompt: 'व्यक्तिगत सलाह प्राप्त करने के लिए अपना पहला खेत जोड़ें।',
    
    yourCropsTitle: 'आपकी फसलें',
    noCropsMsg: 'कोई सक्रिय फसल पंजीकृत नहीं है।',
    
    marketPricesTitle: 'बाज़ार भाव',
    marketDataUnavailable: 'बाज़ार भाव वर्तमान में उपलब्ध नहीं है।',
    
    govtSchemesForYouTitle: 'आपके लिए सरकारी योजनाएं',
    eligibleBadge: 'पात्र',
    
    recentAlertsTitle: 'हाल की चेतावनियाँ',
    
    quickActionsTitle: 'त्वरित कार्य',
    diagnoseCropAction: 'फसल की जांच करें',
    checkWeatherAction: 'मौसम देखें',
    viewMarketAction: 'बाज़ार भाव देखें',
    exploreSchemesAction: 'योजनाएं देखें',
    
    tipOfDayTitle: 'आज का कृषि सुझाव',
    tipOfDayBody: 'संभावित बारिश से पहले खेतों में उचित जल निकासी की व्यवस्था करें। मल्चिंग (Mulching) से मिट्टी की नमी बनी रहती है।',
    viewMoreTipsBtn: 'अधिक सुझाव देखें'
  },
  cropDoctor: {
    title: 'क्रॉप डॉक्टर',
    subtitle: 'फसल की बीमारियों की पहचान करें और AI की मदद से सही उपचार पाएं।',
    badgeAI: 'AI फसल स्वास्थ्य जांच',
    
    step1: '01 फोटो अपलोड करें',
    step2: '02 AI विश्लेषण',
    step3: '03 उपचार मार्गदर्शन',

    uploadTitle: 'फसल की फोटो अपलोड करें',
    uploadSubtitle: 'प्रभावित पत्ते, फल, तने या पौधे की स्पष्ट फोटो लें।',
    btnTakePhoto: 'कैमरे से फोटो लें',
    btnUploadDevice: 'गैलरी से फोटो चुनें',
    btnRetake: 'दोबारा फोटो लें',
    btnAnalyze: 'फसल की जांच करें',
    maxSizeNotice: 'JPG, JPEG, PNG, WebP समर्थित (अधिकतम: 10 MB)',
    
    checklistTitle: 'बेहतर फोटो के लिए सुझाव:',
    check1: 'पर्याप्त रोशनी',
    check2: 'फसल स्पष्ट दिखे',
    check3: 'प्रभावित हिस्से पर फोकस',
    check4: 'धुंधली फोटो से बचें',

    cropSelect: 'फसल चुनें',
    growthStageSelect: 'वृद्धि की अवस्था',
    stateLabel: 'राज्य',
    districtLabel: 'जिला',
    villageLabel: 'गांव (वैकल्पिक)',
    symptomsLabel: 'दिखने वाले लक्षण बताएं (वैकल्पिक)',
    symptomsPlaceholder: 'जैसे- पत्ते पीले पड़ रहे हैं और भूरे धब्बे दिखाई दे रहे हैं।',

    stepExamining: 'फसल की फोटो जांच रहा है...',
    stepDetecting: 'बीमारी के लक्षण खोज रहा है...',
    stepComparing: 'पैटर्न की तुलना कर रहा है...',
    stepCheckingWeather: 'मौसम जोखिम जांच रहा है...',
    stepPreparing: 'किसान अनुकूल रिपोर्ट तैयार कर रहा है...',

    resultTitle: 'फसल स्वास्थ्य विश्लेषण',
    confidenceLabel: 'AI सटीकता',
    possibleDisease: 'संभावित बीमारी',
    statusAttention: 'ध्यान देना आवश्यक',
    statusHealthy: 'फसल स्वस्थ दिख रही है',
    healthyNotice: 'AI को किसी गंभीर बीमारी के लक्षण नहीं मिले। नियमित देखभाल जारी रखें।',
    lowConfidenceWarning: 'फोटो से सटीक पहचान नहीं हो पा रही है। कृपया अधिक स्पष्ट फोटो अपलोड करें या कृषि विशेषज्ञ से संपर्क करें।',
    
    symptomsTitle: 'पहचाने गए लक्षण',
    explanationTitle: 'AI विश्लेषण का स्पष्टीकरण',
    aiDisclaimerNotice: 'नोट: AI निदान एक सहायक उपकरण है और यह प्रमाणित कृषि अधिकारी की सलाह का विकल्प नहीं है।',

    severityTitle: 'बीमारी की गंभीरता',
    affectedArea: 'प्रभावित क्षेत्र:',
    severityUnavailable: 'गंभीरता उपलब्ध नहीं',

    actionsTitle: '🌿 अब मुझे क्या करना चाहिए?',
    immediateActions: 'तत्काल कदम',
    preventionTitle: 'रोकथाम और प्रबंधन',

    protectionTitle: '🧪 प्रमाणित फसल सुरक्षा उत्पाद (Verified)',
    protectionWarning: '⚠️ सुरक्षा प्रथम: केवल अपनी फसल और बीमारी के लिए स्वीकृत उत्पादों का उपयोग करें। हमेशा लेबल निर्देशों और सुरक्षा उपकरणों का पालन करें।',
    noProtectionFound: 'इस बीमारी के लिए कोई सत्यापित उत्पाद नहीं मिला। कृपया कृषि अधिकारी से सलाह लें।',
    activeIngredient: 'सक्रिय घटक (Active Ingredient)',
    applicationGuidance: 'उपयोग संबंधी निर्देश',
    safetyPPE: 'सुरक्षा उपकरण (PPE)',
    phi: 'कटाई पूर्व समय (PHI)',
    verificationSource: 'सत्यापित स्रोत',

    integratedTitle: '🌱 एकीकृत फसल प्रबंधन',
    irrigationMgmt: '💧 सिंचाई प्रबंधन',
    fieldHygiene: '🌿 खेत की सफाई',
    pestMonitoring: '🐛 कीट निगरानी',
    cropNutrition: '🌾 फसल पोषण',
    environmentalMgmt: '🌤️ पर्यावरण प्रबंधन',

    weatherTitle: '🌦️ मौसम जोखिम पूर्वानुमान',
    btnViewWeather: 'विस्तृत मौसम देखें',

    confidenceFooter: '🔬 AI मॉडल विवरण',
    btnAskExpert: 'कृषि विशेषज्ञ से पूछें',
    btnSaveReport: 'रिपोर्ट सेव करें',
    btnHistory: 'पुराने रिकॉर्ड देखें',

    expertModalTitle: 'कृषि विशेषज्ञ से परामर्श लें',
    expertModalSub: 'आपकी फोटो और AI रिपोर्ट क्षेत्रीय कृषि विशेषज्ञ के पास भेजी जाएगी।',
    btnSubmitExpert: 'विशेषज्ञ को भेजें',
    expertSuccessMsg: 'सफलतापूर्वक भेजा गया! कृषि अधिकारी 24 घंटे में समीक्षा करेंगे।',

    historyTitle: 'फसल निदान इतिहास',
    historySubtitle: 'अपनी पिछली फसल जांचों का रिकॉर्ड देखें।',
    filterAll: 'सभी',
    filterHealthy: 'स्वस्थ',
    filterDisease: 'बीमारी ग्रसित',
    filterReview: 'विशेषज्ञ समीक्षा',
    btnViewReport: 'रिपोर्ट देखें',
    emptyHistory: 'अभी कोई रिकॉर्ड सेव नहीं है।'
  },
  schemes: {
    title: 'सरकारी कृषि योजनाएं और सब्सिडी',
    subtitleMr: 'शासकीय कृषी योजना व अनुदान केंद्र',
    subtitle: 'केंद्र और राज्य सरकार की 13+ आधिकारिक कृषि योजनाओं की जानकारी लें और सीधे आवेदन करें।',
    btnCheckEligibility: 'मेरी पात्रता जांचें',
    
    statsActive: 'सक्रिय योजनाएं',
    statsCentral: 'केंद्र सरकार',
    statsState: 'महाराष्ट्र सरकार',
    statsSubsidy: 'सीधे बैंक खाते में सब्सिडी (DBT)',

    searchPlaceholder: 'योजना का नाम या सब्सिडी खोजें (जैसे पीएम किसान, सोलर पंप, ऋण माफी)...',
    allLevels: 'सभी स्तर',
    centralGovt: '🏛️ केंद्र सरकार',
    stateGovt: '🚩 महाराष्ट्र सरकार',
    allLandSizes: 'सभी भूमि क्षेत्र',

    eligibilityModalTitle: 'किसान योजना पात्रता कैलकुलेटर',
    eligibilityModalSub: 'अपनी भूमि और फसल के अनुसार उपयुक्त योजनाएं खोजें',
    landSizeLabel: 'भूमि का क्षेत्रफल *',
    cropCategoryLabel: 'मुख्य फसल वर्ग *',
    farmerCategoryLabel: 'किसान वर्ग *',
    btnCalculate: 'मेरे लिए उपयुक्त योजनाएं खोजें',

    benefitHeader: '💡 योजना के वित्तीय लाभ और सब्सिडी',
    maxCap: 'अधिकतम सब्सिडी सीमा:',
    overviewHeader: '📜 योजना विवरण',
    docsHeader: '✅ आवश्यक दस्तावेज',
    stepsHeader: '📋 आवेदन प्रक्रिया',
    helplineLabel: 'आधिकारिक टोल-फ्री हेल्पलाइन नंबर:',
    btnApplyPortal: 'आधिकारिक पोर्टल पर आवेदन करें'
  },
  alerts: {
    title: 'सूचनाएं और कृषि सलाह',
    subtitle: 'मौसम, फसल स्वास्थ्य, कीट-बीमारी और मंडी भाव की महत्वपूर्ण सूचनाएं समय पर प्राप्त करें।',
    btnMarkAllRead: 'सभी को पढ़ा हुआ चिन्हित करें',
    btnSettings: 'सूचना सेटिंग्स',
    
    summaryCritical: 'महत्वपूर्ण',
    summaryWarnings: 'चेतावनी',
    summaryModerate: 'मध्यम',
    summaryInfo: 'सामान्य जानकारी',
    summaryRead: 'पढ़ा हुआ',

    searchPlaceholder: 'सूचनाएं, फसल या स्थान खोजें...',
    sortBy: 'क्रमबद्ध करें',
    sortImportant: 'महत्वपूर्ण पहले',
    sortLatest: 'नवीनतम पहले',
    sortUnread: 'अपठित पहले',
    unreadOnly: 'केवल अपठित',

    criticalSectionTitle: '🚨 अत्यंत महत्वपूर्ण अलर्ट',
    criticalActionRequired: 'तत्काल कार्रवाई आवश्यक',
    generalSectionTitle: '📋 क्षेत्रीय कृषि सलाह और मंडी अपडेट',
    
    affectedCrops: 'प्रभावित फसलें:',
    expectedRainfall: 'अपेक्षित बारिश',
    timeWindow: 'समय सीमा',
    priceMovement: 'मूल्य परिवर्तन',
    verifiedSource: 'सत्यापित स्रोत',
    
    btnViewWeather: 'मौसम देखें',
    btnOpenCropDoctor: 'क्रॉप डॉक्टर खोलें',
    btnViewMarket: 'मंडी भाव देखें',
    btnViewScheme: 'योजना देखें',

    emptyTitle: '🌱 आपकी सभी सूचनाएं देखी जा चुकी हैं!',
    emptyDesc: 'आपके खेत के लिए फिलहाल कोई नई सूचना नहीं है।',
    btnRefresh: 'रिफ्रेश करें',

    drawerHeaderDesc: 'विस्तृत विवरण',
    actionPlanHeader: '💡 किसानों के लिए अनुशंसित कार्य योजना',
    
    settingsTitle: 'सूचना प्राथमिकताएं',
    settingsSub: 'चुनें कि आप अलर्ट कब और कैसे प्राप्त करना चाहते हैं',
    smsAlerts: 'SMS द्वारा मौसम व कीट चेतावनी',
    pushAlerts: 'ऐप पुश नोटिफिकेशन्स',
    weatherTopic: 'मौसम चेतावनी (बारिश, सूखा, ठंड)',
    pestTopic: 'कीट और बीमारी का प्रकोप',
    marketTopic: 'मंडी भाव उतार-चढ़ाव',
    btnSaveSettings: 'सेटिंग्स सेव करें'
  },
  market: {
    title: 'कृषि उपज मंडी (APMC) भाव',
    subtitle: 'महाराष्ट्र की सभी प्रमुख मंडियों के वास्तविक भाव देखें और अपनी फसल पर अधिकतम लाभ पाएं',
    selectDistrict: 'मंडी जिला चुनें:',
    allDistricts: 'सभी जिले',
    puneDistrictTab: 'पुणे जिला (Pune)',
    nashikDistrictTab: 'नासिक जिला (Nashik)',
    ahmednagarDistrictTab: 'अहमदनगर / कोपरगांव',
    
    recommendationTitle: '💡 AI उच्चतम शुद्ध लाभ मंडी सिफारिश',
    recommendationSub: 'मंडी भाव और परिवहन लागत घटाकर आंका गया लाभ',
    netProfitLabel: 'अनुमानित शुद्ध लाभ:',
    recommendedMandi: 'अनुशंसित मंडी:',
    distanceLabel: 'अनुमानित परिवहन दूरी:',
    
    searchCropPlaceholder: 'फसल खोजें (जैसे Onion, कांदा, Tomato, अनार)...',
    sortByPriceHigh: 'उच्चतम भाव',
    sortByPriceLow: 'कम भाव',
    sortByNearest: 'निकटतम मंडी',
    
    modalPriceLabel: 'औसत भाव',
    minMaxRange: 'न्यूनतम - अधिकतम भाव रेंज:',
    trend7Day: '7-दिनों का मंडी भाव ट्रेंड'
  },
  community: {
    title: 'किसान समुदाय मंच (Community)',
    subtitle: 'अन्य किसान भाइयों और कृषि विशेषज्ञों से जुड़ें और अपनी समस्याओं का समाधान पाएं।',
    btnAskCommunity: '+ समुदाय से पूछें',
    
    activeFarmers: 'सक्रिय किसान',
    expertsCount: 'कृषि विशेषज्ञ',
    discussionsCount: 'चर्चाएं',
    onlineNow: 'ऑनलाइन किसान',

    pinnedDiscussion: '📌 पिन की गई महत्वपूर्ण चर्चा',
    searchDiscussionsPlaceholder: 'चर्चाएं, फसलें या विषय खोजें...',
    sortLatest: 'नवीनतम',
    sortDiscussed: 'सर्वाधिक चर्चाएं',
    sortHelpful: 'उपयोगी',

    verifiedExpertAnswer: '✓ प्रमाणित कृषि विशेषज्ञ का उत्तर',
    btnHelpful: 'उपयोगी',
    btnReply: 'उत्तर दें',
    btnShare: 'शेयर करें',
    btnAnalyzeDoctor: 'क्रॉप डॉक्टर से जांचें',

    trendingDiscussions: '🔥 लोकप्रिय चर्चाएं',
    agriExperts: '🧑‍🌾 आधिकारिक कृषि विशेषज्ञ',
    popularCrops: '🌾 मुख्य फसलें',

    createModalTitle: 'नई चर्चा शुरू करें',
    createModalSub: 'अपने प्रश्न पूछें या खेती का अनुभव दूसरों के साथ साझा करें',
    discussionTitleLabel: 'चर्चा का विषय *',
    cropLabel: 'फसल का नाम *',
    categoryLabel: 'चर्चा वर्ग *',
    contentLabel: 'विस्तृत विवरण *',
    attachPhoto: 'फसल की फोटो जोड़ें (वैकल्पिक)',
    btnSubmitPost: 'चर्चा पोस्ट करें'
  },
  profile: {
    title: 'मेरी प्रोफ़ाइल और खेती की जानकारी',
    headerBannerSubtitle: 'पंजीकृत एग्रीरक्षक किसान',
    roleFarmer: 'पंजीकृत किसान',
    roleExpert: 'कृषि विस्तार विशेषज्ञ',
    verifiedAccount: '🟢 सुपरबेस प्रमाणित खाता',
    demoAccount: '🟡 ऑफ़लाइन डेमो खाता',
    
    diagnosesCompleted: 'फसल जांच पूर्ण',
    communityDiscussions: 'समुदाय में चर्चाएं',
    trustRegion: 'कोपरगांव क्षेत्रीय भरोसा',

    editTitle: 'प्रोफ़ाइल जानकारी संपादित करें',
    editSubtitle: 'अपना नाम, मोबाइल नंबर और खेत का स्थान अपडेट करें',
    fullNameLabel: 'पूरा नाम',
    phoneLabel: 'मोबाइल नंबर',
    districtLabel: 'जिला / मंडी क्षेत्र',
    stateLabel: 'राज्य',
    btnSaveProfile: 'प्रोफ़ाइल सेव करें',
    successUpdate: 'प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!'
  },
  settings: {
    title: 'सेटिंग्स और प्राथमिकताएं',
    subtitle: 'भाषा, नोटिफिकेशन्स और क्षेत्रीय विकल्प प्रबंधित करें',
    
    langSectionTitle: '🌐 भाषा और क्षेत्र प्राथमिकताएं (Language Settings)',
    langSectionSub: 'एग्रीरक्षक का उपयोग करने के लिए अपनी पसंदीदा भाषा चुनें',
    langEnglish: 'English (🇬🇧)',
    langMarathi: 'मराठी (🇮🇳)',
    langHindi: 'हिंदी (🇮🇳)',
    currentLangIs: 'वर्तमान में सक्रिय भाषा:',
    langUpdatedMsg: '✓ भाषा सफलतापूर्वक बदल दी गई!',

    notifSectionTitle: 'सूचना सेटिंग्स',
    notifSms: 'SMS अलर्ट (मौसम और कीट सूचनाएं)',
    notifPush: 'ऐप पुश नोटिफिकेशन्स'
  },
  auth: {
    signInTitle: 'एग्रीरक्षक साइन इन',
    signInSub: 'AI-आधारित उन्नत कृषि और किसान सलाहकार',
    emailLabel: 'ईमेल पता',
    passwordLabel: 'पासवर्ड',
    forgotPassword: 'पासवर्ड भूल गए?',
    showPassword: 'पासवर्ड दिखाएं',
    hidePassword: 'पासवर्ड छुपाएं',
    btnSignIn: 'साइन इन करें',
    quickDemoLogin: 'त्वरित डेमो लॉगिन:',
    loginAsFarmer: 'किसान के रूप में लॉगिन (रमेश पाटिल)',
    loginAsExpert: 'कृषि विशेषज्ञ के रूप में लॉगिन (डॉ. अनिता)',
    noAccountPrompt: 'खाता नहीं है?',
    createAccountLink: 'नया खाता बनाएं',

    signUpTitle: 'नया खाता बनाएं',
    signUpSub: 'हजारों किसानों और कृषि विशेषज्ञों के समुदाय में शामिल हों',
    registeringAs: 'मैं पंजीकरण कर रहा हूँ:',
    roleFarmerBtn: '🌾 किसान',
    roleExpertBtn: '🧑‍🌾 कृषि विशेषज्ञ',
    confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
    btnCompleteSignUp: 'पंजीकरण पूर्ण करें',
    alreadyAccountPrompt: 'पहले से खाता है?',
    loginLink: 'साइन इन करें'
  }
};
