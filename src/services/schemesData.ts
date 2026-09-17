import type { GovernmentScheme } from '../types/scheme';

export const SCHEMES_DATA: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Samman Nidhi',
    title_mr: 'प्रधानमंत्री किसान सन्मान निधी योजना',
    category: 'Direct Cash Support',
    government_level: 'Central Government',
    summary: 'Direct income support of ₹6,000 per year transferred directly into the bank accounts of land-holding farmer families in 3 equal installments of ₹2,000.',
    benefits: 'Financial assistance of ₹6,000 annually (₹2,000 every 4 months) directly deposited via Aadhaar DBT.',
    subsidy_amount: '₹6,000 / year',
    max_subsidy: '₹6,000 annually',
    land_holding_eligibility: ['All Farmers', 'Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['All Crops', 'Cotton', 'Onion', 'Soybean', 'Sugarcane', 'Wheat'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      'Aadhaar Card (linked with Mobile & Bank)',
      '7/12 Extract (साताबारा उतारा) & 8-A Record',
      'Bank Account Passbook (Aadhaar Seeded)',
      'Self-Declaration Form'
    ],
    application_steps: [
      'Visit the official PM-KISAN portal (pmkisan.gov.in) or your local CSC Center.',
      'Click on "Farmers Corner" → "New Farmer Registration".',
      'Enter Aadhaar Number, select State (Maharashtra), District, and Taluka.',
      'Upload 7/12 extract copy and enter bank account details.',
      'Complete e-KYC via OTP or biometric authentication.'
    ],
    official_portal_url: 'https://pmkisan.gov.in',
    helpline_number: '155261 / 1800-115-526',
    status: 'Always Open',
    badge: 'Direct Cash',
    icon_name: 'Coins'
  },
  {
    id: 'pm-kusum',
    title: 'PM-KUSUM Solar Pump Scheme',
    title_mr: 'पीएम-कुसुम सौर कृषी पंप योजना (महाकृषीऊर्जा)',
    category: 'Irrigation & Solar',
    government_level: 'Maharashtra State Govt',
    summary: 'Provides up to 90% government subsidy to farmers for installing off-grid solar water pumps (3 HP, 5 HP, 7.5 HP) for reliable daytime irrigation.',
    benefits: '90% total subsidy (60% Central + 30% State Govt). Farmer pays only 10% of total solar pump cost.',
    subsidy_amount: '90% Subsidy',
    max_subsidy: 'Up to ₹2.5 Lakh per pump',
    land_holding_eligibility: ['Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['All Crops', 'Horticulture', 'Vegetables', 'Sugarcane', 'Cotton'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      '7/12 Extract showing source of water (Well/Borewell)',
      'No Electricity Connection Certificate from MSEDCL (महावितरण)',
      'Aadhaar Card & Caste Certificate (if applicable)',
      'Bank Account Details'
    ],
    application_steps: [
      'Login to MahaUrja (MEDA) / PM-KUSUM portal or MahaDBT Farmer Portal.',
      'Select Solar Agriculture Pump (३/५/७.५  एच.पी. सौर पंप).',
      'Upload 7/12 land record showing water availability.',
      'Pay 10% farmer share online upon allocation.',
      'MahaUrja vendor inspects farm site and installs solar panels & submersible pump.'
    ],
    official_portal_url: 'https://mahadbt.maharashtra.gov.in',
    helpline_number: '1800-233-3435',
    status: 'Active / Open',
    badge: '90% Solar Subsidy',
    icon_name: 'Sun'
  },
  {
    id: 'pmfby',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    title_mr: 'प्रधानमंत्री पीक विमा योजना (१ रुपयात पीक विमा)',
    category: 'Crop Insurance',
    government_level: 'Central Government',
    summary: 'Comprehensive crop insurance covering risk from pre-sowing to post-harvest damage due to unseasonal rains, drought, hail, floods, and pest attack for just ₹1 premium in Maharashtra.',
    benefits: 'Full financial payout for yield loss and localized calamity. Maharashtra farmers pay nominal ₹1 token fee.',
    subsidy_amount: '₹1 Premium Insurance',
    max_subsidy: 'Sum Insured up to ₹50,000/ha',
    land_holding_eligibility: ['All Farmers', 'Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['Soybean', 'Cotton', 'Onion', 'Paddy', 'Pomegranate', 'Grapes', 'Sugarcane'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      '7/12 Extract & 8-A Land Record',
      'Sowing Certificate (पिक पाहणी नोंद / ई-पिक पाहणी)',
      'Aadhaar Card',
      'Bank Passbook Copy'
    ],
    application_steps: [
      'Enroll online via PMFBY portal or MahaDBT / Bank Branch / CSC.',
      'Select Kharif or Rabi crop season and fill crop area details.',
      'Pay ₹1 token premium per application.',
      'In case of heavy rainfall/drought, report crop loss on PMFBY app within 72 hours.'
    ],
    official_portal_url: 'https://pmfby.gov.in',
    helpline_number: '14447 / 1800-200-5142',
    status: 'Seasonal',
    badge: '₹1 Token Fee',
    icon_name: 'ShieldCheck'
  },
  {
    id: 'pocra',
    title: 'Nanaji Deshmukh Krishi Sanjeevani Prakalp (PoCRA)',
    title_mr: 'नानाजी देशमुख कृषी संजीवनी प्रकल्प (पोकरा)',
    category: 'Equipment & Machinery',
    government_level: 'Maharashtra State Govt',
    summary: 'State scheme targeting climate-resilient farming in 5,142 villages of Marathwada & Vidarbha with up to 75% DBT grant for farm ponds, shade nets, micro-irrigation, and mechanization.',
    benefits: '50% to 75% Direct Benefit Transfer (DBT) into farmer bank account for climate adaptation assets.',
    subsidy_amount: '50% - 75% DBT Grant',
    max_subsidy: 'Up to ₹1.5 Lakh per activity',
    land_holding_eligibility: ['Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)'],
    crop_eligibility: ['Cotton', 'Soybean', 'Pigeon Pea (Tur)', 'Gram', 'Horticulture'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      'PoCRA Village Domicile proof (पोकरा अंतर्गत समाविष्ट गाव)',
      '7/12 & 8-A Extract',
      'Aadhaar Card linked Bank Account',
      'Site Quotation & Geo-tagged Photo'
    ],
    application_steps: [
      'Register on DBT PoCRA portal (mahapocra.gov.in) or mobile app.',
      'Select activity: Farm Pond (शेततळे), Drip Irrigation, Shade Net, or Sprinkler.',
      'Submit application for Gram Panchayat committee approval.',
      'Execute work, upload geo-tagged photo, and receive direct DBT transfer.'
    ],
    official_portal_url: 'https://mahapocra.gov.in',
    helpline_number: '1800-120-8040',
    status: 'Active / Open',
    badge: '75% Climate Subsidy',
    icon_name: 'Sprout'
  },
  {
    id: 'mjpksky',
    title: 'Mahatma Jyotirao Phule Shetkari Karjmukti Yojna',
    title_mr: 'महात्मा महात्मा ज्योतिराव फुले शेतकरी कर्जमुक्ती योजना',
    category: 'Loans & Credit',
    government_level: 'Maharashtra State Govt',
    summary: 'Crop loan waiver scheme offering up to ₹2 Lakh debt relief for distressed farmers and ₹50,000 incentive bonus for farmers who regularly repay crop loans on time.',
    benefits: 'Complete waiver of outstanding short-term crop loans up to ₹2 Lakh + ₹50,000 incentive for prompt payers.',
    subsidy_amount: 'Up to ₹2.0 Lakh Waiver',
    max_subsidy: '₹2,00,000 debt relief',
    land_holding_eligibility: ['All Farmers', 'Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)'],
    crop_eligibility: ['All Crops'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      'Aadhaar Card',
      'Cooperative / Gramin Bank Crop Loan Account Number',
      '7/12 Land Record'
    ],
    application_steps: [
      'Visit local Bank Branch or Aaple Sarkar Seva Kendra (CSC).',
      'Verify Aadhaar authentication against bank loan list.',
      'Confirm loan account details on portal.',
      'Loan waiver amount is directly credited to loan account.'
    ],
    official_portal_url: 'https://mjpsky.maharashtra.gov.in',
    helpline_number: '1800-102-5311',
    status: 'Active / Open',
    badge: '₹2 Lakh Loan Waiver',
    icon_name: 'Landmark'
  },
  {
    id: 'smam',
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    title_mr: 'कृषी यांत्रिकीकरण उपअभियान (ट्रॅक्टर व अवजारे अनुदान)',
    category: 'Equipment & Machinery',
    government_level: 'Central Government',
    summary: 'Subsidies of 40% to 80% for purchasing farm machinery, tractors, rotavators, power tillers, seed drills, and setting up Custom Hiring Centers (CHC).',
    benefits: '40% - 50% subsidy for individual farmers, up to 80% for Custom Hiring Centers (CHC) run by FPOs / Groups.',
    subsidy_amount: '40% - 80% Subsidy',
    max_subsidy: 'Up to ₹4.0 Lakh for tractors / equipment',
    land_holding_eligibility: ['Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['All Crops', 'Sugarcane', 'Cotton', 'Grains', 'Vegetables'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      '7/12 & 8-A Extract',
      'Authorized Machinery Dealer Quotation',
      'Aadhaar Card & Caste Certificate (SC/ST get extra 10% bonus)',
      'Bank Passbook'
    ],
    application_steps: [
      'Log into MahaDBT Farmer Portal (mahadbt.maharashtra.gov.in).',
      'Navigate to "Agriculture" → "Agricultural Mechanization" (कृषी यांत्रिकीकरण).',
      'Choose equipment (Tractor, Rotavator, Power Tiller, Harvester attachment).',
      'Submit dealer quotation & land record.',
      'Upon lottery selection, purchase equipment and receive subsidy in bank.'
    ],
    official_portal_url: 'https://agrimachinery.nic.in',
    helpline_number: '1800-180-1551',
    status: 'Active / Open',
    badge: '80% Farm Machinery',
    icon_name: 'Tractor'
  },
  {
    id: 'pmksy-drip',
    title: 'PMKSY - Micro Irrigation Scheme (Drip & Sprinkler)',
    title_mr: 'प्रधानमंत्री कृषी सिंचन योजना (ठिबक व तुषार सिंचन अनुदान)',
    category: 'Irrigation & Solar',
    government_level: 'Central Government',
    summary: 'Offers 55% subsidy to small & marginal farmers (and 45% to other farmers) + 25% extra Maharashtra state top-up subsidy, providing up to 80% total drip & sprinkler cost relief.',
    benefits: 'Up to 80% total combined subsidy for installing Drip (ठिबक) & Sprinkler (तुषार) micro-irrigation systems.',
    subsidy_amount: '55% - 80% Subsidy',
    max_subsidy: 'Up to ₹60,000 per hectare',
    land_holding_eligibility: ['Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['Sugarcane', 'Onion', 'Cotton', 'Pomegranate', 'Grapes', 'Vegetables', 'Banana'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      '7/12 Extract with Water Source Entry',
      'Micro Irrigation System Dealer Quotation & Map Plan',
      'Aadhaar Card & Bank Passbook',
      'Electricity Bill / Pump Registration'
    ],
    application_steps: [
      'Apply online on MahaDBT Portal under "Micro Irrigation".',
      'Select certified Drip/Sprinkler manufacturer & dealer.',
      'Upload farm plot map & water source proof.',
      'Receive pre-sanction letter (पूर्व संमती पत्र), install system, and get field verification for DBT credit.'
    ],
    official_portal_url: 'https://pmksy.gov.in',
    helpline_number: '1800-233-4000',
    status: 'Active / Open',
    badge: '80% Drip Subsidy',
    icon_name: 'Droplets'
  },
  {
    id: 'kcc',
    title: 'Kisan Credit Card (KCC) & Interest Subvention',
    title_mr: 'किसान क्रेडिट कार्ड (केसीसी) व व्याज सवलत योजना',
    category: 'Loans & Credit',
    government_level: 'Central Government',
    summary: 'Collateral-free short-term crop loans up to ₹1.6 Lakh (and up to ₹3 Lakh at effectively 4% annual interest rate with prompt repayment incentive).',
    benefits: '3% Central Interest Subvention + 3% Maharashtra State Dr. Punjabrao Deshmukh Interest Subvention (0% effective interest up to ₹3 Lakh).',
    subsidy_amount: '0% - 4% Interest Rate',
    max_subsidy: 'Up to ₹3,00,000 credit limit',
    land_holding_eligibility: ['All Farmers', 'Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['All Crops', 'Livestock', 'Fisheries', 'Sugarcane', 'Cotton'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      '7/12 Extract & 8-A Land Record',
      'Aadhaar Card & PAN Card',
      'No Dues Certificate from neighbouring banks',
      '2 Passport size photographs'
    ],
    application_steps: [
      'Obtain KCC Application Form from Commercial Bank / District Central Coop Bank (DCCB).',
      'Attach 7/12 land record & cropping details.',
      'Bank evaluates loan limit based on crop scale of finance.',
      'Card issued with RuPay debit card facility for instant ATM withdrawal.'
    ],
    official_portal_url: 'https://pmkisan.gov.in/KCC.aspx',
    helpline_number: '1800-11-0001',
    status: 'Always Open',
    badge: '0% Interest Credit',
    icon_name: 'CreditCard'
  },
  {
    id: 'soil-health-card',
    title: 'Soil Health Card Scheme',
    title_mr: 'मृदा आरोग्य पत्रक योजना (माती परीक्षण)',
    category: 'Soil & Fertilizer',
    government_level: 'Central Government',
    summary: 'Free soil sample collection and laboratory testing for 12 essential soil parameters (N, P, K, pH, EC, Organic Carbon, Micronutrients) with customized crop fertilizer recommendations.',
    benefits: 'Free scientific soil analysis report every 2 years, saving up to 20% on unnecessary chemical fertilizer costs.',
    subsidy_amount: '100% Free Testing',
    max_subsidy: 'Free soil testing & advice',
    land_holding_eligibility: ['All Farmers', 'Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['All Crops', 'Cotton', 'Onion', 'Soybean', 'Wheat', 'Sugarcane'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      'Aadhaar Card',
      '7/12 Land Survey Number Details',
      'Mobile Number'
    ],
    application_steps: [
      'Contact local Krishi Sahayak (कृषी सहायक) or Taluka Soil Testing Lab.',
      'Agriculture officer collects soil samples from grid points on your farm plot.',
      'Sample analyzed in district lab.',
      'Receive Soil Health Card with exact N-P-K & micronutrient dosage guidance.'
    ],
    official_portal_url: 'https://soilhealth.dac.gov.in',
    helpline_number: '1800-180-1551',
    status: 'Always Open',
    badge: '100% Free Soil Test',
    icon_name: 'FlaskConical'
  },
  {
    id: 'pkvy',
    title: 'Paramparagat Krishi Vikas Yojana (PKVY Organic)',
    title_mr: 'परंपरागत कृषी विकास योजना (सेंद्रिय शेती प्रोत्साहन)',
    category: 'Organic Farming',
    government_level: 'Central Government',
    summary: 'Financial support of ₹50,000 per hectare over 3 years for organic farming cluster formation, organic input purchasing, PGS certification, and organic produce branding.',
    benefits: '₹31,000 direct credit per hectare for organic seeds, bio-fertilizers, neem oil & vermicompost + branding support.',
    subsidy_amount: '₹50,000 / hectare',
    max_subsidy: 'Up to ₹50,000 over 3 years',
    land_holding_eligibility: ['All Farmers', 'Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)'],
    crop_eligibility: ['Organic Vegetables', 'Pulses', 'Spices', 'Fruits', 'Cotton'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      '7/12 Extract',
      'Organic Cluster Group Agreement (20+ farmers cluster)',
      'Aadhaar Card & Bank Account Details'
    ],
    application_steps: [
      'Form a cluster of 20 or more farmers (total 20 hectares area).',
      'Submit cluster proposal to District Agriculture Officer (DAO).',
      'Register group on Participatory Guarantee System (PGS-India) portal.',
      'Receive annual financial installments for organic inputs & certification.'
    ],
    official_portal_url: 'https://pgsindia-ncof.gov.in',
    helpline_number: '011-23382012',
    status: 'Active / Open',
    badge: '₹50,000 Organic Fund',
    icon_name: 'Leaf'
  },
  {
    id: 'aif',
    title: 'Agriculture Infrastructure Fund (AIF)',
    title_mr: 'कृषी पायाभूत सुविधा निधी (कोल्ड स्टोरेज व प्रक्रिया उद्योग)',
    category: 'Equipment & Machinery',
    government_level: 'Central Government',
    summary: 'Provides 3% annual interest subvention for credit facilities up to ₹2 Crore for building post-harvest infrastructure like cold storages, pack-houses, sorting/grading units, and solar dryers.',
    benefits: '3% interest subvention for 7 years + credit guarantee coverage under CGTMSE for loans up to ₹2 Crore.',
    subsidy_amount: '3% Interest Subvention',
    max_subsidy: 'Loans up to ₹2 Crore',
    land_holding_eligibility: ['All Farmers', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['Onion', 'Pomegranate', 'Grapes', 'Vegetables', 'Grains'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      'Detailed Project Report (DPR) of infrastructure unit',
      '7/12 Extract / Land Lease Agreement',
      'GST & FSSAI Registration (if applicable)',
      'PAN & Bank Statements'
    ],
    application_steps: [
      'Register on AgriInfra portal (agriinfra.dac.gov.in).',
      'Submit Project DPR for Cold Storage / Processing Unit.',
      'Ministry approves project & forwards to designated Bank.',
      'Bank disburses loan with automated 3% interest discount.'
    ],
    official_portal_url: 'https://agriinfra.dac.gov.in',
    helpline_number: '011-23381002',
    status: 'Active / Open',
    badge: '₹2 Cr Infrastructure Loan',
    icon_name: 'Building'
  },
  {
    id: 'nlm-goat-dairy',
    title: 'National Livestock Mission (Goat & Dairy Farming)',
    title_mr: 'राष्ट्रीय पशुधन अभियान (शेळीपालन, कुक्कुटपालन व दुग्ध व्यवसाय)',
    category: 'Livestock & Dairy',
    government_level: 'Central Government',
    summary: '50% capital subsidy (up to ₹50 Lakh) for setting up goat/sheep breeding farms, poultry hatcheries, piggery units, and fodder silage infrastructure.',
    benefits: '50% direct capital subsidy credited into bank loan account for commercial livestock ventures.',
    subsidy_amount: '50% Capital Subsidy',
    max_subsidy: 'Up to ₹50 Lakh (Goat: ₹10L - ₹50L)',
    land_holding_eligibility: ['All Farmers', 'Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['Livestock', 'Dairy', 'Goat Farming', 'Poultry'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      'Land Ownership / 10-Year Lease Document for shed',
      'Livestock Training Certificate from Animal Husbandry Dept',
      'Bank Sanction Letter / DPR',
      'Aadhaar & PAN Card'
    ],
    application_steps: [
      'Log into NLM Portal (nlm.udyamimitra.in).',
      'Select project type: Goat Breeding (100+10 / 200+20 / 500+50) or Poultry.',
      'Upload DPR and bank loan approval letter.',
      'State Level Executive Committee inspects site and grants 50% capital subsidy.'
    ],
    official_portal_url: 'https://nlm.udyamimitra.in',
    helpline_number: '1800-180-1551',
    status: 'Active / Open',
    badge: '50% Livestock Subsidy',
    icon_name: 'Beef'
  },
  {
    id: 'mukhyamantri-saur-feeder',
    title: 'Mukhyamantri Saur Krishi Vahini Yojna 2.0',
    title_mr: 'मुख्यमंत्री सौर कृषी वाहिनी योजना २.० (दिवसा ८ तास वीज)',
    category: 'Irrigation & Solar',
    government_level: 'Maharashtra State Govt',
    summary: 'State initiative to convert 30% of agricultural feeders to solar energy by 2025, ensuring 8 hours of uninterrupted, high-voltage daytime electricity for agricultural pumps.',
    benefits: 'Guaranteed 8-hour daytime electricity supply (सकाळी ८ ते संध्याकाळी ६) for agricultural pumps + lease income of ₹1.25 Lakh/acre for land leased for solar plants.',
    subsidy_amount: 'Daytime 8-Hour Power',
    max_subsidy: '₹1.25 Lakh/acre/yr land rent',
    land_holding_eligibility: ['All Farmers', 'Small & Marginal (< 2 Ha)', 'Medium (2-5 Ha)', 'Large (> 5 Ha)'],
    crop_eligibility: ['All Crops', 'Sugarcane', 'Cotton', 'Onion', 'Grapes'],
    category_eligibility: ['General', 'OBC', 'SC', 'ST', 'Women Farmer'],
    required_documents: [
      '7/12 Land Record',
      'MSEDCL Agriculture Consumer Connection Number',
      'Aadhaar Card'
    ],
    application_steps: [
      'Farmers automatically benefit in feeders converted to Solar Feeders.',
      'To lease uncultivable land for solar project: Apply on MSEDCL Solar Land Portal.',
      'MSEDCL inspects sub-station proximity (within 5 km).',
      'Sign 25-year lease agreement for annual land rent income.'
    ],
    official_portal_url: 'https://www.mahadiscom.in/solar-mskvy',
    helpline_number: '1912 / 1800-233-3435',
    status: 'Active / Open',
    badge: '8-Hr Daytime Power',
    icon_name: 'Zap'
  }
];

export const getSchemeCategories = (): string[] => [
  'All',
  'Direct Cash Support',
  'Crop Insurance',
  'Irrigation & Solar',
  'Equipment & Machinery',
  'Organic Farming',
  'Loans & Credit',
  'Soil & Fertilizer',
  'Livestock & Dairy'
];

export const filterSchemes = (
  schemes: GovernmentScheme[],
  query: string,
  category: string,
  level: string,
  landSize: string
): GovernmentScheme[] => {
  return schemes.filter((scheme) => {
    // Search query match (English or Marathi)
    const matchesQuery =
      !query ||
      scheme.title.toLowerCase().includes(query.toLowerCase()) ||
      scheme.title_mr.includes(query) ||
      scheme.summary.toLowerCase().includes(query.toLowerCase()) ||
      scheme.benefits.toLowerCase().includes(query.toLowerCase());

    // Category match
    const matchesCategory = category === 'All' || scheme.category === category;

    // Govt Level match
    const matchesLevel = level === 'All' || scheme.government_level === level;

    // Land Size eligibility match
    const matchesLandSize =
      landSize === 'All' ||
      scheme.land_holding_eligibility.includes('All Farmers') ||
      scheme.land_holding_eligibility.includes(landSize as any);

    return matchesQuery && matchesCategory && matchesLevel && matchesLandSize;
  });
};
