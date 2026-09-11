/** The five realms of Aaron's world. Every fact comes from his résumé; the lore is only the wrapper. */
export type Chamber = { name: string; detail: string };
export type Role = { title: string; product: string; dates: string; bullets: string[] };
export type Location = {
  id: string;
  name: string;
  realm: string;
  era: string;
  tagline: string;
  lore: string;
  icon: 'citadel' | 'grid' | 'tower' | 'hive' | 'forge';
  accent: string;
  map: { x: number; y: number };
  roles: Role[];
  chambers: Chamber[];
  stack: string[];
  apps: string[];
  stats: { value: string; label: string }[];
  enterPose: string;
  climbStep: number;
};

export const locations: Location[] = [
  {
    id: 'walmart-citadel',
    name: 'Walmart Citadel',
    realm: 'Retail Sector',
    era: '2021 – 2026 · four campaigns',
    tagline: 'Enterprise mobile at the scale of half a million associates.',
    lore: 'The biggest world on the chart. I came back four times, and each time I left something standing: micro-frontends, shared component libraries, testing infrastructure and the monitoring that keeps the citadel up at night.',
    icon: 'citadel',
    accent: '#7fb8ff',
    map: { x: 1120, y: 300 },
    roles: [
      { title: 'Staff Software Engineer', product: 'Seller Center · Marketplace Platform', dates: 'Jan 2026 – Apr 2026', bullets: [
        'Spearheaded React Native and React front-end development for Seller Center, the marketplace platform behind billions in annual GMV.',
        'Set component architecture standards and code review protocols for a cross-functional squad of 6+ engineers.',
        'Established shared component libraries and mobile performance profiling protocols adopted across 3 product teams.' ] },
      { title: 'Software Engineer II', product: 'Warehouse Management System', dates: 'Aug 2024 – Feb 2025', bullets: [
        'Delivered iOS and Android features for the warehouse management system serving 500K+ daily active store associates.',
        'Designed Jest and React Testing Library infrastructure, lifting coverage to 80%+ and cutting production regressions by 35%.',
        'Optimized app load time by 40% through bundle optimization, image caching, FlatList virtualization and request batching.',
        'Instrumented Dynatrace across 3 mobile apps, cutting MTTR by 50% on critical incidents.' ] },
      { title: 'Software Engineer', product: 'Receiving 1.0 & 2.0', dates: 'Nov 2022 – Jan 2024', bullets: [
        'Built the Receiving inventory apps used by 1,000+ associates daily across hundreds of stores.',
        'Designed a modular React Native component system shared across 3 warehouse apps, cutting duplicate code by 40%.',
        'Implemented real-time sync between React Native clients and Walmart’s SAP backend with sub-second latency.',
        'Sustained 99.9% crash-free sessions on iOS and Android using Dynatrace session replay and crash analytics.' ] },
      { title: 'Full Stack Engineer', product: 'Store Assist · Fulfillment as a Service', dates: 'Nov 2021 – Oct 2022', bullets: [
        'Delivered curbside pickup, order management and associate workflows for Store Assist while leading a team of 5 engineers.',
        'Implemented Electrode Native micro-frontends so React Native modules embed in existing native apps, cutting integration time by 60%.',
        'Contributed reusable components and performance-tuned modules to Spark Driver and Dispense.' ] },
    ],
    chambers: [
      { name: 'Marketplace & Seller Center', detail: 'Front-end architecture for the seller platform behind billions in GMV.' },
      { name: 'Biz Customer Hub', detail: 'Business-customer experiences in the Walmart Business app.' },
      { name: 'Store Assist', detail: 'Curbside pickup, order management and associate workflows (FaaS).' },
      { name: 'Spark Driver', detail: 'Reusable, performance-optimized modules for the gig delivery platform.' },
      { name: 'Receiving 1.0 & 2.0', detail: 'Inventory apps with real-time SAP sync used by 1,000+ associates a day.' },
      { name: 'Electrode Native Gate', detail: 'Micro-frontend architecture embedding React Native into native apps.' },
      { name: 'Testing Armory', detail: 'Jest and React Testing Library infrastructure at 80%+ coverage.' },
      { name: 'Performance Workshop', detail: 'Bundle, image cache, virtualization and batching work worth a 40% faster load.' },
      { name: 'Dynatrace Watchtower', detail: 'Crash analytics, session replay and dashboards that halved MTTR.' },
    ],
    stack: ['React Native', 'React', 'TypeScript', 'Electrode Native', 'Redux', 'Jest', 'React Testing Library', 'Dynatrace', 'SAP integration'],
    apps: ['mywalmart', 'spark-driver', 'walmart-seller', 'walmart-business'],
    stats: [ { value: '500K+', label: 'daily active associates served' }, { value: '40%', label: 'faster app load' }, { value: '50%', label: 'lower MTTR with Dynatrace' }, { value: '4', label: 'campaigns at the citadel' } ],
    enterPose: 'jumping/leap-forward',
    climbStep: 4,
  },
  {
    id: 'ibm-power-grid',
    name: 'IBM Power Grid',
    realm: 'Utility Nebula',
    era: 'Mar 2025 – Jan 2026',
    tagline: 'Field operations for thousands of utility technicians.',
    lore: 'A lattice of pylons humming with microservices. I wired React and React Native fronts to Java Spring Boot services here, and tamed a transmission checklist ten thousand rows long.',
    icon: 'grid',
    accent: '#41d9ff',
    map: { x: 760, y: 190 },
    roles: [
      { title: 'Senior Software Engineer', product: 'IBM / American Electric Power · Enterprise Field Operations', dates: 'Mar 2025 – Jan 2026', bullets: [
        'Developed React and React Native front-ends for AEP’s field operations platform, integrating 10+ microservice APIs and complex data-entry workflows used by thousands of technicians nationwide.',
        'Improved application load time by 40% through React.memo, lazy loading, code splitting and Redux state refactoring.',
        'Instrumented Dynatrace APM with crash analytics, session replay and performance dashboards, reducing MTTR by 50% on P1 incidents.' ] },
    ],
    chambers: [
      { name: 'React & React Native Front', detail: 'Shared web and mobile surfaces for field technicians.' },
      { name: 'Spring Boot Substation', detail: 'Java Spring Boot enterprise microservices, 10+ APIs integrated.' },
      { name: 'The Long Forms', detail: 'Complex, validated data-entry workflows that must survive spotty field connectivity.' },
      { name: '10,000-Row Checklist', detail: 'A transmission checklist rendered and edited at scale without freezing the UI.' },
      { name: 'Performance Monitoring', detail: 'Dynatrace dashboards, session replay and crash analytics.' },
    ],
    stack: ['React', 'React Native', 'Java Spring Boot', 'Microservices', 'Redux', 'Dynatrace', 'TypeScript'],
    apps: ['aep-ohio'],
    stats: [ { value: '10,000', label: 'row transmission checklist' }, { value: '10+', label: 'microservice APIs integrated' }, { value: '40%', label: 'faster load time' }, { value: '50%', label: 'lower P1 MTTR' } ],
    enterPose: 'code-power/beam',
    climbStep: 5,
  },
  {
    id: 'hcsc-signal-tower',
    name: 'HCSC Signal Tower',
    realm: 'Care Orbit',
    era: 'Feb 2024 – Jun 2024',
    tagline: 'Real-time healthcare for a million members.',
    lore: 'A tower that never stops transmitting. I led HCSC Mobile 2.0, streaming high volumes of messages over WebSockets to more than a million Illinois members.',
    icon: 'tower',
    accent: '#5ee0a6',
    map: { x: 470, y: 330 },
    roles: [
      { title: 'React Native Engineer (Lead)', product: 'Infosys / HCSC · HCSC Mobile 2.0', dates: 'Feb 2024 – Jun 2024', bullets: [
        'Led React Native development of HCSC Mobile 2.0, a healthcare management app serving 1M+ Illinois members; drove architecture, sprint planning and delivery across hybrid distributed teams.',
        'Mentored 4 engineers in React Native, Redux Saga and mobile best practices; structured PR review and pairing improved team velocity by 25%.',
        'Established Jest unit testing standards, lifting coverage from 45% to 85% and enabling confident continuous deployment.' ] },
    ],
    chambers: [
      { name: 'Signal Room', detail: 'WebSockets and real-time communication between members and care teams.' },
      { name: 'Message Floodgates', detail: 'High-volume message processing kept smooth on mid-range devices.' },
      { name: 'Zustand Vault', detail: 'Lean, predictable state for the real-time surfaces.' },
      { name: 'Mentor’s Balcony', detail: 'Four engineers coached in React Native and Redux Saga.' },
    ],
    stack: ['React Native', 'Zustand', 'Redux Saga', 'WebSockets', 'Jest', 'TypeScript'],
    apps: ['bcbsil'],
    stats: [ { value: '1M+', label: 'members served' }, { value: '45→85%', label: 'test coverage' }, { value: '25%', label: 'team velocity gain' }, { value: '4', label: 'engineers mentored' } ],
    enterPose: 'code-power/tap',
    climbStep: 3,
  },
  {
    id: 'roambee-hive',
    name: 'Roambee Hive',
    realm: 'Sensor Belt',
    era: 'Jun 2017 – Oct 2018',
    tagline: 'IoT asset tracking, in the pocket.',
    lore: 'A hexagonal hive buzzing with sensors. I built the Mobile as Bee app that let logistics teams watch their shipments move in real time, and made the bees last longer on a charge.',
    icon: 'hive',
    accent: '#ffb347',
    map: { x: 300, y: 620 },
    roles: [
      { title: 'Software Engineer', product: 'Roambee · IoT logistics startup', dates: 'Jun 2017 – Oct 2018', bullets: [
        'Built the Mobile as Bee iOS/Android app with React Native and Firebase on a Node.js RESTful backend, delivering real-time IoT asset tracking for enterprise logistics clients.',
        'Spearheaded an iOS codebase refactoring initiative that improved stability and cut crash rates by 60%.' ] },
    ],
    chambers: [
      { name: 'Tracking Comb', detail: 'Live location of tagged shipments and assets.' },
      { name: 'Firebase Nectar', detail: 'Real-time data with Firebase and a Node.js REST backend.' },
      { name: 'Battery Cells', detail: 'Battery optimization for devices that report from the road.' },
      { name: 'iOS & Android Wings', detail: 'One React Native codebase, two native platforms.' },
    ],
    stack: ['React Native', 'Firebase', 'Node.js', 'iOS', 'Android', 'IoT'],
    apps: [],
    stats: [ { value: '60%', label: 'lower crash rate after refactor' }, { value: 'iOS + Android', label: 'from one codebase' }, { value: 'Real-time', label: 'IoT asset tracking' } ],
    enterPose: 'crouching/sneak',
    climbStep: 2,
  },
  {
    id: 'eurybia-forge',
    name: 'Eurybia Forge',
    realm: 'Founders’ Belt',
    era: '2015 – 2021 · the early years',
    tagline: 'Where products were built from zero.',
    lore: 'Where I learned to ship. First as a front-end developer at Lonewolf, then as co-founder of Eurybia Studio, hammering out delivery systems, restaurant tech and e-commerce for paying customers.',
    icon: 'forge',
    accent: '#ff6a3d',
    map: { x: 620, y: 760 },
    roles: [
      { title: 'Lead Engineer & Co-Founder', product: 'Eurybia Studio', dates: 'Oct 2018 – Nov 2021', bullets: [
        'Co-founded Eurybia Studio; delivered 0-to-1 React Native and React web applications across restaurant tech, on-demand delivery and e-commerce.',
        'Built a contactless QR digital menu platform deployed at 50+ restaurants during COVID-19, with sub-500ms QR decode on a Firebase real-time backend.',
        'Developed an end-to-end React Native gas delivery tracking app with Node.js/Express backend, scaling to 300+ daily deliveries with live driver location and ETA.' ] },
      { title: 'Front-End Developer', product: 'Lonewolf · web & game startup', dates: 'Aug 2015 – Jun 2017', bullets: [
        'Built responsive single-page applications in React with Flux architecture; developed React Native admin screens and reusable component libraries.' ] },
    ],
    chambers: [
      { name: 'Expo Anvil', detail: 'Fast React Native builds with Expo for small teams.' },
      { name: 'Ionic & Angular Bellows', detail: 'Hybrid apps before React Native became the default.' },
      { name: 'Firebase Furnace', detail: 'Auth, Firestore and cloud functions as the backend for everything.' },
      { name: 'Delivery Systems', detail: 'Gas delivery tracking with live drivers and ETAs, 300+ deliveries a day.' },
      { name: 'Restaurant Tech', detail: 'QR digital menus in 50+ restaurants during the pandemic.' },
    ],
    stack: ['Expo', 'React Native', 'Ionic', 'Angular', 'React', 'Firebase', 'Node.js', 'Express'],
    apps: [],
    stats: [ { value: '50+', label: 'restaurants on the QR menu platform' }, { value: '300+', label: 'daily deliveries tracked' }, { value: '<500ms', label: 'QR decode time' }, { value: '0→1', label: 'products shipped' } ],
    enterPose: 'code-power/orb',
    climbStep: 1,
  },
];

/** Non-career zones that also live on the map. */
export type Zone = { id: string; name: string; description: string; route: string; map: { x: number; y: number }; icon: 'quests' | 'skills' | 'hall' | 'vault' | 'portal' };
export const zones: Zone[] = [
  { id: 'quests', name: 'Quest Board', description: 'Six side projects, from hackathon builds to AI products.', route: '/quests', map: { x: 940, y: 560 }, icon: 'quests' },
  { id: 'skills', name: 'Skill Tree', description: 'Five branches, thirty-five skills, eight years of front end.', route: '/skills', map: { x: 1330, y: 640 }, icon: 'skills' },
  { id: 'hall', name: 'Hall of Achievements', description: 'Twelve trophies from a decade of building and organizing.', route: '/achievements', map: { x: 1380, y: 130 }, icon: 'hall' },
  { id: 'vault', name: 'Memory Vault', description: 'Collectible moments: talks, hackathons, community and off duty.', route: '/memories', map: { x: 160, y: 200 }, icon: 'vault' },
  { id: 'portal', name: 'Contact Portal', description: 'Open a channel to Aaron.', route: '/contact', map: { x: 1250, y: 860 }, icon: 'portal' },
];

/** Career timeline in chronological order for the climbing sequence. */
export const timeline = [
  { year: '2015', title: 'Front-End Developer', where: 'Lonewolf', location: 'eurybia-forge' },
  { year: '2017', title: 'Software Engineer', where: 'Roambee', location: 'roambee-hive' },
  { year: '2018', title: 'Lead Engineer & Co-Founder', where: 'Eurybia Studio', location: 'eurybia-forge' },
  { year: '2021', title: 'Full Stack Engineer', where: 'Walmart · Store Assist', location: 'walmart-citadel' },
  { year: '2022', title: 'Software Engineer', where: 'Walmart · Receiving', location: 'walmart-citadel' },
  { year: '2024', title: 'React Native Engineer (Lead)', where: 'HCSC Mobile 2.0', location: 'hcsc-signal-tower' },
  { year: '2024', title: 'Software Engineer II', where: 'Walmart · Warehouse Management', location: 'walmart-citadel' },
  { year: '2025', title: 'Senior Software Engineer', where: 'IBM / American Electric Power', location: 'ibm-power-grid' },
  { year: '2026', title: 'Staff Software Engineer', where: 'Walmart · Seller Center', location: 'walmart-citadel' },
];

/** Stars scattered along the warp lanes. Running over one collects it and reveals a fact. Every fact comes from the realms above. */
export type Collectible = { id: string; x: number; y: number; fact: string };
export const collectibles: Collectible[] = [
  { id: 'star-01', x: 470, y: 705, fact: 'Roambee: one React Native codebase, shipped to both iOS and Android.' },
  { id: 'star-02', x: 350, y: 470, fact: 'HCSC: four engineers coached in React Native and Redux Saga.' },
  { id: 'star-03', x: 600, y: 245, fact: 'IBM: a 10,000-row transmission checklist rendered and edited without freezing the UI.' },
  { id: 'star-04', x: 950, y: 225, fact: 'Walmart: 40% faster app load after the performance workshop.' },
  { id: 'star-05', x: 1260, y: 205, fact: 'Walmart: Dynatrace crash analytics and dashboards that halved MTTR.' },
  { id: 'star-06', x: 790, y: 665, fact: 'Eurybia: QR digital menus in 50+ restaurants during the pandemic.' },
  { id: 'star-07', x: 1040, y: 445, fact: 'Walmart: apps serving 500K+ daily active associates.' },
  { id: 'star-08', x: 1145, y: 610, fact: 'Skill tree: five branches, thirty-five skills, eight years of front end.' },
  { id: 'star-09', x: 1300, y: 760, fact: 'Chicago, San Francisco, Puebla, Guadalajara: products and communities on both sides of the border.' },
  { id: 'star-10', x: 300, y: 265, fact: 'Code & Coffee Chicago: co-organizer of events with 200+ monthly attendees.' },
  { id: 'star-11', x: 1235, y: 455, fact: 'Four campaigns at Walmart: Store Assist, Receiving, Warehouse Management, Seller Center.' },
  { id: 'star-12', x: 720, y: 885, fact: 'Eurybia: gas delivery tracking with live drivers and ETAs, 300+ deliveries a day.' },
];
