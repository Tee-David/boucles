import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Facebook } from 'lucide-react';
import Layout from '../components/layout/Layout';

// Mock blog post data - in production, fetch from API
const blogPostsData: Record<string, {
    title: string;
    category: string;
    date: string;
    readTime: string;
    author: string;
    content: string;
}> = {
    'art-of-intentional-engagement': {
        title: 'The Art of Intentional Engagement',
        category: 'Strategy',
        date: 'Jan 15, 2026',
        readTime: '5 min',
        author: 'Mojisola Saka',
        content: `
      <p>In today's saturated market, brands that win are those that understand the power of intentional engagement. It's not about shouting the loudest—it's about speaking directly to the hearts of your audience.</p>
      
      <h2>What is Intentional Engagement?</h2>
      <p>Intentional engagement is a strategic approach to brand communication that prioritizes meaningful connections over mere visibility. It's about creating touchpoints that resonate, conversations that matter, and experiences that leave lasting impressions.</p>
      
      <p>Unlike traditional marketing that casts a wide net hoping to catch anyone, intentional engagement is like spear fishing—precise, purposeful, and highly effective.</p>
      
      <h2>The Three Pillars</h2>
      <p>At Boucles, we've identified three core pillars that drive successful intentional engagement:</p>
      
      <ul>
        <li><strong>Understanding:</strong> Deep knowledge of your audience's needs, desires, and pain points.</li>
        <li><strong>Relevance:</strong> Creating content and experiences that matter to your specific audience.</li>
        <li><strong>Authenticity:</strong> Being genuine in every interaction, building trust over time.</li>
      </ul>
      
      <h2>The African Context</h2>
      <p>In African markets, intentional engagement takes on additional significance. The diversity of cultures, languages, and contexts means that one-size-fits-all approaches simply don't work.</p>
      
      <p>Successful brands in Africa are those that take the time to understand local nuances and craft messages that feel native to each market.</p>
      
      <h2>Moving Forward</h2>
      <p>The future belongs to brands that choose quality over quantity, depth over breadth, and meaning over noise. Is your brand ready to make that shift?</p>
    `,
    },
    'building-brand-trust-african-markets': {
        title: 'Building Brand Trust in African Markets',
        category: 'Culture',
        date: 'Jan 10, 2026',
        readTime: '7 min',
        author: 'Omolola Archer',
        content: `
      <p>Africa is not a monolith. From Lagos to Nairobi, Accra to Johannesburg, each market has its unique cultural fabric that shapes how consumers interact with brands.</p>
      
      <h2>Understanding Cultural Nuances</h2>
      <p>Trust is built differently across African markets. What works in Nigeria might not resonate in Kenya, and strategies successful in Ghana might need adjustment for South Africa.</p>
      
      <p>The key is to approach each market with humility, curiosity, and a genuine desire to understand.</p>
      
      <h2>Community-Centric Approaches</h2>
      <p>African consumers often make purchasing decisions within community contexts. Word-of-mouth remains powerful, and community endorsement can make or break a brand.</p>
      
      <h2>Building Long-term Relationships</h2>
      <p>Patience is essential. Unlike markets where quick wins are possible, African markets reward brands that demonstrate long-term commitment and consistent delivery on promises.</p>
    `,
    },
};

export default function BlogPost() {
    const { slug } = useParams<{ slug: string }>();
    const containerRef = useRef<HTMLDivElement>(null);

    const post = slug ? blogPostsData[slug] : null;

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.post-header',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
            );

            gsap.fromTo('.post-content',
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, delay: 0.3 }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [slug]);

    if (!post) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="font-archivo text-4xl mb-4">POST NOT FOUND</h1>
                        <Link to="/blog" className="brutal-btn-coral">
                            Back to Blog
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div ref={containerRef}>
                {/* Back Link */}
                <div className="border-b-3 border-ink py-4">
                    <div className="container-brutal px-6 md:px-12">
                        <Link to="/blog" className="inline-flex items-center gap-2 font-archivo text-sm uppercase hover:text-coral transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Blog
                        </Link>
                    </div>
                </div>

                {/* Article Header */}
                <header className="section-brutal bg-paper">
                    <div className="container-brutal max-w-4xl">
                        <div className="post-header">
                            <span className="inline-block px-4 py-2 bg-coral text-paper font-archivo text-sm uppercase mb-6">
                                {post.category}
                            </span>
                        </div>

                        <h1 className="post-header text-section font-archivo mb-8">
                            {post.title.toUpperCase()}
                        </h1>

                        <div className="post-header flex flex-wrap items-center gap-6 text-ink/60">
                            <span className="font-archivo">By {post.author}</span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> {post.date}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> {post.readTime}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Article Content */}
                <article className="section-brutal bg-cream">
                    <div className="container-brutal max-w-4xl">
                        <div
                            className="post-content prose prose-lg max-w-none font-outfit
                prose-headings:font-archivo prose-headings:uppercase prose-headings:text-ink
                prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b-3 prose-h2:border-ink prose-h2:pb-4
                prose-p:text-ink/80 prose-p:leading-relaxed prose-p:mb-6
                prose-ul:space-y-4 prose-li:text-ink/80
                prose-strong:text-ink prose-strong:font-archivo"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>

                {/* Share Section */}
                <section className="py-12 border-t-3 border-ink bg-paper">
                    <div className="container-brutal max-w-4xl px-6 md:px-12">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <Share2 className="w-5 h-5" />
                                <span className="font-archivo uppercase">Share this article</span>
                            </div>
                            <div className="flex gap-4">
                                <a href="#" className="w-12 h-12 border-3 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-12 h-12 border-3 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a href="#" className="w-12 h-12 border-3 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors">
                                    <Facebook className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="section-brutal bg-indigo text-paper">
                    <div className="container-brutal text-center">
                        <h2 className="text-section font-archivo mb-8">
                            WANT TO <span className="text-acid">WORK</span> WITH US?
                        </h2>
                        <Link to="/contact" className="brutal-btn bg-acid text-ink border-paper">
                            Start a Project
                        </Link>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
