export const en = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    delete: 'Delete',
    edit: 'Edit',
    search: 'Search',
    loading: 'Loading...',
    refresh: 'Refresh',
    viewDetails: 'View Details',
    applyNow: 'Apply Now',
    close: 'Close',
    all: 'All',
    verified: 'Verified',
    status: 'Status',
    action: 'Action',
    required: 'Required',
    optional: 'Optional'
  },
  nav: {
    dashboard: 'Dashboard',
    cropDoctor: 'Crop Doctor',
    govtSchemes: 'Govt Schemes',
    alerts: 'Alerts & Advisory',
    marketPrices: 'Market Prices',
    community: 'Community',
    profile: 'My Profile',
    settings: 'Settings',
    logout: 'Logout'
  },
  topbar: {
    welcomeRegion: 'Region',
    notifications: 'Notifications',
    unread: 'Unread',
    markAllRead: 'Mark all read',
    viewAllAlerts: 'View All Intelligence Alerts'
  },
  dashboard: {
    title: 'Farmer Advisory Dashboard',
    subtitle: 'Real-time weather insights & food security advisories',
    regionSelect: 'Select District Region',
    puneDistrict: 'Pune District',
    nashikDistrict: 'Nashik District',
    
    // Crop Doctor Hero Card
    cdHeroTag: 'AI Powered Health Assessment',
    cdHeroTitle: '🌱 Crop Doctor',
    cdHeroDesc: 'Upload a crop photo and let AI analyze its health, detect diseases, and get verified treatment guidance.',
    cdHeroDiagnoseBtn: 'Diagnose My Crop',
    cdHeroHistoryBtn: 'View Previous Diagnoses',

    // Govt Schemes Hero Banner
    schemesHeroTag: '🏛️ Govt Subsidies & Benefits',
    schemesHeroTitle: 'Government Schemes for Farmers',
    schemesHeroDesc: 'Explore 13+ active Maharashtra & Central Govt schemes including PM-KISAN, 90% Solar Pump Subsidies, Drip Irrigation & Loan Waivers.',
    schemesHeroBtn: 'Explore 13 Schemes',

    // Dashboard Command Center Keys
    greetingMorning: 'Good Morning',
    greetingAfternoon: 'Good Afternoon',
    greetingEvening: 'Good Evening',
    heroSubtitle: "Here's what's happening on your farms today.",
    agriculturalMotto: 'Better information. Better decisions. Healthier crops.',
    
    totalLandArea: 'Total Land Area',
    activeCrops: 'Active Crops',
    unreadAlerts: 'Unread Alerts',
    eligibleSchemes: 'Eligible Schemes',
    marketWatch: 'Market Watch',
    checkEligibility: 'Check your eligibility',
    
    todaysWeatherTitle: "Today's Weather",
    rainChance: 'Rain Chance',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    viewDetailedForecast: 'View Detailed Forecast',
    
    criticalAlertsTitle: 'Critical Alerts',
    affectedCropsLabel: 'Affected crops:',
    severityHigh: 'HIGH',
    viewAll: 'View All',
    
    yourFarmsTitle: 'Your Farms',
    addFarmBtn: '+ Add New Farm',
    ownedLabel: 'Owned',
    leasedLabel: 'Leased',
    noFarmsMsg: 'No farms added yet.',
    addFarmPrompt: 'Add your first farm to receive personalized advisories.',
    
    yourCropsTitle: 'Your Crops',
    noCropsMsg: 'No active crops registered.',
    
    marketPricesTitle: 'Market Prices',
    marketDataUnavailable: 'Market data currently unavailable.',
    
    govtSchemesForYouTitle: 'Government Schemes For You',
    eligibleBadge: 'Eligible',
    
    recentAlertsTitle: 'Recent Alerts',
    
    quickActionsTitle: 'Quick Actions',
    diagnoseCropAction: 'Diagnose Crop',
    checkWeatherAction: 'Check Weather',
    viewMarketAction: 'View Market Prices',
    exploreSchemesAction: 'Explore Schemes',
    
    tipOfDayTitle: 'Farming Tip of the Day',
    tipOfDayBody: 'Ensure proper drainage in your fields before expected rainfall. Mulching can help retain soil moisture and prevent nutrient leaching.',
    viewMoreTipsBtn: 'View More Tips'
  },
  cropDoctor: {
    title: 'Crop Doctor',
    subtitle: 'Identify possible crop diseases and get practical treatment guidance using AI.',
    badgeAI: 'AI Health Assessment',
    
    step1: '01 Upload Photo',
    step2: '02 AI Analysis',
    step3: '03 Treatment Guidance',

    uploadTitle: 'Upload Crop Photo',
    uploadSubtitle: 'Take a clear photo of the affected leaf, fruit, stem, or plant.',
    btnTakePhoto: 'Take Photo',
    btnUploadDevice: 'Upload from Device',
    btnRetake: 'Retake Photo',
    btnAnalyze: 'Analyze Crop',
    maxSizeNotice: 'Supports JPG, JPEG, PNG, WebP (Max size: 10 MB)',
    
    checklistTitle: 'Image Quality Tips:',
    check1: 'Good lighting',
    check2: 'Crop clearly visible',
    check3: 'Focus on affected area',
    check4: 'Avoid blurry images',

    cropSelect: 'Select Crop',
    growthStageSelect: 'Growth Stage',
    stateLabel: 'State',
    districtLabel: 'District',
    villageLabel: 'Village (Optional)',
    symptomsLabel: 'Describe what you observed (Optional)',
    symptomsPlaceholder: 'e.g. Leaves are becoming yellow and developing brown spots.',

    stepExamining: 'Examining Crop Photo...',
    stepDetecting: 'Detecting visual symptoms...',
    stepComparing: 'Comparing disease patterns...',
    stepCheckingWeather: 'Checking environmental risk factors...',
    stepPreparing: 'Preparing farmer-friendly diagnosis...',

    resultTitle: 'Crop Health Analysis',
    confidenceLabel: 'Confidence',
    possibleDisease: 'Possible Disease',
    statusAttention: 'Attention Required',
    statusHealthy: 'Crop Appears Healthy',
    healthyNotice: 'AI did not detect a strong visual indication of supported diseases. Continue good field hygiene.',
    lowConfidenceWarning: 'The image does not provide enough evidence for a reliable diagnosis. Please upload a clearer image or consult an agriculture expert.',
    
    symptomsTitle: 'Symptoms Detected',
    explanationTitle: 'AI Assessment Explanation',
    aiDisclaimerNotice: 'Note: AI diagnosis is a supportive tool based on visible symptoms and does not replace certified agricultural extension advice.',

    severityTitle: 'Disease Risk Severity',
    affectedArea: 'Affected Area:',
    severityUnavailable: 'Severity assessment unavailable',

    actionsTitle: '🌿 What Should I Do?',
    immediateActions: 'Immediate Actions',
    preventionTitle: 'Prevention & Management',

    protectionTitle: '🧪 Verified Crop Protection Options',
    protectionWarning: '⚠️ Safety First: Use only products registered/approved for your crop and target disease. Always follow current product label, required protective equipment, dosage, and pre-harvest interval.',
    noProtectionFound: 'No verified crop-protection product was found for this crop and diagnosis. Please consult a qualified agricultural officer.',
    activeIngredient: 'Active Ingredient',
    applicationGuidance: 'Application Guidance',
    safetyPPE: 'Safety / Required PPE',
    phi: 'Pre-Harvest Interval (PHI)',
    verificationSource: 'Verified Source',

    integratedTitle: '🌱 Integrated Crop Management',
    irrigationMgmt: '💧 Irrigation Management',
    fieldHygiene: '🌿 Field Hygiene',
    pestMonitoring: '🐛 Pest Monitoring',
    cropNutrition: '🌾 Crop Nutrition',
    environmentalMgmt: '🌤️ Environmental Management',

    weatherTitle: '🌦️ Disease Risk & Weather Correlation',
    btnViewWeather: 'View Detailed Weather',

    confidenceFooter: '🔬 Diagnosis Confidence',
    btnAskExpert: 'Ask Agriculture Expert',
    btnSaveReport: 'Save Diagnosis Report',
    btnHistory: 'View Previous Diagnoses',

    expertModalTitle: 'Submit for Agriculture Expert Review',
    expertModalSub: 'Your crop photo and AI analysis will be shared with our regional agricultural extension specialists.',
    btnSubmitExpert: 'Send to Expert',
    expertSuccessMsg: 'Submitted successfully! An agriculture officer will review your report within 24 hours.',

    historyTitle: 'Crop Diagnosis History',
    historySubtitle: 'Track past crop health analyses and recommendations.',
    filterAll: 'All',
    filterHealthy: 'Healthy',
    filterDisease: 'Disease Detected',
    filterReview: 'Needs Review',
    btnViewReport: 'View Report',
    emptyHistory: 'No crop diagnoses recorded yet.'
  },
  schemes: {
    title: 'Government Schemes & Subsidies',
    subtitleMr: 'शासकीय कृषी योजना व अनुदान केंद्र',
    subtitle: 'Explore 13+ official state & central agricultural schemes, check eligibility, and apply directly.',
    btnCheckEligibility: 'Check My Scheme Eligibility',
    
    statsActive: 'Active Schemes',
    statsCentral: 'Central Govt',
    statsState: 'Maharashtra State',
    statsSubsidy: 'Subsidy Direct DBT',

    searchPlaceholder: 'Search scheme name, subsidy, e.g. PM-KISAN, Solar, कर्जमुक्ती, ठिबक...',
    allLevels: 'All Levels',
    centralGovt: '🏛️ Central Govt',
    stateGovt: '🚩 Maharashtra State',
    allLandSizes: 'All Land Sizes',

    eligibilityModalTitle: 'Farmer Scheme Eligibility Calculator',
    eligibilityModalSub: 'Find government schemes tailored to your farm',
    landSizeLabel: 'Land Holding Size *',
    cropCategoryLabel: 'Primary Crop Category *',
    farmerCategoryLabel: 'Farmer Category *',
    btnCalculate: 'Find Eligible Schemes For Me',

    benefitHeader: '💡 Scheme Financial Benefit / Subsidy',
    maxCap: 'Maximum Cap:',
    overviewHeader: '📜 Overview',
    docsHeader: '✅ Mandatory Documents Required',
    stepsHeader: '📋 Step-by-Step How to Apply',
    helplineLabel: 'Official Toll-Free Helpline:',
    btnApplyPortal: 'Apply on Official Portal'
  },
  alerts: {
    title: 'Alerts & Notifications',
    subtitle: 'Stay informed about weather, crop health, pests, markets and important agricultural updates.',
    btnMarkAllRead: 'Mark all as read',
    btnSettings: 'Notification Settings',
    
    summaryCritical: 'Critical',
    summaryWarnings: 'Warnings',
    summaryModerate: 'Moderate',
    summaryInfo: 'Informational',
    summaryRead: 'Read',

    searchPlaceholder: 'Search alerts, crops, locations...',
    sortBy: 'Sort By',
    sortImportant: 'Most Important',
    sortLatest: 'Latest First',
    sortUnread: 'Unread First',
    unreadOnly: 'Unread Only',

    criticalSectionTitle: '🚨 Critical Alerts',
    criticalActionRequired: 'Urgent Action Required',
    generalSectionTitle: '📋 Regional Advisory & Market Alerts',
    
    affectedCrops: 'Affected crops:',
    expectedRainfall: 'Expected Rainfall',
    timeWindow: 'Time Window',
    priceMovement: 'Price Movement',
    verifiedSource: 'Verified Source',
    
    btnViewWeather: 'View Weather',
    btnOpenCropDoctor: 'Open Crop Doctor',
    btnViewMarket: 'View Market Prices',
    btnViewScheme: 'View Scheme Details',

    emptyTitle: '🌱 You\'re all caught up!',
    emptyDesc: 'No new alerts for your farms and crops.',
    btnRefresh: 'Refresh Alerts',

    drawerHeaderDesc: 'Detailed Explanation',
    actionPlanHeader: '💡 Recommended Action Plan for Farmers',
    
    settingsTitle: 'Notification Preferences',
    settingsSub: 'Customize how and when you receive agricultural alerts',
    smsAlerts: 'SMS Weather & Pest Alerts',
    pushAlerts: 'In-App Push Notifications',
    weatherTopic: 'Weather Warnings (Rainfall, Frost, Drought)',
    pestTopic: 'Pest & Disease Outbreak Warnings',
    marketTopic: 'Market Price Fluctuations',
    btnSaveSettings: 'Save Notification Settings'
  },
  market: {
    title: 'Market Prices & Mandi Intelligence',
    subtitle: 'Track real-time mandi prices across Maharashtra and maximize your crop profit',
    selectDistrict: 'Select Mandi District:',
    allDistricts: 'All Districts',
    puneDistrictTab: 'Pune District (पुणे जिल्हा)',
    nashikDistrictTab: 'Nashik District (नाशिक जिल्हा)',
    ahmednagarDistrictTab: 'Ahmednagar / Kopargaon',
    
    recommendationTitle: '💡 AI Highest Net Profit Mandi Recommendation',
    recommendationSub: 'Calculated modal price minus estimated freight transport cost',
    netProfitLabel: 'Estimated Net Profit:',
    recommendedMandi: 'Recommended Mandi:',
    distanceLabel: 'Est. Freight Distance:',
    
    searchCropPlaceholder: 'Search crop (e.g. Onion, कांदा, Tomato, डाळिंब)...',
    sortByPriceHigh: 'Highest Price',
    sortByPriceLow: 'Lowest Price',
    sortByNearest: 'Nearest Mandi',
    
    modalPriceLabel: 'Modal Price',
    minMaxRange: 'Min - Max Range:',
    trend7Day: '7-Day Price Trajectory'
  },
  community: {
    title: 'Community Forum',
    subtitle: 'Connect with farmers, agriculture experts, and your farming community.',
    btnAskCommunity: '+ Ask Community',
    
    activeFarmers: 'Active Farmers',
    expertsCount: 'Agriculture Experts',
    discussionsCount: 'Discussions',
    onlineNow: 'Online Now',

    pinnedDiscussion: '📌 Pinned Discussion',
    searchDiscussionsPlaceholder: 'Search discussions, crops, topics...',
    sortLatest: 'Latest',
    sortDiscussed: 'Most Discussed',
    sortHelpful: 'Most Helpful',

    verifiedExpertAnswer: '✓ VERIFIED EXPERT ANSWER',
    btnHelpful: 'Helpful',
    btnReply: 'Reply',
    btnShare: 'Share',
    btnAnalyzeDoctor: 'Analyze with Crop Doctor',

    trendingDiscussions: '🔥 Trending Discussions',
    agriExperts: '🧑‍🌾 Agriculture Experts',
    popularCrops: '🌾 Popular Crops',

    createModalTitle: 'Start a Community Discussion',
    createModalSub: 'Ask questions or share your farming experience with experts & peers',
    discussionTitleLabel: 'Discussion Title *',
    cropLabel: 'Crop Name *',
    categoryLabel: 'Discussion Category *',
    contentLabel: 'Detailed Description *',
    attachPhoto: 'Attach Crop Photo (Optional)',
    btnSubmitPost: 'Post Discussion'
  },
  profile: {
    title: 'Farmer Profile & Settings',
    headerBannerSubtitle: 'Registered AgriRakshak Farmer',
    roleFarmer: 'Registered Farmer',
    roleExpert: 'Agriculture Expert',
    verifiedAccount: '🟢 Supabase Verified Account',
    demoAccount: '🟡 Offline Demo Account',
    
    diagnosesCompleted: 'Crop Diagnoses Completed',
    communityDiscussions: 'Community Discussions',
    trustRegion: 'Kopargaon Region Trust',

    editTitle: 'Edit Profile Information',
    editSubtitle: 'Update your personal details and farming location',
    fullNameLabel: 'Full Name',
    phoneLabel: 'Phone Number',
    districtLabel: 'District / Mandi Region',
    stateLabel: 'State',
    btnSaveProfile: 'Save Profile Updates',
    successUpdate: 'Profile updated successfully!'
  },
  settings: {
    title: 'Settings & Preferences',
    subtitle: 'Manage your account language, notifications, and regional preferences',
    
    langSectionTitle: '🌐 Language & Region Preferences',
    langSectionSub: 'Choose your preferred language for the entire AgriRakshak interface',
    langEnglish: 'English (🇬🇧)',
    langMarathi: 'मराठी (🇮🇳)',
    langHindi: 'हिंदी (🇮🇳)',
    currentLangIs: 'Current Active Language:',
    langUpdatedMsg: '✓ UI language updated successfully!',

    notifSectionTitle: 'Notification Preferences',
    notifSms: 'SMS Alerts (Weather & Pest warnings)',
    notifPush: 'Push Notifications (Daily advisories)'
  },
  auth: {
    signInTitle: 'AgriRakshak Sign In',
    signInSub: 'AI-Powered Smart Agriculture & Farmer Advisory',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    forgotPassword: 'Forgot password?',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    btnSignIn: 'Sign In to AgriRakshak',
    quickDemoLogin: 'Quick Demo Login:',
    loginAsFarmer: 'Log in as Farmer (Ramesh)',
    loginAsExpert: 'Log in as Expert (Dr. Anita)',
    noAccountPrompt: 'Don\'t have an account?',
    createAccountLink: 'Create Farmer Account',

    signUpTitle: 'Create AgriRakshak Account',
    signUpSub: 'Join thousands of farmers and agricultural experts',
    registeringAs: 'I am registering as:',
    roleFarmerBtn: '🌾 Farmer',
    roleExpertBtn: '🧑‍🌾 Agriculture Expert',
    confirmPasswordLabel: 'Confirm Password',
    btnCompleteSignUp: 'Complete Sign Up',
    alreadyAccountPrompt: 'Already have an account?',
    loginLink: 'Sign In'
  }
};
