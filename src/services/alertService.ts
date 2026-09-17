import type { FarmAlert } from '../types/alert';
import type { UserProfile } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const FALLBACK_ALERTS: FarmAlert[] = [
  {
    id: 'alert-1',
    alert_type: 'weather',
    severity: 'critical',
    title: 'Heavy Rainfall Expected',
    title_mr: 'मुसळधार पावसाचा इशारा',
    location: 'Nashik District',
    description: 'Heavy rainfall of 50mm+ may occur in the next 48 hours according to Indian Meteorological Dept (IMD). High risk of waterlogging in low-lying crop fields.',
    crop: 'Onion • Tomato • Grapes',
    source: 'Indian Meteorological Department (IMD)',
    source_url: 'https://mausam.imd.gov.in',
    action_text: 'View Weather',
    action_route: '/alerts',
    is_read: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    rainfall_mm: 50,
    expected_hours: 48,
    verified_by: 'IMD Weather Warning Division',
    recommended_actions: [
      'Ensure proper field drainage channels to prevent water stagnation around onion bulbs.',
      'Postpone any planned pesticide or fertilizer spraying during continuous rainfall.',
      'Check greenhouse / shade-net structural tie-downs in high wind areas.'
    ]
  },
  {
    id: 'alert-2',
    alert_type: 'pest',
    severity: 'high',
    title: 'Aphids & Thrips Pest Attack Advisory',
    title_mr: 'मावा व फुलकिडे प्रादुर्भाव सावधानतेचा इशारा',
    location: 'Kopargaon & Rahata Taluka',
    description: 'Early aphid and thrips activity detected in nearby agricultural plots. Increased humidity favors rapid pest reproduction on young onion leaves.',
    crop: 'Onion',
    source: 'ICAR - Krishi Vigyan Kendra (KVK)',
    source_url: 'https://kvk.icar.gov.in',
    action_text: 'Open Crop Doctor',
    action_route: '/crop-doctor',
    is_read: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    verified_by: 'ICAR-KVK Plant Pathology Dept',
    recommended_actions: [
      'Inspect lower leaf surfaces for yellowing and sticky honeydew exudate.',
      'Install yellow sticky traps (15-20 traps/acre) for eco-friendly pest monitoring.',
      'If threshold exceeds 10 aphids/leaf, apply CIBRC registered Neem-based Azadirachtin (1500 ppm) at 5ml/liter water.'
    ]
  },
  {
    id: 'alert-3',
    alert_type: 'crop_health',
    severity: 'high',
    title: 'High Humidity Purple Blotch Alert',
    title_mr: 'करपा रोग हवामान धोका इशारा',
    location: 'Nashik & Ahmednagar Region',
    description: 'Relative humidity exceeding 85% with temperatures between 22°C–28°C creates optimal conditions for Purple Blotch (Alternaria porri) infection in onion crops.',
    crop: 'Onion',
    source: 'AgriRakshak Climate-AI Model',
    action_text: 'Open Crop Doctor',
    action_route: '/crop-doctor',
    is_read: false,
    created_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14h ago
    verified_by: 'AgriRakshak Early Warning System',
    recommended_actions: [
      'Take a clear photo of suspicious leaf spots and upload to Crop Doctor for instant AI diagnosis.',
      'Maintain adequate row spacing to encourage air circulation between crop canopies.'
    ]
  },
  {
    id: 'alert-4',
    alert_type: 'market',
    severity: 'moderate',
    title: 'Onion Market Price Increase (+₹180/qtl)',
    title_mr: 'नाशिक बाजारात कांदा भावात वाढ',
    location: 'Nashik APMC Mandi',
    description: 'Modal price for red onion (लाल कांदा) increased by ₹180/quintal due to strong inter-state demand in Southern markets.',
    crop: 'Onion',
    source: 'Maharashtra State Agricultural Marketing Board (MSAMB)',
    source_url: 'https://www.msamb.com',
    action_text: 'View Market Prices',
    action_route: '/market',
    is_read: false,
    created_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(), // 22h ago
    market_name: 'Nashik APMC',
    current_price: '₹2,450 / qtl',
    price_change: '+₹180 (7.9%)',
    verified_by: 'MSAMB Official Market Feed',
    recommended_actions: [
      'Compare prices between Nashik, Kopargaon, and Pimpalgaon mandis using the Market Prices module.',
      'Calculate net profit after freight before dispatching your crop produce.'
    ]
  },
  {
    id: 'alert-5',
    alert_type: 'government',
    severity: 'moderate',
    title: 'PM-KUSUM 90% Solar Pump Application Deadline',
    title_mr: 'पीएम-कुसुम सौर कृषी पंप अर्ज अंतिम मुदत',
    location: 'Maharashtra State',
    description: 'Final allocation quota for 90% subsidized solar agricultural pumps (3 HP / 5 HP / 7.5 HP) closes in 10 days for Maharashtra farmers.',
    crop: 'All Crops',
    source: 'MahaUrja (MEDA) & Department of Agriculture',
    source_url: 'https://mahadbt.maharashtra.gov.in',
    action_text: 'View Scheme Details',
    action_route: '/schemes',
    is_read: true,
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    scheme_name: 'PM-KUSUM Solar Pump Scheme',
    scheme_deadline: '30 September 2026',
    verified_by: 'MahaUrja Official Notice',
    recommended_actions: [
      'Ensure 7/12 extract has water source entry (Well/Borewell).',
      'Submit online application on MahaDBT portal with 10% farmer share deposit.'
    ]
  },
  {
    id: 'alert-6',
    alert_type: 'system',
    severity: 'informational',
    title: 'AgriRakshak AI Model Upgrade v2.4',
    title_mr: 'ॲग्रीरक्षक AI मॉडेल अपडेट समाविष्ट',
    location: 'Platform Wide',
    description: 'Crop Doctor ViT-B/16 Vision Transformer model upgraded to version 2.4 with 94.8% accuracy for Tomato, Onion, and Grape disease detection.',
    crop: 'All Crops',
    source: 'AgriRakshak Engineering Team',
    action_text: 'View Model Metrics',
    action_route: '/admin/crop-doctor',
    is_read: true,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    verified_by: 'AgriRakshak System Admin',
    recommended_actions: [
      'No action required. Crop Doctor diagnoses will now deliver faster and more accurate crop health recommendations.'
    ]
  }
];

const LOCAL_STORAGE_ALERTS_KEY = 'agri_rakshak_alerts_store';

export const getStoredAlerts = (): FarmAlert[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_ALERTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Failed to parse alerts from localStorage', e);
  }
  return FALLBACK_ALERTS;
};

export const saveStoredAlerts = (alerts: FarmAlert[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_ALERTS_KEY, JSON.stringify(alerts));
  } catch (e) {
    console.error('Failed to save alerts to localStorage', e);
  }
};

export const fetchPersonalizedAlerts = async (userProfile?: UserProfile | null): Promise<FarmAlert[]> => {
  let alertsList = getStoredAlerts();

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        alertsList = data as FarmAlert[];
      }
    } catch (err) {
      console.warn('Supabase fetch alerts fallback:', err);
    }
  }

  // Prioritization Algorithm:
  // 1. Severity: critical (3) > high (2) > moderate (1) > informational (0)
  // 2. Location & Crop Relevance to Farmer Profile
  // 3. Recency
  const severityWeight: Record<string, number> = {
    critical: 300,
    high: 200,
    moderate: 100,
    informational: 0
  };

  const userDistrict = userProfile?.district?.toLowerCase() || 'nashik';

  const sortedAlerts = [...alertsList].sort((a, b) => {
    let scoreA = severityWeight[a.severity] || 0;
    let scoreB = severityWeight[b.severity] || 0;

    // Bonus score for matching farmer location
    if (a.location.toLowerCase().includes(userDistrict)) scoreA += 50;
    if (b.location.toLowerCase().includes(userDistrict)) scoreB += 50;

    // Bonus for unread
    if (!a.is_read) scoreA += 20;
    if (!b.is_read) scoreB += 20;

    // Recency tie-breaker
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();

    if (scoreA === scoreB) {
      return dateB - dateA;
    }
    return scoreB - scoreA;
  });

  return sortedAlerts;
};

export const markAlertAsRead = async (alertId: string): Promise<FarmAlert[]> => {
  const alerts = getStoredAlerts();
  const updated = alerts.map((a) => (a.id === alertId ? { ...a, is_read: true } : a));
  saveStoredAlerts(updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('alerts').update({ is_read: true }).eq('id', alertId);
    } catch (err) {
      console.warn('Supabase mark read update error:', err);
    }
  }

  return updated;
};

export const markAllAlertsAsRead = async (): Promise<FarmAlert[]> => {
  const alerts = getStoredAlerts();
  const updated = alerts.map((a) => ({ ...a, is_read: true }));
  saveStoredAlerts(updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('alerts').update({ is_read: true }).neq('id', '');
    } catch (err) {
      console.warn('Supabase mark all read error:', err);
    }
  }

  return updated;
};

export const getUnreadAlertsCount = (alerts: FarmAlert[]): number => {
  return alerts.filter((a) => !a.is_read).length;
};
