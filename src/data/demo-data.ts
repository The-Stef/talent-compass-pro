// BMW HR Talent Intelligence - Synthetic Demo Data

export interface ForecastedRole {
  id: string;
  title: string;
  department: string;
  urgencyScore: number;
  openingTimeline: string;
  strategicImportance: string;
  keyRequirements: string[];
  riskIfUnfilled: string;
  status: 'critical' | 'high' | 'medium';
}

export interface EmployeeTrajectory {
  id: string;
  name: string;
  currentRole: string;
  department: string;
  tenure: number;
  trajectoryScore: number;
  readinessHorizon: string;
  growthVelocity: 'accelerating' | 'steady' | 'plateau';
  strengths: string[];
  criticalGaps: string[];
  photoSeed: number;
}

export interface RoleMatch {
  roleId: string;
  roleTitle: string;
  department: string;
  recommendedAction: 'internal' | 'external' | 'hybrid';
  candidates: {
    employeeId: string;
    employeeName: string;
    fitScore: number;
    readinessTiming: string;
    gapSummary: string;
  }[];
  externalReasoning?: string;
  urgencyScore: number;
}

export interface DevelopmentIntervention {
  id: string;
  employeeId: string;
  employeeName: string;
  targetRole: string;
  type: 'training' | 'mentorship' | 'rotation' | 'project' | 'coaching';
  title: string;
  duration: string;
  priority: 'critical' | 'high' | 'medium';
  gapAddressed: string;
  successMetrics: string;
  riskIfNotCompleted: string;
}

export interface ExecutiveDecision {
  roleId: string;
  roleTitle: string;
  department: string;
  decision: 'internal promotion' | 'external hire' | 'hybrid approach';
  primaryCandidate?: string;
  urgency: 'immediate' | 'Q2 2026' | 'Q3 2026' | 'Q4 2026';
  confidence: number;
  keyRisk: string;
  nextStep: string;
}

export const forecastedRoles: ForecastedRole[] = [
  {
    id: 'r1',
    title: 'VP of Autonomous Driving Engineering',
    department: 'R&D — Autonomous Vehicles',
    urgencyScore: 97,
    openingTimeline: 'Q2 2026',
    strategicImportance: 'Critical path for BMW iNEXT Level 4 autonomy rollout. Regulatory deadlines in EU and US require senior leadership continuity.',
    keyRequirements: ['15+ yrs autonomous systems', 'V2X & sensor fusion expertise', 'EU regulatory navigation', 'Team leadership 200+'],
    riskIfUnfilled: 'iNEXT L4 program delays by 6–9 months; €240M revenue impact',
    status: 'critical',
  },
  {
    id: 'r2',
    title: 'Director of Battery Cell Innovation',
    department: 'Neue Klasse — Electrification',
    urgencyScore: 94,
    openingTimeline: 'Q2 2026',
    strategicImportance: 'Neue Klasse platform requires next-gen solid-state battery integration. Current director retiring.',
    keyRequirements: ['Solid-state battery R&D', 'Supply chain partnerships', 'Patent portfolio management', 'Cross-functional leadership'],
    riskIfUnfilled: 'Neue Klasse battery cost targets missed; competitive gap vs. competitors widens',
    status: 'critical',
  },
  {
    id: 'r3',
    title: 'Head of AI/ML Platform',
    department: 'Digital & IT',
    urgencyScore: 89,
    openingTimeline: 'Q3 2026',
    strategicImportance: 'Centralized AI platform powers predictive maintenance, in-car personalization, and manufacturing optimization.',
    keyRequirements: ['ML infrastructure at scale', 'MLOps & model governance', 'Automotive AI applications', 'Team of 80+'],
    riskIfUnfilled: 'AI initiatives fragmented across BUs; duplicated effort and inconsistent quality',
    status: 'high',
  },
  {
    id: 'r4',
    title: 'Chief Sustainability Officer',
    department: 'Corporate Strategy',
    urgencyScore: 85,
    openingTimeline: 'Q3 2026',
    strategicImportance: 'EU CSRD compliance deadline. ESG performance directly impacts €2.1B green bond financing.',
    keyRequirements: ['EU sustainability regulation', 'Carbon accounting frameworks', 'Stakeholder communication', 'Board-level reporting'],
    riskIfUnfilled: 'CSRD non-compliance risk; green bond covenant breach potential',
    status: 'high',
  },
  {
    id: 'r5',
    title: 'Regional President — Greater China',
    department: 'Sales & Marketing',
    urgencyScore: 82,
    openingTimeline: 'Q4 2026',
    strategicImportance: 'China represents 33% of global volume. Incumbent transitioning to advisory role.',
    keyRequirements: ['China automotive market expertise', 'Government relations', 'JV management', 'P&L ownership €15B+'],
    riskIfUnfilled: 'Market share erosion in key growth market; dealer network instability',
    status: 'high',
  },
  {
    id: 'r6',
    title: 'VP of Connected Vehicle Services',
    department: 'Digital & IT',
    urgencyScore: 78,
    openingTimeline: 'Q3 2026',
    strategicImportance: 'Connected services generate recurring revenue; critical for BMW digital ecosystem strategy.',
    keyRequirements: ['Digital product management', 'Subscription business models', 'IoT platforms', 'Customer experience'],
    riskIfUnfilled: 'Connected services revenue growth stalls; customer churn increases',
    status: 'medium',
  },
];

export const employeeTrajectories: EmployeeTrajectory[] = [
  {
    id: 'e1',
    name: 'Dr. Katarina Weiss',
    currentRole: 'Senior Director, ADAS Development',
    department: 'R&D — Autonomous Vehicles',
    tenure: 11,
    trajectoryScore: 93,
    readinessHorizon: '3–6 months',
    growthVelocity: 'accelerating',
    strengths: ['Sensor fusion architecture', 'Team scaling (80→200)', 'SAE L3 certification lead', 'Patent portfolio (14 patents)'],
    criticalGaps: ['US regulatory experience', 'Board-level presentation skills'],
    photoSeed: 1,
  },
  {
    id: 'e2',
    name: 'Marcus Chen',
    currentRole: 'Director, Energy Storage Systems',
    department: 'Neue Klasse — Electrification',
    tenure: 8,
    trajectoryScore: 88,
    readinessHorizon: '6–9 months',
    growthVelocity: 'accelerating',
    strengths: ['Solid-state R&D (3 breakthroughs)', 'CATL & Samsung SDI partnerships', 'Cost optimization (18% reduction)'],
    criticalGaps: ['Patent strategy leadership', 'Executive stakeholder management'],
    photoSeed: 2,
  },
  {
    id: 'e3',
    name: 'Dr. Priya Sharma',
    currentRole: 'Head of ML Engineering',
    department: 'Digital & IT',
    tenure: 5,
    trajectoryScore: 91,
    readinessHorizon: '3–6 months',
    growthVelocity: 'accelerating',
    strengths: ['MLOps at scale (500+ models)', 'Real-time inference systems', 'Cross-BU AI governance framework'],
    criticalGaps: ['Manufacturing domain knowledge', 'Budget management >€50M'],
    photoSeed: 3,
  },
  {
    id: 'e4',
    name: 'Stefan Müller',
    currentRole: 'VP Sustainability Programs',
    department: 'Corporate Strategy',
    tenure: 14,
    trajectoryScore: 86,
    readinessHorizon: '0–3 months',
    growthVelocity: 'steady',
    strengths: ['CSRD implementation lead', 'Green bond framework architect', 'Board reporting experience'],
    criticalGaps: ['Global supply chain carbon accounting', 'Public-facing ESG communications'],
    photoSeed: 4,
  },
  {
    id: 'e5',
    name: 'Liu Wei',
    currentRole: 'SVP China Operations',
    department: 'Sales & Marketing',
    tenure: 9,
    trajectoryScore: 84,
    readinessHorizon: '6–12 months',
    growthVelocity: 'steady',
    strengths: ['BBA JV operations', 'Government relations (provincial)', 'Dealer network (680+ outlets)'],
    criticalGaps: ['Full P&L ownership experience', 'Central government relations'],
    photoSeed: 5,
  },
  {
    id: 'e6',
    name: 'Anna Bergström',
    currentRole: 'Director, Digital Products',
    department: 'Digital & IT',
    tenure: 6,
    trajectoryScore: 82,
    readinessHorizon: '6–9 months',
    growthVelocity: 'accelerating',
    strengths: ['Subscription revenue growth (140%)', 'UX-driven product strategy', 'Connected car platforms'],
    criticalGaps: ['IoT infrastructure depth', 'Enterprise sales leadership'],
    photoSeed: 6,
  },
  {
    id: 'e7',
    name: 'Dr. Thomas Richter',
    currentRole: 'Principal Engineer, Perception Systems',
    department: 'R&D — Autonomous Vehicles',
    tenure: 7,
    trajectoryScore: 79,
    readinessHorizon: '12–18 months',
    growthVelocity: 'steady',
    strengths: ['LiDAR & camera fusion', 'Published researcher (28 papers)', 'Technical mentorship'],
    criticalGaps: ['People management experience', 'Business strategy exposure', 'Cross-functional collaboration'],
    photoSeed: 7,
  },
  {
    id: 'e8',
    name: 'Yuki Tanaka',
    currentRole: 'Senior Manager, Battery Testing',
    department: 'Neue Klasse — Electrification',
    tenure: 4,
    trajectoryScore: 75,
    readinessHorizon: '18–24 months',
    growthVelocity: 'accelerating',
    strengths: ['Battery lifecycle analysis', 'Automated testing frameworks', 'Quality systems'],
    criticalGaps: ['Strategic planning', 'Supplier relationship management', 'Leadership at scale'],
    photoSeed: 8,
  },
];

export const roleMatches: RoleMatch[] = [
  {
    roleId: 'r1',
    roleTitle: 'VP of Autonomous Driving Engineering',
    department: 'R&D — Autonomous Vehicles',
    recommendedAction: 'internal',
    candidates: [
      { employeeId: 'e1', employeeName: 'Dr. Katarina Weiss', fitScore: 92, readinessTiming: '3–6 months with targeted development', gapSummary: 'US regulatory exposure needed; executive coaching for board presentations' },
      { employeeId: 'e7', employeeName: 'Dr. Thomas Richter', fitScore: 68, readinessTiming: '12–18 months', gapSummary: 'Strong technical but needs significant leadership development' },
    ],
    urgencyScore: 97,
  },
  {
    roleId: 'r2',
    roleTitle: 'Director of Battery Cell Innovation',
    department: 'Neue Klasse — Electrification',
    recommendedAction: 'internal',
    candidates: [
      { employeeId: 'e2', employeeName: 'Marcus Chen', fitScore: 87, readinessTiming: '6–9 months with patent strategy mentorship', gapSummary: 'Patent portfolio management and executive stakeholder skills needed' },
    ],
    urgencyScore: 94,
  },
  {
    roleId: 'r3',
    roleTitle: 'Head of AI/ML Platform',
    department: 'Digital & IT',
    recommendedAction: 'internal',
    candidates: [
      { employeeId: 'e3', employeeName: 'Dr. Priya Sharma', fitScore: 90, readinessTiming: '3–6 months', gapSummary: 'Manufacturing rotation and budget ownership stretch assignment needed' },
    ],
    urgencyScore: 89,
  },
  {
    roleId: 'r4',
    roleTitle: 'Chief Sustainability Officer',
    department: 'Corporate Strategy',
    recommendedAction: 'internal',
    candidates: [
      { employeeId: 'e4', employeeName: 'Stefan Müller', fitScore: 89, readinessTiming: 'Ready now with coaching support', gapSummary: 'External communications coaching and supply chain carbon methodology training' },
    ],
    urgencyScore: 85,
  },
  {
    roleId: 'r5',
    roleTitle: 'Regional President — Greater China',
    department: 'Sales & Marketing',
    recommendedAction: 'hybrid',
    candidates: [
      { employeeId: 'e5', employeeName: 'Liu Wei', fitScore: 79, readinessTiming: '6–12 months', gapSummary: 'Full P&L ownership and central government relationships need development' },
    ],
    externalReasoning: 'Role urgency may require interim external leader while Liu Wei completes development. Consider external search in parallel for risk mitigation.',
    urgencyScore: 82,
  },
  {
    roleId: 'r6',
    roleTitle: 'VP of Connected Vehicle Services',
    department: 'Digital & IT',
    recommendedAction: 'external',
    candidates: [
      { employeeId: 'e6', employeeName: 'Anna Bergström', fitScore: 74, readinessTiming: '6–9 months', gapSummary: 'IoT platform architecture and enterprise B2B sales experience gaps significant' },
    ],
    externalReasoning: 'Internal candidate shows strong potential but critical skill gaps in IoT infrastructure require depth only available externally. Recommend external hire with Anna Bergström as deputy for succession.',
    urgencyScore: 78,
  },
];

export const developmentInterventions: DevelopmentIntervention[] = [
  {
    id: 'd1', employeeId: 'e1', employeeName: 'Dr. Katarina Weiss', targetRole: 'VP of Autonomous Driving Engineering',
    type: 'rotation', title: 'US Regulatory Immersion — NHTSA & State DMV Engagement', duration: '8 weeks',
    priority: 'critical', gapAddressed: 'US regulatory experience',
    successMetrics: 'Lead 2 regulatory submissions; establish 3 NHTSA relationships',
    riskIfNotCompleted: 'Cannot effectively manage US autonomous vehicle certification pipeline',
  },
  {
    id: 'd2', employeeId: 'e1', employeeName: 'Dr. Katarina Weiss', targetRole: 'VP of Autonomous Driving Engineering',
    type: 'coaching', title: 'Executive Presence & Board Communication Program', duration: '12 weeks',
    priority: 'high', gapAddressed: 'Board-level presentation skills',
    successMetrics: 'Present at 2 Board committee meetings; positive feedback from 3 Board members',
    riskIfNotCompleted: 'Limited effectiveness in Board-level strategic advocacy',
  },
  {
    id: 'd3', employeeId: 'e2', employeeName: 'Marcus Chen', targetRole: 'Director of Battery Cell Innovation',
    type: 'mentorship', title: 'Patent Strategy Mentorship with Chief IP Counsel', duration: '16 weeks',
    priority: 'critical', gapAddressed: 'Patent portfolio management',
    successMetrics: 'Develop 3-year patent roadmap; file 2 strategic patents',
    riskIfNotCompleted: 'Unable to protect BMW competitive advantage in solid-state technology',
  },
  {
    id: 'd4', employeeId: 'e2', employeeName: 'Marcus Chen', targetRole: 'Director of Battery Cell Innovation',
    type: 'coaching', title: 'C-Suite Stakeholder Management Workshop', duration: '6 weeks',
    priority: 'high', gapAddressed: 'Executive stakeholder management',
    successMetrics: 'Lead 3 cross-functional steering committees; sponsor sign-off on development plan',
    riskIfNotCompleted: 'Difficulty navigating executive decision-making in high-stakes programs',
  },
  {
    id: 'd5', employeeId: 'e3', employeeName: 'Dr. Priya Sharma', targetRole: 'Head of AI/ML Platform',
    type: 'rotation', title: 'Manufacturing AI Rotation — Munich & Dingolfing Plants', duration: '10 weeks',
    priority: 'critical', gapAddressed: 'Manufacturing domain knowledge',
    successMetrics: 'Deploy 1 predictive maintenance model in production; reduce downtime by 5%',
    riskIfNotCompleted: 'AI platform strategy disconnected from core manufacturing needs',
  },
  {
    id: 'd6', employeeId: 'e3', employeeName: 'Dr. Priya Sharma', targetRole: 'Head of AI/ML Platform',
    type: 'project', title: 'Budget Ownership — AI Infrastructure Modernization (€65M)', duration: '6 months',
    priority: 'high', gapAddressed: 'Budget management >€50M',
    successMetrics: 'Deliver project on-budget; implement financial governance framework',
    riskIfNotCompleted: 'Unprepared for full P&L accountability of AI platform organization',
  },
  {
    id: 'd7', employeeId: 'e4', employeeName: 'Stefan Müller', targetRole: 'Chief Sustainability Officer',
    type: 'training', title: 'Global Supply Chain Carbon Accounting Certification', duration: '4 weeks',
    priority: 'high', gapAddressed: 'Global supply chain carbon accounting',
    successMetrics: 'Complete Scope 3 emissions baseline for top 50 suppliers',
    riskIfNotCompleted: 'CSRD reporting gaps in supply chain emissions disclosure',
  },
  {
    id: 'd8', employeeId: 'e4', employeeName: 'Stefan Müller', targetRole: 'Chief Sustainability Officer',
    type: 'coaching', title: 'Public ESG Communications & Media Training', duration: '6 weeks',
    priority: 'medium', gapAddressed: 'Public-facing ESG communications',
    successMetrics: 'Lead 2 external ESG presentations; positive media coverage',
    riskIfNotCompleted: 'Reduced effectiveness as public-facing sustainability leader',
  },
  {
    id: 'd9', employeeId: 'e5', employeeName: 'Liu Wei', targetRole: 'Regional President — Greater China',
    type: 'project', title: 'Full P&L Ownership — China EV Launch Program', duration: '6 months',
    priority: 'critical', gapAddressed: 'Full P&L ownership experience',
    successMetrics: 'Manage €3.2B launch budget; achieve 95% milestone delivery',
    riskIfNotCompleted: 'Not prepared for €15B+ regional P&L accountability',
  },
  {
    id: 'd10', employeeId: 'e6', employeeName: 'Anna Bergström', targetRole: 'VP of Connected Vehicle Services',
    type: 'rotation', title: 'IoT Infrastructure Deep Dive — BMW Cloud & Edge Computing', duration: '12 weeks',
    priority: 'critical', gapAddressed: 'IoT infrastructure depth',
    successMetrics: 'Architect connected vehicle data pipeline; reduce latency by 30%',
    riskIfNotCompleted: 'Cannot credibly lead IoT platform strategy at VP level',
  },
];

export const executiveDecisions: ExecutiveDecision[] = [
  {
    roleId: 'r1', roleTitle: 'VP of Autonomous Driving Engineering', department: 'R&D — Autonomous Vehicles',
    decision: 'internal promotion', primaryCandidate: 'Dr. Katarina Weiss',
    urgency: 'immediate', confidence: 91, keyRisk: 'US regulatory gap requires fast-track immersion',
    nextStep: 'Approve 8-week US regulatory rotation starting April 14; assign executive coach',
  },
  {
    roleId: 'r2', roleTitle: 'Director of Battery Cell Innovation', department: 'Neue Klasse — Electrification',
    decision: 'internal promotion', primaryCandidate: 'Marcus Chen',
    urgency: 'Q2 2026', confidence: 86, keyRisk: 'Patent strategy expertise needs accelerated development',
    nextStep: 'Initiate patent mentorship with Chief IP Counsel; schedule stakeholder introductions',
  },
  {
    roleId: 'r3', roleTitle: 'Head of AI/ML Platform', department: 'Digital & IT',
    decision: 'internal promotion', primaryCandidate: 'Dr. Priya Sharma',
    urgency: 'Q2 2026', confidence: 89, keyRisk: 'Manufacturing knowledge gap may slow cross-BU adoption',
    nextStep: 'Start manufacturing rotation at Dingolfing plant; assign €65M budget ownership',
  },
  {
    roleId: 'r4', roleTitle: 'Chief Sustainability Officer', department: 'Corporate Strategy',
    decision: 'internal promotion', primaryCandidate: 'Stefan Müller',
    urgency: 'Q2 2026', confidence: 88, keyRisk: 'Public communications readiness for investor scrutiny',
    nextStep: 'Enroll in media training program; schedule investor day dry run',
  },
  {
    roleId: 'r5', roleTitle: 'Regional President — Greater China', department: 'Sales & Marketing',
    decision: 'hybrid approach', primaryCandidate: 'Liu Wei',
    urgency: 'Q3 2026', confidence: 72, keyRisk: 'P&L readiness timeline vs. business urgency mismatch',
    nextStep: 'Engage executive search firm for interim candidates; assign Liu Wei to EV launch P&L',
  },
  {
    roleId: 'r6', roleTitle: 'VP of Connected Vehicle Services', department: 'Digital & IT',
    decision: 'external hire', primaryCandidate: undefined,
    urgency: 'Q3 2026', confidence: 65, keyRisk: 'Internal pipeline insufficient for IoT platform leadership',
    nextStep: 'Launch external search with Spencer Stuart; position Anna Bergström as deputy & successor',
  },
];

export const executiveSummary = {
  pipelineHealth: 78,
  totalForecastedRoles: 6,
  urgentRoles: 3,
  internalReady: 4,
  externalRequired: 1,
  hybridApproach: 1,
  topRisks: [
    'VP Autonomous Driving vacancy could delay iNEXT L4 by 6–9 months (€240M impact)',
    'Greater China leadership transition during critical EV market expansion',
    'Connected Vehicle Services has no ready internal successor',
  ],
  hiddenTalent: [
    'Dr. Priya Sharma — accelerating trajectory, cross-BU AI governance already built',
    'Anna Bergström — 140% subscription revenue growth, strong succession candidate',
    'Yuki Tanaka — early-career high potential, accelerating growth trajectory in battery R&D',
  ],
  analysisTimestamp: '2026-03-28T09:00:00Z',
};
