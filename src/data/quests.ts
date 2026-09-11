/** Project quests. Screenshots come from the captured sites in public/websites and public/apps. */
export type Quest = {
  id: string;
  name: string;
  codename: string;
  kind: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  mission: string;
  challenge: string;
  role: string;
  loadout: string[];
  architecture: string[];
  solution: string;
  results: string[];
  screenshots: { src: string; alt: string }[];
  links: { label: string; href: string; kind: 'live' | 'github' | 'store' }[];
  skills: string[];
  memory?: string;
  accent: string;
};

export const quests: Quest[] = [
  {
    id: 'phoenix',
    name: 'Phoenix',
    codename: 'Temper · the memory layer for AI coding tools',
    kind: 'Hackathon build · AI developer tools',
    difficulty: 4,
    mission: 'Stop teaching your AI the same things twice. Build a memory layer that learns how a developer works and carries those preferences into every AI coding session.',
    challenge: 'Hackathon time limits, a product that has to feel trustworthy from the first session, and preferences that must stay under the user’s control rather than silently changing the model’s behaviour.',
    role: 'Product engineer: concept, front-end, landing experience and the demo flow, built at a Y Combinator hackathon.',
    loadout: ['React', 'TypeScript', 'Node.js', 'Claude', 'Vercel'],
    architecture: ['Landing and onboarding web app deployed on Vercel', 'Preference signals captured from coding sessions and summarised into a portable memory profile', 'Memory injected into AI coding tools as context, with a review step so the user stays in control'],
    solution: 'A focused demo that shows the loop end to end: learn a style from a few signals, show the learned preferences, and replay them into a new session without re-prompting.',
    results: ['Working demo shipped inside the hackathon window', 'Live landing page still online', 'Fed directly into Aaron’s AI-assisted development workflow'],
    screenshots: [{ src: '/websites/ychackathon.vercel.app-1440.webp', alt: 'Temper landing page with the phoenix mascot' }],
    links: [{ label: 'Open the live demo', href: 'https://ychackathon.vercel.app/', kind: 'live' }],
    skills: ['claude', 'ai-agents', 'ai-assisted', 'react', 'typescript', 'nodejs'],
    memory: 'moment-21',
    accent: '#ff6a3d',
  },
  {
    id: 'lidia',
    name: 'Lidia',
    codename: 'Lidia Central · assistant app for Propia AI',
    kind: 'Mobile product · Google Play',
    difficulty: 3,
    mission: 'Ship a production Android app for Propia AI’s Lidia assistant, giving users a central place to talk to their AI on the go.',
    challenge: 'Conversational UI has to feel instant on real devices, handle spotty networks gracefully and pass Play Store review.',
    role: 'React Native engineer: app architecture, conversational screens, release pipeline.',
    loadout: ['React Native', 'Expo', 'TypeScript', 'REST APIs', 'Voice AI'],
    architecture: ['React Native client with a thin API layer over Propia’s assistant services', 'Optimistic message rendering with retry queues for weak connectivity', 'EAS builds and store release workflow'],
    solution: 'A lean chat-first app with resilient networking and a release pipeline that lets the team ship updates quickly.',
    results: ['Published on Google Play as Lidia Central', 'Reusable conversational UI patterns carried into later voice projects'],
    screenshots: [{ src: '/apps/lidia.webp', alt: 'Lidia Central on Google Play' }],
    links: [{ label: 'View on Google Play', href: 'https://play.google.com/store/apps/details?id=dev.propia.lidia', kind: 'store' }],
    skills: ['react-native', 'expo', 'android', 'voice-ai', 'rest'],
    accent: '#41d9ff',
  },
  {
    id: 'goaty',
    name: 'Goaty',
    codename: 'Learn anything through what you love',
    kind: 'AI learning product · web',
    difficulty: 4,
    mission: 'Turn any subject into a personalised adventure taught through the learner’s favourite hobbies: anime, sports, cooking, gaming and more.',
    challenge: 'Generated lessons must stay accurate while adapting to wildly different interests, and the experience needs game mechanics (levels, XP, streaks) that motivate without feeling childish.',
    role: 'Founder-engineer: product design, front-end, AI lesson pipeline and the mascot-driven UX.',
    loadout: ['React', 'TypeScript', 'Node.js', 'OpenAI', 'LangChain', 'Firebase'],
    architecture: ['Lesson generator that maps a subject onto a hobby-specific narrative', 'Progression system with levels, XP and streaks stored per learner', 'Responsive web app with a card-based learning flow'],
    solution: 'A learning loop where every lesson is rewritten in the language of something the learner already loves, with light RPG progression keeping them coming back.',
    results: ['Live product with a working demo', 'Reusable AI prompt and evaluation pipeline shared with the CFO quest'],
    screenshots: [{ src: '/websites/aaronr253.sg-host.com-1440.webp', alt: 'Goaty landing page' }],
    links: [{ label: 'Visit Goaty', href: 'https://aaronr253.sg-host.com/', kind: 'live' }],
    skills: ['openai', 'langchain', 'ai-agents', 'react', 'firebase', 'responsive'],
    accent: '#5ee0a6',
  },
  {
    id: 'loop-cfo',
    name: 'AI Small Business CFO',
    codename: 'LoopCFO · Clarity. Cash flow. Confidence.',
    kind: 'AI fintech product · web',
    difficulty: 5,
    mission: 'Give small-business owners AI-powered financial guidance so they make smarter decisions every day without needing an accounting degree.',
    challenge: 'Financial advice has to be explainable and cautious; the AI must reason over real cash-flow data and never invent numbers.',
    role: 'Founder-engineer: architecture, AI agent design, front-end and security model.',
    loadout: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Claude', 'LangChain', 'AI agents'],
    architecture: ['Cash-flow model built from the owner’s transactions', 'Agent that plans, checks its own numbers against the ledger and explains each recommendation', 'Dashboard with a smart-plan panel and cash-balance projections'],
    solution: 'An agentic CFO that reads the books, forecasts cash and answers questions with citations back to the data it used.',
    results: ['Live product page and demo', 'Established the agent-with-verification pattern Aaron now reuses in AI work'],
    screenshots: [{ src: '/websites/aaronr254.sg-host.com-1440.webp', alt: 'LoopCFO landing page' }],
    links: [{ label: 'Visit LoopCFO', href: 'https://aaronr254.sg-host.com/', kind: 'live' }],
    skills: ['claude', 'langchain', 'ai-agents', 'postgresql', 'nodejs', 'react'],
    accent: '#8bd450',
  },
  {
    id: 'grandma-mode',
    name: 'VoiceOS Accessibility Assistant',
    codename: 'Grandma Mode · your voice, your safety, your control',
    kind: 'Voice AI · accessibility',
    difficulty: 4,
    mission: 'Let people who struggle with small screens and confusing messages run their phone by voice, with a guardian that flags scams and checks before anything happens.',
    challenge: 'Voice has to be reliable for older users, safety checks must not become friction, and every action needs a clear confirmation.',
    role: 'Product engineer: voice pipeline, safety analysis flow, front-end.',
    loadout: ['React', 'TypeScript', 'Vapi', 'Voice AI', 'Claude', 'Node.js'],
    architecture: ['Voice agent built on Vapi for natural conversation', 'Safety analyser that scores incoming messages and explains why something looks suspicious', 'Confirmation layer before any outbound action'],
    solution: 'A calm, voice-first assistant that reads, explains and protects, designed for the people who usually get left behind by new technology.',
    results: ['Live product page and demo', 'Voice patterns reused across Aaron’s AI experiments'],
    screenshots: [{ src: '/websites/aaronr257.sg-host.com-1440.webp', alt: 'Grandma Mode landing page' }],
    links: [{ label: 'Visit Grandma Mode', href: 'https://aaronr257.sg-host.com/', kind: 'live' }],
    skills: ['vapi', 'voice-ai', 'claude', 'ai-agents', 'react'],
    accent: '#7fb8ff',
  },
  {
    id: 'rn-mvp-boilerplate',
    name: 'React Native MVP Boilerplate',
    codename: 'From Idea to App · the ChicagoJS starter',
    kind: 'Open source · React Native',
    difficulty: 2,
    mission: 'Give developers a hands-on starter that goes from idea to a working React Native MVP with authentication, navigation and live data.',
    challenge: 'Keep it small enough to understand in a talk, yet structured enough to grow into a real product.',
    role: 'Author and speaker. The repository accompanies Aaron’s ChicagoJS talk “From Idea to App: Rapid MVP Development in React Native”.',
    loadout: ['React Native', 'Expo', 'Firebase', 'TypeScript', 'React Navigation'],
    architecture: ['Expo project with feature folders', 'Firebase authentication and Firestore data layer', 'Movie explorer screens as the sample domain'],
    solution: 'A clone-and-go template that demonstrates the decisions that matter early: navigation, auth, data fetching and project structure.',
    results: ['Public repository on GitHub', 'Presented live at ChicagoJS'],
    screenshots: [],
    links: [{ label: 'Explore the repository', href: 'https://github.com/aaronrl25/mvpboilerplate', kind: 'github' }],
    skills: ['react-native', 'expo', 'firebase', 'public-speaking', 'mobile-arch'],
    memory: 'moment-01',
    accent: '#ff8a7a',
  },
];
