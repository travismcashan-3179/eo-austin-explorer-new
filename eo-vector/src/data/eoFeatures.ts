export type EOFeature = {
  name: string;
  category: 'CONNECT' | 'LEARN' | 'GROW';
  description: string;
  format: string;
  cost: string;
  details?: string;
};

export const eoFeatures: EOFeature[] = [
  // CONNECT
  {
    name: 'Forum',
    category: 'CONNECT',
    description: 'Confidential peer group of 6-10 entrepreneurs meeting monthly to share business and life challenges.',
    format: 'Monthly, 4-hour meeting + annual retreat',
    cost: 'Included',
    details: `What it is: A confidential "board of advisors" of 6-10 entrepreneurs who meet monthly to share 5%‑level business and life challenges.
Why it matters: Consistently EO's #1‑rated benefit (91/100). Members credit Forum with accelerated decision‑making, deeper relationships, and personal transformation.
Key elements:
  • Monthly 4‑hour meeting + annual retreat
  • Structured agenda: updates, presentation, experience share, goal setting
  • Strict confidentiality & no advice‑giving (experience only)
Time commitment: ≈55 hrs / year
Eligibility: All EO members post‑Forum Training
Cost: Included (retreat costs vary)
Forum Types:
  • Chapter Forum – local chapter placement
  • Industry Forum – multi‑chapter, sector‑specific
  • Bridge Forum – cross‑country virtual w/ quarterly in‑person
  • Experience Forum – custom topic or format
  • SLP & Key Executive Forums – for spouses / senior staff (user‑pay workshops)`
  },
  {
    name: 'Forum Training (FTP)',
    category: 'CONNECT',
    description: 'Eight-hour onboarding workshop covering Forum mindset, confidentiality, and facilitation.',
    format: '8-hour onboarding',
    cost: 'Included',
    details: `What it is: Eight-hour mandatory workshop covering Forum mindset, confidentiality, 5% reflections, Gestalt protocol, and safe-space facilitation.
Frequency: Multiple sessions per year per chapter
Format: In-person or virtual; led by certified Forum Trainer
Outcome: Certification for Forum placement.`
  },
  {
    name: 'Forum Workshops',
    category: 'CONNECT',
    description: 'Short, topic-specific boosters for existing Forums.',
    format: '4-8 hr boosters',
    cost: 'Optional (chapter)',
    details: `What it is: Shorter, topic-specific boosters for existing Forums. Offerings include Forum Next Level, Health, Leadership, and bespoke deep-dives.
Duration: 4–8 hours
Cost: Trainer + venue (chapter-funded or user-pay)
Ideal for: Forums needing refresh, conflict resolution, or advanced skills.`
  },
  {
    name: 'Forum Moderator Journey',
    category: 'CONNECT',
    description: 'Multi-step leadership path for Forum moderators.',
    format: 'Multi-step',
    cost: 'Included',
    details: `What it is: Four-stage learning path: FTP → Moderator Practicum → Moderator Summit → Regional/Global Forum Leadership. Builds facilitation, coaching, and leadership capacity.`
  },
  {
    name: 'EO Communities',
    category: 'CONNECT',
    description: 'Purpose-driven cohorts overlaying Forum/Chapter structure (Women, Under 35, DealExchange, Industries).',
    format: 'Summits, roundtables, curated sessions, online',
    cost: 'Included',
    details: `What it is: Purpose-driven cohorts that overlay the Forum/Chapter structure.
Current communities: Women, Under 35, DealExchange, Industries (16 sub-groups)
Activities: Summits, roundtables, curated sessions at GLC, online discussions
Join: Opt-in via EO Hub (included); event fees vary.`
  },
  {
    name: 'MyEO Groups',
    category: 'CONNECT',
    description: 'Member-created interest groups (500+).',
    format: 'Ongoing',
    cost: 'Included',
    details: `What it is: Member-created interest groups (500+). Anything from pickleball to AI ethics.
Start or join via ConnectEO platform
Cost: Free; Premier Group Summits user-pay.`
  },
  {
    name: 'MyEO Events',
    category: 'CONNECT',
    description: 'Member-hosted adventures and experiences.',
    format: 'One-off',
    cost: 'Optional (user-pay)',
    details: `What it is: One-off experiences planned by members (local dinners to Kilimanjaro climbs).
Who can attend: Members, SLPs, adult kids, guests
Cost: User-pay per event.`
  },
  {
    name: 'Chapter Events',
    category: 'CONNECT',
    description: 'Local learning and social gatherings.',
    format: 'Monthly',
    cost: 'Included',
    details: `What it is: Monthly learning or social gatherings run by each chapter's Learning Chair. Speakers, workshops, socials.
Cost: Included (meal/venue small fee may apply).`
  },
  {
    name: 'Regional Events',
    category: 'CONNECT',
    description: 'Multi-chapter conferences.',
    format: 'Periodic',
    cost: 'Optional (user-pay)',
    details: `What it is: Larger multi-chapter conferences featuring keynotes, learning tracks, family programs.
Cost: Ticket + travel cost.`
  },
  {
    name: 'EO Universities',
    category: 'CONNECT',
    description: '4-day global summits blending keynote learning and cultural experiences.',
    format: 'Annual',
    cost: 'Optional',
    details: `What it is: Flagship 4-day global summit blending keynote learning and cultural experiences. Rotates cities annually (e.g., London, Cascais, San Francisco).
Attendance: 75–500 attendees
Fee: US$3.5–5k.`
  },
  {
    name: 'EO Explorations',
    category: 'CONNECT',
    description: 'Immersive travel and learning expeditions.',
    format: '4-7 days',
    cost: 'Optional',
    details: `What it is: 75–100-member expeditions (e.g., Iceland, Kenya). 4–7 days, US$5.5–9k. High-access, immersive travel + learning.`
  },
  {
    name: 'New Member Event Voucher',
    category: 'CONNECT',
    description: 'US$750 credit for new members to apply to events.',
    format: 'Voucher',
    cost: 'Included',
    details: `What it is: US$750 voucher for members who joined July 2022 onward. Valid 24 months. Apply to Universities, Explorations, Executive Education Year 1, etc.`
  },
  {
    name: 'EO Bold',
    category: 'CONNECT',
    description: 'A division within EO Austin for entrepreneurs with $10M+ in annual revenue or a $10M+ exit in the last 7 years.',
    format: 'Peer group, ongoing',
    cost: 'Included (for eligible members)',
    details: `What it is: EO Bold is a division within EO Austin for entrepreneurs whose company has achieved $10M+ in annual revenue or had a $10M+ exit in the last 7 years.
Who it's for: Entrepreneurs at $10M+ scale or with a recent $10M+ exit.
Key elements:
  • Peer group of high-performing entrepreneurs
  • Experience sharing and mentorship
  • Wisdom and leadership for the entire chapter
  • Special events and learning opportunities
Contact: Reach out to EO Austin leadership for more information.`
  },
  // LEARN
  {
    name: 'EO Learning Platform',
    category: 'LEARN',
    description: 'On-demand LMS with hundreds of keynotes, webinars, and courses.',
    format: 'Online',
    cost: 'Included',
    details: `What it is: On-demand LMS hosting hundreds of past keynotes, webinars, and courses. Accessible via EO Hub.`
  },
  {
    name: 'Powerhouse Speaker Series',
    category: 'LEARN',
    description: 'Quarterly live virtual firesides with icons.',
    format: 'Quarterly, 1-hr webcast',
    cost: 'Included',
    details: `What it is: Quarterly live virtual firesides with icons (e.g., Brené Brown, Richard Branson). 1 hr w/ Q&A. Free replay.`
  },
  {
    name: 'Jumpstart Series',
    category: 'LEARN',
    description: '21-day themed learning labs (AI, e-commerce, storytelling).',
    format: 'Jan & Jul, 21 days',
    cost: 'Included',
    details: `What it is: 21-day themed "learning labs" each Jan & Jul (AI, e-commerce, storytelling). Blend of live coaching, on-demand modules, and peer challenges.`
  },
  {
    name: 'Nano Learning',
    category: 'LEARN',
    description: 'Video micro-courses (20–90 min) across nine tracks.',
    format: 'On-demand',
    cost: 'Included',
    details: `What it is: Video micro-courses (20–90 min) across nine tracks—Leadership, Finance, Parenting, etc. Created by EO experts.`
  },
  {
    name: 'EO Podcasts',
    category: 'LEARN',
    description: 'Three show channels: EO 360, EO Wonder, Maestros del Escalamiento.',
    format: 'On-demand',
    cost: 'Included',
    details: `What it is: EO 360 – Long-form interviews (English)
EO Wonder – Women entrepreneurs' stories (English)
Maestros del Escalamiento – Scaling insights (Spanish)`
  },
  {
    name: 'Global Speakers Academy',
    category: 'LEARN',
    description: 'Five-day intensive to craft a signature talk.',
    format: '5 days',
    cost: 'Optional',
    details: `What it is: Five-day intensive to craft a signature talk; ~35 participants; US$6.5–8.5k. Graduates join the EO Certified Speaker roster.`
  },
  {
    name: 'EO @ Harvard – Strategy',
    category: 'LEARN',
    description: 'Four-day program on market dominance & strategy.',
    format: '4 days',
    cost: 'Optional',
    details: `What it is: Four-day program on market dominance & strategy. 97 participants. US$7.5k incl. hotel.`
  },
  {
    name: 'EO @ Harvard – Exit',
    category: 'LEARN',
    description: 'Four-day exit-planning intensive.',
    format: '4 days',
    cost: 'Optional',
    details: `What it is: Four-day exit-planning intensive. US$9.35k.`
  },
  {
    name: 'EO @ Wharton',
    category: 'LEARN',
    description: 'Five-day finance & ops mastery.',
    format: '5 days',
    cost: 'Optional',
    details: `What it is: Five-day finance & ops mastery. US$6.6k.`
  },
  {
    name: 'EO @ Oxford',
    category: 'LEARN',
    description: 'Four-day strategic innovation course at Saïd Business School.',
    format: '4 days',
    cost: 'Optional',
    details: `What it is: Four-day strategic innovation course at Saïd Business School. US$7.7k.`
  },
  {
    name: 'EO/LBS Growth Forum',
    category: 'LEARN',
    description: 'Case-method growth planning.',
    format: '4 days',
    cost: 'Optional',
    details: `What it is: Case-method growth planning. 4 days, London, US$6.8k.`
  },
  {
    name: 'EO@INSEAD',
    category: 'LEARN',
    description: 'Five-day high-performance culture program in Singapore.',
    format: '5 days',
    cost: 'Optional',
    details: `What it is: Five-day high-performance culture program in Singapore. US$7.5k.`
  },
  {
    name: 'Entrepreneurial Masters Program (EMP)',
    category: 'LEARN',
    description: 'Three-year MIT-based cohort (4 days/yr).',
    format: '3 years',
    cost: 'Optional',
    details: `What it is: Three-year MIT-based cohort (4 days/yr). Yr 1 US$7k, Yrs 2-3 US$4-5k, 68 seats.`
  },
  {
    name: 'EO Ignite',
    category: 'LEARN',
    description: 'A program (formerly Accelerator) designed to help entrepreneurs grow their business above $1M in annual revenue.',
    format: 'Cohort-based, ongoing',
    cost: 'Optional',
    details: `What it is: EO Ignite (formerly Accelerator) is designed to give you the tools, direction, and feedback you need to propel your business above $1 million in annual revenue in 3 years or less.
Who it's for: Entrepreneurs aiming to break the $1M revenue mark.
Key elements:
  • Structured learning and accountability
  • Peer cohort and mentorship
  • Focus on sustainable growth
  • Access to EO network and resources
Learn more: Contact your local EO chapter for details.`
  },
  // GROW
  {
    name: 'Path of Leadership (PoL)',
    category: 'GROW',
    description: '75-position ladder from Day Chair to Global Board.',
    format: 'One-year terms',
    cost: 'Included',
    details: `What it is: 75-position ladder from Day Chair → Chapter Officer → Regional Council → Global Board. One-year terms, training provided.`
  },
  {
    name: 'Global Leadership Conference (GLC)',
    category: 'GROW',
    description: '5-day annual summit for officers and observers.',
    format: 'Annual',
    cost: 'Included / Optional',
    details: `What it is: 5-day annual summit for officers + observers. Keynotes, workshops, city learn-arounds. Officers attend on chapter allocation; others pay registration.`
  },
  {
    name: 'Global Leadership Academy (GLA)',
    category: 'GROW',
    description: '4.5-day immersive servant-leadership program.',
    format: '4.5 days',
    cost: 'Optional',
    details: `What it is: 4.5-day immersive servant-leadership program. 28 participants. US$5.5–9k. Applications open each June.`
  },
  {
    name: 'Forum Moderator Summit',
    category: 'GROW',
    description: 'Two-day regional gathering for moderators.',
    format: '2 days',
    cost: 'Optional',
    details: `What it is: Two-day regional gathering to share best practices, receive advanced facilitation coaching, and network with moderators.`
  },
]; 