import { LayoutGrid } from "../components/ui/layout-grid";
import Layout from '../components/layout/Layout';

const SkeletonOne = () => {
    return (
        <div>
            <p className="font-bold text-4xl text-white">Office Vibes</p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-outfit">
                Our workspace is designed for collaboration and creativity.
            </p>
        </div>
    );
};

const SkeletonTwo = () => {
    return (
        <div>
            <p className="font-bold text-4xl text-white">Strategic Planning</p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-outfit">
                Deep dive sessions where we map out the future for our clients.
            </p>
        </div>
    );
};
const SkeletonThree = () => {
    return (
        <div>
            <p className="font-bold text-4xl text-white">Team Bonding</p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-outfit">
                Work hard, play hard. We celebrate every win together.
            </p>
        </div>
    );
};
const SkeletonFour = () => {
    return (
        <div>
            <p className="font-bold text-4xl text-white">Client Success</p>
            <p className="font-normal text-base text-white"></p>
            <p className="font-normal text-base my-4 max-w-lg text-neutral-200 font-outfit">
                Delivering results that exceed expectations.
            </p>
        </div>
    );
};

const cards = [
    {
        id: 1,
        content: <SkeletonOne />,
        className: "md:col-span-2",
        thumbnail:
            "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=3450&auto=format&fit=crop",
    },
    {
        id: 2,
        content: <SkeletonTwo />,
        className: "col-span-1",
        thumbnail:
            "https://images.unsplash.com/photo-1531538606174-0f90ff5dce88?q=80&w=3374&auto=format&fit=crop",
    },
    {
        id: 3,
        content: <SkeletonThree />,
        className: "col-span-1",
        thumbnail:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3542&auto=format&fit=crop",
    },
    {
        id: 4,
        content: <SkeletonFour />,
        className: "md:col-span-2",
        thumbnail:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=3540&auto=format&fit=crop",
    },
];

export default function About() {
    return (
        <Layout>
            {/* Hero Section */}
            <section className="relative min-h-[50vh] flex items-center border-b-3 border-ink overflow-hidden bg-paper">
                <div className="absolute inset-0 pattern-dots opacity-20" />
                <div className="container-brutal px-6 md:px-12 py-24">
                    <span className="inline-block px-4 py-2 bg-ink text-paper font-archivo text-sm uppercase tracking-wider mb-8">
                        About Us
                    </span>
                    <h1 className="text-hero font-archivo mb-8">
                        OUR <span className="text-coral">CULTURE</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-ink/70 max-w-3xl leading-relaxed font-outfit">
                        We are more than just a consultancy. We are a collective of creators, strategists, and dreamers.
                    </p>
                </div>
            </section>

            {/* Grid Section */}
            <section className="py-20 min-h-screen w-full bg-cream border-b-3 border-ink">
                <LayoutGrid cards={cards} />
            </section>

            <div className="section-brutal bg-indigo text-paper text-center">
                <h2 className="text-2xl font-archivo">JOIN THE MOVEMENT</h2>
            </div>
        </Layout>
    );
}


