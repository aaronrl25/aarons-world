import photos from './photos.json';
export type MemoryKind = 'speaking' | 'hackathon' | 'community' | 'event' | 'off-duty';
export type Memory = { id: string; src: string; thumbnail: string; alt: string; width: number; height: number; kind: MemoryKind; title: string; story: string; place?: string };

const stories: Record<string, { kind: MemoryKind; title: string; story: string; place?: string }> = {
  'talent-land-speaking': { kind: 'speaking', title: 'On stage at Talent Land', story: 'Jalisco Talent Land 2024, Developer Land stage. Aaron spoke about nearshoring, staffing and where LATAM engineering talent goes next.', place: 'Guadalajara, Mexico' },
  'talent-land': { kind: 'speaking', title: 'Developer Land, before the talk', story: 'The Talent Land stage minutes before going on. Thousands of attendees, one microphone.', place: 'Guadalajara, Mexico' },
  'moment-01': { kind: 'speaking', title: 'Sharing ideas with the community', story: 'A room of developers, a slide deck and a live demo: the format Aaron used for his ChicagoJS talk on rapid React Native MVPs.', place: 'Chicago' },
  'moment-21': { kind: 'hackathon', title: 'Y Combinator, hackathon day', story: 'Outside YC with a teammate during the hackathon where Phoenix (Temper) was built.', place: 'San Francisco' },
  'moment-22': { kind: 'hackathon', title: 'The Y Combinator sign', story: 'The classic photo, taken after shipping a working demo inside the hackathon window.', place: 'San Francisco' },
  'moment-17': { kind: 'event', title: 'Data + AI Summit night at Oracle Park', story: 'Summit signs, a ballpark and the people who make conferences worth attending.', place: 'San Francisco' },
  'moment-19': { kind: 'community', title: 'A community gathering in the city', story: 'Builders in the park. Code & Coffee-style meetups are where Aaron organizes, mentors and recruits collaborators.', place: 'San Francisco' },
  'moment-20': { kind: 'community', title: 'Group photo outside the Amazon Spheres', story: 'A full crowd of developers in one frame, the kind of turnout that grew Chicago events past 200 attendees.', place: 'Seattle' },
  'moment-07': { kind: 'community', title: 'Building at a developer gathering', story: 'Laptops open, ideas traded. Community organizing looks like this most weekends.' },
  'moment-08': { kind: 'community', title: 'A GitHub event', story: 'Open source, meetups and the people who maintain the tools Aaron ships with every day.' },
  'moment-14': { kind: 'community', title: 'A quick selfie with fellow attendees', story: 'The network behind the résumé: engineers Aaron keeps meeting in Chicago and the Bay Area.' },
  'moment-06': { kind: 'event', title: 'NVIDIA GTC 2026', story: 'Outside GTC, where the AI-agent ideas behind LoopCFO and Grandma Mode got sharper.', place: 'San Jose' },
  'moment-05': { kind: 'event', title: 'Capital One private reception', story: 'Fintech conversations that later informed the AI Small Business CFO quest.' },
  'moment-10': { kind: 'event', title: 'Auth0 Camp AI group photo', story: 'Identity, agents and security: Camp AI with fellow builders.' },
  'moment-11': { kind: 'event', title: 'Connecting at Auth0 Camp AI', story: 'Same camp, new collaborators.' },
  'moment-16': { kind: 'event', title: 'At a Snowflake event', story: 'Data platforms, the other half of every AI product.' },
  'moment-18': { kind: 'event', title: 'Connecting at an AWS event', story: 'Cloud conversations for the enterprise side of the map.' },
  'moment-13': { kind: 'event', title: 'America Innovates stage', story: 'An innovation conference stage, the kind of room where the Talent Land nearshoring talk started taking shape.' },
  'moment-15': { kind: 'event', title: 'Exploring the conference floor', story: 'Mascots, demos and a lot of walking.' },
  'moment-04': { kind: 'event', title: 'A technology exhibition', story: 'Payments and platform booths on a conference floor.' },
  'moment-09': { kind: 'event', title: 'Conversations at a technology event', story: 'Headphones on the neck, as always.' },
  'moment-23': { kind: 'off-duty', title: 'Building the AI era, at the stadium', story: 'Matching “Building the AI Era” shirts and a football game. Off duty, mostly.' },
  'moment-02': { kind: 'off-duty', title: 'Evening by the Golden Gate', story: 'Chicago to San Francisco. Both cities are home base for the community work.', place: 'San Francisco' },
  'moment-03': { kind: 'off-duty', title: 'Golden Gate, daytime', story: 'The hoodie from the sprite sheets, in the real world.', place: 'San Francisco' },
  'moment-12': { kind: 'off-duty', title: 'Sunset on San Francisco Bay', story: 'A rare quiet moment on the water.', place: 'San Francisco' },
  'moment-24': { kind: 'off-duty', title: 'A portrait away from the keyboard', story: 'Blazer instead of hoodie, for once.' },
};

export const memories: Memory[] = photos.map((p) => ({ ...p, ...(stories[p.id] ?? { kind: 'event', title: p.alt, story: p.alt }) }));
export const memoryById = (id: string) => memories.find((m) => m.id === id);
export const kinds: { id: MemoryKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All memories' }, { id: 'speaking', label: 'Speaking' }, { id: 'hackathon', label: 'Hackathons' }, { id: 'community', label: 'Community' }, { id: 'event', label: 'Events' }, { id: 'off-duty', label: 'Off duty' },
];
