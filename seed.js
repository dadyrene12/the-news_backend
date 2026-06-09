require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');
const User = require('./models/User');
const Category = require('./models/Category');
const Advertisement = require('./models/Advertisement');

const articles = [
  {
    title: 'After all is said and done, more is done',
    slug: 'after-all-is-said-and-done',
    excerpt: 'One man with courage makes a majority. Success is not a good teacher, failure makes you humble.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'Politics',
    author: 'John Doe',
    image: 'https://picsum.photos/seed/politics1/780/470',
    featured: true,
    breaking: true
  },
  {
    title: 'Success is not a good teacher failure makes you humble',
    slug: 'success-is-not-a-good-teacher',
    excerpt: 'Failure is the condiment that gives success its flavor. Learn from your mistakes and grow.',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    category: 'Business',
    author: 'Jane Smith',
    image: 'https://picsum.photos/seed/business1/780/470',
    featured: true,
    breaking: true
  },
  {
    title: 'Budget issues force 2017 Tour to be cancelled',
    slug: 'budget-issues-force-tour-cancelled',
    excerpt: 'Economic challenges have led to the cancellation of the highly anticipated tour.',
    content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    category: 'Sports',
    author: 'Mike Johnson',
    image: 'https://picsum.photos/seed/sports1/780/470',
    featured: true,
    breaking: true
  },
  {
    title: 'Instagram\'s big redesign goes live with black and white app',
    slug: 'instagram-big-redesign',
    excerpt: 'The popular social media platform rolls out its biggest visual overhaul yet.',
    content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
    category: 'Technology',
    author: 'Sarah Wilson',
    image: 'https://picsum.photos/seed/tech1/780/470',
    featured: true,
    breaking: true
  },
  {
    title: 'The best smart home gadgets of 2026',
    slug: 'best-smart-home-gadgets-2026',
    excerpt: 'Explore the latest innovations in smart home technology that are changing the way we live.',
    content: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    category: 'Technology',
    author: 'Alex Chen',
    image: 'https://picsum.photos/seed/gadgets/780/470',
    featured: true,
    breaking: false
  },
  {
    title: 'Global climate summit reaches historic agreement',
    slug: 'global-climate-summit-agreement',
    excerpt: 'World leaders commit to ambitious new targets in landmark environmental deal.',
    content: 'Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.',
    category: 'World',
    author: 'Emily Brown',
    image: 'https://picsum.photos/seed/world1/780/470',
    featured: false,
    breaking: true
  },
  {
    title: 'Stock markets reach new all-time highs',
    slug: 'stock-markets-all-time-highs',
    excerpt: 'Markets surge as investor confidence grows amid strong economic data.',
    content: 'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.',
    category: 'Business',
    author: 'David Lee',
    image: 'https://picsum.photos/seed/business2/780/470',
    featured: false,
    breaking: false
  },
  {
    title: 'New breakthrough in renewable energy storage',
    slug: 'breakthrough-renewable-energy-storage',
    excerpt: 'Scientists develop a new battery technology that could revolutionize solar power.',
    content: 'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.',
    category: 'Technology',
    author: 'Sarah Wilson',
    image: 'https://picsum.photos/seed/energy/780/470',
    featured: false,
    breaking: false
  },
  {
    title: 'Hollywood blockbuster breaks box office records',
    slug: 'hollywood-blockbuster-box-office',
    excerpt: 'The latest summer release shatters global opening weekend records.',
    content: 'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    category: 'Entertainment',
    author: 'Lisa Taylor',
    image: 'https://picsum.photos/seed/entertainment1/780/470',
    featured: false,
    breaking: false
  },
  {
    title: 'Olympic committee announces 2032 host city',
    slug: 'olympic-committee-2032-host',
    excerpt: 'The International Olympic Committee has selected the host city for the 2032 games.',
    content: 'Harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.',
    category: 'Sports',
    author: 'Mike Johnson',
    image: 'https://picsum.photos/seed/olympic/780/470',
    featured: false,
    breaking: false
  },
  {
    title: 'Rising sea levels threaten coastal communities',
    slug: 'rising-sea-levels-coastal',
    excerpt: 'New research shows accelerated ice melt could flood major cities by 2050.',
    content: 'Omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.',
    category: 'World',
    author: 'Emily Brown',
    image: 'https://picsum.photos/seed/sea-level/780/470',
    featured: false,
    breaking: false
  },
  {
    title: 'The rise of artificial intelligence in healthcare',
    slug: 'ai-in-healthcare',
    excerpt: 'AI-powered diagnostics are transforming patient care and medical research.',
    content: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
    category: 'Technology',
    author: 'Alex Chen',
    image: 'https://picsum.photos/seed/ai-health/780/470',
    featured: true,
    breaking: false
  },
  {
    title: 'Rwanda launches 5G network across Kigali as digital transformation accelerates',
    slug: 'rwanda-launches-5g-network-kigali',
    excerpt: 'Rwanda has officially launched its 5G mobile network in Kigali, marking a significant milestone in the country\'s digital transformation journey and positioning it as a regional tech hub.',
    content: 'Rwanda has officially launched its 5G mobile network in Kigali, marking a significant milestone in the country\'s digital transformation journey. The rollout, led by MTN Rwanda in partnership with the Rwanda Utilities Regulatory Authority (RURA), covers the city of Kigali with initial expansion plans for secondary cities including Musanze, Huye, and Rubavu.\n\nSpeaking at the launch event, the Minister of ICT and Innovation expressed optimism about the impact of 5G technology on various sectors including healthcare, education, and agriculture. The network promises speeds up to 10 times faster than current 4G LTE connections, enabling real-time applications such as remote surgery, smart agriculture monitoring, and advanced logistics tracking.\n\nBusinesses in Kigali\'s special economic zones will be among the first to benefit from the enhanced connectivity, with smart factory implementations already in pilot phase. The government has also announced a 5G innovation fund to support local startups developing applications for the new network.\n\nThis launch cements Rwanda\'s position as a leader in ICT adoption in Africa, following previous successes with the Irembo e-government platform and the Kigali Innovation City project.',
    category: 'Technology',
    author: 'The News',
    image: 'https://picsum.photos/seed/rwanda-5g/780/470',
    featured: true,
    breaking: true,
    source: 'igihe'
  },
  {
    title: 'BK TecHouse opens applications for 2026 fintech accelerator cohort',
    slug: 'bk-techouse-2026-fintech-cohort',
    excerpt: 'Bank of Kigali\'s innovation hub BK TecHouse has opened applications for its 2026 fintech accelerator program, seeking startups building financial solutions for the African market.',
    content: 'Bank of Kigali\'s innovation hub, BK TecHouse, has officially opened applications for its 2026 fintech accelerator program. The program, now in its fourth year, seeks to identify and support early-stage fintech startups building innovative financial solutions for the African market.\n\nSelected startups will receive up to $50,000 in seed funding, mentorship from industry experts, access to BK\'s banking infrastructure APIs, and office space at the BK TecHouse facility in Kigali. The three-month program culminates in a demo day where startups pitch to a panel of investors.\n\nPrevious cohorts have produced successful ventures including PayAfrik, a mobile payments platform now serving over 200,000 users across Rwanda and Uganda, and AgriFinance, a digital lending platform for smallholder farmers.\n\nApplications are open until August 15, 2026, with the program running from September to November. Startups from across Africa are encouraged to apply, with priority given to those addressing financial inclusion challenges in underserved communities.',
    category: 'Technology',
    author: 'The News',
    image: 'https://picsum.photos/seed/bk-techouse/780/470',
    featured: true,
    breaking: false,
    source: 'igihe'
  },
  {
    title: 'Government completes digitization of land registration system nationwide',
    slug: 'rwanda-digital-land-registration',
    excerpt: 'Rwanda has completed the nationwide digitization of its land registration system, making it possible for citizens to access land titles and conduct transactions entirely online through the Irembo platform.',
    content: 'Rwanda has achieved a major milestone in its e-governance journey with the completion of nationwide land registration digitization. The project, implemented by the Rwanda Land Management and Use Authority in partnership with the Rwanda Information Society Authority (RISA), has digitized over 8 million land parcels across the country.\n\nCitizens can now access land titles, apply for transfers, and conduct property transactions entirely through the Irembo e-government platform, eliminating the need for physical visits to district offices. The system integrates with mobile money services for fee payments and provides SMS notifications for application status updates.\n\n"This reform significantly reduces corruption and delays in land administration," said the Director General of the Rwanda Land Management and Use Authority. "The average processing time for land transfers has been reduced from 30 days to just 3 days."\n\nThe digitization project is part of Rwanda\'s broader Smart Rwanda Master Plan, which aims to digitize all government services by 2028. Similar digitization efforts are underway for business registration, marriage certificates, and driver\'s license renewals.',
    category: 'Technology',
    author: 'The News',
    image: 'https://picsum.photos/seed/land-registration/780/470',
    featured: false,
    breaking: true,
    source: 'igihe'
  },
  {
    title: 'Irembo platform surpasses 10 million transactions processed in 2025',
    slug: 'irembo-10-million-transactions',
    excerpt: 'Rwanda\'s flagship e-government platform Irembo has processed over 10 million transactions in 2025 alone, representing a 40% increase from the previous year and demonstrating growing digital adoption.',
    content: 'Rwanda\'s e-government platform Irembo has achieved a significant milestone, processing over 10 million transactions in 2025 alone. This represents a 40% increase from the previous year and brings the total transactions processed since launch to over 50 million.\n\nThe platform, which offers over 100 government services online, has seen particular growth in mobile usage, with 65% of transactions now conducted via smartphones. The most popular services include birth certificate requests, good conduct certificates, tax filings, and land transfer applications.\n\nIrembo CEO noted that the platform has saved citizens an estimated 15 million hours in queuing time annually. "We are now working on integrating AI-powered chatbots to help citizens navigate services and introducing voice-based interfaces for users with limited literacy," he said.\n\nThe platform\'s success has attracted international attention, with delegations from over 20 African countries visiting Rwanda to study the Irembo model for potential adoption in their own countries.',
    category: 'Technology',
    author: 'The News',
    image: 'https://picsum.photos/seed/irembo/780/470',
    featured: false,
    breaking: false,
    source: 'igihe'
  },
  {
    title: 'Apple unveils next-generation M4 chip with dedicated AI neural engine',
    slug: 'apple-m4-chip-ai-neural-engine',
    excerpt: 'Apple has announced its M4 processor featuring a dedicated neural engine capable of 38 trillion operations per second, marking the company\'s biggest leap in AI-focused chip design.',
    content: 'Apple has unveiled its latest silicon innovation, the M4 processor, at a special event in Cupertino. The chip features a dedicated 16-core neural engine capable of an unprecedented 38 trillion operations per second, purpose-built for AI and machine learning workloads.\n\nThe M4 is built on a 3-nanometer process and incorporates 28 billion transistors, offering up to 50% faster CPU performance and 4x faster graphics performance compared to the M2 chip. A new media engine includes dedicated hardware for AV1 decoding and advanced video processing capabilities.\n\nApple executives positioned the M4 as a watershed moment for on-device AI, with capabilities that enable real-time language translation, advanced photo and video editing, and sophisticated voice recognition without sending data to the cloud. The chip also introduces hardware-accelerated ray tracing for gaming and professional graphics workflows.\n\nThe M4 will first ship in the next-generation MacBook Pro and iPad Pro models, with Apple claiming up to 22 hours of battery life in the MacBook Pro configuration.',
    category: 'Technology',
    author: 'The News',
    image: 'https://picsum.photos/seed/apple-m4/780/470',
    featured: true,
    breaking: true,
    source: 'BBC'
  },
  {
    title: 'Google DeepMind achieves major breakthrough in protein folding prediction',
    slug: 'deepmind-protein-folding-breakthrough',
    excerpt: 'Google DeepMind\'s AlphaFold2 has achieved near-perfect accuracy in predicting protein structures, unlocking new possibilities for drug discovery and disease treatment research.',
    content: 'Google DeepMind has announced a major scientific breakthrough with its AlphaFold2 system, which can now predict the three-dimensional structure of proteins with near-perfect accuracy. The system, trained on the Protein Data Bank of known structures, achieved a median score of 92.4 on the Global Distance Test (GDT), compared to the 90-point threshold typically considered equivalent to experimental methods.\n\nProtein folding — the process by which proteins assume their functional three-dimensional shapes — has been one of biology\'s grand challenges for over 50 years. The ability to accurately predict protein structures from amino acid sequences alone has profound implications for drug discovery, disease understanding, and synthetic biology.\n\nDeepMind has made AlphaFold2\'s predictions freely available for over 200 million proteins, creating a comprehensive open-access database that researchers worldwide can use. Since the database launched, it has been accessed by over 1 million researchers and has been cited in thousands of studies.\n\nThe breakthrough has particularly accelerated research into neglected tropical diseases, including malaria and Chagas disease, where structural knowledge of parasite proteins could lead to new therapeutic approaches.',
    category: 'Technology',
    author: 'The News',
    image: 'https://picsum.photos/seed/deepmind/780/470',
    featured: true,
    breaking: false,
    source: 'BBC'
  },
  {
    title: 'SpaceX successfully tests orbital refueling technology for deep space missions',
    slug: 'spacex-orbital-refueling-test',
    excerpt: 'SpaceX has successfully demonstrated orbital propellant transfer between two Starship vehicles, a critical capability for NASA\'s Artemis program and future Mars missions.',
    content: 'SpaceX has achieved a critical milestone for deep space exploration, successfully demonstrating orbital propellant transfer between two Starship vehicles in low Earth orbit. The test involved the Starship tanker transferring over 100 metric tons of liquid methane and liquid oxygen to a receiving Starship vehicle.\n\nThis capability is essential for NASA\'s Artemis program, which plans to use a Starship variant as the Human Landing System for returning astronauts to the Moon\'s surface. Orbital refueling allows Starship to carry the massive amounts of propellant needed for lunar and Martian missions by launching multiple tanker flights to transfer propellant in orbit.\n\n"Without orbital refueling, Starship cannot achieve its full potential for deep space missions," said a SpaceX spokesperson. "This test validates the technology that will enable humanity to become a multi-planetary species."\n\nThe successful test follows a series of development flights from SpaceX\'s Boca Chica facility in Texas. NASA Administrator praised the achievement, noting that the technology demonstration brings the goal of sustained lunar presence significantly closer to reality.',
    category: 'Technology',
    author: 'The News',
    image: 'https://picsum.photos/seed/spacex/780/470',
    featured: false,
    breaking: true,
    source: 'BBC'
  },
  {
    title: 'EU adopts landmark regulation framework for artificial intelligence systems',
    slug: 'eu-ai-regulation-framework',
    excerpt: 'The European Union has adopted the world\'s first comprehensive AI regulation framework, categorizing AI systems by risk level and imposing strict requirements on high-risk applications.',
    content: 'The European Union has adopted the world\'s first comprehensive legal framework for artificial intelligence, marking a defining moment for technology governance. The AI Act, which received overwhelming support from the European Parliament, categorizes AI systems into four risk levels: minimal, limited, high, and unacceptable.\n\nHigh-risk AI applications — including those used in critical infrastructure, employment, healthcare, and law enforcement — will face strict requirements including human oversight, transparency, risk assessment, and data governance. Unacceptable risk systems, such as social scoring by governments and real-time biometric surveillance in public spaces, are banned entirely.\n\nThe regulation also introduces specific rules for generative AI systems like ChatGPT and Midjourney, requiring them to disclose AI-generated content, implement safeguards against illegal content generation, and publish summaries of copyrighted training data used.\n\nNon-compliance can result in fines of up to 7% of global annual turnover or 35 million euros, whichever is higher. The regulation will come into full effect over a phased timeline through 2028, giving companies time to adapt their systems to the new requirements.',
    category: 'Technology',
    author: 'The News',
    image: 'https://picsum.photos/seed/eu-ai/780/470',
    featured: true,
    breaking: false,
    source: 'BBC'
  }
];

const defaultCategories = [
  { name: 'Technology', slug: 'technology', description: 'Latest in tech, gadgets, and innovation', order: 1 },
  { name: 'Business', slug: 'business', description: 'Markets, finance, and business news', order: 2 },
  { name: 'Sports', slug: 'sports', description: 'Sports coverage from around the world', order: 3 },
  { name: 'Entertainment', slug: 'entertainment', description: 'Movies, music, and celebrity news', order: 4 },
  { name: 'Politics', slug: 'politics', description: 'Political news and analysis', order: 5 },
  { name: 'World', slug: 'world', description: 'International news and global affairs', order: 6 },
  { name: 'Health', slug: 'health', description: 'Health, wellness, and medical news', order: 7 },
  { name: 'Science', slug: 'science', description: 'Scientific discoveries and research', order: 8 }
];

const defaultAds = [
  { title: 'BK Bank of Kigali', subtitle: 'Tuzan BK - Banking services', image: 'https://igihe.com/IMG/logo/tuzanbkkinyarwanda.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/bk-banner-236554', position: 'banner', active: true, clicks: 1240, category: 'Business' },
  { title: 'Heineken - Bralirwa', subtitle: 'Gerayo Amahoro', image: 'https://www.igihe.com/IMG/gif/bra_gerayo_amahoro_web_banner_638x90px.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/heineken-web-banner1', position: 'after-menu', active: true, clicks: 2150, category: 'World' },
  { title: 'GT Bank Rwanda', subtitle: 'GT Bank - June 2026', image: 'https://www.igihe.com/IMG/gif/gt_bank_banner_june_2026.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/gt-bank-banner-250632', position: 'after-menu', active: true, clicks: 980, category: 'Business' },
  { title: 'SKOL - Bralirwa', subtitle: 'SKOL mobile banner', image: 'https://igihe.com/IMG/gif/igihe-mob-728x90_1_.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/skol-mobile-banner-250386', position: 'banner', active: true, clicks: 1870, category: 'Sports' },
  { title: 'MTN Rwanda', subtitle: 'MTN unified banner', image: 'https://igihe.com/IMG/gif/igihe_300x250px_unified.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/mtn-web-banner-243497', position: 'sidebar', active: true, clicks: 3200, category: 'Technology' },
  { title: 'Storykast - Stella', subtitle: 'Stella banner ad', image: 'https://igihe.com/IMG/png/stella_banner-01.png', link: 'https://www.igihe.com/serivisi/kwamamaza/article/storykast-banner-241312', position: 'inline', active: true, clicks: 650, category: 'Entertainment' },
  { title: 'MTN 300x250 Sidebar', subtitle: 'MTN sidebar promotion', image: 'https://igihe.com/IMG/gif/igihe_300x250px_unified.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/mtn-web-banner-243497', position: 'sidebar', active: true, clicks: 1560, category: 'Technology' },
  { title: 'Heineken Leaderboard', subtitle: 'Heineken premium leaderboard', image: 'https://www.igihe.com/IMG/gif/bra_gerayo_amahoro_web_banner_638x90px.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/heineken-web-banner1', position: 'leaderboard', active: true, clicks: 890, category: 'World' },
  { title: 'BK Bank Banner', subtitle: 'Bank of Kigali - Tuzan BK', image: 'https://igihe.com/IMG/logo/tuzanbkkinyarwanda.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/bk-banner-236554', position: 'hero-banner', active: true, clicks: 430, category: 'Business' },
  { title: 'GT Bank Leaderboard', subtitle: 'GT Bank financial services', image: 'https://www.igihe.com/IMG/gif/gt_bank_banner_june_2026.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/gt-bank-banner-250632', position: 'leaderboard', active: true, clicks: 720, category: 'Business' },
  { title: 'SKOL Promo', subtitle: 'SKOL beer promotion', image: 'https://igihe.com/IMG/gif/igihe-mob-728x90_1_.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/skol-mobile-banner-250386', position: 'inline', active: true, clicks: 540, category: 'Sports' },
  { title: 'Storykast Entertainment', subtitle: 'Stella entertainment', image: 'https://igihe.com/IMG/png/stella_banner-01.png', link: 'https://www.igihe.com/serivisi/kwamamaza/article/storykast-banner-241312', position: 'sidebar', active: true, clicks: 380, category: 'Entertainment' },
  { title: 'BK Premium Banking', subtitle: 'Bank of Kigali premium', image: 'https://igihe.com/IMG/logo/tuzanbkkinyarwanda.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/bk-banner-236554', position: 'banner', active: true, clicks: 1120, category: 'Business' },
  { title: 'MTN Hero Banner', subtitle: 'MTN - Connect with the world', image: 'https://igihe.com/IMG/gif/igihe_300x250px_unified.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/mtn-web-banner-243497', position: 'hero-banner', active: true, clicks: 2100, category: 'Technology' },
  { title: 'Bralirwa After Menu', subtitle: 'Bralirwa - Gerayo Amahoro', image: 'https://www.igihe.com/IMG/gif/bra_gerayo_amahoro_web_banner_638x90px.gif', link: 'https://www.igihe.com/serivisi/kwamamaza/article/heineken-web-banner1', position: 'after-menu', active: true, clicks: 1650, category: 'World' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Article.deleteMany({});
    console.log('Cleared existing articles');

    await User.deleteMany({});
    console.log('Cleared existing users');

    await Category.deleteMany({});
    console.log('Cleared existing categories');

    await Advertisement.deleteMany({});
    console.log('Cleared existing advertisements');

    const result = await Article.insertMany(articles);
    console.log(`Seeded ${result.length} articles`);

    await Category.insertMany(defaultCategories);
    console.log(`Seeded ${defaultCategories.length} categories`);

    await Advertisement.insertMany(defaultAds);
    console.log(`Seeded ${defaultAds.length} advertisements`);

    await User.create({
      name: 'Admin',
      email: 'reneniyi@gmail.com',
      password: 'Dad43@43',
      role: 'admin'
    });
    console.log('Created admin user: reneniyi@gmail.com');

    await User.create({
      name: 'Demo User',
      email: 'user@demo.com',
      password: 'user1234',
      role: 'user'
    });
    console.log('Created demo user: user@demo.com');

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
