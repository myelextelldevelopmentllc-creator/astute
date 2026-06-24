export interface Property {
  id: string;
  tag: string;
  name: string;
  address: string;
  location: string;
  type: string;
  units: number;
  sqft: number;
  yearBuilt: number;
  coords: [number, number];
  askingPrice: number;
  pricePerUnit: number;
  image: string;
  irr: string;
  cap: string;
  score: number;
  financials: {
    currentRent: number;
    marketRent: number;
    monthlyExpenses: number;
    currentNOI: number;
    stabilizedNOI: number;
    capRateIn: number;
    capRateOut: number;
    renovationBudget: number;
    totalBasis: number;
    projectedSalePrice: number;
    holdPeriod: string;
    projectedIRR: string;
    equityMultiple: string;
  };
  thesis: string;
  valuePlan: string[];
  exitStrategy: string;
  riskFactors: string[];
}

export const PROPERTIES: Property[] = [
  {
    id: 'elliott-yonkers',
    tag: 'Westchester',
    name: 'Elliott Avenue Quadruplex',
    address: '80 Elliott Ave, Yonkers, NY',
    location: 'Yonkers, NY',
    type: '4-Unit Quadruplex',
    units: 4,
    sqft: 5505,
    yearBuilt: 1911,
    coords: [-73.8988, 40.9312],
    askingPrice: 1600000,
    pricePerUnit: 400000,
    image: 'https://media.base44.com/images/public/69c2da550bf86f45f1a86382/183ca4640_generated_5cbead47.png',
    irr: '18–22%',
    cap: '6.45%',
    score: 88,
    financials: {
      currentRent: 11590, marketRent: 13400, monthlyExpenses: 2984,
      currentNOI: 103272, stabilizedNOI: 116952, capRateIn: 6.45, capRateOut: 8,
      renovationBudget: 120000, totalBasis: 1720000, projectedSalePrice: 2100000,
      holdPeriod: '5 years', projectedIRR: '18–22%', equityMultiple: '1.8x–2.1x',
    },
    thesis: 'A compact Westchester multifamily asset with stable income, below-market rent upside, and a clear light-renovation path.',
    valuePlan: ['Modernize kitchens and baths during natural turnover', 'Tighten expense controls and vendor pricing', 'Improve curb appeal, entry lighting, and common areas', 'Push rents toward market after upgrades'],
    exitStrategy: 'Stabilize NOI and exit to a private multifamily buyer or refinance after income growth.',
    riskFactors: ['Older building systems', 'Tenant turnover timing', 'Westchester property tax pressure'],
  },
  {
    id: 'union-city-summit',
    tag: 'Hudson County',
    name: 'Summit Ave Multifamily',
    address: 'Summit Ave, Union City, NJ',
    location: 'Union City, NJ',
    type: 'Small Multifamily',
    units: 6,
    sqft: 4800,
    yearBuilt: 1920,
    coords: [-74.0263, 40.7695],
    askingPrice: 699000,
    pricePerUnit: 116500,
    image: 'https://media.base44.com/images/public/69c2da550bf86f45f1a86382/acdbf629a_generated_ac3f08dd.png',
    irr: '24–30%',
    cap: '1.98%',
    score: 91,
    financials: {
      currentRent: 3395, marketRent: 8000, monthlyExpenses: 2070,
      currentNOI: 13861, stabilizedNOI: 66358, capRateIn: 1.98, capRateOut: 9.5,
      renovationBudget: 210000, totalBasis: 909000, projectedSalePrice: 1250000,
      holdPeriod: '5 years', projectedIRR: '24–30%', equityMultiple: '2.0x–2.6x',
    },
    thesis: 'High-upside Hudson County basis play with major rent-to-market opportunity and strong commuter demand.',
    valuePlan: ['Renovate units in phases', 'Reposition rents to market levels', 'Upgrade exterior identity and security', 'Add professional management systems'],
    exitStrategy: 'Create a stabilized cash-flowing asset and sell to a mid-market buyer seeking Hudson County scale.',
    riskFactors: ['Execution risk from larger rent gap', 'Permitting delays', 'Financing sensitivity'],
  },
  {
    id: 'arlington-somerville',
    tag: 'Boston Metro',
    name: '13 Arlington St',
    address: '13 Arlington St, Somerville, MA',
    location: 'Somerville, MA',
    type: 'Multifamily',
    units: 6,
    sqft: 6100,
    yearBuilt: 1900,
    coords: [-71.1006, 42.3919],
    askingPrice: 2998125,
    pricePerUnit: 499688,
    image: 'https://media.base44.com/images/public/69c2da550bf86f45f1a86382/89eeef37e_generated_3bd8c857.png',
    irr: '15–19%',
    cap: '4.90%',
    score: 84,
    financials: {
      currentRent: 15850, marketRent: 18000, monthlyExpenses: 2823,
      currentNOI: 146817, stabilizedNOI: 171327, capRateIn: 4.9, capRateOut: 5.71,
      renovationBudget: 250000, totalBasis: 3248125, projectedSalePrice: 3850000,
      holdPeriod: '7–10 years', projectedIRR: '15–19%', equityMultiple: '1.7x–2.0x',
    },
    thesis: 'Quality Boston metro asset in a deep rental market with durable tenant demand and moderate renovation upside.',
    valuePlan: ['Target premium finishes in select units', 'Improve energy efficiency and common areas', 'Retain occupancy while raising rents gradually', 'Position for long-term appreciation'],
    exitStrategy: 'Hold through market appreciation and refinance or sell after NOI stabilization.',
    riskFactors: ['Higher entry basis', 'Boston regulatory complexity', 'Longer hold period'],
  },
  {
    id: 'upland-somerville',
    tag: 'Boston Metro',
    name: '25-27 Upland Rd',
    address: '25-27 Upland Rd, Somerville, MA',
    location: 'Somerville, MA',
    type: 'Two-Building Multifamily',
    units: 8,
    sqft: 7600,
    yearBuilt: 1905,
    coords: [-71.1112, 42.3886],
    askingPrice: 2400000,
    pricePerUnit: 300000,
    image: 'https://media.base44.com/images/public/69c2da550bf86f45f1a86382/b0032e592_generated_dba01761.png',
    irr: '16–20%',
    cap: '5.78%',
    score: 86,
    financials: {
      currentRent: 14358, marketRent: 16250, monthlyExpenses: 2803,
      currentNOI: 138654, stabilizedNOI: 155500, capRateIn: 5.78, capRateOut: 6.5,
      renovationBudget: 300000, totalBasis: 2700000, projectedSalePrice: 3200000,
      holdPeriod: '7–10 years', projectedIRR: '16–20%', equityMultiple: '1.8x–2.1x',
    },
    thesis: 'Somerville multifamily with attractive in-place yield and a conservative path to value through rent growth.',
    valuePlan: ['Refresh interiors unit-by-unit', 'Improve laundry, storage, and resident experience', 'Reduce maintenance drag', 'Maintain occupancy during renovations'],
    exitStrategy: 'Stabilize and exit to local operators or recapitalize into a larger Boston portfolio.',
    riskFactors: ['Renovation pacing', 'Competitive rental inventory', 'Interest-rate sensitivity'],
  },
  {
    id: 'elliott-92',
    tag: 'Westchester',
    name: '92 Elliott Ave',
    address: '92 Elliott Ave, Yonkers, NY',
    location: 'Yonkers, NY',
    type: '4-Unit Multifamily',
    units: 4,
    sqft: 5200,
    yearBuilt: 1910,
    coords: [-73.8975, 40.9320],
    askingPrice: 1500000,
    pricePerUnit: 375000,
    image: 'https://media.base44.com/images/public/69c2da550bf86f45f1a86382/183ca4640_generated_5cbead47.png',
    irr: '17–21%',
    cap: '6.73%',
    score: 87,
    financials: {
      currentRent: 12000, marketRent: 12900, monthlyExpenses: 3583,
      currentNOI: 101000, stabilizedNOI: 111260, capRateIn: 6.73, capRateOut: 7.42,
      renovationBudget: 110000, totalBasis: 1610000, projectedSalePrice: 1950000,
      holdPeriod: '5 years', projectedIRR: '17–21%', equityMultiple: '1.7x–2.0x',
    },
    thesis: 'Stable Yonkers asset with strong going-in yield and manageable business plan execution.',
    valuePlan: ['Selective interior upgrades', 'Improve leasing and expense tracking', 'Add exterior lighting and signage', 'Push below-market units gradually'],
    exitStrategy: 'Increase NOI and sell/refinance at stabilized cash flow.',
    riskFactors: ['Tax reassessment risk', 'Limited unit count scale', 'Older property maintenance'],
  },
];

export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export const portfolioValue = PROPERTIES.reduce((s, p) => s + p.askingPrice, 0);
export const totalUnits = PROPERTIES.reduce((s, p) => s + p.units, 0);
