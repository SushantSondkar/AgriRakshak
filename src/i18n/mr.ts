import type { en } from './en';

export const mr: typeof en = {
  common: {
    save: 'सेव्ह करा',
    cancel: 'रद्द करा',
    back: 'मागे',
    next: 'पुढे',
    submit: 'सबमिट करा',
    delete: 'हटवा',
    edit: 'संपादित करा',
    search: 'शोधा',
    loading: 'लोड होत आहे...',
    refresh: 'रिफ्रेश करा',
    viewDetails: 'सविस्तर पहा',
    applyNow: 'आता अर्ज करा',
    close: 'बंद करा',
    all: 'सर्व',
    verified: 'प्रमाणित',
    status: 'स्थिती',
    action: 'कृती',
    required: 'आवश्यक',
    optional: 'पर्यायी'
  },
  nav: {
    dashboard: 'डॅशबोर्ड',
    cropDoctor: 'क्रॉप डॉक्टर',
    govtSchemes: 'शासकीय योजना',
    alerts: 'सूचना व सल्ला',
    marketPrices: 'बाजार भाव',
    community: 'समुदाय',
    profile: 'माझे प्रोफाइल',
    settings: 'सेटिंग्ज',
    logout: 'लॉगआउट'
  },
  topbar: {
    welcomeRegion: 'प्रदेश',
    notifications: 'सूचना',
    unread: 'अवाचलेले',
    markAllRead: 'सर्व वाचलेले दाखवा',
    viewAllAlerts: 'सर्व कृषी अलर्ट पहा'
  },
  dashboard: {
    title: 'शेतकरी सल्लागार डॅशबोर्ड',
    subtitle: 'हवामान अंदाज व अन्न सुरक्षा मार्गदर्शक सूचना',
    regionSelect: 'जिल्हा प्रदेश निवडा',
    puneDistrict: 'पुणे जिल्हा',
    nashikDistrict: 'नाशिक जिल्हा',
    
    cdHeroTag: 'AI पीक आरोग्य तपासणी',
    cdHeroTitle: '🌱 क्रॉप डॉक्टर',
    cdHeroDesc: 'पिकाचा फोटो अपलोड करा आणि AI द्वारे रोगाचे निदान व प्रमाणित उपचार मार्गदर्शन मिळवा.',
    cdHeroDiagnoseBtn: 'पिकाचे निदान करा',
    cdHeroHistoryBtn: 'पूर्वीचे अहवाल पहा',

    schemesHeroTag: '🏛️ शासकीय योजना व अनुदान',
    schemesHeroTitle: 'शेतकऱ्यांसाठी शासकीय कृषी योजना',
    schemesHeroDesc: 'पीएम-किसान, ९०% सौर कृषी पंप अनुदान, ठिबक सिंचन आणि कर्जमुक्तीसह १३+ योजनांची माहिती घ्या.',
    schemesHeroBtn: '१३ योजना पहा',

    greetingMorning: 'शुभ प्रभात',
    greetingAfternoon: 'शुभ दुपार',
    greetingEvening: 'शुभ संध्याकाळ',
    heroSubtitle: 'आज तुमच्या शेतात काय घडत आहे ते पहा.',
    agriculturalMotto: 'उत्कृष्ट माहिती. योग्य निर्णय. सुदृढ पिके.',
    
    totalLandArea: 'एकूण जमीन क्षेत्र',
    activeCrops: 'एकूण पिके',
    unreadAlerts: 'अवाचलेले इशारे',
    eligibleSchemes: 'पात्र योजना',
    marketWatch: 'बाजार भाव नजर',
    checkEligibility: 'पात्रता तपासा',
    
    todaysWeatherTitle: 'आजचे हवामान',
    rainChance: 'पावसाची शक्यता',
    humidity: 'आद्रतेचे प्रमाण',
    windSpeed: 'वाऱ्याचा वेग',
    viewDetailedForecast: 'सविस्तर हवामान अंदाज पहा',
    
    criticalAlertsTitle: 'महत्त्वाचे इशारे',
    affectedCropsLabel: 'बाधित पिके:',
    severityHigh: 'उच्च गंभीर',
    viewAll: 'सर्व पहा',
    
    yourFarmsTitle: 'तुमची शेती क्षेत्रे',
    addFarmBtn: '+ नवीन शेत जोडा',
    ownedLabel: 'मालकीची',
    leasedLabel: 'कौलाने/कराराने',
    noFarmsMsg: 'अद्याप कोणतेही शेत जोडलेले नाही.',
    addFarmPrompt: 'वैयक्तिक सल्ला मिळवण्यासाठी तुमचे पहिले शेत जोडा.',
    
    yourCropsTitle: 'तुमची पिके',
    noCropsMsg: 'कोणतीही पिके नोंदवलेली नाहीत.',
    
    marketPricesTitle: 'बाजार भाव',
    marketDataUnavailable: 'बाजार भाव सध्या उपलब्ध नाही.',
    
    govtSchemesForYouTitle: 'तुमच्यासाठी शासकीय योजना',
    eligibleBadge: 'पात्र',
    
    recentAlertsTitle: 'नुकतेच आलेले इशारे',
    
    quickActionsTitle: 'त्वरित कृती',
    diagnoseCropAction: 'पिकाचे निदान करा',
    checkWeatherAction: 'हवामान पहा',
    viewMarketAction: 'बाजार भाव पहा',
    exploreSchemesAction: 'योजना पहा',
    
    tipOfDayTitle: 'आजचा कृषी सल्ला',
    tipOfDayBody: 'अपेक्षित पावसापूर्वी तुमच्या शेतात योग्य पाण्याचा निचरा होण्याची व्यवस्था करा. आच्छादनामुळे (Mulching) जमिनीतील ओलावा टिकून राहतो.',
    viewMoreTipsBtn: 'अधिक सल्ले पहा'
  },
  cropDoctor: {
    title: 'क्रॉप डॉक्टर',
    subtitle: 'पिकाच्या रोगांची मोफत AI द्वारे ओळख करा आणि त्वरित उपचार मार्गदर्शन मिळवा.',
    badgeAI: 'AI पीक आरोग्य तपासणी',
    
    step1: '०१ फोटो अपलोड करा',
    step2: '०२ AI विश्लेषण',
    step3: '०३ उपचार मार्गदर्शन',

    uploadTitle: 'पिकाचा फोटो अपलोड करा',
    uploadSubtitle: 'बाधित पान, फळ, खोड किंवा झाडाचा स्पष्ट फोटो घ्या.',
    btnTakePhoto: 'कॅमेऱ्याने फोटो घ्या',
    btnUploadDevice: 'गॅलरीतून फोटो निवडा',
    btnRetake: 'पुन्हा फोटो घ्या',
    btnAnalyze: 'पिक तपासा (AI Analyze)',
    maxSizeNotice: 'JPG, JPEG, PNG, WebP सपोर्ट (कमाल आकार: १० MB)',
    
    checklistTitle: 'उत्तम फोटोसाठी टीपा:',
    check1: 'योग्य प्रकाश',
    check2: 'पीक स्पष्ट दिसणे',
    check3: 'बाधित भागावर फोकस',
    check4: 'धुंद फोटो टाळा',

    cropSelect: 'पीक निवडा',
    growthStageSelect: 'वाढीची पायरी',
    stateLabel: 'राज्य',
    districtLabel: 'जिल्हा',
    villageLabel: 'गाव (पर्यायी)',
    symptomsLabel: 'तुम्हाला दिसणारी लक्षणे सांगा (पर्यायी)',
    symptomsPlaceholder: 'उदा. पाने पिवळी पडत आहेत आणि त्यावर तपकिरी ठिपके दिसत आहेत.',

    stepExamining: 'पिकाचा फोटो तपासत आहे...',
    stepDetecting: 'रोगाची लक्षणे शोधत आहे...',
    stepComparing: 'रोग नमुन्यांची तुलना करत आहे...',
    stepCheckingWeather: 'हवामान जोखीम तपासत आहे...',
    stepPreparing: 'शेतकरी स्नेही अहवाल तयार करत आहे...',

    resultTitle: 'पीक आरोग्य विश्लेषण अहवाल',
    confidenceLabel: 'AI अचूकता प्रमाण',
    possibleDisease: 'संभाव्य रोग',
    statusAttention: 'लक्ष देणे आवश्यक',
    statusHealthy: 'पीक निरोगी दिसत आहे',
    healthyNotice: 'AI ला कोणत्याही रोगाची स्पष्ट लक्षणे आढळली नाहीत. नियमित काळजी घ्या.',
    lowConfidenceWarning: 'फोटोवरून रोगाची अचूक ओळख पटत नाही. कृपया अधिक स्पष्ट फोटो अपलोड करा किंवा कृषी तज्ञांशी संपर्क साधा.',
    
    symptomsTitle: 'आढळलेली लक्षणे',
    explanationTitle: 'AI विश्लेषणाचे स्पष्टीकरण',
    aiDisclaimerNotice: 'टीप: AI निदान हे केवळ मार्गदर्शक साधन आहे, हे अधिकृत कृषी अधिकाऱ्यांच्या सल्ल्याला पर्याय नाही.',

    severityTitle: 'रोगाची तीव्रता',
    affectedArea: 'बाधित क्षेत्र:',
    severityUnavailable: 'तीव्रता उपलब्ध नाही',

    actionsTitle: '🌿 मी आता काय करावे?',
    immediateActions: 'तात्काळ करायच्या गोष्टी',
    preventionTitle: 'प्रतिबंधक उपाय',

    protectionTitle: '🧪 प्रमाणित पीक संरक्षण औषधे (Verified)',
    protectionWarning: '⚠️ सुरक्षा प्रथम: केवळ तुमच्या पिकासाठी आणि रोगासाठी मंजूर असलेली औषधे वापरा. लेबलवरील सूचना, डोस आणि सुरक्षा साधनांचा वापर करा.',
    noProtectionFound: 'या निदानासाठी कोणतीही प्रमाणित औषध नोंद आढळली नाही. कृपया कृषी अधिकाऱ्यांचा सल्ला घ्या.',
    activeIngredient: 'प्रमुख घटक (Active Ingredient)',
    applicationGuidance: 'फवारणी मार्गदर्शन',
    safetyPPE: 'सुरक्षा साधने (PPE)',
    phi: 'कापणीपूर्वीचा काळ (PHI)',
    verificationSource: 'प्रमाणित स्रोत',

    integratedTitle: '🌱 एकात्मिक पीक व्यवस्थापन',
    irrigationMgmt: '💧 पाणी व्यवस्थापन',
    fieldHygiene: '🌿 शेत स्वच्छता',
    pestMonitoring: '🐛 किड पाहणी',
    cropNutrition: '🌾 पीक पोषण',
    environmentalMgmt: '🌤️ हवामान काळजी',

    weatherTitle: '🌦️ हवामान व रोग जोखीम अंदाज',
    btnViewWeather: 'सविस्तर हवामान पहा',

    confidenceFooter: '🔬 AI अचूकता प्रमाण',
    btnAskExpert: 'कृषी तज्ञाला विचारा',
    btnSaveReport: 'अहवाल सेव्ह करा',
    btnHistory: 'पूर्वीचे अहवाल पहा',

    expertModalTitle: 'कृषी तज्ञांकडे पाठवा',
    expertModalSub: 'तुमचा फोटो आणि AI अहवाल प्रादेशिक कृषी विस्तार तज्ञांकडे पाठवला जाईल.',
    btnSubmitExpert: 'तज्ञांकडे सबमिट करा',
    expertSuccessMsg: 'यशस्वीरीत्या पाठवले! कृषी अधिकारी २४ तासांत पाहणी करतील.',

    historyTitle: 'पीक निदान इतिहास',
    historySubtitle: 'मागील सर्व पीक आरोग्य तपासणी अहवाल पहा.',
    filterAll: 'सर्व',
    filterHealthy: 'निरोगी',
    filterDisease: 'रोग आढळलेले',
    filterReview: 'तज्ञ तपासणी',
    btnViewReport: 'अहवाल पहा',
    emptyHistory: 'अद्याप कोणतेही अहवाल सेव्ह नाहीत.'
  },
  schemes: {
    title: 'शासकीय कृषी योजना व अनुदान',
    subtitleMr: 'शासकीय कृषी योजना व अनुदान केंद्र',
    subtitle: 'केंद्र व राज्य सरकारच्या १३+ अधिकृत कृषी योजनांची माहिती घ्या व थेट अर्ज करा.',
    btnCheckEligibility: 'माझी योजना पात्रता तपासा',
    
    statsActive: 'सक्रिय योजना',
    statsCentral: 'केंद्र सरकार',
    statsState: 'महाराष्ट्र शासन',
    statsSubsidy: 'थेट खात्यात अनुदान (DBT)',

    searchPlaceholder: 'योजनेचे नाव, अनुदान शोधा (उदा. पीएम किसान, सौर पंप, कर्जमुक्ती, ठिबक)...',
    allLevels: 'सर्व स्तर',
    centralGovt: '🏛️ केंद्र सरकार',
    stateGovt: '🚩 महाराष्ट्र शासन',
    allLandSizes: 'सर्व जमीन क्षेत्र',

    eligibilityModalTitle: 'शेतकरी योजना पात्रता कॅल्क्युलेटर',
    eligibilityModalSub: 'तुमच्या शेतीनुसार पात्र योजना शोधा',
    landSizeLabel: 'जमीन धारण क्षेत्र *',
    cropCategoryLabel: 'प्रमुख पीक वर्ग *',
    farmerCategoryLabel: 'शेतकरी प्रवर्ग *',
    btnCalculate: 'माझ्यासाठी पात्र योजना शोधा',

    benefitHeader: '💡 योजनेचे आर्थिक लाभ व अनुदान',
    maxCap: 'कमाल अनुदान मर्यादा:',
    overviewHeader: '📜 योजनेची माहिती',
    docsHeader: '✅ आवश्यक कागदपत्रे',
    stepsHeader: '📋 अर्ज प्रक्रिया',
    helplineLabel: 'अधिकृत मोफत हेल्पलाइन नंबर:',
    btnApplyPortal: 'अधिकृत पोर्टलवर अर्ज करा'
  },
  alerts: {
    title: 'सूचना व कृषी सल्ला',
    subtitle: 'हवामान, पीक आरोग्य, किड-रोग आणि बाजारभावांचे महत्वाचे इशारे वेळेवर मिळवा.',
    btnMarkAllRead: 'सर्व वाचलेले करा',
    btnSettings: 'सूचना सेटिंग्ज',
    
    summaryCritical: 'महत्वाचे',
    summaryWarnings: 'इशारे',
    summaryModerate: 'मध्यम',
    summaryInfo: 'माहिती',
    summaryRead: 'वाचलेले',

    searchPlaceholder: 'सूचना, पिके किंवा ठिकाण शोधा...',
    sortBy: 'क्रमवारी',
    sortImportant: 'महत्वाचे प्रथम',
    sortLatest: 'नवीनतम प्रथम',
    sortUnread: 'अवाचलेले प्रथम',
    unreadOnly: 'केवळ अवाचलेले',

    criticalSectionTitle: '🚨 अत्यंत महत्वाचे इशारे',
    criticalActionRequired: 'तात्काळ कारवाई आवश्यक',
    generalSectionTitle: '📋 प्रादेशिक कृषी सल्ला व बाजार अपडेट्स',
    
    affectedCrops: 'बाधित पिके:',
    expectedRainfall: 'अपेक्षित पाऊस',
    timeWindow: 'कालावधी',
    priceMovement: 'दर बदल',
    verifiedSource: 'प्रमाणित स्रोत',
    
    btnViewWeather: 'हवामान पहा',
    btnOpenCropDoctor: 'क्रॉप डॉक्टर उघडा',
    btnViewMarket: 'बाजार भाव पहा',
    btnViewScheme: 'योजना पहा',

    emptyTitle: '🌱 सर्व सूचना वाचून झाल्या आहेत!',
    emptyDesc: 'तुमच्या शेतासाठी सध्या नवीन कोणतेही अलर्ट नाहीत.',
    btnRefresh: 'रिफ्रेश करा',

    drawerHeaderDesc: 'सविस्तर स्पष्टीकरण',
    actionPlanHeader: '💡 शेतकऱ्यांसाठी कृती आराखडा',
    
    settingsTitle: 'सूचना पसंती सेटिंग्ज',
    settingsSub: 'कृषी अलर्ट कसे आणि कधी मिळवायचे ते निवडा',
    smsAlerts: 'SMS द्वारे हवामान व किड इशारे',
    pushAlerts: 'ॲप पुश नोटिफिकेशन्स',
    weatherTopic: 'हवामान इशारे (पाऊस, वादळ, दुष्काळ)',
    pestTopic: 'किड व रोग प्रादुर्भाव इशारे',
    marketTopic: 'बाजार भाव चढ-उतार',
    btnSaveSettings: 'सेटिंग्ज सेव्ह करा'
  },
  market: {
    title: 'कृषी उत्पन्न बाजार समिती (APMC) दर',
    subtitle: 'महाराष्ट्रातील सर्व प्रमुख बाजार समित्यांचे थेट दर पहा आणि सर्वाधिक नफा मिळवा',
    selectDistrict: 'जिल्हा बाजार निवडा:',
    allDistricts: 'सर्व जिल्हे',
    puneDistrictTab: 'पुणे जिल्हा (Pune)',
    nashikDistrictTab: 'नाशिक जिल्हा (Nashik)',
    ahmednagarDistrictTab: 'अहिल्यानगर / कोपरगाव',
    
    recommendationTitle: '💡 AI सर्वाधिक निव्वळ नफा देणारी बाजार समिती',
    recommendationSub: 'बाजार दर व वाहतूक खर्च वजा करून मोजलेला नफा',
    netProfitLabel: 'अंदाजित निव्वळ नफा:',
    recommendedMandi: 'शिफारस केलेली बाजार समिती:',
    distanceLabel: 'अंदाजित वाहतूक अंतर:',
    
    searchCropPlaceholder: 'पीक शोधा (उदा. Onion, कांदा, Tomato, डाळिंब)...',
    sortByPriceHigh: 'सर्वाधिक दर',
    sortByPriceLow: 'कमी दर',
    sortByNearest: 'जवळची बाजार समिती',
    
    modalPriceLabel: 'सर्वसाधारण दर',
    minMaxRange: 'कमीत कमी - जास्तीत जास्त दर:',
    trend7Day: '७-दिवसांची बाजार भाव वाटचाल'
  },
  community: {
    title: 'शेतकरी समुदाय मंच (Community)',
    subtitle: 'इतर शेतकरी बंधू आणि कृषी तज्ञांशी जोडा व शंकांचे निरसन करा.',
    btnAskCommunity: '+ समुदायाला विचारा',
    
    activeFarmers: 'सक्रिय शेतकरी',
    expertsCount: 'कृषी तज्ञ',
    discussionsCount: 'चर्चा',
    onlineNow: 'ऑनलाइन शेतकरी',

    pinnedDiscussion: '📌 पिन केलेली महत्वाची चर्चा',
    searchDiscussionsPlaceholder: 'चर्चा, पिके किंवा विषय शोधा...',
    sortLatest: 'नवीनतम',
    sortDiscussed: 'सर्वाधिक चर्चा',
    sortHelpful: 'उपयुक्त',

    verifiedExpertAnswer: '✓ प्रमाणित कृषी तज्ञांचे उत्तर',
    btnHelpful: 'उपयुक्त',
    btnReply: 'उत्तर द्या',
    btnShare: 'शेअर करा',
    btnAnalyzeDoctor: 'क्रॉप डॉक्टरने तपासा',

    trendingDiscussions: '🔥 लोकप्रिय चर्चा',
    agriExperts: '🧑‍🌾 अधिकृत कृषी तज्ञ',
    popularCrops: '🌾 प्रमुख पिके',

    createModalTitle: 'नवीन चर्चा सुरू करा',
    createModalSub: 'आपले प्रश्न विचारा किंवा शेतीचा अनुभव इतरांशी शेअर करा',
    discussionTitleLabel: 'चर्चेचा विषय *',
    cropLabel: 'पिकाचे नाव *',
    categoryLabel: 'चर्चा वर्ग *',
    contentLabel: 'सविस्तर माहिती *',
    attachPhoto: 'पिकाचा फोटो जोडा (पर्यायी)',
    btnSubmitPost: 'चर्चा पोस्ट करा'
  },
  profile: {
    title: 'माझे प्रोफाइल व शेती माहिती',
    headerBannerSubtitle: 'नोंदणीकृत ॲग्रीरक्षक शेतकरी',
    roleFarmer: 'नोंदणीकृत शेतकरी',
    roleExpert: 'कृषी विस्तार तज्ञ',
    verifiedAccount: '🟢 सुपारबेस प्रमाणित खाते',
    demoAccount: '🟡 ऑफलाइन डेमो खाते',
    
    diagnosesCompleted: 'पूर्ण झालेली पीक निदाने',
    communityDiscussions: 'समुदायातील चर्चा',
    trustRegion: 'कोपरगाव प्रादेशिक विश्वास',

    editTitle: 'प्रोफाइल माहिती संपादित करा',
    editSubtitle: 'तुमचे नाव, मोबाईल नंबर व शेतीचे ठिकाण अपडेट करा',
    fullNameLabel: 'पूर्ण नाव',
    phoneLabel: 'मोबाईल नंबर',
    districtLabel: 'जिल्हा / बाजार प्रदेश',
    stateLabel: 'राज्य',
    btnSaveProfile: 'प्रोफाइल सेव्ह करा',
    successUpdate: 'प्रोफाइल यशस्वीरीत्या अपडेट झाली!'
  },
  settings: {
    title: 'सेटिंग्ज व पसंती',
    subtitle: 'भाषा, नोटिफिकेशन्स आणि प्रादेशिक पर्याय व्यवस्थापित करा',
    
    langSectionTitle: '🌐 भाषा व प्रदेश पसंती (Language Settings)',
    langSectionSub: 'ॲग्रीरक्षक वापरण्यासाठी तुमची पसंतीची भाषा निवडा',
    langEnglish: 'English (🇬🇧)',
    langMarathi: 'मराठी (🇮🇳)',
    langHindi: 'हिंदी (🇮🇳)',
    currentLangIs: 'सध्याची सक्रिय भाषा:',
    langUpdatedMsg: '✓ भाषा यशस्वीरीत्या बदलली!',

    notifSectionTitle: 'सूचना सेटिंग्ज',
    notifSms: 'SMS इशारे (हवामान व किड इशारे)',
    notifPush: 'ॲप पुश नोटिफिकेशन्स'
  },
  auth: {
    signInTitle: 'ॲग्रीरक्षक साइन इन',
    signInSub: 'AI-आधारित प्रगत कृषी व शेतकरी सल्लागार',
    emailLabel: 'ईमेल पत्ता',
    passwordLabel: 'पासवर्ड',
    forgotPassword: 'पासवर्ड विसरलात?',
    showPassword: 'पासवर्ड दाखवा',
    hidePassword: 'पासवर्ड लपवा',
    btnSignIn: 'साइन इन करा',
    quickDemoLogin: 'झटपट डेमो लॉगइन:',
    loginAsFarmer: 'शेतकरी म्हणून लॉगइन (रमेश पाटील)',
    loginAsExpert: 'कृषी तज्ञ म्हणून लॉगइन (डॉ. अनिता)',
    noAccountPrompt: 'खाते नाही?',
    createAccountLink: 'नवीन खाते तयार करा',

    signUpTitle: 'नवीन खाते तयार करा',
    signUpSub: 'हजारो शेतकरी आणि कृषी तज्ञांच्या समुदायात सामील व्हा',
    registeringAs: 'मी नोंदणी करत आहे:',
    roleFarmerBtn: '🌾 शेतकरी',
    roleExpertBtn: '🧑‍🌾 कृषी तज्ञ',
    confirmPasswordLabel: 'पासवर्डची खात्री करा',
    btnCompleteSignUp: 'नोंदणी पूर्ण करा',
    alreadyAccountPrompt: 'आधीपासून खाते आहे?',
    loginLink: 'साइन इन करा'
  }
};
