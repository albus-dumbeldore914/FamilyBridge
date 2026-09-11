import { GovernmentBenefit } from './types';

export const BENEFIT_SCHEMES_DATABASE: GovernmentBenefit[] = [
  {
    id: 'scheme_edli_epfo',
    title: 'Employees’ Deposit-Linked Insurance Scheme (EDLI)',
    department: 'Ministry of Labour and Employment / EPFO',
    category: 'Life & Social Security',
    description:
      'Provides assurance benefits to the registered nominees of active EPF members in the event of death during service, with zero employee contribution.',
    potentialSupport: 'Lump-sum death benefit up to ₹ 7,00,000 (Tax-free)',
    matchScore: 'High Match',
    criteriaSummary: [
      'Deceased member had continuous active service under EPF Scheme',
      'e-Nomination registered under EPFO portal',
      'Claim submitted alongside EPF Form 20 & 10D',
    ],
    requiredDocuments: [
      'EPFO UAN Number (1009-8821-4402)',
      'Death Certificate of primary subscriber',
      'Nominee cancelled cheque & bank passbook',
      'Form 5IF (EDLI Claim Form) certified by employer',
    ],
    officialPortalUrl: 'https://epfindia.gov.in',
    disclaimer:
      'Potentially relevant. Benefit sanction is determined solely by the EPFO field commissioner based on active service tenure and average monthly wages.',
  },
  {
    id: 'scheme_eps_widow_pension',
    title: 'Employees’ Pension Scheme (EPS-95) Family & Orphan Pension',
    department: 'Employees’ Provident Fund Organisation',
    category: 'Monthly Social Security',
    description:
      'Guarantees lifelong monthly pension to the surviving spouse (Widow Pension) and simultaneous monthly pension to up to two dependent children until they reach age 25.',
    potentialSupport: 'Lifelong monthly widow pension + monthly child pension for 2 children',
    matchScore: 'High Match',
    criteriaSummary: [
      'Primary member contributed to EPS-95 for at least one month',
      'Spouse name registered on official EPF Form 2 / e-Nomination',
      'Children aged below 25 years (Arjun 16, Ananya 10)',
    ],
    requiredDocuments: [
      'Form 10D (Claim for Pension)',
      'Certified copy of Death Certificate',
      'Age proof / Birth certificates of children',
      'Joint photograph and bank account details of spouse',
    ],
    officialPortalUrl: 'https://unifiedportal-mem.epfindia.gov.in',
    disclaimer:
      'Potentially relevant. Exact monthly pension calculation is performed by EPFO actuarial formula based on contributory wage history.',
  },
  {
    id: 'scheme_sukanya_samriddhi',
    title: 'Sukanya Samriddhi Yojana (SSY) Continuation & Tax Benefits',
    department: 'Ministry of Finance / National Savings Institute',
    category: 'Daughter Education & Welfare',
    description:
      'High-interest government sovereign savings scheme designed exclusively for girl children up to age 10. Allows guardian transition in continuity mode.',
    potentialSupport: '8.2% sovereign guaranteed compound interest with Section 80C tax exemption',
    matchScore: 'Potential Match',
    criteriaSummary: [
      'Girl child aged below 10 years (Ananya Kumar is 10)',
      'Mother can take over legal operational guardianship seamlessly',
    ],
    requiredDocuments: [
      'Ananya Birth Certificate',
      'Mother KYC (Aadhaar & PAN)',
      'Post Office / Authorized Bank SSY Passbook',
    ],
    officialPortalUrl: 'https://www.nsiindia.gov.in',
    disclaimer:
      'Potentially relevant. Account operations and legal guardianship succession must be approved by the designated post office / authorized bank branch.',
  },
  {
    id: 'scheme_cbse_single_girl_scholarship',
    title: 'CBSE Merit Scholarship for Single Girl Child / Dependent Girl Support',
    department: 'Central Board of Secondary Education (CBSE)',
    category: 'Education Assistance',
    description:
      'Special educational scholarship designed by CBSE to support meritorious girl students pursuing secondary and senior secondary schooling.',
    potentialSupport: '₹ 6,000 annually towards tuition & study materials',
    matchScore: 'Potential Match',
    criteriaSummary: [
      'Girl student studying in CBSE affiliated institution',
      'School fee within prescribed ceiling limits',
    ],
    requiredDocuments: [
      'Student School ID Card',
      'Affidavit sworn before First Class Magistrate',
      'Previous grade marksheet',
    ],
    officialPortalUrl: 'https://cbse.gov.in',
    disclaimer:
      'Potentially relevant. Application windows open annually between September and November through the official CBSE portal.',
  },
];
