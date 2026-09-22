import { User, Post, Comment, Community, Story, NotificationItem, Conversation, Message, HashtagInfo, UserSettings } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Arjun Sharma',
    username: 'arjun_sharma',
    email: 'arjun@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    bio: 'Founding Engineer & OSS builder @ Sangam. Building accessible web apps & distributed systems. Based in Bengaluru 🇮🇳',
    location: 'Bengaluru, India',
    website: 'https://arjunsharma.dev',
    role: 'creator',
    joinedDate: 'January 2024',
    followersCount: 2840,
    followingCount: 342,
    isVerified: true,
    mutualFollowers: ['priya_designs', 'rohan_builds', 'ananya_ai']
  },
  {
    id: 'user-2',
    name: 'Priya Patel',
    username: 'priya_designs',
    email: 'priya@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    bio: 'Product Designer & Design Systems lead. Obsessed with typography, spacing math, and craft. Mumbai ☕',
    location: 'Mumbai, India',
    website: 'https://priyapatel.design',
    role: 'creator',
    joinedDate: 'February 2024',
    followersCount: 4120,
    followingCount: 410,
    isVerified: true,
    mutualFollowers: ['arjun_sharma', 'sneha_codes']
  },
  {
    id: 'user-3',
    name: 'Rohan Mehta',
    username: 'rohan_builds',
    email: 'rohan@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    bio: 'Bootstrapping micro-SaaS from Pune. Shared our journey from ₹0 to ₹1,49,000/mo MRR. Code, ship, repeat 🚀',
    location: 'Pune, India',
    website: 'https://rohanmehta.tech',
    role: 'creator',
    joinedDate: 'March 2024',
    followersCount: 6200,
    followingCount: 520,
    isVerified: true,
    mutualFollowers: ['arjun_sharma', 'vikram_v']
  },
  {
    id: 'user-4',
    name: 'Ananya Iyer',
    username: 'ananya_ai',
    email: 'ananya@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    bio: 'AI Researcher @ TechLabs Hyderabad. Exploring SLMs, model quantization & agentic workflows. Reader & coffee enthusiast.',
    location: 'Hyderabad, India',
    website: 'https://ananyaiyer.ai',
    role: 'creator',
    joinedDate: 'February 2024',
    followersCount: 3890,
    followingCount: 295,
    isVerified: true,
    mutualFollowers: ['arjun_sharma', 'priya_designs']
  },
  {
    id: 'user-5',
    name: 'Vikram Verma',
    username: 'vikram_v',
    email: 'vikram@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    bio: 'Cloud Architect & Kubernetes enthusiast. Demystifying high-throughput backend services and cost optimization. Delhi NCR.',
    location: 'Gurugram, India',
    website: 'https://vikramverma.cloud',
    role: 'member',
    joinedDate: 'April 2024',
    followersCount: 1950,
    followingCount: 412,
    isVerified: false,
    mutualFollowers: ['arjun_sharma']
  },
  {
    id: 'user-6',
    name: 'Sneha Reddy',
    username: 'sneha_codes',
    email: 'sneha@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    bio: 'Frontend architect. React, TypeScript & CSS wizardry. Community speaker & mentor. Bengaluru tech scene 🌱',
    location: 'Bengaluru, India',
    website: 'https://snehareddy.io',
    role: 'creator',
    joinedDate: 'January 2024',
    followersCount: 5120,
    followingCount: 680,
    isVerified: true,
    mutualFollowers: ['arjun_sharma', 'priya_designs', 'rohan_builds']
  },
  {
    id: 'user-7',
    name: 'Aditya Joshi',
    username: 'aditya_j',
    email: 'aditya@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    bio: 'Rustaceans, Linux kernels & terminal customizations. Speed matters. Ahmedabad ⚡',
    location: 'Ahmedabad, India',
    website: 'https://adityajoshi.net',
    role: 'member',
    joinedDate: 'May 2024',
    followersCount: 1420,
    followingCount: 310,
    isVerified: false,
    mutualFollowers: ['vikram_v']
  },
  {
    id: 'user-8',
    name: 'Tanvi Kapoor',
    username: 'tanvi_creates',
    email: 'tanvi@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    bio: 'Visual storyteller & street photographer. Capturing the colors, chai stalls, and modern silhouettes of urban India 📸',
    location: 'Chandigarh, India',
    website: 'https://tanvikapoor.photo',
    role: 'creator',
    joinedDate: 'March 2024',
    followersCount: 7800,
    followingCount: 290,
    isVerified: true,
    mutualFollowers: ['priya_designs']
  },
  {
    id: 'user-9',
    name: 'Kabir Nair',
    username: 'kabir_n',
    email: 'kabir@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    bio: 'Mobile dev (Flutter & Swift). Crafting silky-smooth 120fps micro-interactions. Kochi, Kerala 🌴',
    location: 'Kochi, India',
    website: 'https://kabirnair.dev',
    role: 'member',
    joinedDate: 'February 2024',
    followersCount: 2210,
    followingCount: 380,
    isVerified: false,
    mutualFollowers: ['sneha_codes']
  },
  {
    id: 'user-10',
    name: 'Meera Desai',
    username: 'meera_d',
    email: 'meera@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    bio: 'Community builder & DevRel lead. Connecting developers across Indian tech colleges & startups. Chennai 🎧',
    location: 'Chennai, India',
    website: 'https://meeradesai.in',
    role: 'creator',
    joinedDate: 'January 2024',
    followersCount: 5400,
    followingCount: 820,
    isVerified: true,
    mutualFollowers: ['arjun_sharma', 'rohan_builds']
  },
  {
    id: 'user-11',
    name: 'Devansh Shah',
    username: 'devansh_s',
    email: 'devansh@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
    bio: 'CS Sophomore @ IIT Bombay. Hackathon junkie, web3 curious & open to collaborative side-projects! 💡',
    location: 'Mumbai, India',
    website: 'https://github.com/devansh-s',
    role: 'member',
    joinedDate: 'April 2024',
    followersCount: 1650,
    followingCount: 520,
    isVerified: false,
    mutualFollowers: ['ananya_ai', 'arjun_sharma']
  },
  {
    id: 'user-12',
    name: 'Ritika Sen',
    username: 'ritika_writes',
    email: 'ritika@sangam.in',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    bio: 'Technical writer & editor. Translating convoluted architecture diagrams into human-readable articles. Kolkata 📚',
    location: 'Kolkata, India',
    website: 'https://ritikasen.substack.com',
    role: 'creator',
    joinedDate: 'March 2024',
    followersCount: 3100,
    followingCount: 240,
    isVerified: true,
    mutualFollowers: ['priya_designs', 'meera_d']
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-1',
    name: 'Web Development',
    slug: 'web-development',
    description: 'The premier community for frontend, backend, and fullstack developers across modern web ecosystems.',
    category: 'Technology',
    bannerUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=200&q=80',
    memberCount: 14800,
    isJoined: true,
    rules: [
      'Be respectful and constructive in code reviews.',
      'Share original solutions and credit open source libraries.',
      'No unsolicited promotional spam or referral links.'
    ],
    tags: ['React', 'TypeScript', 'Nextjs', 'CSS', 'NodeJS'],
    trendingTopic: 'React 19 Hooks and Server Components discussion'
  },
  {
    id: 'comm-2',
    name: 'AI & Machine Learning',
    slug: 'ai-ml',
    description: 'Explore neural networks, LLMs, computer vision, research papers, and generative tools shaping tomorrow.',
    category: 'Technology',
    bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    memberCount: 22400,
    isJoined: true,
    rules: [
      'Disclose AI generation where relevant.',
      'Ground technical claims in reproducible code or benchmarks.',
      'Collaborative discussions only; promote ethical research.'
    ],
    tags: ['AI', 'PyTorch', 'LLMs', 'DeepLearning', 'Robotics'],
    trendingTopic: 'Quantized SLMs running locally on laptops'
  },
  {
    id: 'comm-3',
    name: 'Startups & Founders',
    slug: 'startups',
    description: 'Founders, early team members, and indie hackers sharing real MRR, product validation, and growth lessons.',
    category: 'Business',
    bannerUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80',
    memberCount: 18500,
    isJoined: true,
    rules: [
      'Be transparent about metrics and hurdles.',
      'No vanity posturing; share actionable insights.',
      'Give feedback before requesting feedback.'
    ],
    tags: ['Startups', 'IndieHackers', 'ProductMarketFit', 'SaaS', 'IndiaTech'],
    trendingTopic: 'Bootstrapping with ₹0 external venture capital'
  },
  {
    id: 'comm-4',
    name: 'College Life & Tech',
    slug: 'college-life',
    description: 'Engineering and college students across India discussing campus tech clubs, hackathons, and placement prep.',
    category: 'Education',
    bannerUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=200&q=80',
    memberCount: 31200,
    isJoined: false,
    rules: [
      'Share hackathon opportunities and resources generously.',
      'Keep discussions polite and respectful across colleges.',
      'Help juniors with genuine placement guidance.'
    ],
    tags: ['CollegeLife', 'Hackathons', 'Placements', 'Projects', 'Campus'],
    trendingTopic: 'Upcoming Smart India Hackathon preparations'
  },
  {
    id: 'comm-5',
    name: 'Photography India',
    slug: 'photography-india',
    description: 'Celebrating the incredible landscapes, street moments, heritage, and modern architecture of India.',
    category: 'Creative',
    bannerUrl: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=200&q=80',
    memberCount: 16900,
    isJoined: false,
    rules: [
      'Post your own original photography or clearly credit author.',
      'Share EXIF / camera settings where possible.',
      'Provide respectful critique when solicited.'
    ],
    tags: ['Photography', 'StreetPhoto', 'IncredibleIndia', 'Architecture'],
    trendingTopic: 'Monsoon street photography in Mumbai & Western Ghats'
  },
  {
    id: 'comm-6',
    name: 'Gaming Hub',
    slug: 'gaming-hub',
    description: 'From esports tournaments to PC builds, game development, and indie game reviews.',
    category: 'Entertainment',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=200&q=80',
    memberCount: 9800,
    isJoined: false,
    rules: [
      'No toxicity or griefing.',
      'Highlight indie game creators.',
      'Keep setup and build discussions honest.'
    ],
    tags: ['Gaming', 'PCBuild', 'Esports', 'IndieGames'],
    trendingTopic: 'Building high FPS budget rigs under ₹65,000'
  },
  {
    id: 'comm-7',
    name: 'Fitness & Wellness',
    slug: 'fitness-wellness',
    description: 'Daily discipline, calisthenics, running routes, nutrition balance, and mental health for tech professionals.',
    category: 'Lifestyle',
    bannerUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    avatarUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=200&q=80',
    memberCount: 12400,
    isJoined: false,
    rules: [
      'Consult medical professionals for clinical advice.',
      'Celebrate progress at every fitness level.',
      'Encourage work-life equilibrium.'
    ],
    tags: ['Fitness', 'Running', 'Health', 'DeskErgonomics'],
    trendingTopic: '10k weekend runs around Cubbon Park'
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'user-1',
    content: 'Just launched our latest architecture upgrade on SANGAM! We spent the last two weeks refining state persistence, optical typographic hierarchy, and sub-100ms render cycles. It feels wonderful when complex systems render with zero layout shift.\n\nWhat are you shipping this weekend? #WebDevelopment #React #Technology #India',
    mediaUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['WebDevelopment', 'React', 'Technology', 'India'],
    createdAt: '15 minutes ago',
    likesCount: 142,
    commentsCount: 24,
    sharesCount: 18,
    savesCount: 39,
    communityId: 'comm-1',
    communityName: 'Web Development'
  },
  {
    id: 'post-2',
    authorId: 'user-2',
    content: 'A golden rule of design systems: outer container padding must always exceed inner element spacing. When you mix cards inside cards without optical math, the eye gets tired.\n\nHere is a preview of our fresh token scale in dark & light mode. Thoughts on the subtle border radius calculations? #ProductDesign #WebDevelopment #UIUX',
    mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['ProductDesign', 'WebDevelopment', 'UIUX'],
    createdAt: '45 minutes ago',
    likesCount: 289,
    commentsCount: 38,
    sharesCount: 42,
    savesCount: 88,
    communityId: 'comm-1',
    communityName: 'Web Development'
  },
  {
    id: 'post-3',
    authorId: 'user-3',
    content: 'Transparent milestone: exactly 6 months ago, our indie SaaS generated zero rupees. Today, we crossed ₹1,49,000 monthly recurring revenue with 380 active paying teams.\n\nKey takeaway: Solve a hyper-specific painful problem for Indian developers instead of building generic clones. Happy to answer any questions about pricing in INR or customer retention! 📈 #Startups #IndieHackers #India #Technology',
    hashtags: ['Startups', 'IndieHackers', 'India', 'Technology'],
    createdAt: '2 hours ago',
    likesCount: 512,
    commentsCount: 64,
    sharesCount: 81,
    savesCount: 140,
    communityId: 'comm-3',
    communityName: 'Startups & Founders'
  },
  {
    id: 'post-4',
    authorId: 'user-4',
    content: 'We just finished running inference benchmarks on smaller 3B-parameter quantized models on consumer laptops without an expensive GPU cluster.\n\nSeeing 38 tokens/second on an M-series Mac with 4-bit precision. The future of edge intelligence in India is rapidly arriving. Code repository coming early next week! #AI #MachineLearning #DeepLearning #Technology',
    mediaUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['AI', 'MachineLearning', 'DeepLearning', 'Technology'],
    createdAt: '3 hours ago',
    likesCount: 375,
    commentsCount: 45,
    sharesCount: 52,
    savesCount: 95,
    communityId: 'comm-2',
    communityName: 'AI & Machine Learning'
  },
  {
    id: 'post-5',
    authorId: 'user-8',
    content: 'Golden hour at Marine Drive, Mumbai. The contrast between the colonial stone promenades and the distant modern skyline never ceases to amaze me. 35mm f/1.8 lens. #Photography #IncredibleIndia #Mumbai #StreetPhoto',
    mediaUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['Photography', 'IncredibleIndia', 'Mumbai', 'StreetPhoto'],
    createdAt: '4 hours ago',
    likesCount: 680,
    commentsCount: 51,
    sharesCount: 77,
    savesCount: 110,
    communityId: 'comm-5',
    communityName: 'Photography India'
  },
  {
    id: 'post-6',
    authorId: 'user-6',
    content: 'Unpopular opinion: You do not need 40 external npm packages for a responsive social UI. Modern CSS grid, container queries, and standard Web APIs solve 90% of layout problems cleaner and with zero bundle bloat.\n\nKeep your client-side dependencies lean and clean! 🚀 #React #WebDevelopment #Coding',
    hashtags: ['React', 'WebDevelopment', 'Coding'],
    createdAt: '5 hours ago',
    likesCount: 420,
    commentsCount: 58,
    sharesCount: 39,
    savesCount: 104,
    communityId: 'comm-1',
    communityName: 'Web Development'
  },
  {
    id: 'post-7',
    authorId: 'user-11',
    content: 'Our team just pulled a 36-hour hackathon sprint at IIT Bombay! We engineered a real-time assistive reading tool for regional Indian languages. Sleep deprived, running on chai and filter coffee, but feeling invincible. Proud of this crew! 💡⚡ #CollegeLife #Hackathons #IITBombay #Technology',
    mediaUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['CollegeLife', 'Hackathons', 'IITBombay', 'Technology'],
    createdAt: '6 hours ago',
    likesCount: 590,
    commentsCount: 41,
    sharesCount: 33,
    savesCount: 48,
    communityId: 'comm-4',
    communityName: 'College Life & Tech'
  },
  {
    id: 'post-8',
    authorId: 'user-5',
    content: 'Migrated 4 microservices from oversized cloud VMs to containerized auto-scaling tasks this week. Cut our hosting bill from ₹84,000/month to ₹22,500/month while p99 latency dropped by 18ms.\n\nNever underestimate the power of profiling before purchasing bigger machines. #DevOps #Cloud #Technology',
    hashtags: ['DevOps', 'Cloud', 'Technology'],
    createdAt: '7 hours ago',
    likesCount: 310,
    commentsCount: 29,
    sharesCount: 30,
    savesCount: 72,
    communityId: 'comm-1',
    communityName: 'Web Development'
  },
  {
    id: 'post-9',
    authorId: 'user-7',
    content: 'Rewrote our core data parser in Rust. What took 4.2 seconds in Python now executes in 85 milliseconds. The compiler gives you tough love during lifetime checks, but when it compiles, it simply runs rock solid. #Rust #Technology #Performance',
    hashtags: ['Rust', 'Technology', 'Performance'],
    createdAt: '8 hours ago',
    likesCount: 245,
    commentsCount: 34,
    sharesCount: 22,
    savesCount: 53
  },
  {
    id: 'post-10',
    authorId: 'user-10',
    content: 'Bengaluru Tech Meetup alert! We have 120 developers gathering this Saturday near Indiranagar to discuss open source contributions, system design, and developer relations.\n\nFree entry, complimentary chai and snacks. Register your spot on the community tab! ☕ #Bengaluru #TechCommunity #OpenSource',
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['Bengaluru', 'TechCommunity', 'OpenSource'],
    createdAt: '10 hours ago',
    likesCount: 412,
    commentsCount: 52,
    sharesCount: 65,
    savesCount: 82,
    communityId: 'comm-1',
    communityName: 'Web Development'
  },
  {
    id: 'post-11',
    authorId: 'user-9',
    content: 'Working from Fort Kochi today. Gentle Arabian Sea breeze, sea gulls, and testing out a smooth 120Hz gesture physics engine for mobile feeds.\n\nRemote work in India allows you to choose your environment and bring your best creative focus to life. #RemoteWork #Flutter #Mobile #Kochi',
    mediaUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['RemoteWork', 'Flutter', 'Mobile', 'Kochi'],
    createdAt: '12 hours ago',
    likesCount: 530,
    commentsCount: 36,
    sharesCount: 41,
    savesCount: 68
  },
  {
    id: 'post-12',
    authorId: 'user-12',
    content: '5 habits that elevated my technical writing as an engineer:\n\n1. Cut passive voice ruthlessly.\n2. Put the code snippet before the long exposition.\n3. Replace 50-word paragraphs with concise bullet lists.\n4. Show the exact failure output, not just happy paths.\n5. Read it out loud before hitting publish. #Writing #Career #Technology',
    hashtags: ['Writing', 'Career', 'Technology'],
    createdAt: '14 hours ago',
    likesCount: 615,
    commentsCount: 48,
    sharesCount: 92,
    savesCount: 185
  },
  {
    id: 'post-13',
    authorId: 'user-1',
    content: 'Early morning coffee and reviewing PRs before the city awakens. Cubbon Park mornings always bring clarity before a packed engineering sprint. Hope everyone has a productive day ahead! #Bengaluru #MorningRoutine #Engineering',
    mediaUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['Bengaluru', 'MorningRoutine', 'Engineering'],
    createdAt: '16 hours ago',
    likesCount: 320,
    commentsCount: 22,
    sharesCount: 15,
    savesCount: 29
  },
  {
    id: 'post-14',
    authorId: 'user-2',
    content: 'Typography pairing tip for modern platforms: pair a geometric or expressive display font (like Outfit) for headers with an ultra-legible humanist sans-serif (like Plus Jakarta Sans) for continuous reading. Keeps the interface modern without sacrificing scan speed. #Design #UIUX #Typography',
    hashtags: ['Design', 'UIUX', 'Typography'],
    createdAt: '18 hours ago',
    likesCount: 298,
    commentsCount: 19,
    sharesCount: 31,
    savesCount: 94
  },
  {
    id: 'post-15',
    authorId: 'user-3',
    content: 'Do not chase vanity metrics like total registered users if active daily engagement is flat. 50 highly committed users who love your product beat 5,000 passive accounts who never return. Build for retention first. #Startups #ProductStrategy #Founders',
    hashtags: ['Startups', 'ProductStrategy', 'Founders'],
    createdAt: '1 day ago',
    likesCount: 472,
    commentsCount: 39,
    sharesCount: 58,
    savesCount: 112,
    communityId: 'comm-3',
    communityName: 'Startups & Founders'
  },
  {
    id: 'post-16',
    authorId: 'user-4',
    content: 'Interesting research paper from Stanford on agentic memory consolidation: using vector hierarchies instead of flat embeddings reduces hallucination by 42%. Testing a localized prototype on our test datasets. #AI #Research #MachineLearning',
    hashtags: ['AI', 'Research', 'MachineLearning'],
    createdAt: '1 day ago',
    likesCount: 388,
    commentsCount: 28,
    sharesCount: 45,
    savesCount: 120,
    communityId: 'comm-2',
    communityName: 'AI & Machine Learning'
  },
  {
    id: 'post-17',
    authorId: 'user-6',
    content: 'Mastering TypeScript generic constraints will unlock 10x cleaner React component APIs. Stop reaching for `any` or loose type assertions—let the compiler guarantee props correctness at build time! #TypeScript #React #WebDevelopment',
    hashtags: ['TypeScript', 'React', 'WebDevelopment'],
    createdAt: '1 day ago',
    likesCount: 510,
    commentsCount: 42,
    sharesCount: 66,
    savesCount: 148,
    communityId: 'comm-1',
    communityName: 'Web Development'
  },
  {
    id: 'post-18',
    authorId: 'user-7',
    content: 'My minimalist desk setup setup in Ahmedabad. Ultra-wide monitor, ErgoDox mechanical keyboard with silent tactile switches, and zero cables in sight. A clean space equals a peaceful mind. #DeskSetup #Minimalism #Productivity',
    mediaUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['DeskSetup', 'Minimalism', 'Productivity'],
    createdAt: '1 day ago',
    likesCount: 640,
    commentsCount: 57,
    sharesCount: 49,
    savesCount: 130
  },
  {
    id: 'post-19',
    authorId: 'user-8',
    content: 'Street life during evening twilight in Old Delhi. The scent of roasted spices, tea steam rising against heritage stone, and rickshaws moving through centuries of history. India in its purest rhythm. #Photography #OldDelhi #IncredibleIndia',
    mediaUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['Photography', 'OldDelhi', 'IncredibleIndia'],
    createdAt: '2 days ago',
    likesCount: 790,
    commentsCount: 63,
    sharesCount: 94,
    savesCount: 160,
    communityId: 'comm-5',
    communityName: 'Photography India'
  },
  {
    id: 'post-20',
    authorId: 'user-11',
    content: 'College project update: Built a distributed campus notes repository using local storage & client-side indexing. Already 450 classmates using it for exam revisions! Building software that people nearby actually use is the best feeling in computer science. #CollegeLife #StudentDev #OpenSource',
    hashtags: ['CollegeLife', 'StudentDev', 'OpenSource'],
    createdAt: '2 days ago',
    likesCount: 430,
    commentsCount: 35,
    sharesCount: 28,
    savesCount: 54,
    communityId: 'comm-4',
    communityName: 'College Life & Tech'
  },
  {
    id: 'post-21',
    authorId: 'user-10',
    content: 'Reminder for anyone feeling imposter syndrome today: every single senior engineer you admire once stared at an unhelpful error stack for 4 hours only to realize they missed a single semicolon or misspelled an environment variable. Give yourself grace and keep building! 💪 #TechCommunity #Career #Motivation',
    hashtags: ['TechCommunity', 'Career', 'Motivation'],
    createdAt: '2 days ago',
    likesCount: 880,
    commentsCount: 74,
    sharesCount: 122,
    savesCount: 210
  },
  {
    id: 'post-22',
    authorId: 'user-5',
    content: 'Always implement idempotency keys for payment and mutating transactional endpoints. If a client retries due to flaky mobile data networks (especially 4G in transit), duplicate records will ruin your day. Clean system architecture is defensive by default. #SoftwareEngineering #Backend #Architecture',
    hashtags: ['SoftwareEngineering', 'Backend', 'Architecture'],
    createdAt: '3 days ago',
    likesCount: 340,
    commentsCount: 26,
    sharesCount: 35,
    savesCount: 89
  },
  {
    id: 'post-23',
    authorId: 'user-9',
    content: 'Pro-tip for mobile developers: do not paint the whole screen when only a small counter or like button toggles. Keep your component trees shallow and scope state changes locally. 60fps is minimum; 120fps is the craft. #Flutter #React #MobileApp',
    hashtags: ['Flutter', 'React', 'MobileApp'],
    createdAt: '3 days ago',
    likesCount: 295,
    commentsCount: 18,
    sharesCount: 24,
    savesCount: 65
  },
  {
    id: 'post-24',
    authorId: 'user-12',
    content: 'Just published a comprehensive guide: "How modern web browsers render CSS: from DOM tree parsing to GPU compositing layers". Understanding browser paint cycles helps write buttery-smooth UI transitions. Link in bio! #WebDevelopment #CSS #BrowserInternals',
    hashtags: ['WebDevelopment', 'CSS', 'BrowserInternals'],
    createdAt: '3 days ago',
    likesCount: 460,
    commentsCount: 37,
    sharesCount: 71,
    savesCount: 142
  },
  {
    id: 'post-25',
    authorId: 'user-3',
    content: 'Our annual subscription tier is priced at ₹12,999/year for teams. When we switched from monthly billing to annual default with 2 months free, cash flow stability increased by 300%. If you are building in India, offer straightforward INR pricing with zero hidden surcharges. #Startups #SaaS #IndiaTech',
    hashtags: ['Startups', 'SaaS', 'IndiaTech'],
    createdAt: '4 days ago',
    likesCount: 520,
    commentsCount: 46,
    sharesCount: 61,
    savesCount: 115,
    communityId: 'comm-3',
    communityName: 'Startups & Founders'
  },
  {
    id: 'post-26',
    authorId: 'user-1',
    content: 'Accessibility is not an afterthought or a checkbox—it is fundamental engineering ethics. Semantic HTML, visible focus states, proper color contrast ratios (passing WCAG AA 4.5:1), and keyboard navigation must be in our muscle memory as developers. #Accessibility #A11y #WebDevelopment',
    hashtags: ['Accessibility', 'A11y', 'WebDevelopment'],
    createdAt: '4 days ago',
    likesCount: 640,
    commentsCount: 41,
    sharesCount: 88,
    savesCount: 175
  },
  {
    id: 'post-27',
    authorId: 'user-2',
    content: 'A reminder that good design feels invisible. When a user can navigate their feed, find their communities, and share ideas without hesitation, the interface has succeeded. Polish is in the details you do not notice until they are absent. #DesignPhilosophy #UIUX #Sangam',
    hashtags: ['DesignPhilosophy', 'UIUX', 'Sangam'],
    createdAt: '5 days ago',
    likesCount: 710,
    commentsCount: 54,
    sharesCount: 95,
    savesCount: 190
  },
  {
    id: 'post-28',
    authorId: 'user-4',
    content: 'Evaluating local vector search indexing with HNSW graphs vs flat cosine distance. On 100,000 document chunks, query latency dropped from 140ms to 4.8ms with 98.7% recall fidelity. Algorithmic trade-offs are beautiful. #AI #VectorSearch #Algorithms',
    hashtags: ['AI', 'VectorSearch', 'Algorithms'],
    createdAt: '5 days ago',
    likesCount: 390,
    commentsCount: 31,
    sharesCount: 44,
    savesCount: 98,
    communityId: 'comm-2',
    communityName: 'AI & Machine Learning'
  },
  {
    id: 'post-29',
    authorId: 'user-6',
    content: 'Never stop learning, but also remember to pause and celebrate how much you have grown in the past 12 months. Remember when promises or async/await felt bewildering? You have got this. Happy coding everyone! 🌟 #Motivation #WebDev #Growth',
    hashtags: ['Motivation', 'WebDev', 'Growth'],
    createdAt: '6 days ago',
    likesCount: 820,
    commentsCount: 68,
    sharesCount: 110,
    savesCount: 165
  },
  {
    id: 'post-30',
    authorId: 'user-8',
    content: 'Himalayan foothills after fresh snowfall near Manali. Clean crisp air and towering pines standing strong against cold winter winds. Captured at 1/1000s, ISO 100. Nature is the greatest architect. #Photography #Manali #Himalayas #IncredibleIndia',
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
    hashtags: ['Photography', 'Manali', 'Himalayas', 'IncredibleIndia'],
    createdAt: '6 days ago',
    likesCount: 940,
    commentsCount: 82,
    sharesCount: 135,
    savesCount: 220,
    communityId: 'comm-5',
    communityName: 'Photography India'
  },
  {
    id: 'post-31',
    authorId: 'user-7',
    content: 'Linux tip of the day: use `ripgrep` (`rg`) and `fd` instead of legacy grep and find. Speed increases by orders of magnitude on large monorepos. Your terminal workflow should be friction-free. #Linux #Tools #Productivity',
    hashtags: ['Linux', 'Tools', 'Productivity'],
    createdAt: '1 week ago',
    likesCount: 315,
    commentsCount: 24,
    sharesCount: 38,
    savesCount: 84
  },
  {
    id: 'post-32',
    authorId: 'user-11',
    content: 'Grateful for the tech mentors across Indian developer communities who answer questions patiently without condescension. Mentorship changes students lives forever. Let us keep paying it forward! 🤝 #Community #Mentorship #CollegeLife',
    hashtags: ['Community', 'Mentorship', 'CollegeLife'],
    createdAt: '1 week ago',
    likesCount: 760,
    commentsCount: 59,
    sharesCount: 90,
    savesCount: 140,
    communityId: 'comm-4',
    communityName: 'College Life & Tech'
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-item-1',
    postId: 'post-1',
    authorId: 'user-2',
    content: 'The typographic hierarchy looks pristine Arjun! The font pairing between Outfit and Plus Jakarta Sans works wonders for legibility.',
    createdAt: '12 minutes ago',
    likesCount: 12
  },
  {
    id: 'comm-item-2',
    postId: 'post-1',
    authorId: 'user-6',
    content: 'Sub-100ms render speeds are noticeable immediately. The feed feels super responsive!',
    createdAt: '9 minutes ago',
    likesCount: 8
  },
  {
    id: 'comm-item-3',
    postId: 'post-1',
    authorId: 'user-3',
    content: 'Great shipping discipline. Consistent incremental improvements always compound.',
    createdAt: '5 minutes ago',
    likesCount: 4
  },
  {
    id: 'comm-item-4',
    postId: 'post-2',
    authorId: 'user-1',
    content: 'The nested border-radius rule is so true: Inner Radius = Outer Radius - Padding. When neglected, corners look disjointed.',
    createdAt: '35 minutes ago',
    likesCount: 15
  },
  {
    id: 'comm-item-5',
    postId: 'post-2',
    authorId: 'user-12',
    content: 'Saved this for our design tokens review next sprint! Clean visual math.',
    createdAt: '20 minutes ago',
    likesCount: 7
  },
  {
    id: 'comm-item-6',
    postId: 'post-3',
    authorId: 'user-1',
    content: 'Congratulations Rohan! Reaching ₹1,49,000 MRR bootstrapped from Pune is inspiring. How did you acquire your first 50 paying customers?',
    createdAt: '1 hour ago',
    likesCount: 19
  },
  {
    id: 'comm-item-7',
    postId: 'post-3',
    authorId: 'user-5',
    content: 'Transparent INR pricing is such a huge advantage for domestic conversions. Great job!',
    createdAt: '50 minutes ago',
    likesCount: 11
  },
  {
    id: 'comm-item-8',
    postId: 'post-3',
    authorId: 'user-10',
    content: 'Would love to have you speak on an upcoming founder community panel about this journey!',
    createdAt: '30 minutes ago',
    likesCount: 9
  },
  {
    id: 'comm-item-9',
    postId: 'post-4',
    authorId: 'user-11',
    content: '38 tokens/second on an edge device is wild Ananya! Can we test it on a standard 16GB RAM laptop?',
    createdAt: '2 hours ago',
    likesCount: 14
  },
  {
    id: 'comm-item-10',
    postId: 'post-4',
    authorId: 'user-7',
    content: 'Looking forward to inspecting the quantization quantization schema in your repo.',
    createdAt: '1 hour ago',
    likesCount: 6
  },
  {
    id: 'comm-item-11',
    postId: 'post-5',
    authorId: 'user-2',
    content: 'The reflection on the wet promenade is breathtaking Tanvi! Marine Drive in monsoon lighting is unbeatable.',
    createdAt: '3 hours ago',
    likesCount: 22
  },
  {
    id: 'comm-item-12',
    postId: 'post-6',
    authorId: 'user-1',
    content: 'Preach Sneha! Every extra dependency is maintenance debt and attack surface. Keep it lean.',
    createdAt: '4 hours ago',
    likesCount: 18
  },
  {
    id: 'comm-item-13',
    postId: 'post-7',
    authorId: 'user-10',
    content: 'Kudos to the IIT Bombay team! What an impactful project to build in 36 hours.',
    createdAt: '5 hours ago',
    likesCount: 15
  },
  {
    id: 'comm-item-14',
    postId: 'post-8',
    authorId: 'user-7',
    content: 'From ₹84,000 down to ₹22,500/month is massive ROI Vikram. What profiling tool identified the bottleneck?',
    createdAt: '6 hours ago',
    likesCount: 8
  },
  {
    id: 'comm-item-15',
    postId: 'post-10',
    authorId: 'user-1',
    content: 'Count me in Meera! Looking forward to meeting folks in Indiranagar this weekend.',
    createdAt: '9 hours ago',
    likesCount: 12
  },
  {
    id: 'comm-item-16',
    postId: 'post-12',
    authorId: 'user-6',
    content: 'Reading out loud before publishing is my favorite test. Catches awkward run-on sentences every time.',
    createdAt: '12 hours ago',
    likesCount: 16
  }
];

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-1',
    authorId: 'user-1',
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    caption: 'Deploying the new SANGAM release! Fast builds & clean typography ⚡',
    createdAt: '2 hours ago',
    isViewed: false
  },
  {
    id: 'story-2',
    authorId: 'user-2',
    mediaUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    caption: 'Prototyping fluid card interactions in Mumbai today ☕🎨',
    createdAt: '3 hours ago',
    isViewed: false
  },
  {
    id: 'story-3',
    authorId: 'user-3',
    mediaUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    caption: 'Product roadmap planning session with the core team! 🚀',
    createdAt: '4 hours ago',
    isViewed: false
  },
  {
    id: 'story-4',
    authorId: 'user-4',
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    caption: 'Model loss curves looking beautifully convergent today! 🧠',
    createdAt: '5 hours ago',
    isViewed: false
  },
  {
    id: 'story-5',
    authorId: 'user-8',
    mediaUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    caption: 'Sunrise over Mumbai harbor. Early morning light hits different 🌅',
    createdAt: '6 hours ago',
    isViewed: false
  },
  {
    id: 'story-6',
    authorId: 'user-6',
    mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    caption: 'Clean terminal, dark theme, and listening to Indian classical flute while coding 💻',
    createdAt: '7 hours ago',
    isViewed: false
  },
  {
    id: 'story-7',
    authorId: 'user-10',
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    caption: 'Setting up the stage for the Bengaluru Tech Meetup! See you soon 🎤',
    createdAt: '8 hours ago',
    isViewed: false
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'like',
    actorId: 'user-2',
    postId: 'post-1',
    text: 'liked your post on modern architecture upgrades.',
    createdAt: '10 minutes ago',
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'comment',
    actorId: 'user-6',
    postId: 'post-1',
    text: 'commented: "Sub-100ms render speeds are noticeable immediately..."',
    createdAt: '15 minutes ago',
    isRead: false
  },
  {
    id: 'notif-3',
    type: 'follow',
    actorId: 'user-3',
    text: 'started following you.',
    createdAt: '1 hour ago',
    isRead: false
  },
  {
    id: 'notif-4',
    type: 'share',
    actorId: 'user-4',
    postId: 'post-1',
    text: 'shared your post to AI & Machine Learning.',
    createdAt: '2 hours ago',
    isRead: true
  },
  {
    id: 'notif-5',
    type: 'like',
    actorId: 'user-10',
    postId: 'post-13',
    text: 'liked your post about Cubbon Park morning coffee.',
    createdAt: '12 hours ago',
    isRead: true
  },
  {
    id: 'notif-6',
    type: 'follow',
    actorId: 'user-11',
    text: 'started following you.',
    createdAt: '1 day ago',
    isRead: true
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['user-1', 'user-2'],
    lastMessage: 'The new color palette passes contrast tests perfectly!',
    updatedAt: '10 minutes ago',
    unreadCount: 1
  },
  {
    id: 'conv-2',
    participantIds: ['user-1', 'user-3'],
    lastMessage: 'Let us connect on Friday to discuss the pricing model.',
    updatedAt: '2 hours ago',
    unreadCount: 0
  },
  {
    id: 'conv-3',
    participantIds: ['user-1', 'user-4'],
    lastMessage: 'Can you share the benchmark code for SLM inference?',
    updatedAt: 'Yesterday',
    unreadCount: 0
  },
  {
    id: 'conv-4',
    participantIds: ['user-1', 'user-10'],
    lastMessage: 'Reserved 2 front seats for you at the Indiranagar meetup.',
    updatedAt: '2 days ago',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    text: 'Hey Arjun! Did you get a chance to check out the updated design tokens on Figma?',
    createdAt: '25 minutes ago',
    isRead: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-1',
    receiverId: 'user-2',
    text: 'Yes Priya! I reviewed them this morning. The contrast ratios in dark mode look remarkably sharp.',
    createdAt: '18 minutes ago',
    isRead: true
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-2',
    receiverId: 'user-1',
    text: 'The new color palette passes contrast tests perfectly!',
    createdAt: '10 minutes ago',
    isRead: false
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    senderId: 'user-3',
    receiverId: 'user-1',
    text: 'Hey Arjun, saw your post on SANGAM foundation. Really impressed with the speed.',
    createdAt: '3 hours ago',
    isRead: true
  },
  {
    id: 'msg-5',
    conversationId: 'conv-2',
    senderId: 'user-1',
    receiverId: 'user-3',
    text: 'Thanks Rohan! And congrats on crossing ₹1,49,000 MRR milestone. Big inspiration for indie developers.',
    createdAt: '2 hours ago',
    isRead: true
  },
  {
    id: 'msg-6',
    conversationId: 'conv-2',
    senderId: 'user-3',
    receiverId: 'user-1',
    text: 'Let us connect on Friday to discuss the pricing model.',
    createdAt: '2 hours ago',
    isRead: true
  }
];

export const INITIAL_HASHTAGS: HashtagInfo[] = [
  { tag: 'React', postCount: 4280, isTrending: true, category: 'Tech' },
  { tag: 'WebDevelopment', postCount: 6840, isTrending: true, category: 'Tech' },
  { tag: 'AI', postCount: 8920, isTrending: true, category: 'Tech' },
  { tag: 'Startups', postCount: 5410, isTrending: true, category: 'Business' },
  { tag: 'Bengaluru', postCount: 3950, isTrending: true, category: 'Community' },
  { tag: 'India', postCount: 9400, isTrending: true, category: 'General' },
  { tag: 'CollegeLife', postCount: 3200, isTrending: false, category: 'Education' },
  { tag: 'ProductDesign', postCount: 2840, isTrending: false, category: 'Design' },
  { tag: 'Photography', postCount: 4500, isTrending: false, category: 'Creative' },
  { tag: 'TypeScript', postCount: 3820, isTrending: true, category: 'Tech' },
  { tag: 'OpenSource', postCount: 2950, isTrending: false, category: 'Tech' },
  { tag: 'Coding', postCount: 5120, isTrending: false, category: 'Tech' }
];

export const DEFAULT_SETTINGS: UserSettings = {
  account: {
    name: 'Arjun Sharma',
    username: 'arjun_sharma',
    email: 'arjun@sangam.in',
    bio: 'Founding Engineer & OSS builder @ Sangam. Building accessible web apps & distributed systems. Based in Bengaluru 🇮🇳',
    website: 'https://arjunsharma.dev',
    location: 'Bengaluru, India'
  },
  privacy: {
    isPrivateAccount: false,
    showOnlineStatus: true,
    allowDirectMessages: 'everyone',
    allowTagging: true
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    likes: true,
    comments: true,
    newFollowers: true,
    directMessages: true
  },
  appearance: {
    theme: 'light',
    reducedMotion: false,
    fontSize: 'medium'
  }
};
