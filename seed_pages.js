import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const portfolio_projects = [
    {
        title: "DeFi Protocol Launch",
        category: "Tokenomics",
        metric: "$42M TVL",
        description: "Designed comprehensive tokenomics for a lending protocol, including incentive mechanisms and governance structure. Achieved $42M TVL within 3 months of launch.",
        slug: "defi-protocol",
        year: "2024",
    },
    {
        title: "NFT Marketplace GTM",
        category: "Go-to-Market",
        metric: "180K Users",
        description: "Led go-to-market strategy for a creator-focused NFT marketplace. Developed influencer partnerships and community programs resulting in 180K users in Q1.",
        slug: "nft-marketplace",
        year: "2024",
    },
    {
        title: "L2 Ecosystem Growth",
        category: "Business Development",
        metric: "+340%",
        description: "Expanded ecosystem partnerships for a Layer 2 solution, driving 340% growth in developer activity and onboarding 50+ new protocols.",
        slug: "l2-ecosystem",
        year: "2023",
    },
    {
        title: "DAO Governance Design",
        category: "Product Strategy",
        metric: "95% Pass Rate",
        description: "Architected governance framework for a major DAO, achieving 95% proposal pass rate and 3x increase in voter participation.",
        slug: "dao-governance",
        year: "2023",
    },
    {
        title: "Token Migration",
        category: "Tokenomics",
        metric: "99.7% Migration",
        description: "Managed token migration and economic restructuring for a protocol upgrade, achieving 99.7% successful migration rate.",
        slug: "token-migration",
        year: "2023",
    },
    {
        title: "Cross-Chain Bridge",
        category: "Product Strategy",
        metric: "$120M Volume",
        description: "Product strategy and launch for a cross-chain bridge, reaching $120M in monthly volume within 6 months.",
        slug: "cross-chain-bridge",
        year: "2022",
    },
];

const services = [
    {
        title: "Tokenomics Design",
        description: "Comprehensive token economic models that align incentives, drive adoption, and maximize long-term value.",
        features: [
            "Token supply and distribution modeling",
            "Incentive mechanism design",
            "Vesting schedule optimization",
            "Staking and rewards architecture",
            "Economic simulation and stress testing",
            "Governance framework design",
        ],
        price: "From $15,000",
        icon: "Coins"
    },
    {
        title: "Go-to-Market Strategy",
        description: "Strategic launch planning and execution to maximize adoption and market penetration.",
        features: [
            "Market positioning and messaging",
            "Launch timeline and milestones",
            "Community building strategy",
            "Influencer and KOL partnerships",
            "Exchange listing strategy",
            "Marketing campaign architecture",
        ],
        price: "From $12,000",
        icon: "Rocket"
    },
    {
        title: "Product Strategy",
        description: "End-to-end product vision and roadmap development for protocols and dApps.",
        features: [
            "Product vision and positioning",
            "Feature prioritization framework",
            "User research and personas",
            "Competitive analysis",
            "Roadmap development",
            "KPI definition and tracking",
        ],
        price: "From $10,000",
        icon: "BarChart3"
    },
    {
        title: "Business Development",
        description: "Strategic partnership cultivation and ecosystem growth across the Web3 landscape.",
        features: [
            "Partnership strategy development",
            "Ecosystem mapping and targeting",
            "Integration facilitation",
            "Strategic alliance negotiation",
            "Cross-protocol collaboration",
            "Investor relations support",
        ],
        price: "From $8,000",
        icon: "Users"
    },
];

const values = [
    {
        title: "Data-Driven",
        description: "Every strategic decision is backed by rigorous analysis and market research.",
        order_index: 1
    },
    {
        title: "Results-Focused",
        description: "Success is measured by tangible outcomes: TVL, user growth, and sustainable tokenomics.",
        order_index: 2
    },
    {
        title: "Ecosystem Thinking",
        description: "Building interconnected value across protocols, partners, and communities.",
        order_index: 3
    },
    {
        title: "Long-Term Vision",
        description: "Designing systems that compound value over years, not just quarters.",
        order_index: 4
    },
];

async function seed() {
    console.log("Seeding portfolio projects...");
    const { error: err1 } = await supabase.from('portfolio_projects').upsert(portfolio_projects, { onConflict: 'slug' });
    if (err1) console.error("Error seeding portfolio:", err1);

    console.log("Seeding services...");

    // Since services doesn't have a unique constraint, we wipe the table first to avoid duplicates
    await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: err2 } = await supabase.from('services').insert(services);
    if (err2) console.error("Error seeding services:", err2);

    console.log("Seeding value props (About Me)...");
    await supabase.from('value_props').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error: err3 } = await supabase.from('value_props').insert(values);
    if (err3) console.error("Error seeding value props:", err3);

    console.log("Done seeding!");
}

seed();
