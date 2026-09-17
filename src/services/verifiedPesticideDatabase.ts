import type { VerifiedCropProtectionProduct } from '../types/cropDoctor';

export const VERIFIED_PESTICIDE_DATABASE: VerifiedCropProtectionProduct[] = [
  // Tomato - Early Blight
  {
    id: 'prod-001',
    crop: 'Tomato',
    target_disease: 'Early Blight',
    product_name: 'Mancozeb 75% WP (Indofil M-45)',
    active_ingredient: 'Mancozeb 75% WP',
    application_guidance: 'Foliar spray @ 2.0-2.5 g/L of water at first sign of disease symptoms. Repeat every 10-14 days if needed.',
    ppe: 'Gloves, mask, long sleeves, eye protection',
    pre_harvest_interval: '7 Days',
    region: 'Maharashtra / All India',
    source: 'Central Insecticides Board & Registration Committee (CIBRC)',
    verification_date: '2026-01-15',
    status: 'Approved'
  },
  {
    id: 'prod-002',
    crop: 'Tomato',
    target_disease: 'Early Blight',
    product_name: 'Azoxystrobin 23% SC (Amistar)',
    active_ingredient: 'Azoxystrobin 23% SC',
    application_guidance: 'Foliar spray @ 1.0 mL/L of water. Apply at disease onset and repeat after 14 days.',
    ppe: 'Nitrile gloves, face shield, protective coveralls',
    pre_harvest_interval: '5 Days',
    region: 'Maharashtra / All India',
    source: 'CIBRC Registered Label',
    verification_date: '2026-02-10',
    status: 'Approved'
  },

  // Tomato - Late Blight
  {
    id: 'prod-003',
    crop: 'Tomato',
    target_disease: 'Late Blight',
    product_name: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate M8)',
    active_ingredient: 'Cymoxanil 8% + Mancozeb 64% WP',
    application_guidance: 'Spray @ 2.5 g/L of water. Ensure thorough coverage of both leaf surfaces.',
    ppe: 'Chemical resistant gloves, goggle mask, boots',
    pre_harvest_interval: '7 Days',
    region: 'Maharashtra / All India',
    source: 'CIBRC Registered Label',
    verification_date: '2026-01-20',
    status: 'Approved'
  },

  // Cotton - Bacterial Blight / Leaf Disease
  {
    id: 'prod-004',
    crop: 'Cotton',
    target_disease: 'Bacterial Blight',
    product_name: 'Copper Oxychloride 50% WP + Streptocycline',
    active_ingredient: 'Copper Oxychloride 50% WP (2.5 g/L) + Streptomycin Sulphate (0.1 g/L)',
    application_guidance: 'Dissolve in water and spray evenly on foliage at first symptom appearance.',
    ppe: 'Mask, gloves, protective clothing',
    pre_harvest_interval: '14 Days',
    region: 'Maharashtra / Gujarat',
    source: 'ICAR-CICR Approved Protocol',
    verification_date: '2026-03-01',
    status: 'Approved'
  },

  // Onion - Purple Blotch
  {
    id: 'prod-005',
    crop: 'Onion',
    target_disease: 'Purple Blotch',
    product_name: 'Tebuconazole 25.9% EC (Folicur)',
    active_ingredient: 'Tebuconazole 25.9% EC',
    application_guidance: 'Spray @ 1.0-1.25 mL/L of water mixed with sticker/spreader agent.',
    ppe: 'Gloves, protective eyewear, mask',
    pre_harvest_interval: '15 Days',
    region: 'Maharashtra (Nashik / Ahmednagar)',
    source: 'DOGR Rajgurunagar / CIBRC',
    verification_date: '2026-02-28',
    status: 'Approved'
  },

  // Soybean - Rust
  {
    id: 'prod-006',
    crop: 'Soybean',
    target_disease: 'Asian Soybean Rust',
    product_name: 'Hexaconazole 5% EC (Contaf)',
    active_ingredient: 'Hexaconazole 5% EC',
    application_guidance: 'Foliar spray @ 2.0 mL/L of water at flowering to early pod stage.',
    ppe: 'Protective gloves, rubber boots, face mask',
    pre_harvest_interval: '30 Days',
    region: 'Maharashtra / Madhya Pradesh',
    source: 'ICAR-IISR Indore Approved List',
    verification_date: '2026-01-10',
    status: 'Approved'
  },

  // Grapes - Downy Mildew
  {
    id: 'prod-007',
    crop: 'Grapes',
    target_disease: 'Downy Mildew',
    product_name: 'Dimethomorph 50% WP (Acrobat)',
    active_ingredient: 'Dimethomorph 50% WP',
    application_guidance: 'Spray @ 1.0 g/L water during humid cloudy conditions at pre-flowering stage.',
    ppe: 'Full face visor, nitrile gloves, apron',
    pre_harvest_interval: '15 Days',
    region: 'Nashik / Sangli / Pune',
    source: 'ICAR-NRC Grapes Annexure-5',
    verification_date: '2026-03-05',
    status: 'Approved'
  }
];

export const getVerifiedProtectionProducts = (crop: string, targetDisease: string): VerifiedCropProtectionProduct[] => {
  const normCrop = crop.toLowerCase();
  const normDisease = targetDisease.toLowerCase();

  return VERIFIED_PESTICIDE_DATABASE.filter(prod => {
    const matchCrop = prod.crop.toLowerCase().includes(normCrop) || normCrop.includes(prod.crop.toLowerCase());
    const matchDisease = prod.target_disease.toLowerCase().includes(normDisease) || normDisease.includes(prod.target_disease.toLowerCase());
    return matchCrop && matchDisease;
  });
};
