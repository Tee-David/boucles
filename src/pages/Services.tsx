import { Card, Carousel } from '../components/ui/apple-cards-carousel';
import Layout from '../components/layout/Layout';

// DummyContent component definition
const DummyContent = ({ title, desc }: { title: string; desc: string }) => {
    return (
        <div className="relative z-10 p-4">
            <h3 className="text-xl font-bold text-neutral-100">{title}</h3>
            <p className="text-neutral-400 text-sm mt-2 font-outfit">{desc}</p>
        </div>
    );
};

const carouselItems = [
    {
        category: "Marketing",
        title: "Brand Activation.",
        src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=3456&auto=format&fit=crop",
        content: <DummyContent title="Brand Activation" desc="We create memorable brand experiences using data-driven strategies." />,
    },
    {
        category: "Communication",
        title: "Public Affairs.",
        src: "https://images.unsplash.com/photo-1533750088811-7a8b16218a58?q=80&w=3456&auto=format&fit=crop",
        content: <DummyContent title="Public Affairs" desc="Navigating complex stakeholder landscapes with precision." />,
    },
    {
        category: "Content",
        title: "Visual Curation.",
        src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=3456&auto=format&fit=crop",
        content: <DummyContent title="Visual Curation" desc="Compelling visuals that capture attention and tell your story." />,
    },
    {
        category: "Marketing",
        title: "Experiential.",
        src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=3456&auto=format&fit=crop",
        content: <DummyContent title="Experiential Marketing" desc="Creating immersive experiences that convert interest into loyalty." />,
    },
    {
        category: "Strategy",
        title: "Digital Strategy.",
        src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=3456&auto=format&fit=crop",
        content: <DummyContent title="Digital Strategy" desc="Building engaged communities across digital platforms." />,
    },
];

export default function Services() {
    const cards = carouselItems.map((card, index) => (
        <Card key={card.src} card={card} index={index} />
    ));

    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center border-b-3 border-ink overflow-hidden bg-paper">
                <div className="absolute inset-0 pattern-dots opacity-20" />
                <div className="container-brutal px-6 md:px-12 py-24">
                    <span className="inline-block px-4 py-2 bg-ink text-paper font-archivo text-sm uppercase tracking-wider mb-8">
                        Services
                    </span>
                    <h1 className="text-hero font-archivo mb-8">
                        WHAT WE <span className="text-coral">DO</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-ink/70 max-w-3xl leading-relaxed font-outfit">
                        Integrated solutions across Marketing, Communication, and Content.
                    </p>
                </div>
            </section>

            {/* Carousel Section */}
            <section className="py-20 bg-cream border-b-3 border-ink">
                <div className="container-brutal mb-12">
                    <h2 className="text-section font-archivo">
                        OUR <span className="text-indigo">CAPABILITIES</span>
                    </h2>
                </div>
                <div className="w-full h-full">
                    <Carousel items={cards} />
                </div>
            </section>

            {/* Legacy Services List (Kept for detail if needed) */}
            {/* ... (Previous detailed list could go here or be replaced by the carousel content modal) ... */}
            {/* For the requested task, I'll keep the page clean with the carousel as the main feature */}

            <section className="section-brutal bg-ink text-paper">
                {/* CTA */}
                <div className="container-brutal text-center">
                    <h2 className="text-section font-archivo mb-8">READY TO START?</h2>
                    <button className="brutal-btn-coral">Contact Us</button>
                </div>
            </section>
        </Layout>
    );
}
