import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';

const footerLinks = {
    services: [
        { label: 'Marketing', path: '/services#marketing' },
        { label: 'Communication', path: '/services#communication' },
        { label: 'Content', path: '/services#content' },
    ],
    company: [
        { label: 'About', path: '/about' },
        { label: 'Team', path: '/team' },
        { label: 'Blog', path: '/blog' },
        { label: 'Contact', path: '/contact' },
    ],
    social: [
        { label: 'Twitter', href: 'https://x.com/bouclesafrica', icon: Twitter },
        { label: 'LinkedIn', href: 'https://linkedin.com/company/boucles-africa', icon: Linkedin },
        { label: 'Instagram', href: 'https://instagram.com/bouclesafrica', icon: Instagram },
    ],
};

export default function Footer() {
    return (
        <footer className="bg-ink text-paper">
            {/* CTA Section */}
            <div className="border-b-3 border-paper/20">
                <div className="container-brutal px-6 md:px-12 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <h2 className="font-archivo text-section text-paper">
                                LET'S BUILD<br />
                                <span className="text-coral">SOMETHING UNIGNORABLE.</span>
                            </h2>
                        </div>
                        <Link to="/contact" className="brutal-btn bg-coral text-paper border-paper shrink-0">
                            Start a Project <ArrowUpRight className="inline w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Links Section */}
            <div className="container-brutal px-6 md:px-12 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Logo Column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="block mb-4">
                            <img
                                src="/boucles-logo.png"
                                alt="Boucles"
                                className="h-12 object-contain"
                            />
                        </Link>
                        <p className="text-paper/60 text-sm leading-relaxed">
                            Marketing, Communication & Content Consultancy for African businesses.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-archivo text-sm text-paper/40 uppercase mb-4">Services</h3>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        className="text-paper/80 hover:text-coral transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-archivo text-sm text-paper/40 uppercase mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.path}
                                        className="text-paper/80 hover:text-coral transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-archivo text-sm text-paper/40 uppercase mb-4">Social</h3>
                        <div className="flex gap-4">
                            {footerLinks.social.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 border-3 border-paper/30 flex items-center justify-center hover:bg-coral hover:border-coral transition-all"
                                    aria-label={link.label}
                                >
                                    <link.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="border-t-3 border-paper/20">
                <div className="container-brutal px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-paper/40 text-sm">
                        © {new Date().getFullYear()} Boucles Africa. All rights reserved.
                    </p>
                    <p className="text-paper/40 text-sm">
                        Lagos, Nigeria
                    </p>
                </div>
            </div>
        </footer>
    );
}
