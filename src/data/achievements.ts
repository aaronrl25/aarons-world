export type Achievement = { id: string; title: string; detail: string; icon: 'years' | 'rn' | 'walmart' | 'ibm' | 'mic' | 'trophy' | 'hammer' | 'coffee' | 'crowd' | 'map'; memory?: string; link?: string; rarity: 'legendary' | 'epic' | 'rare' };
export const achievements: Achievement[] = [
  { id: 'ten-years', title: '10+ Years of Software Engineering', detail: 'From React with Flux at Lonewolf in 2015 to Staff engineer at Walmart in 2026.', icon: 'years', rarity: 'legendary', link: '/recruiter' },
  { id: 'eight-rn', title: '8 Years of Front End', detail: 'Enterprise, startup and founder work on one platform, from Roambee in 2017 to Seller Center today.', icon: 'rn', rarity: 'legendary', link: '/skills' },
  { id: 'walmart', title: 'Walmart', detail: 'Four campaigns: Store Assist, Receiving, Warehouse Management and Seller Center.', icon: 'walmart', rarity: 'epic', link: '/world/walmart-citadel' },
  { id: 'ibm', title: 'IBM', detail: 'Senior engineer on the American Electric Power field operations platform.', icon: 'ibm', rarity: 'epic', link: '/world/ibm-power-grid' },
  { id: 'chicagojs', title: 'ChicagoJS Speaker', detail: '“From Idea to App: Rapid MVP Development in React Native.”', icon: 'mic', rarity: 'rare', memory: 'moment-01', link: '/quests/rn-mvp-boilerplate' },
  { id: 'talent-land', title: 'Talent Land Speaker', detail: 'Jalisco Talent Land 2024: nearshoring, staffing and the future of LATAM engineering talent.', icon: 'mic', rarity: 'rare', memory: 'talent-land-speaking' },
  { id: 'ggj', title: 'Global Game Jam Winner', detail: 'A winning jam build, years before the sprite sheets on this site.', icon: 'trophy', rarity: 'epic' },
  { id: 'hackathons', title: 'Hackathon Builder', detail: 'Five hackathon wins, Cyber Jam 2024 mentor, and the Phoenix build at a Y Combinator hackathon.', icon: 'hammer', rarity: 'epic', memory: 'moment-22', link: '/quests/phoenix' },
  { id: 'cc-chicago', title: 'Code & Coffee Chicago Organizer', detail: 'Co-organizer of the Chicago chapter of a community spanning 40+ cities and 75,000+ members.', icon: 'coffee', rarity: 'rare', memory: 'moment-19' },
  { id: 'cc-sf', title: 'Code & Coffee San Francisco Organizer', detail: 'Bringing the same builder energy to the Bay Area.', icon: 'coffee', rarity: 'rare', memory: 'moment-20' },
  { id: 'two-hundred', title: '200+ Attendee Events', detail: 'Helped grow Chicago events to more than 200 monthly attendees.', icon: 'crowd', rarity: 'rare', memory: 'moment-07' },
  { id: 'us-mx', title: 'Builder Across the United States and Mexico', detail: 'Chicago, San Francisco, Puebla and Guadalajara: products and communities on both sides of the border.', icon: 'map', rarity: 'epic', memory: 'moment-03' },
];
