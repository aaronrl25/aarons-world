export type Skill = { id: string; name: string; level: number; years?: string; note?: string; links: string[] };
export type Branch = { id: string; name: string; tagline: string; accent: string; pose: string; skills: Skill[] };

/** links reference quest ids (quests.ts) or location ids (world.ts). */
export const branches: Branch[] = [
  { id: 'mobile', name: 'Mobile Engineering', tagline: 'The main branch. Eight years of front end.', accent: '#41d9ff', pose: 'idle/point-up-right', skills: [
    { id: 'react-native', name: 'React Native', level: 5, years: '8 years', note: 'Expo, EAS, bare workflow, native module bridging', links: ['walmart-citadel', 'ibm-power-grid', 'hcsc-signal-tower', 'roambee-hive', 'lidia', 'rn-mvp-boilerplate'] },
    { id: 'expo', name: 'Expo', level: 5, note: 'Expo SDK, EAS Build and Update', links: ['eurybia-forge', 'lidia', 'rn-mvp-boilerplate'] },
    { id: 'electrode', name: 'Electrode Native', level: 4, note: 'Micro-frontends inside native apps at Walmart', links: ['walmart-citadel'] },
    { id: 'ios', name: 'iOS', level: 4, links: ['walmart-citadel', 'roambee-hive'] },
    { id: 'android', name: 'Android', level: 4, links: ['walmart-citadel', 'roambee-hive', 'lidia'] },
    { id: 'ionic', name: 'Ionic', level: 3, links: ['eurybia-forge'] },
    { id: 'cordova', name: 'Cordova', level: 3, links: ['eurybia-forge'] },
  ] },
  { id: 'frontend', name: 'Frontend', tagline: 'Interfaces that stay fast under real load.', accent: '#5ee0a6', pose: 'code-power/tap', skills: [
    { id: 'react', name: 'React', level: 5, years: '10 years', links: ['walmart-citadel', 'ibm-power-grid', 'phoenix', 'goaty', 'loop-cfo'] },
    { id: 'typescript', name: 'TypeScript', level: 5, links: ['walmart-citadel', 'ibm-power-grid', 'loop-cfo'] },
    { id: 'javascript', name: 'JavaScript', level: 5, years: '10+ years', links: ['eurybia-forge'] },
    { id: 'redux', name: 'Redux', level: 5, links: ['ibm-power-grid', 'walmart-citadel'] },
    { id: 'redux-saga', name: 'Redux Saga', level: 4, links: ['hcsc-signal-tower'] },
    { id: 'zustand', name: 'Zustand', level: 4, links: ['hcsc-signal-tower'] },
    { id: 'responsive', name: 'Responsive UI', level: 5, links: ['goaty', 'eurybia-forge'] },
    { id: 'performance', name: 'Performance optimization', level: 5, note: '40% faster loads at Walmart and AEP', links: ['walmart-citadel', 'ibm-power-grid'] },
  ] },
  { id: 'backend', name: 'Backend & Data', tagline: 'Enough backend to ship the whole product.', accent: '#ffb347', pose: 'code-power/orb', skills: [
    { id: 'nodejs', name: 'Node.js', level: 4, links: ['roambee-hive', 'eurybia-forge', 'loop-cfo'] },
    { id: 'express', name: 'Express', level: 4, links: ['eurybia-forge'] },
    { id: 'firebase', name: 'Firebase', level: 5, note: 'Auth, Firestore, Cloud Functions, FCM', links: ['roambee-hive', 'eurybia-forge', 'goaty', 'rn-mvp-boilerplate'] },
    { id: 'firestore', name: 'Firestore', level: 5, links: ['eurybia-forge', 'goaty'] },
    { id: 'postgresql', name: 'PostgreSQL', level: 3, links: ['loop-cfo'] },
    { id: 'mongodb', name: 'MongoDB', level: 3, links: ['eurybia-forge'] },
    { id: 'rest', name: 'REST APIs', level: 5, links: ['ibm-power-grid', 'lidia'] },
    { id: 'websockets', name: 'WebSockets', level: 4, links: ['hcsc-signal-tower'] },
  ] },
  { id: 'ai', name: 'AI Engineering', tagline: 'Agents that check their own work.', accent: '#ff6a3d', pose: 'code-power/burst', skills: [
    { id: 'claude', name: 'Claude', level: 5, links: ['phoenix', 'loop-cfo', 'grandma-mode'] },
    { id: 'openai', name: 'OpenAI', level: 4, links: ['goaty'] },
    { id: 'langchain', name: 'LangChain', level: 4, links: ['goaty', 'loop-cfo'] },
    { id: 'vapi', name: 'Vapi', level: 4, links: ['grandma-mode'] },
    { id: 'voice-ai', name: 'Voice AI', level: 4, links: ['grandma-mode', 'lidia'] },
    { id: 'ai-agents', name: 'AI agents', level: 4, links: ['loop-cfo', 'goaty', 'phoenix'] },
    { id: 'ai-assisted', name: 'AI-assisted development', level: 5, note: 'Claude and Cursor in daily enterprise delivery', links: ['phoenix', 'walmart-citadel'] },
  ] },
  { id: 'leadership', name: 'Leadership', tagline: 'Architecture, mentorship and the community around it.', accent: '#ff8a7a', pose: 'idle/wave', skills: [
    { id: 'frontend-arch', name: 'Frontend architecture', level: 5, links: ['walmart-citadel', 'ibm-power-grid'] },
    { id: 'mobile-arch', name: 'Mobile architecture', level: 5, links: ['walmart-citadel', 'hcsc-signal-tower', 'rn-mvp-boilerplate'] },
    { id: 'mentorship', name: 'Engineering mentorship', level: 5, note: 'Teams of 4 to 6 engineers', links: ['hcsc-signal-tower', 'walmart-citadel'] },
    { id: 'testing', name: 'Testing strategy', level: 5, note: 'Jest, Detox, RTL, 80%+ coverage', links: ['walmart-citadel', 'hcsc-signal-tower'] },
    { id: 'dynatrace', name: 'Dynatrace', level: 4, links: ['walmart-citadel', 'ibm-power-grid'] },
    { id: 'public-speaking', name: 'Public speaking', level: 4, note: 'ChicagoJS, Jalisco Talent Land', links: ['rn-mvp-boilerplate'] },
    { id: 'community', name: 'Community organization', level: 5, note: 'Code & Coffee Chicago and San Francisco', links: [] },
  ] },
];
