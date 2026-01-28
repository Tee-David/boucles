import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Search, Calendar, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';

gsap.registerPlugin(ScrollTrigger);

// Mock blog posts - in production, fetch from API
const blogPosts = [
    {
        id: 1,
        slug: 'art-of-intentional-engagement',
        title: 'The Art of Intentional Engagement',
        category: 'Strategy',
        excerpt: 'Why the most successful African brands are choosing purposeful, meaningful connections over noise.',
        date: 'Jan 15, 2026',
        readTime: '5 min',
        featured: true,
    },
    {
        id: 2,
        slug: 'building-brand-trust-african-markets',
        title: 'Building Brand Trust in African Markets',
        category: 'Culture',
        excerpt: 'Understanding the cultural nuances that shape consumer loyalty across the continent.',
        date: 'Jan 10, 2026',
        readTime: '7 min',
        featured: false,
    },
    {
        id: 3,
        slug: 'content-that-commands-attention',
        title: 'Content That Commands Attention',
        category: 'Creativity',
        excerpt: 'How to craft narratives that resonate at home while captivating global audiences.',
        date: 'Jan 5, 2026',
        readTime: '4 min',
        featured: false,
    },
    {
        id: 4,
        slug: 'future-of-experiential-marketing',
        title: 'The Future of Experiential Marketing',
        category: 'Strategy',
        excerpt: 'How brands are creating immersive experiences in a post-digital world.',
        date: 'Dec 28, 2025',
        readTime: '6 min',
        featured: false,
    },
    {
        id: 5,
        slug: 'crisis-communication-best-practices',
        title: 'Crisis Communication Best Practices',
        category: 'Communication',
        excerpt: 'Lessons from brands that turned challenges into opportunities for stronger connections.',
        date: 'Dec 20, 2025',
        readTime: '8 min',
        featured: false,
    },
    {
        id: 6,
        slug: 'influencer-partnerships-that-work',
        title: 'Influencer Partnerships That Actually Work',
        category: 'Content',
        excerpt: 'Moving beyond vanity metrics to create authentic, impactful collaborations.',
        date: 'Dec 15, 2025',
        readTime: '5 min',
        featured: false,
    },
];

const categories = ['All', 'Strategy', 'Culture', 'Creativity', 'Communication', 'Content'];

export default function Blog() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = blogPosts.filter(post => {
        const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = blogPosts.find(p => p.featured);
    const regularPosts = filteredPosts.filter(p => !p.featured);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            gsap.fromTo('.blog-hero-text',
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
            );

            // Featured post
            gsap.fromTo('.featured-post',
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    scrollTrigger: {
                        trigger: '.featured-post',
                        start: 'top 80%',
                    },
                }
            );

            // Blog cards stagger
            gsap.fromTo('.blog-card',
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    scrollTrigger: {
                        trigger: '.blog-grid',
                        start: 'top 80%',
                    },
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <Layout>
            <div ref={containerRef}>
                {/* Hero Section */}
                <section className="relative py-24 border-b-3 border-ink overflow-hidden">
                    <div className="absolute inset-0 pattern-dots opacity-20" />

                    <div className="container-brutal px-6 md:px-12">
                        <span className="blog-hero-text inline-block px-4 py-2 bg-ink text-paper font-archivo text-sm uppercase tracking-wider mb-8">
                            Blog
                        </span>
                        <h1 className="blog-hero-text text-hero font-archivo mb-8">
                            <span className="text-coral">INSIGHTS</span> & IDEAS
                        </h1>
                        <p className="blog-hero-text text-xl md:text-2xl text-ink/70 max-w-3xl leading-relaxed font-outfit">
                            Thoughts on marketing, African markets, and building brands that matter.
                        </p>
                    </div>
                </section>

                {/* Filters */}
                <section className="py-8 border-b-3 border-ink bg-cream">
                    <div className="container-brutal px-6 md:px-12">
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            {/* Categories */}
                            <div className="flex flex-wrap gap-3">
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-2 font-archivo text-sm uppercase border-3 border-ink transition-all ${selectedCategory === cat
                                            ? 'bg-ink text-paper shadow-brutal'
                                            : 'bg-paper text-ink hover:bg-ink hover:text-paper'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/50" />
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="brutal-input pl-12 w-full md:w-72"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Post */}
                {featuredPost && selectedCategory === 'All' && !searchQuery && (
                    <section className="section-brutal bg-paper">
                        <div className="container-brutal">
                            <Link to={`/blog/${featuredPost.slug}`} className="featured-post block brutal-card p-8 md:p-12 group">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex-1">
                                        <span className="inline-block px-3 py-1 bg-coral text-paper font-archivo text-xs uppercase mb-4">
                                            Featured
                                        </span>
                                        <span className="inline-block px-3 py-1 bg-ink text-paper font-archivo text-xs uppercase mb-4 ml-2">
                                            {featuredPost.category}
                                        </span>
                                        <h2 className="text-large font-archivo mb-4 group-hover:text-coral transition-colors">
                                            {featuredPost.title.toUpperCase()}
                                        </h2>
                                        <p className="text-lg text-ink/70 mb-6 font-outfit">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-6 text-sm text-ink/50">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> {featuredPost.date}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> {featuredPost.readTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-48 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-coral border-3 border-ink flex items-center justify-center group-hover:translate-x-2 transition-transform">
                                            <ArrowRight className="w-8 h-8 text-paper" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </section>
                )}

                {/* Blog Grid */}
                <section className="section-brutal bg-cream">
                    <div className="container-brutal">
                        {regularPosts.length > 0 ? (
                            <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {regularPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        to={`/blog/${post.slug}`}
                                        className="blog-card brutal-card p-6 group"
                                    >
                                        <span className="inline-block px-3 py-1 bg-ink text-paper font-archivo text-xs uppercase mb-4">
                                            {post.category}
                                        </span>
                                        <h3 className="font-archivo text-xl uppercase mb-3 group-hover:text-coral transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-ink/70 mb-6 line-clamp-2 font-outfit">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-ink/50">
                                            <span className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> {post.date}
                                            </span>
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" /> {post.readTime}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <p className="font-archivo text-2xl text-ink/50">No posts found</p>
                                <button
                                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                                    className="brutal-btn-outline mt-4"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="section-brutal bg-indigo text-paper">
                    <div className="container-brutal text-center">
                        <h2 className="text-section font-archivo mb-8">
                            STAY <span className="text-acid">INFORMED</span>
                        </h2>
                        <p className="text-xl text-paper/60 max-w-2xl mx-auto mb-8 font-outfit">
                            Subscribe to our newsletter for the latest insights on African markets and brand building.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                            <input
                                type="email"
                                placeholder="your@email.com"
                                className="brutal-input flex-1 bg-paper text-ink"
                            />
                            <button type="submit" className="brutal-btn bg-acid text-ink border-paper">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
