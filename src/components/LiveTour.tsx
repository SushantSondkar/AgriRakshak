import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, X, Volume2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/types';
import './LiveTour.css';

interface TourStepLocale {
  title: string;
  description: string;
  voiceText: string;
}

interface TourStepItem {
  selector: string;
  en: TourStepLocale;
  mr: TourStepLocale;
  hi: TourStepLocale;
}

const TOUR_STEPS: TourStepItem[] = [
  // --- PART 1: CORE DASHBOARD DECISION ENGINES ---
  {
    selector: '.dash-hero-banner',
    en: {
      title: 'Personalized Farm Telemetry',
      description: 'Welcome to AgriRakshak! You are viewing real-time farm telemetry calibrated for Sushant Sondkar in Kopargaon, Ahmednagar. Every recommendation is mathematically tailored to exact landholding (4.5 Acres), soil classification (Black Cotton Soil), and active crop stage (Soybean & Onion) rather than generic regional averages.',
      voiceText: 'Welcome to AgriRakshak. Real-time farm telemetry calibrated for Sushant Sondkar in Kopargaon, Ahmednagar.'
    },
    mr: {
      title: 'वैयक्तिक शेत माहिती व टेलिमेट्री',
      description: 'ॲग्रीरक्षक मध्ये आपले स्वागत आहे! येथे आपण कोपरगाव, अहिल्यानगर मधील सुशांत सोंडकर यांच्या ४.५ एकर शेतीची थेट माहिती पाहत आहात. काळी कसदार जमीन आणि सोयाबीन-कांदा पिकांनुसार प्रत्येक सल्ला अचूकपणे दिला जातो.',
      voiceText: 'ॲग्रीरक्षक मध्ये आपले स्वागत आहे. कोपरगाव मधील सुशांत सोंडकर यांच्या शेतीचा थेट सल्ला येथे उपलब्ध आहे.'
    },
    hi: {
      title: 'व्यक्तिगत कृषि टेलीमेट्री और डेटा',
      description: 'एग्रीरक्षक में आपका स्वागत है! यहाँ आप कोपरगांव, अहिल्यानगर (महाराष्ट्र) के सुशांत सोंडकर के ४.५ एकड़ खेत का लाइव डेटा देख रहे हैं। काली मिट्टी और सोयाबीन-प्याज की फसल के अनुसार सभी वैज्ञानिक सिफारिशें तैयार की गई हैं।',
      voiceText: 'एग्रीरक्षक में आपका स्वागत है। कोपरगांव के सुशांत सोंडकर के खेत की लाइव जानकारी यहाँ उपलब्ध है।'
    }
  },
  {
    selector: '.decision-header-row',
    en: {
      title: 'Scientific FAO-56 Irrigation Dispatch',
      description: 'The central intelligence core of AgriRakshak! This dynamic decision pill ("Hold Irrigation / पाणी देणे टाळा") computes daily crop water requirements using the international FAO-56 Penman-Monteith method. It actively prevents farmers from wasting groundwater and burning pump electricity when natural rainfall is imminent.',
      voiceText: 'Hold irrigation today. 18.4 mm rainfall is expected in the next 36 hours. Conserve groundwater.'
    },
    mr: {
      title: 'वैज्ञानिक FAO-56 सिंचन शिफारस',
      description: 'ॲग्रीरक्षकचा प्रमुख बुद्धिमत्ता विभाग! आंतरराष्ट्रीय FAO-56 पेनमन-माँटिथ पद्धतीनुसार पिकांची दैनंदिन पाण्याची गरज मोजून "पाणी देणे टाळा" असा थेट सल्ला मिळतो. पुढील ३६ तासांत पाऊस अपेक्षित असल्याने विहिरीचे पाणी व विजेची बचत होते.',
      voiceText: 'आज पिकांना पाणी देणे टाळा. पुढील ३६ तासांत १८ मिमी पावसाची शक्यता आहे. भूजल आणि विजेची बचत करा.'
    },
    hi: {
      title: 'वैज्ञानिक FAO-56 सिंचाई अनुशंसा',
      description: 'एग्रीरक्षक का प्रमुख बुद्धिमत्ता केंद्र! अंतरराष्ट्रीय FAO-56 पद्धति के आधार पर दैनिक फसल जल आवश्यकता की गणना करके "सिंचाई रोकें" की सीधी सलाह दी जाती है। बारिश आने से भूजल और बिजली दोनों की बचत होती है।',
      voiceText: 'आज सिंचाई रोकें। अगले ३६ घंटों में १८ मिमी बारिश की संभावना है। भूजल और बिजली बचाएं।'
    }
  },
  {
    selector: '.decision-explanation-strip',
    en: {
      title: 'Explainable AI (XAI) Logic Strip',
      description: 'Zero black-box ambiguity. This explainable reasoning banner translates complex hydrological equations into plain, actionable advice in Marathi, Hindi, and English. Farmers learn exactly why the recommendation was made and can click to modify their farm parameters at any time.',
      voiceText: 'Understand the clear reason behind every irrigation advice in simple language.'
    },
    mr: {
      title: 'स्पष्टीकरणात्मक AI (XAI) कारणमीमांसा',
      description: 'कोणतीही गुप्तता नाही! हा सल्ला का देण्यात आला याचे वैज्ञानिक कारण सोप्या भाषेत येथे स्पष्ट केले जाते. शेतकरी स्वतःच्या शेतातील बदल नोंदवून निर्णय पुन्हा तपासू शकतात.',
      voiceText: 'प्रत्येक सल्ल्यामागील नेमके वैज्ञानिक कारण सोप्या भाषेत समजून घ्या.'
    },
    hi: {
      title: 'व्याख्यात्मक AI (XAI) तर्क पट्टी',
      description: 'कोई छुपाव नहीं! यह सलाह क्यों दी गई है, इसका सटीक वैज्ञानिक कारण सरल भाषा में यहाँ समझाया गया है। किसान किसी भी समय अपने खेत के मापदंड बदल सकते हैं।',
      voiceText: 'हर कृषि सलाह के पीछे का सटीक कारण सरल भाषा में समझें।'
    }
  },
  {
    selector: '.decision-telemetry-grid',
    en: {
      title: 'Multi-Source Telemetry Ingestion',
      description: 'Four continuous live data feeds power the decision model: 48-Hour IMD Doppler Precipitation (18.4 mm), CGWB Live Aquifer Level (66,186 L/ha), GSDA 5-Year Water Deficit (-8.1%), and Sentinel-2 Multispectral NDVI Vegetation Health (0.61).',
      voiceText: 'Four live satellite and sensor feeds continuously monitor soil, rainfall, and crop vigor.'
    },
    mr: {
      title: 'थेट उपग्रह व भूजल माहिती (डेटा फीड्स)',
      description: 'चार प्रमुख थेट स्त्रोतांवर आधारित निर्णय: आयएमडी डॉपलर पाऊस (१८.४ मिमी), केंद्रीय भूजल मंडळ (CGWB) जलपातळी, ५ वर्षांचा भूजल तुटवडा (-८.१%), आणि सेंटिनेल उपग्रहाचा पीक आरोग्य निर्देशांक (NDVI ०.६१).',
      voiceText: 'चार उपग्रह आणि भूजल स्रोतांद्वारे शेतातील ओलावा व पीक आरोग्याचे सतत निरीक्षण केले जाते.'
    },
    hi: {
      title: 'बहु-स्रोत उपग्रह व भूजल डेटा फीड',
      description: 'चार प्रमुख लाइव स्रोतों पर आधारित निर्णय: आईएमडी डॉप्लर रडार वर्षा (१८.४ मिमी), केंद्रीय भूजल बोर्ड (CGWB) स्तर, ५ वर्षीय भूजल घाटा (-८.१%), और सेंटिनेल-२ सैटेलाइट एनडीवीआई फसल स्वास्थ्य (०.६१)।',
      voiceText: 'चार उपग्रह और भूजल स्रोतों से खेत की नमी और फसल स्वास्थ्य की लगातार निगरानी की जाती है।'
    }
  },
  {
    selector: '.rainfall-chart-container',
    en: {
      title: '1km² Micro-Radar Precipitation Forecast',
      description: 'Fuses high-frequency IMD Doppler radar with satellite atmospheric feeds to generate 1km² hyper-local rain probabilities. Instead of district-wide forecasts, farmers get day-by-day probability bars (72% on Friday) allowing precision planning of fertilizer spraying and harvesting.',
      voiceText: '1 square kilometer high-resolution rainfall probability forecast for precision farm operations.'
    },
    mr: {
      title: '१ चौ.किमी मायक्रो-रडार पर्जन्य अंदाज',
      description: 'संपूर्ण जिल्ह्याऐवजी थेट तुमच्या परिसराचा १ चौ.किमी अचूक पावसाचा अंदाज! यामुळे खतांची फवारणी, औषध नियोजन आणि काढणीचे अचूक वेळापत्रक आखता येते.',
      voiceText: 'तुमच्या शेताच्या परिसरातील १ चौरस किलोमीटरचा अचूक पावसाचा अंदाज येथे मिळतो.'
    },
    hi: {
      title: '१ वर्ग किमी माइक्रो-रडार वर्षा पूर्वानुमान',
      description: 'पूरे जिले की जगह सीधे आपके खेत के १ वर्ग किमी क्षेत्र का सटीक बारिश पूर्वानुमान! इससे खाद छिड़काव, कीटनाशक और फसल कटाई की योजना आसानी से बनती है।',
      voiceText: 'आपके खेत के आसपास के १ वर्ग किमी क्षेत्र का सटीक बारिश पूर्वानुमान यहाँ देखें।'
    }
  },
  {
    selector: '.groundwater-comparison-box',
    en: {
      title: 'CGWB Aquifer Depletion Benchmark',
      description: 'Pulls official Central Ground Water Board and GSDA 5-year water table baselines to model sustainable aquifer extraction. Identifies Kopargaon\'s acute -8.1% deficit and guides pulse micro-drip usage to prevent catastrophic borewell silt choking and motor burnouts.',
      voiceText: 'Official Central Ground Water Board benchmarks protect your borewell and aquifer health.'
    },
    mr: {
      title: 'CGWB भूजल पातळी व तुटवडा निर्देशांक',
      description: 'केंद्रीय भूजल मंडळ आणि GSDA च्या ५ वर्षांच्या माहितीनुसार कोपरगावमधील -८.१% भूजल तुटवडा दर्शवतो. ठिबक सिंचनाचा कार्यक्षम वापर करून बोअरवेलचे नुकसान टाळण्यास मदत करतो.',
      voiceText: 'केंद्रीय भूजल मंडळाच्या आकडेवारीनुसार विहीर व बोअरवेलचे पाणी टिकवण्यासाठी मार्गदर्शन.'
    },
    hi: {
      title: 'CGWB भूजल स्तर व घाटा सूचकांक',
      description: 'केंद्रीय भूजल बोर्ड और GSDA के ५ साल के डेटा के अनुसार कोपरगांव के भूजल स्तर की जानकारी। ड्रिप सिंचाई का कुशल उपयोग करके बोरवेल मोटर जलने से बचाने में मदद मिलती है।',
      voiceText: 'भूजल स्तर की सटीक जानकारी से बोरवेल का पानी और मोटर दोनों सुरक्षित रहते हैं।'
    }
  },
  {
    selector: '.dash-quick-links-strip',
    en: {
      title: 'Core Decision Subsystem Portals',
      description: 'One-click gateways to AgriRakshak\'s specialized modules: My Farm land parcel manager, Taluka Water Risk Map, 14-Species AI Crop Doctor leaf scanner, and the District Extension Officer triage desk.',
      voiceText: 'Quick shortcuts to all key tools: My Farm, Risk Map, AI Crop Doctor, and Officer Portal.'
    },
    mr: {
      title: 'महत्त्वाचे उपप्रणाली पोर्टल्स',
      description: 'ॲग्रीरक्षकच्या प्रमुख वैशिष्ट्यांसाठी झटपट मार्ग: माझे शेत, तालुका जल जोखीम नकाशा, १४ पिकांचा एआय पीक डॉक्टर, आणि तालुका कृषी अधिकारी संपर्क कक्ष.',
      voiceText: 'माझे शेत, जोखीम नकाशा, पीक डॉक्टर आणि कृषी अधिकारी केंद्रासाठी झटपट पर्याय.'
    },
    hi: {
      title: 'प्रमुख निर्णय उपप्रणाली पोर्टल्स',
      description: 'एग्रीरक्षक के मुख्य उपकरणों तक त्वरित पहुंच: मेरा खेत, तालुका जल जोखिम मैप, १४ फसलों का एआई फसल डॉक्टर, और कृषि अधिकारी सहायता कक्ष।',
      voiceText: 'मेरा खेत, जोखिम मैप, फसल डॉक्टर और कृषि अधिकारी सहायता के लिए सीधा रास्ता।'
    }
  },
  {
    selector: '.dash-stats-grid',
    en: {
      title: 'Farm Operational & Economic Vitals',
      description: 'Comprehensive summary telemetry tracking total cultivated area (4.5 Acres), active crops with sowing dates, critical weather warnings, 13 matched central & state subsidies, and real-time APMC mandi market commodity movements.',
      voiceText: 'Key vitals: land acreage, crop growth stages, govt subsidies, and live market prices.'
    },
    mr: {
      title: 'शेतीची स्थिती व आर्थिक निर्देशक',
      description: 'शेताचा एकूण विस्तार (४.५ एकर), चालू पिके, पेरणीच्या तारखा, महत्त्वाचे हवामान इशारे, १३ शासकीय योजना, आणि थेट बाजारभाव एकाच दृष्टिक्षेपात.',
      voiceText: 'शेतीचे क्षेत्रफळ, पिकांची स्थिती, शासकीय योजना आणि आजचे बाजारभाव एकाच ठिकाणी.'
    },
    hi: {
      title: 'कृषि स्थिति और आर्थिक आंकड़े',
      description: 'कुल कृषि क्षेत्र (४.५ एकड़), चालू फसलें, बुवाई की तिथियां, मौसम अलर्ट, १३ सरकारी योजनाएं और मंडी के ताज़ा भाव एक ही जगह।',
      voiceText: 'कुल रकबा, फसल की स्थिति, सरकारी सब्सिडी और मंडी भाव का त्वरित विवरण।'
    }
  },
  {
    selector: '.dash-weather-card',
    en: {
      title: 'Hyper-Local Microclimate Sensors',
      description: 'Live surface observations capturing peak daytime temperature (29°C), precipitation totals, ambient relative humidity (65%), and wind velocity (12 km/h) to determine pesticide spray drift risk and thermal plant stress.',
      voiceText: 'Live weather metrics: temperature, humidity, and wind speed for optimal spraying conditions.'
    },
    mr: {
      title: 'स्थानिक सूक्ष्म-हवामान सेन्सर्स',
      description: 'तापमान (२९°से), पाऊस, आर्द्रता (६५%), आणि वाऱ्याचा वेग (१२ किमी/तास) यांचे थेट निरीक्षण. कीटकनाशक फवारणीसाठी वाऱ्याचा वेग व अनुकूल वेळ समजते.',
      voiceText: 'तापमान, आर्द्रता आणि वाऱ्याचा वेग तपासून फवारणीची योग्य वेळ ठरवा.'
    },
    hi: {
      title: 'स्थानीय सूक्ष्म-जलवायु सेंसर',
      description: 'वर्तमान तापमान (२९°से), बारिश, सापेक्ष आर्द्रता (६५%), और हवा की गति (१२ किमी/घंटा)। कीटनाशक छिड़काव के लिए हवा की दिशा और सही समय की जानकारी।',
      voiceText: 'तापमान, आर्द्रता और हवा की गति देखकर कीटनाशक छिड़काव का सही समय तय करें।'
    }
  },
  {
    selector: '.critical-card',
    en: {
      title: 'Early Warning Risk Detection Engine',
      description: 'Continuous background anomaly monitoring that flags critical threats including unseasonal hail, sudden aquifer drops, and localized pest vector outbreaks before economic crop damage occurs.',
      voiceText: 'Early warning alerts protect your crops against sudden storms, pests, and drought.'
    },
    mr: {
      title: 'पूर्वसूचना व संकट निवारण प्रणाली',
      description: 'अवकाळी पाऊस, गारपीट, भूजलातील अचानक घट, किंवा किडींचा प्रादुर्भाव यांसारख्या संकटांची आगाऊ सूचना देऊन पिकांचे आर्थिक नुकसान टाळले जाते.',
      voiceText: 'अवकाळी पाऊस, गारपीट किंवा किडींचा प्रादुर्भाव होण्यापूर्वीच तातडीचे इशारे मिळतात.'
    },
    hi: {
      title: 'पूर्व चेतावनी और जोखिम निवारण प्रणाली',
      description: 'बेमौसम बारिश, ओलावृष्टि, भूजल स्तर में अचानक गिरावट या कीट प्रकोप की समय से पहले चेतावनी, जिससे फसलों को नुकसान से बचाया जा सके।',
      voiceText: 'अचानक आंधी-तूफान, ओले और कीट प्रकोप से फसल बचाने के लिए अग्रिम चेतावनी।'
    }
  },
  {
    selector: '.floating-voice-btn',
    en: {
      title: 'Accessible Voice Advisory (मराठी • हिंदी)',
      description: 'Built specifically for rural accessibility. Tap the floating mic button to ask questions and receive instant spoken answers in Marathi, Hindi, or English using native browser Web Speech synthesis and recognition.',
      voiceText: 'Tap the microphone button anytime to ask questions about your crops or water in Marathi, Hindi, or English.'
    },
    mr: {
      title: 'बोलणारा कृषी सल्लागार (व्हॉइस असिस्टंट)',
      description: 'ग्रामीण भागातील शेतकऱ्यांसाठी विशेष सोय! मायक्रोफोनवर टॅप करून मराठी किंवा हिंदीत थेट प्रश्न विचारा आणि आवाजाद्वारे लगेच उत्तर ऐका.',
      voiceText: 'तुम्ही मला कोणत्याही वेळी शेती, पाणी किंवा पिकांविषयी प्रश्न विचारू शकता!'
    },
    hi: {
      title: 'बोलने वाला कृषि सलाहकार (वॉयस असिस्टेंट)',
      description: 'ग्रामीण किसानों के लिए विशेष सुविधा! माइक बटन दबाकर हिंदी या मराठी में सवाल पूछें और बोलकर तुरंत सलाह प्राप्त करें।',
      voiceText: 'आप माइक का बटन दबाकर किसी भी समय खेती या सिंचाई से संबंधित सवाल पूछ सकते हैं!'
    }
  },
  {
    selector: '.topbar-right',
    en: {
      title: 'Language Switcher & Notification Center',
      description: 'Switch between English, Marathi (मराठी), and Hindi (हिंदी) with instant full-application UI translation, inspect unread weather alerts, or access your farmer profile anytime from the persistent header.',
      voiceText: 'Change your language anytime or check notifications in the top bar.'
    },
    mr: {
      title: 'भाषा निवड आणि सूचना केंद्र',
      description: 'एका क्लिकवर इंग्रजी, मराठी किंवा हिंदी भाषा बदला. तसेच हवामान इशारे तपासा किंवा शेतकरी प्रोफाइल व्यवस्थापित करा.',
      voiceText: 'वरच्या पट्टीवरून तुम्ही कधीही भाषा बदलू शकता किंवा सूचना पाहू शकता.'
    },
    hi: {
      title: 'भाषा चयन और सूचना केंद्र',
      description: 'एक क्लिक में भाषा (अंग्रेजी, मराठी, हिंदी) बदलें, मौसम अलर्ट देखें या अपनी किसान प्रोफाइल जांचें।',
      voiceText: 'ऊपर की पट्टी से कभी भी भाषा बदलें या नए अलर्ट की सूचनाएं देखें।'
    }
  },

  // --- PART 2: NAVIGATION MENU FEATURES (SIDEBAR) ---
  {
    selector: '.nav-dashboard',
    en: {
      title: 'Dashboard Overview',
      description: 'Here you get today\'s latest telemetry, active irrigation prescriptions, and brief summaries of all major agro-hydrological data, live irrigation recommendations, and weather forecasts at a single glance.',
      voiceText: 'The dashboard gives you today\'s irrigation advice, weather outlook, and market trends at a glance.'
    },
    mr: {
      title: 'डॅशबोर्ड विहंगावलोकन',
      description: 'येथे तुम्हाला आजचा सिंचन सल्ला, ताज्या हवामान नोंदी, भूजल पातळी आणि सर्व प्रमुख कृषी-माहितीचा संक्षिप्त आढावा एकाच पानावर मिळतो.',
      voiceText: 'डॅशबोर्डवर तुम्हाला आजचा सिंचन सल्ला, हवामान अंदाज आणि बाजारभाव मिळतील.'
    },
    hi: {
      title: 'डैशबोर्ड विहंगावलोकन',
      description: 'यहाँ आपको आज की सिंचाई सलाह, मौसम रिपोर्ट, भूजल स्तर और सभी मुख्य कृषि आंकड़ों का संक्षिप्त विवरण एक ही पन्ने पर मिलता है।',
      voiceText: 'डैशबोर्ड पर आपको आज का सिंचाई परामर्श, मौसम पूर्वानुमान और ताज़ा मंडी भाव मिलेंगे।'
    }
  },
  {
    selector: '.nav-my-farm',
    en: {
      title: 'My Farm Field Management',
      description: 'Configure and monitor your registered land plots, acreage (4.5 Acres), soil types (Black Cotton Soil), irrigation infrastructure (Drip / Sprinkler), and sowing schedules.',
      voiceText: 'Manage your land parcels, crop acreage, soil type, and drip irrigation setups.'
    },
    mr: {
      title: 'माझे शेत व्यवस्थापन',
      description: 'तुमच्या शेताची नोंदणी, क्षेत्रफळ (४.५ एकर), मातीचा प्रकार (काळी कसदार जमीन), ठिबक किंवा तुषार सिंचन पद्धती आणि पेरणीच्या नोंदी अद्ययावत ठेवा.',
      voiceText: 'येथे तुमच्या शेताचे क्षेत्रफळ, पिके आणि ठिबक सिंचनाची माहिती नोंदवून ठेवा.'
    },
    hi: {
      title: 'मेरा खेत प्रबंधन',
      description: 'अपने खेत का कुल रकबा (४.५ एकड़), मिट्टी का प्रकार (काली मिट्टी), ड्रिप या फव्वारा सिंचाई प्रणाली और बुवाई की जानकारी दर्ज करें।',
      voiceText: 'यहाँ अपने खेत का क्षेत्रफल, फसलें और ड्रिप सिंचाई प्रणाली प्रबंधित करें।'
    }
  },
  {
    selector: '.nav-risk-map',
    en: {
      title: 'Taluka Water Risk Map',
      description: 'Explore interactive geospatial risk heatmaps analyzing drought severity, aquifer depletion, and microclimate water stress across Pune and Ahmednagar talukas.',
      voiceText: 'Interactive regional map showing drought severity and taluka water stress.'
    },
    mr: {
      title: 'तालुका जल जोखीम नकाशा',
      description: 'अहिल्यानगर आणि पुणे जिल्ह्यातील तालुकानिहाय दुष्काळ तीव्रता, भूजल उपसा आणि पाण्याच्या टंचाईचे थेट नकाशावर विश्लेषण पहा.',
      voiceText: 'तालुक्यातील पाणी टंचाई आणि दुष्काळाचा थेट नकाशा येथे पहा.'
    },
    hi: {
      title: 'तालुका जल जोखिम मानचित्र',
      description: 'अहिल्यानगर और पुणे के तालुकावार सूखे की तीव्रता, भूजल दोहन और जल संकट का इंटरैक्टिव मानचित्र देखें।',
      voiceText: 'अपने क्षेत्र में पानी की कमी और सूखे के स्तर का नक्शा यहाँ देखें।'
    }
  },
  {
    selector: '.nav-crop-doctor',
    en: {
      title: 'AI Crop Doctor Diagnostics',
      description: 'On-device neural computer vision pathology scanner. Upload or snap leaf photos to diagnose 14 crop diseases with under 120ms latency and verified chemical & organic remedies.',
      voiceText: 'AI Crop Doctor: snap a photo of diseased leaves for instant diagnosis and remedies.'
    },
    mr: {
      title: 'एआय पीक डॉक्टर तपासणी',
      description: 'पानांचा फोटो काढून अवघ्या काही सेकंदांत १४ प्रकारच्या पिकांवरील रोग व कीड ओळखा आणि त्यावर रासायनिक व सेंद्रिय औषधोपचार मिळवा.',
      voiceText: 'पिकांच्या पानांचा फोटो काढून रोगाचे अचूक निदान आणि फवारणीचे उपाय मिळवा.'
    },
    hi: {
      title: 'एआई फसल डॉक्टर जांच',
      description: 'पत्तियों की फोटो खींचकर कुछ ही पलों में १४ फसलों के रोगों की पहचान करें और तुरंत प्रमाणित जैविक व रासायनिक उपचार पाएं।',
      voiceText: 'पत्ती की तस्वीर खींचकर बीमारी की पहचान करें और सही उपचार जानें।'
    }
  },
  {
    selector: '.nav-officer-portal',
    en: {
      title: 'Extension Officer Support Desk',
      description: 'Direct triage channel connecting farmers to Agricultural Extension Officers for unresolved crop pathology disputes, compensation claims, and soil lab tests.',
      voiceText: 'Connect directly with your local Agricultural Extension Officer for expert verification.'
    },
    mr: {
      title: 'कृषी अधिकारी सहाय्यता कक्ष',
      description: 'शेतातील गुंतागुंतीच्या समस्या, नुकसान भरपाई किंवा माती परीक्षणासाठी थेट तालुका कृषी विस्तार अधिकाऱ्यांशी संपर्क साधा.',
      voiceText: 'पिकांचे नुकसान किंवा तज्ज्ञ सल्ल्यासाठी थेट कृषी अधिकाऱ्यांशी संपर्क साधा.'
    },
    hi: {
      title: 'कृषि अधिकारी सहायता केंद्र',
      description: 'गंभीर फसल रोगों, मुआवजा दावों या मिट्टी परीक्षण के लिए सीधे तालुका कृषि विस्तार अधिकारी से संपर्क स्थापित करें।',
      voiceText: 'किसी भी जटिल समस्या या मुआवजे के लिए सीधे कृषि अधिकारी से सलाह लें।'
    }
  },
  {
    selector: '.nav-schemes',
    en: {
      title: 'Government Scheme Matcher',
      description: 'Algorithmic matching engine connecting landholding size and water stress to eligible central & state subsidies (PM-KUSUM solar pumps, PMFBY insurance, and drip incentives).',
      voiceText: 'Find verified government subsidies and schemes matching your landholding and crop.'
    },
    mr: {
      title: 'शासकीय योजना शोधक',
      description: 'तुमच्या जमिनीनुसार पात्र ठरणाऱ्या केंद्र व राज्य शासनाच्या योजना (पीएम-कुसुम सौर पंप, पीक विमा, ठिबक अनुदान) थेट शोधा व अर्ज करा.',
      voiceText: 'सौर पंप, पीक विमा आणि ठिबक अनुदानाच्या शासकीय योजनांची माहिती येथे मिळवा.'
    },
    hi: {
      title: 'सरकारी योजना खोजक',
      description: 'आपकी जमीन और फसल के अनुसार केंद्र व राज्य सरकार की सब्सिडी योजनाएं (पीएम-कुसुम सोलर पंप, फसल बीमा, ड्रिप अनुदान) खोजें।',
      voiceText: 'सोलर पंप, फसल बीमा और सरकारी अनुदान योजनाओं की जानकारी यहाँ देखें।'
    }
  },
  {
    selector: '.nav-alerts',
    en: {
      title: 'Alerts & Weather Advisory',
      description: 'Real-time weather warning bulletins, severe storm alerts, spray timing recommendations, and personalized notifications for your farm.',
      voiceText: 'Receive timely alerts for storms, heavy rainfall, and pesticide spraying schedules.'
    },
    mr: {
      title: 'हवामान इशारे व कृषी सल्ला',
      description: 'वादळी पाऊस, गारपीट, अतिवृष्टीचे तातडीचे इशारे आणि कीटकनाशक फवारणीसाठी योग्य वेळेचे मार्गदर्शन येथे मिळते.',
      voiceText: 'अतिवृष्टी, गारपीट आणि फवारणीच्या वेळेचे तातडीचे इशारे येथे पहा.'
    },
    hi: {
      title: 'मौसम चेतावनी और कृषि सलाह',
      description: 'भारी बारिश, ओलावृष्टि, आंधी-तूफान के समय पर अलर्ट और कीटनाशक छिड़काव की सही सलाह प्राप्त करें।',
      voiceText: 'भारी बारिश, तूफान और मौसम के बदलाव की समय पर सूचना यहाँ पाएं।'
    }
  },
  {
    selector: '.nav-market',
    en: {
      title: 'APMC Mandi Wholesale Prices',
      description: 'Live APMC mandi commodity rates, price forecasts, wholesale market committee summaries, and optimal harvest sell timing.',
      voiceText: 'Check live APMC mandi wholesale rates and price trends to sell at the best time.'
    },
    mr: {
      title: 'कृषी उत्पन्न बाजार समिती (APMC) भाव',
      description: 'जवळच्या कृषी उत्पन्न बाजार समित्यांमधील सोयाबीन, कांदा व इतर शेतीमालाचे ताजे दर आणि भविष्यातील भावाचा कल जाणून घ्या.',
      voiceText: 'सोयाबीन, कांदा आणि इतर शेतीमालाचे आजचे ताजे बाजारभाव येथे तपासा.'
    },
    hi: {
      title: 'मंडी थोक भाव और रुझान',
      description: 'नजदीकी एपीएमसी मंडियों में सोयाबीन, प्याज और अन्य फसलों के ताज़ा भाव और बेचने का सबसे सही समय जानें।',
      voiceText: 'अपनी उपज का सर्वोत्तम मूल्य पाने के लिए ताज़ा मंडी भाव यहाँ देखें।'
    }
  },
  {
    selector: '.nav-community',
    en: {
      title: 'Farmer Community Forum',
      description: 'Peer-to-peer knowledge sharing network where farmers exchange pest outbreak observations, local field experiences, and expert agronomist advice.',
      voiceText: 'Community forum to discuss farming queries and exchange experiences with fellow farmers.'
    },
    mr: {
      title: 'शेतकरी संवाद मंच (कम्युनिटी)',
      description: 'इतर शेतकरी बांधवांशी चर्चा करा, शेतातील अनुभवांची देवाणघेवाण करा आणि कृषी तज्ञांचे थेट मार्गदर्शन मिळवा.',
      voiceText: 'इतर शेतकरी बांधव आणि कृषी तज्ञांशी चर्चा करण्यासाठी हा संवाद मंच वापरा.'
    },
    hi: {
      title: 'किसान संवाद मंच (कम्युनिटी)',
      description: 'अन्य साथी किसानों से जुड़ें, खेती के अनुभव साझा करें और कृषि वैज्ञानिकों से सीधे सवाल पूछें।',
      voiceText: 'साथी किसानों और विशेषज्ञों के साथ जानकारी साझा करने का खुला मंच।'
    }
  },
  {
    selector: '.nav-profile',
    en: {
      title: 'Farmer Profile & Identity',
      description: 'View and manage personal farmer identity (Sushant Sondkar), phone number (9552735397), registered district (Ahmednagar), and agricultural credentials.',
      voiceText: 'Manage your personal details, mobile number, and registered farming district.'
    },
    mr: {
      title: 'शेतकरी प्रोफाइल व ओळख',
      description: 'शेतकरी सुशांत सोंडकर यांची वैयक्तिक माहिती, मोबाईल क्रमांक (९५५२७३५३९७), जिल्हा अहिल्यानगर व शेती विषयक माहिती तपासा व बदला.',
      voiceText: 'तुमचे नाव, मोबाईल नंबर आणि नोंदणीकृत जिल्ह्याची माहिती येथे व्यवस्थापित करा.'
    },
    hi: {
      title: 'किसान प्रोफाइल और पहचान',
      description: 'किसान सुशांत सोंडकर का व्यक्तिगत विवरण, फोन नंबर (९५५२७३५३९७), पंजीकृत जिला अहिल्यानगर और कृषि विवरण देखें।',
      voiceText: 'अपना नाम, मोबाइल नंबर और कृषि क्षेत्र का विवरण यहाँ देखें व अपडेट करें।'
    }
  },
  {
    selector: '.nav-settings',
    en: {
      title: 'Platform Settings & Offline Mode',
      description: 'Adjust language preferences, accessibility display modes, and synchronize offline IndexedDB cache for seamless use in remote 2G areas.',
      voiceText: 'Configure language, offline mode, and platform preferences here.'
    },
    mr: {
      title: 'ॲप सेटिंग्ज आणि ऑफलाइन मोड',
      description: 'भाषा निवडा, ऑफलाइन डेटा कॅश सिंक करा आणि इंटरनेट नसतानाही दुर्गम भागात ॲप सहज वापरा.',
      voiceText: 'भाषा बदला आणि इंटरनेट नसतानाही वापरण्यासाठी ऑफलाइन डेटा सिंक करा.'
    },
    hi: {
      title: 'ऐप सेटिंग्स और ऑफलाइन मोड',
      description: 'अपनी पसंदीदा भाषा चुनें, ऑफलाइन डेटा सिंक करें और बिना इंटरनेट वाले क्षेत्रों में भी ऐप का आसानी से उपयोग करें।',
      voiceText: 'भाषा चयन और ऑफलाइन मोड की सेटिंग्स यहाँ प्रबंधित करें।'
    }
  }
];

const UI_TEXT = {
  en: {
    stage: (curr: number, total: number) => `STAGE ${curr} OF ${total}`,
    audioPlay: 'Play Voice Advisory',
    audioStop: 'Stop Voice Audio',
    leave: 'Leave guidance',
    back: '‹ Back',
    next: 'Next ›',
    finish: 'Finish Tour ›',
    completedBadge: (total: number) => `TOUR COMPLETED • ${total} OF ${total} STAGES`,
    completedTitle: 'Ready to Explore AgriRakshak!',
    completedSub: "You have completed the full guided tour of our Agricultural Decision-Intelligence platform. You're now equipped to manage irrigation, explore telemetry, and diagnose crop health.",
    continueApp: 'Continue to the App',
    restartTour: 'Restart Tour',
    recaps: [
      { icon: '⚡', title: 'FAO-56 Irrigation Engine', desc: 'Daily dynamic irrigation recommendations' },
      { icon: '💧', title: 'CGWB Aquifer Benchmarks', desc: '5-year groundwater depletion monitoring' },
      { icon: '🌦️', title: '1km² IMD Radar Rain', desc: 'Precision precipitation probabilities' },
      { icon: '🩺', title: 'Neural Crop Doctor', desc: '14-species offline leaf pathology scan' }
    ]
  },
  mr: {
    stage: (curr: number, total: number) => `टप्पा ${curr} / ${total}`,
    audioPlay: 'मराठी सल्ला ऐका (Play Marathi Audio)',
    audioStop: 'आवाज थांबवा (Stop Audio)',
    leave: 'मार्गदर्शक बंद करा',
    back: '‹ मागे',
    next: 'पुढे ›',
    finish: 'मार्गदर्शन पूर्ण करा ›',
    completedBadge: (total: number) => `मार्गदर्शन पूर्ण • ${total} पैकी ${total} टप्पे पूर्ण`,
    completedTitle: 'ॲग्रीरक्षक वापरण्यास सज्ज!',
    completedSub: 'तुम्ही कृषी निर्णय-प्रणालीचे संपूर्ण मार्गदर्शन यशस्वीरित्या पूर्ण केले आहे. आता तुम्ही शास्त्रीय सिंचन, थेट हवामान आणि पीक आरोग्याचे सहज व्यवस्थापन करू शकता.',
    continueApp: 'थेट अ‍ॅप सुरू करा',
    restartTour: 'पुन्हा मार्गदर्शक पहा',
    recaps: [
      { icon: '⚡', title: 'FAO-56 शास्त्रीय सिंचन शिफारस', desc: 'दैनंदिन पिकांच्या पाण्याच्या गरजेनुसार अचूक सिंचन' },
      { icon: '💧', title: 'CGWB भूजल तुटवडा निर्देशांक', desc: '५ वर्षांच्या नोंदीनुसार विहीर व बोअरवेलचे संरक्षण' },
      { icon: '🌦️', title: '१ चौ.किमी अचूक डॉपलर पाऊस', desc: 'फवारणी व काढणीच्या अचूक नियोजनासाठी अंदाज' },
      { icon: '🩺', title: 'एआय पीक डॉक्टर तपासणी', desc: '१४ पिकांवरील पानांच्या रोगांचे त्वरित निदान व उपाय' }
    ]
  },
  hi: {
    stage: (curr: number, total: number) => `चरण ${curr} / ${total}`,
    audioPlay: 'सलाह सुनें (Play Hindi Audio)',
    audioStop: 'आवाज रोकें (Stop Audio)',
    leave: 'टूर समाप्त करें',
    back: '‹ पीछे',
    next: 'आगे ›',
    finish: 'टूर पूरा करें ›',
    completedBadge: (total: number) => `टूर पूर्ण • ${total} में से ${total} चरण पूर्ण`,
    completedTitle: 'एग्रीरक्षक का उपयोग करने के लिए तैयार!',
    completedSub: 'आपने कृषि निर्णय-प्रणाली का संपूर्ण गाइडेड टूर सफलतापूर्वक पूरा कर लिया है। अब आप वैज्ञानिक सिंचाई, मौसम और फसल स्वास्थ्य का आसानी से प्रबंधन कर सकते हैं।',
    continueApp: 'ऐप का उपयोग शुरू करें',
    restartTour: 'टूर फिर से देखें',
    recaps: [
      { icon: '⚡', title: 'FAO-56 वैज्ञानिक सिंचाई प्रणाली', desc: 'दैनिक फसल जल आवश्यकता के अनुसार सटीक परामर्श' },
      { icon: '💧', title: 'CGWB भूजल स्तर सूचकांक', desc: '५ साल के आंकड़ों के आधार पर बोरवेल सुरक्षा' },
      { icon: '🌦️', title: '१ वर्ग किमी डॉप्लर रडार वर्षा', desc: 'छिड़काव व कटाई के सटीक नियोजन हेतु पूर्वानुमान' },
      { icon: '🩺', title: 'एआई फसल डॉक्टर', desc: '१४ फसलों के पत्ती रोगों की तुरंत पहचान व उपचार' }
    ]
  }
};

export const LiveTour = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading } = useAuth();
  const { language } = useLanguage();
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Per-account unique storage key (v3 ensures clean auto-launch)
  const accountKey = user?.id || user?.email || 'default_farmer';
  const tourStorageKey = `agri_live_tour_completed_v3_${accountKey}`;

  // Spotlight coordinates & dimensions
  const [spotlightRect, setSpotlightRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 0, height: 0 });

  // Floating Tour Card Position
  const [cardPosition, setCardPosition] = useState<{ top: number; left: number }>({
    top: 100,
    left: 100
  });

  const activeTargetRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const hasCheckedAutoRef = useRef(false);

  // Automatically trigger the tour on first visit to the app per account
  useEffect(() => {
    if (loading) return;
    if (hasCheckedAutoRef.current) return;

    const isExplicitTour = searchParams.get('tour') === 'true';
    const hasCompleted = localStorage.getItem(tourStorageKey);

    // If explicit query param ?tour=true is passed, launch tour immediately
    if (isExplicitTour) {
      hasCheckedAutoRef.current = true;
      setIsActive(true);
      setShowCompletionModal(false);
      setCurrentStepIndex(0);
      return;
    }

    // First time per account: automatically launch live tour!
    if (!hasCompleted) {
      hasCheckedAutoRef.current = true;
      const autoTimer = setTimeout(() => {
        setIsActive(true);
        setShowCompletionModal(false);
        setCurrentStepIndex(0);
      }, 400);

      return () => clearTimeout(autoTimer);
    }
  }, [accountKey, loading, searchParams, tourStorageKey]);

  // Listen for manual trigger event (topbar / sidebar click)
  useEffect(() => {
    const handleStartTour = () => {
      setIsActive(true);
      setShowCompletionModal(false);
      setCurrentStepIndex(0);
    };
    window.addEventListener('agri_start_live_tour', handleStartTour);
    return () => window.removeEventListener('agri_start_live_tour', handleStartTour);
  }, []);

  // Update spotlight & card position whenever step or active status changes
  const updatePositions = useCallback(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStepIndex];
    if (!step) return;

    let targetEl = document.querySelector(step.selector) as HTMLElement | null;

    // Fallbacks if specific element not found
    if (!targetEl && step.selector === '.decision-header-row') {
      targetEl = document.querySelector('.today-decision-card') as HTMLElement | null;
    } else if (!targetEl && step.selector === '.dash-weather-card') {
      targetEl = document.querySelector('.dash-card') as HTMLElement | null;
    }

    if (targetEl) {
      if (activeTargetRef.current && activeTargetRef.current !== targetEl) {
        activeTargetRef.current.classList.remove('live-tour-target-active');
      }

      targetEl.classList.add('live-tour-target-active');
      activeTargetRef.current = targetEl;

      const rect = targetEl.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Update spotlight frame & SVG cutout hole
      setSpotlightRect({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      });

      // Measured card dimensions
      const cardEl = cardRef.current;
      const cardWidth = cardEl ? cardEl.offsetWidth : Math.min(440, viewportWidth - 32);
      const cardHeight = cardEl ? cardEl.offsetHeight : 310;

      const gap = 20; // Safe distance between spotlight and tour card
      const topbarOffset = 76;
      const margin = 16;

      let top = 100;
      let left = margin;

      // Mobile screen layout (< 680px)
      if (viewportWidth < 680) {
        if (rect.top + rect.height / 2 < viewportHeight / 2) {
          top = viewportHeight - cardHeight - 12;
        } else {
          top = topbarOffset + 10;
        }
        left = 12;
        setCardPosition({ top, left });
        return;
      }

      // Clearances around the target
      const spaceBelow = viewportHeight - rect.bottom - gap;
      const spaceAbove = rect.top - topbarOffset - gap;
      const spaceRight = viewportWidth - rect.right - gap;
      const spaceLeft = rect.left - gap;

      // 1. Target is a left-aligned vertical bar (e.g., sidebar navigation)
      if (rect.left < 280 && spaceRight >= cardWidth + margin) {
        left = rect.right + gap;
        top = Math.max(topbarOffset + 10, Math.min(rect.top, viewportHeight - cardHeight - margin));
      }
      // 2. Target is on the right edge (e.g., floating voice button or topbar right)
      else if (spaceLeft >= cardWidth + margin && rect.right > viewportWidth - 320) {
        left = rect.left - cardWidth - gap;
        top = Math.max(topbarOffset + 10, Math.min(rect.top, viewportHeight - cardHeight - margin));
      }
      // 3. Wide content elements: Prefer BELOW or ABOVE to guarantee ZERO overlap
      else {
        left = Math.max(margin, Math.min(rect.left, viewportWidth - cardWidth - margin));

        if (spaceBelow >= cardHeight) {
          top = rect.bottom + gap;
        } else if (spaceAbove >= cardHeight) {
          top = rect.top - cardHeight - gap;
        } else {
          if (spaceBelow >= spaceAbove) {
            top = rect.bottom + gap;
          } else {
            top = Math.max(topbarOffset + 10, rect.top - cardHeight - gap);
          }
        }
      }

      // Hard Collision Prevention Guard
      const cardRight = left + cardWidth;
      const cardBottom = top + cardHeight;
      const isOverlapping = !(
        cardRight <= rect.left - 8 ||
        left >= rect.right + 8 ||
        cardBottom <= rect.top - 8 ||
        top >= rect.bottom + 8
      );

      if (isOverlapping) {
        if (rect.top > viewportHeight / 2) {
          top = Math.max(topbarOffset + 10, rect.top - cardHeight - gap);
        } else {
          top = rect.bottom + gap;
        }
      }

      setCardPosition({ top, left });
    }
  }, [isActive, currentStepIndex]);

  // Smart Scrolling on step change
  useEffect(() => {
    if (!isActive) return;

    const step = TOUR_STEPS[currentStepIndex];
    if (!step) return;

    const isNavMenu = step.selector.startsWith('.nav-');
    if (isNavMenu) {
      window.dispatchEvent(new CustomEvent('agri_expand_sidebar'));
    }

    let targetEl = document.querySelector(step.selector) as HTMLElement | null;
    if (!targetEl && step.selector === '.decision-header-row') {
      targetEl = document.querySelector('.today-decision-card') as HTMLElement | null;
    } else if (!targetEl && step.selector === '.dash-weather-card') {
      targetEl = document.querySelector('.dash-card') as HTMLElement | null;
    }

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const topbarOffset = 76;
      const isSidebar = step.selector === '.sidebar-nav' || isNavMenu;
      const isVoice = step.selector === '.floating-voice-btn';

      if (isNavMenu) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else if (!isSidebar && !isVoice) {
        const targetScrollY = window.scrollY + rect.top - (topbarOffset + 20);
        window.scrollTo({
          top: Math.max(0, targetScrollY),
          behavior: 'smooth'
        });
      }
    }

    const timer1 = setTimeout(() => {
      updatePositions();
    }, 120);

    const timer2 = setTimeout(() => {
      updatePositions();
    }, 380);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isActive, currentStepIndex, updatePositions]);

  // Continuous resize & scroll tracking
  useEffect(() => {
    if (!isActive) return;

    const handleSync = () => {
      updatePositions();
    };

    window.addEventListener('resize', handleSync, { passive: true });
    window.addEventListener('scroll', handleSync, { passive: true });

    return () => {
      window.removeEventListener('resize', handleSync);
      window.removeEventListener('scroll', handleSync);
    };
  }, [isActive, updatePositions]);

  // Keyboard navigation (← / → / Esc)
  useEffect(() => {
    if (!isActive || showCompletionModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleLeaveGuidance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStepIndex, showCompletionModal]);

  const handleNext = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setShowCompletionModal(true);
    }
  };

  const handlePrev = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleLeaveGuidance = () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsActive(false);
    setShowCompletionModal(false);

    // Persist that this account has completed/dismissed the live tour
    localStorage.setItem(tourStorageKey, 'true');

    if (activeTargetRef.current) {
      activeTargetRef.current.classList.remove('live-tour-target-active');
      activeTargetRef.current = null;
    }

    if (searchParams.get('tour') === 'true' || searchParams.get('from') === 'landing') {
      searchParams.delete('tour');
      searchParams.delete('from');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleFinishAndEnterApp = () => {
    handleLeaveGuidance();
  };

  const handlePlayVoice = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'mr') {
      utterance.lang = 'mr-IN';
    } else if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isActive) return null;

  const currentStepItem = TOUR_STEPS[currentStepIndex];
  const langKey: Language = (language === 'mr' || language === 'hi' || language === 'en') ? language : 'en';
  const currentStep = currentStepItem[langKey] || currentStepItem.en;
  const ui = UI_TEXT[langKey] || UI_TEXT.en;

  return (
    <>
      {/* 1. SVG Backdrop with Smooth Animated Cutout Hole */}
      <svg className="live-tour-svg-backdrop" aria-hidden="true">
        <defs>
          <mask id="tour-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect
              x={spotlightRect.x - 8}
              y={spotlightRect.y - 8}
              width={Math.max(10, spotlightRect.width + 16)}
              height={Math.max(10, spotlightRect.height + 16)}
              rx={18}
              ry={18}
              fill="black"
              className="tour-mask-cutout"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 23, 42, 0.72)"
          mask="url(#tour-spotlight-mask)"
          className="tour-backdrop-rect"
          onClick={handleNext}
        />
      </svg>

      {/* 2. Glowing Amber/Golden Spotlight Highlight Frame */}
      <div
        className="tour-glowing-frame"
        style={{
          top: spotlightRect.y - 8,
          left: spotlightRect.x - 8,
          width: Math.max(10, spotlightRect.width + 16),
          height: Math.max(10, spotlightRect.height + 16)
        }}
      />

      {/* 3. Floating Guidance Tour Card */}
      {!showCompletionModal && (
        <div
          ref={cardRef}
          className="tour-card-container"
          style={{
            top: cardPosition.top,
            left: cardPosition.left
          }}
        >
          {/* Header Row: Stage Counter Badge & Close Button */}
          <div className="tour-card-header">
            <div className="tour-stage-pill">
              <span className="tour-stage-dot">{currentStepIndex + 1}</span>
              <span className="tour-stage-label">
                {ui.stage(currentStepIndex + 1, TOUR_STEPS.length)}
              </span>
            </div>
            <button
              className="tour-close-btn"
              onClick={handleLeaveGuidance}
              aria-label={ui.leave}
              title={ui.leave}
            >
              <X size={18} />
            </button>
          </div>

          {/* Title & Sparkle Icon */}
          <div className="tour-title-wrap">
            <Sparkles size={20} className="tour-title-sparkle" />
            <h3 className="tour-card-title">{currentStep.title}</h3>
          </div>

          {/* Detailed Explanatory Description */}
          <p className="tour-card-description">{currentStep.description}</p>

          {/* Audio Spoken Advisory Button */}
          {currentStep.voiceText && (
            <div className="tour-audio-action-wrap">
              <button
                className={`tour-audio-btn ${isSpeaking ? 'speaking' : ''}`}
                onClick={() => handlePlayVoice(currentStep.voiceText)}
              >
                <Volume2 size={16} />
                <span>{isSpeaking ? ui.audioStop : ui.audioPlay}</span>
              </button>
            </div>
          )}

          {/* Card Footer: Leave guidance + Back & Next Buttons */}
          <div className="tour-card-footer">
            <button className="tour-link-leave" onClick={handleLeaveGuidance}>
              {ui.leave}
            </button>
            <div className="tour-nav-buttons">
              <button
                className="tour-btn-back"
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
              >
                {ui.back}
              </button>
              <button className="tour-btn-next" onClick={handleNext}>
                {currentStepIndex === TOUR_STEPS.length - 1 ? ui.finish : ui.next}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Post-Tour Celebration Completion Popup Modal */}
      {showCompletionModal && (
        <div className="tour-complete-backdrop">
          <div className="tour-complete-card">
            <div className="tour-complete-confetti">🎉</div>
            <div className="tour-complete-badge">
              <Sparkles size={14} color="#047857" />
              <span>{ui.completedBadge(TOUR_STEPS.length)}</span>
            </div>
            <h2 className="tour-complete-title">{ui.completedTitle}</h2>
            <p className="tour-complete-sub">{ui.completedSub}</p>

            {/* Feature Summary Grid */}
            <div className="tour-recap-grid">
              {ui.recaps.map((item, idx) => (
                <div className="recap-chip" key={idx}>
                  <span className="recap-icon">{item.icon}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="tour-complete-actions">
              <button className="btn-continue-app" onClick={handleFinishAndEnterApp}>
                <span>{ui.continueApp}</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn-restart-tour"
                onClick={() => {
                  setShowCompletionModal(false);
                  setCurrentStepIndex(0);
                }}
              >
                <span>{ui.restartTour}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
