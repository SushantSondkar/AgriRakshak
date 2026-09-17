export type DistrictName = 'Pune District' | 'Nashik District' | 'Ahmednagar / Kopargaon' | 'All Districts';

export interface MandiPriceItem {
  id: string;
  district: DistrictName;
  mandiName: string;
  mandiNameMr: string;
  crop: string;
  cropMr: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  priceChangePercent: number;
  priceChangeAmount: number;
  distanceFromHubKm: number;
  lastUpdated: string;
  unit: string;
  history7Days: Array<{ date: string; price: number }>;
}

const generate7DayHistory = (currentPrice: number, changeAmount: number) => {
  const history = [];
  const startPrice = currentPrice - changeAmount;
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const progress = (6 - i) / 6;
    const wave = i > 0 && i < 6 ? Math.round(Math.sin(i * 1.5) * (changeAmount * 0.4)) : 0;
    const price = Math.round(startPrice + changeAmount * progress + wave);
    history.push({ date: dateStr, price: i === 0 ? currentPrice : price });
  }
  return history;
};

export const RAW_MARKET_DATA: MandiPriceItem[] = [
  // ==================== PUNE DISTRICT MANDIS ====================
  {
    id: 'pune-tom-01',
    district: 'Pune District',
    mandiName: 'Pune (Gultekdi)',
    mandiNameMr: 'पुणे (गुलटेकडी)',
    crop: 'Tomato',
    cropMr: 'टोमॅटो',
    modalPrice: 2200,
    minPrice: 1500,
    maxPrice: 2600,
    priceChangePercent: 8.5,
    priceChangeAmount: 170,
    distanceFromHubKm: 0,
    lastUpdated: 'Today, 10:15 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(2200, 170)
  },
  {
    id: 'pune-tom-02',
    district: 'Pune District',
    mandiName: 'Manchar',
    mandiNameMr: 'मंचर',
    crop: 'Tomato',
    cropMr: 'टोमॅटो',
    modalPrice: 2350,
    minPrice: 1650,
    maxPrice: 2750,
    priceChangePercent: 10.2,
    priceChangeAmount: 215,
    distanceFromHubKm: 60,
    lastUpdated: 'Today, 11:00 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(2350, 215)
  },
  {
    id: 'pune-tom-03',
    district: 'Pune District',
    mandiName: 'Junnar (Narayangaon)',
    mandiNameMr: 'जुन्नर (नारायणगाव)',
    crop: 'Tomato',
    cropMr: 'टोमॅटो',
    modalPrice: 2480,
    minPrice: 1800,
    maxPrice: 2900,
    priceChangePercent: 12.5,
    priceChangeAmount: 275,
    distanceFromHubKm: 85,
    lastUpdated: 'Today, 10:45 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(2480, 275)
  },
  {
    id: 'pune-on-01',
    district: 'Pune District',
    mandiName: 'Pune (Gultekdi)',
    mandiNameMr: 'पुणे (गुलटेकडी)',
    crop: 'Onion',
    cropMr: 'कांदा',
    modalPrice: 4200,
    minPrice: 3600,
    maxPrice: 4500,
    priceChangePercent: 5.2,
    priceChangeAmount: 200,
    distanceFromHubKm: 0,
    lastUpdated: 'Today, 09:30 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(4200, 200)
  },
  {
    id: 'pune-on-02',
    district: 'Pune District',
    mandiName: 'Chakan (Khed)',
    mandiNameMr: 'चाकण (खेड)',
    crop: 'Onion',
    cropMr: 'कांदा',
    modalPrice: 4100,
    minPrice: 3500,
    maxPrice: 4400,
    priceChangePercent: 4.8,
    priceChangeAmount: 180,
    distanceFromHubKm: 30,
    lastUpdated: 'Today, 11:15 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(4100, 180)
  },
  {
    id: 'pune-soy-01',
    district: 'Pune District',
    mandiName: 'Baramati',
    mandiNameMr: 'बारामती',
    crop: 'Soybean',
    cropMr: 'सोयाबीन',
    modalPrice: 6250,
    minPrice: 5900,
    maxPrice: 6500,
    priceChangePercent: 3.1,
    priceChangeAmount: 185,
    distanceFromHubKm: 100,
    lastUpdated: 'Today, 10:30 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(6250, 185)
  },
  {
    id: 'pune-soy-02',
    district: 'Pune District',
    mandiName: 'Indapur',
    mandiNameMr: 'इंदापूर',
    crop: 'Soybean',
    cropMr: 'सोयाबीन',
    modalPrice: 6180,
    minPrice: 5850,
    maxPrice: 6420,
    priceChangePercent: 2.8,
    priceChangeAmount: 165,
    distanceFromHubKm: 130,
    lastUpdated: 'Today, 11:45 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(6180, 165)
  },
  {
    id: 'pune-pom-01',
    district: 'Pune District',
    mandiName: 'Indapur',
    mandiNameMr: 'इंदापूर',
    crop: 'Pomegranate',
    cropMr: 'डाळिंब',
    modalPrice: 9200,
    minPrice: 6500,
    maxPrice: 10800,
    priceChangePercent: 4.5,
    priceChangeAmount: 400,
    distanceFromHubKm: 130,
    lastUpdated: 'Today, 12:00 PM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(9200, 400)
  },

  // ==================== NASHIK DISTRICT MANDIS ====================
  {
    id: 'nas-on-01',
    district: 'Nashik District',
    mandiName: 'Lasalgaon',
    mandiNameMr: 'लासलगाव',
    crop: 'Onion',
    cropMr: 'कांदा',
    modalPrice: 4450,
    minPrice: 3950,
    maxPrice: 4750,
    priceChangePercent: 8.5,
    priceChangeAmount: 350,
    distanceFromHubKm: 55,
    lastUpdated: 'Today, 10:45 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(4450, 350)
  },
  {
    id: 'nas-on-02',
    district: 'Nashik District',
    mandiName: 'Pimpalgaon Baswant',
    mandiNameMr: 'पिंपळगाव बसवंत',
    crop: 'Onion',
    cropMr: 'कांदा',
    modalPrice: 4380,
    minPrice: 3880,
    maxPrice: 4680,
    priceChangePercent: 7.9,
    priceChangeAmount: 320,
    distanceFromHubKm: 30,
    lastUpdated: 'Today, 11:20 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(4380, 320)
  },
  {
    id: 'nas-on-03',
    district: 'Nashik District',
    mandiName: 'Nashik APMC',
    mandiNameMr: 'नाशिक APMC',
    crop: 'Onion',
    cropMr: 'कांदा',
    modalPrice: 4250,
    minPrice: 3750,
    maxPrice: 4550,
    priceChangePercent: 6.8,
    priceChangeAmount: 270,
    distanceFromHubKm: 0,
    lastUpdated: 'Today, 12:15 PM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(4250, 270)
  },
  {
    id: 'nas-on-04',
    district: 'Nashik District',
    mandiName: 'Yeola',
    mandiNameMr: 'येवला',
    crop: 'Onion',
    cropMr: 'कांदा',
    modalPrice: 4180,
    minPrice: 3700,
    maxPrice: 4480,
    priceChangePercent: 6.2,
    priceChangeAmount: 240,
    distanceFromHubKm: 85,
    lastUpdated: 'Today, 10:30 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(4180, 240)
  },
  {
    id: 'nas-tom-01',
    district: 'Nashik District',
    mandiName: 'Pimpalgaon Baswant',
    mandiNameMr: 'पिंपळगाव बसवंत',
    crop: 'Tomato',
    cropMr: 'टोमॅटो',
    modalPrice: 1950,
    minPrice: 1200,
    maxPrice: 2300,
    priceChangePercent: 11.4,
    priceChangeAmount: 200,
    distanceFromHubKm: 30,
    lastUpdated: 'Today, 11:15 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(1950, 200)
  },
  {
    id: 'nas-tom-02',
    district: 'Nashik District',
    mandiName: 'Nashik APMC',
    mandiNameMr: 'नाशिक APMC',
    crop: 'Tomato',
    cropMr: 'टोमॅटो',
    modalPrice: 1850,
    minPrice: 1100,
    maxPrice: 2200,
    priceChangePercent: 9.8,
    priceChangeAmount: 165,
    distanceFromHubKm: 0,
    lastUpdated: 'Today, 12:00 PM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(1850, 165)
  },
  {
    id: 'nas-gra-01',
    district: 'Nashik District',
    mandiName: 'Nashik APMC',
    mandiNameMr: 'नाशिक APMC',
    crop: 'Grapes',
    cropMr: 'द्राक्षे',
    modalPrice: 6500,
    minPrice: 4800,
    maxPrice: 7800,
    priceChangePercent: 4.2,
    priceChangeAmount: 260,
    distanceFromHubKm: 0,
    lastUpdated: 'Today, 10:00 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(6500, 260)
  },

  // ==================== AHMEDNAGAR / KOPARGAON REGION ====================
  {
    id: 'kop-on-01',
    district: 'Ahmednagar / Kopargaon',
    mandiName: 'Kopargaon',
    mandiNameMr: 'कोपरगाव',
    crop: 'Onion',
    cropMr: 'कांदा',
    modalPrice: 4150,
    minPrice: 3650,
    maxPrice: 4605,
    priceChangePercent: 3.35,
    priceChangeAmount: 120,
    distanceFromHubKm: 0,
    lastUpdated: 'Today, 11:30 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(4150, 120)
  },
  {
    id: 'kop-on-02',
    district: 'Ahmednagar / Kopargaon',
    mandiName: 'Ahilyanagar',
    mandiNameMr: 'अहिल्यानगर',
    crop: 'Onion',
    cropMr: 'कांदा',
    modalPrice: 4350,
    minPrice: 3900,
    maxPrice: 4650,
    priceChangePercent: 7.41,
    priceChangeAmount: 300,
    distanceFromHubKm: 100,
    lastUpdated: 'Today, 10:00 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(4350, 300)
  },
  {
    id: 'kop-soy-01',
    district: 'Ahmednagar / Kopargaon',
    mandiName: 'Kopargaon',
    mandiNameMr: 'कोपरगाव',
    crop: 'Soybean',
    cropMr: 'सोयाबीन',
    modalPrice: 6032,
    minPrice: 5750,
    maxPrice: 6250,
    priceChangePercent: 2.03,
    priceChangeAmount: 120,
    distanceFromHubKm: 0,
    lastUpdated: 'Today, 11:30 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(6032, 120)
  },
  {
    id: 'kop-cot-01',
    district: 'Ahmednagar / Kopargaon',
    mandiName: 'Shrirampur',
    mandiNameMr: 'श्रीरामपूर',
    crop: 'Cotton',
    cropMr: 'कापूस',
    modalPrice: 7380,
    minPrice: 6950,
    maxPrice: 7720,
    priceChangePercent: 0.95,
    priceChangeAmount: 70,
    distanceFromHubKm: 42,
    lastUpdated: 'Today, 10:40 AM',
    unit: 'Quintal',
    history7Days: generate7DayHistory(7380, 70)
  },
  {
    id: 'kop-sug-01',
    district: 'Ahmednagar / Kopargaon',
    mandiName: 'Kopargaon',
    mandiNameMr: 'कोपरगाव',
    crop: 'Sugarcane',
    cropMr: 'ऊस',
    modalPrice: 3150,
    minPrice: 2950,
    maxPrice: 3250,
    priceChangePercent: 0,
    priceChangeAmount: 0,
    distanceFromHubKm: 0,
    lastUpdated: 'Today, 09:30 AM',
    unit: 'Ton',
    history7Days: generate7DayHistory(3150, 0)
  }
];

// Helper to compute AI Best Selling Mandi Recommendation for a given crop
export const getBestSellingMandiRecommendation = (district: DistrictName, crop: string) => {
  const items = RAW_MARKET_DATA.filter(item => {
    const matchDist = district === 'All Districts' || item.district === district;
    const matchCrop = crop === 'All' || item.crop.toLowerCase() === crop.toLowerCase();
    return matchDist && matchCrop;
  });

  if (items.length === 0) return null;

  // Calculate Net Return (Modal Price - estimated freight)
  const evaluated = items.map(item => {
    const freightPerQ = item.distanceFromHubKm * 1.5; // ~ ₹1.5 per km per Quintal
    const netPrice = item.modalPrice - freightPerQ;
    return { ...item, netPrice, freightPerQ };
  }).sort((a, b) => b.netPrice - a.netPrice);

  return evaluated[0];
};
