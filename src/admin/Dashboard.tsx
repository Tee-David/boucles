import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Mail, TrendingUp, ArrowRight } from 'lucide-react';

interface DashboardStats {
    totalContacts: number;
    totalPosts: number;
    recentSubmissions: number;
    totalCampaigns: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalContacts: 0,
        totalPosts: 0,
        recentSubmissions: 0,
        totalCampaigns: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/dashboard', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch {
            // Use mock data for demo
            setStats({
                totalContacts: 156,
                totalPosts: 12,
                recentSubmissions: 8,
                totalCampaigns: 4,
            });
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Contacts', value: stats.totalContacts, icon: Users, color: 'coral', link: '/admin/contacts' },
        { label: 'Blog Posts', value: stats.totalPosts, icon: FileText, color: 'indigo', link: '/admin/posts' },
        { label: 'Recent Submissions', value: stats.recentSubmissions, icon: TrendingUp, color: 'acid', link: '/admin/contacts' },
        { label: 'Campaigns', value: stats.totalCampaigns, icon: Mail, color: 'ink', link: '/admin/campaigns' },
    ];

    const quickActions = [
        { label: 'New Blog Post', path: '/admin/posts/new', icon: FileText },
        { label: 'View Contacts', path: '/admin/contacts', icon: Users },
        { label: 'New Campaign', path: '/admin/campaigns', icon: Mail },
    ];

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-archivo text-3xl uppercase">
                    DASHBOARD
                </h1>
                <p className="text-ink/60 mt-2">Welcome back! Here's an overview of your platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        to={stat.link}
                        className={`brutal-card p-6 group transition-colors ${stat.color === 'coral' ? 'hover:bg-coral' :
                            stat.color === 'indigo' ? 'hover:bg-indigo' :
                                stat.color === 'acid' ? 'hover:bg-acid' :
                                    'hover:bg-ink'
                            }`}
                    >
                        <div className={`w-12 h-12 border-3 border-ink flex items-center justify-center mb-4 ${stat.color === 'coral' ? 'bg-coral' :
                            stat.color === 'indigo' ? 'bg-indigo' :
                                stat.color === 'acid' ? 'bg-acid' :
                                    'bg-ink'
                            }`}>
                            <stat.icon className={`w-6 h-6 ${stat.color === 'acid' ? 'text-ink' : 'text-paper'}`} />
                        </div>

                        <p className={`font-archivo text-4xl mb-2 ${stat.color === 'acid' ? 'group-hover:text-ink' : 'group-hover:text-paper'
                            } transition-colors`}>
                            {loading ? '...' : stat.value}
                        </p>
                        <p className={`text-ink/60 text-sm ${stat.color === 'acid' ? 'group-hover:text-ink/80' : 'group-hover:text-paper/60'
                            } transition-colors`}>
                            {stat.label}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-12">
                <h2 className="font-archivo text-xl uppercase mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            to={action.path}
                            className="brutal-card p-6 flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 bg-ink flex items-center justify-center group-hover:bg-coral transition-colors">
                                <action.icon className="w-6 h-6 text-paper" />
                            </div>
                            <span className="font-archivo uppercase flex-1">{action.label}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity (Placeholder) */}
            <div>
                <h2 className="font-archivo text-xl uppercase mb-6">Recent Activity</h2>
                <div className="brutal-card p-6">
                    <div className="space-y-4">
                        {[
                            { action: 'New contact submission', time: '2 hours ago', type: 'contact' },
                            { action: 'Blog post published', time: '1 day ago', type: 'post' },
                            { action: 'Campaign sent', time: '3 days ago', type: 'campaign' },
                        ].map((activity, i) => (
                            <div key={i} className="flex items-center gap-4 py-4 border-b-3 border-ink/10 last:border-0">
                                <div className={`w-10 h-10 flex items-center justify-center ${activity.type === 'contact' ? 'bg-coral' :
                                    activity.type === 'post' ? 'bg-indigo' :
                                        'bg-acid'
                                    }`}>
                                    {activity.type === 'contact' && <Users className="w-5 h-5 text-paper" />}
                                    {activity.type === 'post' && <FileText className="w-5 h-5 text-paper" />}
                                    {activity.type === 'campaign' && <Mail className="w-5 h-5 text-ink" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-dm">{activity.action}</p>
                                    <p className="text-ink/50 text-sm">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
