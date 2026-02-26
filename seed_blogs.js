import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const posts = [
    {
        title: "The Future of Tokenomics: Beyond Simple Staking",
        excerpt: "Exploring how next-generation token models are moving beyond basic staking mechanisms to create more sustainable and engaging economic systems. We analyze ve-tokenomics, real yield models, and dynamic emission schedules that are reshaping DeFi.",
        category: "Tokenomics",
        date: "2026-01-02",
        read_time: "8 min read",
        slug: "future-of-tokenomics",
        status: "Published",
    },
    {
        title: "Building Sustainable DeFi Protocols",
        excerpt: "A deep dive into the economic principles that separate successful DeFi protocols from those that fail to maintain long-term growth. Examining liquidity bootstrapping, incentive alignment, and treasury management strategies.",
        category: "DeFi",
        date: "2025-12-18",
        read_time: "12 min read",
        slug: "sustainable-defi",
        status: "Published",
    },
    {
        title: "Go-to-Market Strategies for Web3 Products",
        excerpt: "How to successfully launch a Web3 product in a crowded market: lessons learned from 50+ protocol launches. Covers community building, influencer partnerships, and timing your TGE for maximum impact.",
        category: "Strategy",
        date: "2025-12-05",
        read_time: "10 min read",
        slug: "gtm-web3",
        status: "Published",
    },
    {
        title: "The Role of Governance in Protocol Success",
        excerpt: "Why governance design matters more than ever, and how to build systems that enable meaningful community participation. From token-weighted voting to quadratic mechanisms and delegation frameworks.",
        category: "Governance",
        date: "2025-11-22",
        read_time: "7 min read",
        slug: "governance-success",
        status: "Published",
    },
    {
        title: "Token Vesting Strategies That Work",
        excerpt: "Analyzing vesting schedules that align long-term incentives while maintaining market confidence and team retention. Includes case studies from successful L1s, DeFi protocols, and gaming projects.",
        category: "Tokenomics",
        date: "2025-11-10",
        read_time: "9 min read",
        slug: "token-vesting",
        status: "Published",
    },
    {
        title: "Building Strategic Partnerships in Web3",
        excerpt: "A framework for identifying, approaching, and closing partnerships that create genuine value for all parties. Learn the art of ecosystem alignment and co-marketing in decentralized environments.",
        category: "Business Development",
        date: "2025-10-28",
        read_time: "11 min read",
        slug: "strategic-partnerships",
        status: "Published",
    },
    {
        title: "Navigating Bear Markets: A Protocol Survival Guide",
        excerpt: "Strategies for maintaining runway, community engagement, and development momentum during market downturns. How the best protocols use bear markets to build competitive advantages.",
        category: "Strategy",
        date: "2025-10-15",
        read_time: "14 min read",
        slug: "bear-market-survival",
        status: "Published",
    },
    {
        title: "The Economics of Layer 2 Scaling Solutions",
        excerpt: "Breaking down the tokenomics and value capture mechanisms of rollups, validiums, and other L2 architectures. Understanding sequencer revenue, MEV distribution, and sustainable fee models.",
        category: "Infrastructure",
        date: "2025-10-01",
        read_time: "16 min read",
        slug: "l2-economics",
        status: "Published",
    },
    {
        title: "Community-First Product Development",
        excerpt: "How to leverage your community as a competitive moat while building products that genuinely serve user needs. Implementing feedback loops, governance proposals, and contributor incentives.",
        category: "Product",
        date: "2025-09-18",
        read_time: "8 min read",
        slug: "community-first-product",
        status: "Published",
    },
    {
        title: "VC Relations in Web3: A Founder's Playbook",
        excerpt: "Navigating the unique dynamics of crypto fundraising—from seed rounds to strategic token sales. Building relationships with the right investors who add value beyond capital.",
        category: "Fundraising",
        date: "2025-09-05",
        read_time: "13 min read",
        slug: "vc-relations-web3",
        status: "Published",
    },
    {
        title: "Designing Incentive-Compatible NFT Economies",
        excerpt: "Beyond floor prices: creating NFT ecosystems with genuine utility, sustainable royalties, and aligned stakeholder incentives. Lessons from gaming, identity, and membership applications.",
        category: "NFTs",
        date: "2025-08-22",
        read_time: "10 min read",
        slug: "nft-economies",
        status: "Published",
    },
    {
        title: "Cross-Chain Expansion: When and How to Go Multi-Chain",
        excerpt: "The strategic calculus behind deploying on additional chains. Evaluating ecosystem fit, liquidity fragmentation risks, and the operational complexity of multi-chain protocols.",
        category: "Infrastructure",
        date: "2025-08-08",
        read_time: "12 min read",
        slug: "cross-chain-expansion",
        status: "Published",
    }
];

async function seed() {
    console.log("Seeding blogs...");
    const { data, error } = await supabase.from('blogs').upsert(posts, { onConflict: 'slug' });

    if (error) {
        console.error("Error seeding blogs:", error);
    } else {
        console.log("Successfully seeded blogs!");
    }
}

seed();
