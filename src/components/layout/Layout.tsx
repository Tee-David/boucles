import type { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
    hideFooterCta?: boolean;
}

export default function Layout({ children, hideFooterCta: _hideFooterCta = false }: LayoutProps) {
    return (
        <div className="min-h-screen bg-paper">
            <Navbar />
            <main className="pt-20">
                {children}
            </main>
            <Footer />
        </div>
    );
}
