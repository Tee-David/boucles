import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/team', label: 'Team' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            <nav className="nav-brutal">
                <div className="container-brutal flex items-center justify-between h-20 px-6 md:px-12">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="/boucles-logo.png"
                            alt="Boucles"
                            className="h-10 object-contain"
                            style={{ filter: 'invert(1) brightness(0)' }}
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`nav-link ${location.pathname === link.path ? 'text-coral' : ''
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link to="/contact" className="brutal-btn-coral text-sm py-3 px-6">
                            Start Project
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="md:hidden p-2 border-3 border-ink"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-[200] bg-paper flex flex-col">
                    <div className="flex justify-between items-center h-20 px-6 border-b-3 border-ink">
                        <Link to="/" onClick={() => setMenuOpen(false)}>
                            <img
                                src="/boucles-logo.png"
                                alt="Boucles"
                                className="h-10 object-contain"
                                style={{ filter: 'invert(1) brightness(0)' }}
                            />
                        </Link>
                        <button
                            onClick={() => setMenuOpen(false)}
                            className="p-2 border-3 border-ink"
                            aria-label="Close menu"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setMenuOpen(false)}
                                className={`font-archivo text-4xl uppercase ${location.pathname === link.path ? 'text-coral' : 'text-ink'
                                    } hover:text-coral transition-colors`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="p-6 border-t-3 border-ink">
                        <Link
                            to="/contact"
                            onClick={() => setMenuOpen(false)}
                            className="brutal-btn-coral block text-center w-full"
                        >
                            Start a Project
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
