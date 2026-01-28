import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Users,
    Mail,
    LogOut,
    Menu,
    ChevronRight
} from 'lucide-react';

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/posts', label: 'Blog Posts', icon: FileText },
    { path: '/admin/contacts', label: 'Contacts', icon: Users },
    { path: '/admin/campaigns', label: 'Campaigns', icon: Mail },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const userData = localStorage.getItem('adminUser');

        if (!token) {
            navigate('/admin/login');
            return;
        }

        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-ink text-paper transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="h-full flex flex-col">
                    {/* Logo */}
                    <div className="p-6 border-b border-paper/20">
                        <Link to="/admin" className="font-archivo text-2xl">
                            BOUCLES<span className="text-coral">.</span>
                        </Link>
                        <p className="text-paper/40 text-sm mt-1">Admin Panel</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 font-dm text-sm transition-all ${isActive(item.path, item.exact)
                                            ? 'bg-coral text-paper'
                                            : 'text-paper/70 hover:bg-paper/10'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        {item.label}
                                        {isActive(item.path, item.exact) && (
                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* User Info */}
                    <div className="p-4 border-t border-paper/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-coral flex items-center justify-center font-archivo">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-archivo text-sm truncate">{user.name}</p>
                                <p className="text-paper/40 text-xs truncate">{user.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-paper/30 text-paper/70 hover:bg-paper/10 transition-colors text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-ink/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-paper border-b-3 border-ink px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 border-3 border-ink"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        <Link to="/" target="_blank" className="text-sm text-ink/60 hover:text-coral transition-colors">
                            View Site →
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
