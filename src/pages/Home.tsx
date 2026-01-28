import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, TrendingUp, MessageCircle, Play } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Marquee } from "../components/ui/marquee";
import { ScrollReveal } from "../components/ui/scroll-reveal";
import { AnimatedBubbleParticles } from "../components/ui/animated-bubble-particles";
import ImageReveal from "../components/ui/image-reveal";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { LayoutTextFlip } from "../components/ui/layout-text-flip";
import WebcamPixelGrid from "../components/ui/webcam-pixel-grid";
import Counter from "../components/ui/counter";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";

gsap.registerPlugin(ScrollTrigger);

// Service data
const services = [
    {
        id: 'marketing',
        title: 'Marketing',
        description: 'Brand activation, trade engagement, consumer experiences, and event design that captivate audiences.',
        icon: TrendingUp,
        color: 'coral',
        items: ['Brand Activation', 'Trade Engagement', 'Consumer & Experiential', 'Event Design & Execution'],
    },
    {
        id: 'communication',
        title: 'Communication',
        description: 'Strategic messaging, reputation management, and media relations that build lasting trust.',
        icon: MessageCircle,
        color: 'indigo',
        items: ['Perception & Reputation', 'Public Affairs', 'Crisis Communication', 'Media Relations'],
    },
    {
        id: 'content',
        title: 'Content',
        description: 'Digital engagement, influencer partnerships, and audio-visual production that tell your story.',
        icon: Play,
        color: 'acid',
        items: ['Social Media Curation', 'Influencer Management', 'Visual Curation', 'Audio-visual Production'],
    },
];

export default function Home() {
    const heroRef = useRef(null);
    const servicesRef = useRef(null);
    const philosophyRef = useRef(null);
    const statsRef = useRef(null);

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Hero animations
            gsap.fromTo(heroRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: 'power2.out' }
            );

            // Services stagger
            gsap.fromTo('.service-card',
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: servicesRef.current,
                        start: 'top 80%',
                    },
                }
            );

            // Philosophy text reveal
            gsap.fromTo('.reveal-text',
                { y: 30, opacity: 0, rotateX: 10 },
                {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    stagger: 0.08,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: philosophyRef.current,
                        start: 'top 70%',
                    },
                }
            );

            // Stats counter animation
            gsap.fromTo('.stat-item',
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: 'top 80%',
                    },
                }
            );
        }, heroRef);

        return () => ctx.revert();
    }, []);

    return (
        <Layout>
            {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="relative min-h-screen flex items-center border-b-3 border-ink overflow-hidden bg-paper">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 items-center">

                    {/* Left: Design & Strategy */}
                    <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 lg:py-24 relative overflow-hidden order-2 lg:order-1">

                        <div className="mb-12 w-full max-w-xl">
                            <Marquee>
                                <span className="inline-block px-4 py-2 mx-4 bg-acid text-ink font-archivo text-sm uppercase tracking-wider border-2 border-ink shadow-brutal-sm text-nowrap">
                                    The Engagement Agency
                                </span>
                                <span className="inline-block px-4 py-2 mx-4 bg-coral text-paper font-archivo text-sm uppercase tracking-wider border-2 border-ink shadow-brutal-sm text-nowrap">
                                    Experiences That Matter
                                </span>
                                <span className="inline-block px-4 py-2 mx-4 bg-indigo text-paper font-archivo text-sm uppercase tracking-wider border-2 border-ink shadow-brutal-sm text-nowrap">
                                    Strategy First
                                </span>
                            </Marquee>
                        </div>

                        <div className="mb-10 font-archivo flex flex-col gap-8"> {/* Increased gap for more spacing */}
                            <span className="text-3xl md:text-5xl font-black text-ink tracking-tighter">WE DESIGN</span>
                            <div className="h-20">
                                <LayoutTextFlip
                                    text=""
                                    words={["ENGAGEMENT", "EXPERIENCES", "STRATEGY", "IMPACT"]}
                                    duration={2500}
                                    className="text-4xl md:text-6xl font-black text-coral" />
                            </div>
                        </div>

                        <div className="mb-16 max-w-2xl text-left">
                            <p className="text-xl md:text-2xl text-ink/80 leading-relaxed font-outfit">
                                We span the realms of digital, physical, and immersive experiences, connecting brands with their audiences in meaningful ways.
                            </p>
                        </div>

                        <div className="flex gap-6">
                            <Link to="/contact" className="brutal-btn-coral flex items-center gap-3 px-8 py-4 text-lg">
                                Start a Project <ArrowRight className="w-6 h-6 ml-2" />
                            </Link>
                            <button className="brutal-btn bg-transparent border-ink text-ink hover:bg-ink hover:text-paper flex items-center gap-3 px-8 py-4 text-lg">
                                <Play className="w-6 h-6 mr-2" /> Showreel
                            </button>
                        </div>
                    </div>



                    {/* Right: Webcam Pixel Grid Effect */}
                    <div className="relative h-full min-h-[500px] bg-paper flex items-center justify-center p-4 md:p-8 lg:pr-16 order-1 lg:order-2"> {/* Changed bg-black to bg-paper */}
                        <div className="relative w-full h-full rounded-[2rem] overflow-hidden border-4 border-ink shadow-2xl"> {/* Added rounding container */}
                            <WebcamPixelGrid
                                gridCols={40}
                                gridRows={30}
                                motionSensitivity={0.5}
                                gapRatio={0.05}
                                borderColor="#ff4d4d" // Coral-ish
                                monochromeColor="#e0e7ff" // Indigo-ish tint
                                backgroundColor="#FEF9EF" // Match hero section background
                                colorMode="webcam" // or monochrome
                                className="absolute inset-0 w-full h-full z-0"
                            />

                            <div className="relative z-10 text-center pointer-events-none mix-blend-difference px-6 h-full flex flex-col items-center justify-center">
                                <p className="font-archivo text-5xl md:text-7xl font-bold tracking-tighter text-white mb-2 leading-none">
                                    FOCUSED ON
                                </p>
                                <p className="font-archivo text-5xl md:text-7xl font-bold tracking-tighter text-coral mb-6 leading-none outline-text-white">
                                    YOUR VISION
                                </p>
                                <p className="font-sans text-xl text-white/80 max-w-md mx-auto">
                                    We see the world through your brand's eyes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
          FEATURE HIGHLIGHT - Container Scroll
          ═══════════════════════════════════════════════════════════════════ */}
            <section className="bg-paper overflow-hidden">
                <ContainerScroll
                    titleComponent={
                        <>
                            <h1 className="text-4xl font-semibold text-ink dark:text-white">
                                Unleash the power of <br />
                                <span className="text-4xl md:text-6xl lg:text-[6rem] font-bold mt-1 leading-none font-archivo text-coral">
                                    Strategic Design
                                </span>
                            </h1>
                        </>
                    }
                >
                    <img
                        src="/hero_colorful.jpg"
                        alt="hero"
                        height={720}
                        width={1400}
                        className="mx-auto rounded-2xl object-cover h-full object-left-top draggable-false"
                    />
                </ContainerScroll>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
          SERVICES SECTION
          ═══════════════════════════════════════════════════════════════════ */}
            <section ref={servicesRef} className="section-brutal bg-cream">
                <div className="container-brutal">
                    {/* Section Header */}
                    <div className="mb-16">
                        <span className="inline-block px-4 py-2 bg-ink text-paper font-archivo text-sm uppercase tracking-wider mb-6">
                            What We Do
                        </span>
                        <h2 className="text-section font-archivo">
                            OUR <span className="text-coral">SERVICES</span>
                        </h2>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <Link
                                key={service.id}
                                to={`/services#${service.id}`}
                                className={`service-card brutal-card p-8 group cursor-pointer ${service.color === 'coral' ? 'hover:bg-coral' :
                                    service.color === 'indigo' ? 'hover:bg-indigo' :
                                        'hover:bg-ink'
                                    } transition-colors`}
                            >
                                <div className={`w-16 h-16 border-3 border-ink flex items-center justify-center mb-6 ${service.color === 'coral' ? 'bg-coral' :
                                    service.color === 'indigo' ? 'bg-indigo' :
                                        'bg-acid'
                                    }`}>
                                    <service.icon className={`w-8 h-8 ${service.color === 'acid' ? 'text-ink' : 'text-paper'}`} />
                                </div>

                                <h3 className="font-archivo text-2xl uppercase mb-4 group-hover:text-paper transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-ink/70 mb-6 group-hover:text-paper/70 transition-colors">
                                    {service.description}
                                </p>

                                <ul className="space-y-2">
                                    {service.items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm group-hover:text-paper/80 transition-colors">
                                            <span className="w-2 h-2 bg-coral group-hover:bg-paper" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 flex items-center gap-2 font-archivo text-sm uppercase text-coral group-hover:text-paper transition-colors">
                                    Learn More <ArrowRight className="w-4 h-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
          PHILOSOPHY SECTION - Aceternity Text Reveal replaced with Generate Effect
          ═══════════════════════════════════════════════════════════════════ */}
            <section className="section-brutal bg-ink text-paper flex justify-center items-center min-h-[60vh]">
                <div className="container-brutal">
                    <div className="flex flex-col items-center">
                        <h2 className="text-section font-archivo mb-12 text-center">
                            OUR <span className="text-coral">PHILOSOPHY</span>
                        </h2>

                        <div className="max-w-5xl mx-auto text-center">
                            <ScrollReveal
                                size="2xl"
                                textClassName="text-white font-archivo leading-tight font-medium"
                                align="center"
                                baseOpacity={0.2}
                            >
                                We believe in the power of connection. Great experiences begin with strategy. Great experiences begin with intentional engagement.
                            </ScrollReveal>
                        </div>

                        <div className="mt-20 text-center">
                            <Link to="/about" className="brutal-btn bg-coral border-paper text-paper hover:bg-paper hover:text-ink transition-all">
                                About Our Philosophy
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
          FEATURED WORK - Image Reveal
          ═══════════════════════════════════════════════════════════════════ */}
            <section className="bg-paper py-24 border-y-3 border-ink">
                <div className="container-brutal mb-12">
                    <span className="inline-block px-4 py-2 bg-indigo text-paper font-archivo text-sm uppercase tracking-wider mb-6">
                        Selected Work
                    </span>
                    <h2 className="text-section font-archivo text-ink">
                        RECENT <span className="text-coral">PROJECTS</span>
                    </h2>
                </div>
                <ImageReveal />
                <div className="container-brutal mt-12 text-center">
                    <Link to="/services" className="brutal-btn bg-transparent border-ink text-ink hover:bg-ink hover:text-paper">
                        View All Projects <ArrowRight className="inline w-5 h-5 ml-2" />
                    </Link>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
          STATS SECTION
          ═══════════════════════════════════════════════════════════════════ */}
            <div className="relative h-auto min-h-[500px] md:h-[60vh] w-full bg-ink border-y-3 border-ink flex items-center justify-center py-16 md:py-0">
                <AnimatedBubbleParticles
                    particleColor="#FF5E3A" // Coral particles requesting via hex
                    backgroundColor="#1a1a1a" // Dark bg
                    particleSize={40}
                    spawnInterval={300}
                    className="h-full w-full absolute inset-0"
                >
                    <div className="container-brutal relative z-10 w-full h-full flex items-center justify-center">

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 w-full">
                            {[
                                { label: "Years Combined Experience", value: 80, suffix: "+" },
                                { label: "Happy Clients", value: 150, suffix: "+" },
                                { label: "Projects Delivered", value: 130, suffix: "+" },
                                { label: "Positive Feedback", value: 99, suffix: "%" },
                            ].map((stat, i) => (
                                <div key={i} className="stat-item text-center flex flex-col items-center justify-center">
                                    <p className="font-archivo text-5xl md:text-8xl text-white mb-4 font-black tracking-tighter flex items-center justify-center">
                                        <Counter value={stat.value} />{stat.suffix}
                                    </p>
                                    <p className="font-dm text-sm md:text-base uppercase tracking-widest text-white/80 font-bold border-t-2 border-white/20 pt-4">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </AnimatedBubbleParticles>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
          TESTIMONIALS SECTION - Using Aceternity AnimatedTestimonials
          ═══════════════════════════════════════════════════════════════════ */}
            <section className="section-brutal bg-paper py-24 border-b-3 border-ink overflow-hidden">
                <div className="container-brutal mb-16 relative z-10">
                    <div className="text-center">
                        <span className="inline-block px-4 py-2 bg-coral text-paper font-archivo text-sm uppercase tracking-wider mb-6">
                            Client Love
                        </span>
                        <h2 className="text-section font-archivo text-ink">
                            WHAT <span className="text-coral">CLIENTS</span> SAY
                        </h2>
                    </div>
                </div>

                <div className="container-brutal">
                    <AnimatedTestimonials
                        autoplay={true}
                        testimonials={[
                            {
                                quote: "Boucles transformed our brand identity completely. The strategic approach they took was exactly what we needed to stand out in a crowded market.",
                                name: "Sarah Jenkins",
                                designation: "CMO, TechFlow",
                                src: "/testimonial_1.jpg",
                            },
                            {
                                quote: "The team at Boucles is simply failure-intolerant. They pushed our creative boundaries and delivered a campaign that went viral within days.",
                                name: "Marcus Thorne",
                                designation: "Director, ArtVibe",
                                src: "/testimonial_2.jpg",
                            },
                            {
                                quote: "Exceptional attention to detail. From the website interactions to the print materials, everything was cohesive and beautifully executed.",
                                name: "Elena Rodriguez",
                                designation: "Founder, GreenLeaf",
                                src: "/testimonial_3.jpg",
                            },
                        ]}
                    />
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════════
          BLOG TEASER SECTION
          ═══════════════════════════════════════════════════════════════════ */}
            <section className="section-brutal bg-indigo text-paper">
                <div className="container-brutal">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <span className="inline-block px-4 py-2 bg-paper text-ink font-archivo text-sm uppercase tracking-wider mb-6">
                                Insights
                            </span>
                            <h2 className="text-section font-archivo">
                                FROM OUR <span className="text-acid">BLOG</span>
                            </h2>
                            <p className="text-paper/60 text-lg mt-4 max-w-xl">
                                Thoughts on marketing, African markets, and building brands that matter.
                            </p>
                        </div>
                        <Link to="/blog" className="brutal-btn bg-acid text-ink border-paper shrink-0">
                            View All Posts <ArrowRight className="inline w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
