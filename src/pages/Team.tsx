import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Linkedin, ArrowRight } from 'lucide-react';
import Layout from '../components/layout/Layout';

gsap.registerPlugin(ScrollTrigger);

const team = [
    {
        name: 'Mojisola Saka',
        role: 'Chief Engagement & Experience Officer',
        bio: '22+ years Pan-African experience across marketing, communications, and brand management with leading multinationals.',
        color: 'coral',
        linkedin: '#',
    },
    {
        name: 'Omolola Archer',
        role: 'Director, Project Experience',
        bio: 'Expert in marketing communications with extensive experience in project delivery and client success.',
        color: 'indigo',
        linkedin: '#',
    },
    {
        name: 'Aisha Abdulsalam',
        role: 'Curator, Digital Strategy',
        bio: 'Multi-skilled communications specialist with deep expertise in digital engagement and social strategy.',
        color: 'acid',
        linkedin: '#',
    },
    {
        name: 'Adeola Ajibola',
        role: 'Communications Associate',
        bio: 'Professional writing and project management expertise driving impactful communications.',
        color: 'coral',
        linkedin: '#',
    },
];

const stats = [
    { value: '80+', label: 'Years Combined Experience' },
    { value: '20+', label: 'Top Regional Brands Served' },
    { value: '4', label: 'Core Experts' },
];

export default function Team() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Hero animation
            gsap.fromTo('.team-hero-text',
                { y: 80, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15 }
            );

            // Team cards stagger with rotation
            gsap.fromTo('.team-card',
                { y: 100, opacity: 0, rotate: -5 },
                {
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                    stagger: 0.12,
                    duration: 0.7,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.team-grid',
                        start: 'top 75%',
                    },
                }
            );

            // Stats animation
            gsap.fromTo('.team-stat',
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: '.team-stats',
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
                <section className="relative min-h-[60vh] flex items-center border-b-3 border-ink overflow-hidden">
                    <div className="absolute inset-0 pattern-dots opacity-20" />
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-indigo border-3 border-ink shadow-brutal hidden lg:block" />

                    <div className="container-brutal px-6 md:px-12 py-24">
                        <span className="team-hero-text inline-block px-4 py-2 bg-ink text-paper font-archivo text-sm uppercase tracking-wider mb-8">
                            Our Team
                        </span>
                        <h1 className="team-hero-text text-hero font-archivo mb-8">
                            MEET THE <span className="text-coral">CURATORS</span>
                        </h1>
                        <p className="team-hero-text text-xl md:text-2xl text-ink/70 max-w-3xl leading-relaxed font-outfit">
                            Award-winning experts with 80+ years combined experience
                            across Africa's top brands.
                        </p>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="team-stats section-brutal bg-acid py-16">
                    <div className="container-brutal">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="team-stat text-center">
                                    <p className="font-archivo text-5xl md:text-6xl text-ink mb-2">
                                        {stat.value}
                                    </p>
                                    <p className="font-dm text-sm uppercase tracking-wider text-ink/70">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Grid */}
                <section className="section-brutal bg-paper">
                    <div className="container-brutal">
                        <div className="team-grid grid grid-cols-1 md:grid-cols-2 gap-8">
                            {team.map((member, i) => (
                                <div
                                    key={i}
                                    className={`team-card brutal-card p-8 ${member.color === 'coral' ? 'hover:bg-coral' :
                                        member.color === 'indigo' ? 'hover:bg-indigo' :
                                            'hover:bg-ink'
                                        } group transition-colors`}
                                >
                                    {/* Avatar Placeholder */}
                                    <div className={`w-24 h-24 border-3 border-ink mb-6 flex items-center justify-center font-archivo text-3xl ${member.color === 'coral' ? 'bg-coral text-paper group-hover:bg-paper group-hover:text-coral' :
                                        member.color === 'indigo' ? 'bg-indigo text-paper group-hover:bg-paper group-hover:text-indigo' :
                                            'bg-acid text-ink group-hover:bg-paper'
                                        } transition-colors`}>
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>

                                    <h3 className="font-archivo text-2xl uppercase mb-2 group-hover:text-paper transition-colors">
                                        {member.name}
                                    </h3>

                                    <p className={`font-bebas text-lg tracking-wider mb-4 ${member.color === 'coral' ? 'text-coral' :
                                        member.color === 'indigo' ? 'text-indigo' :
                                            'text-ink'
                                        } group-hover:text-paper/80 transition-colors`}>
                                        {member.role}
                                    </p>

                                    <p className="text-ink/70 mb-6 group-hover:text-paper/70 transition-colors font-outfit">
                                        {member.bio}
                                    </p>

                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-archivo uppercase group-hover:text-paper transition-colors"
                                    >
                                        <Linkedin className="w-5 h-5" /> LinkedIn
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="section-brutal bg-indigo text-paper">
                    <div className="container-brutal text-center">
                        <h2 className="text-section font-archivo mb-8">
                            WANT TO <span className="text-acid">JOIN</span> US?
                        </h2>
                        <p className="text-xl text-paper/60 max-w-2xl mx-auto mb-12 font-outfit">
                            We're always looking for talented individuals who share our passion
                            for creating impactful experiences.
                        </p>
                        <Link to="/contact" className="brutal-btn bg-acid text-ink border-paper">
                            Get in Touch <ArrowRight className="inline w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
