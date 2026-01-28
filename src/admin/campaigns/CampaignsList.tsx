import { useEffect, useState } from 'react';
import { Plus, Send, Edit, BarChart3 } from 'lucide-react';


interface Campaign {
    id: number;
    name: string;
    subject: string;
    status: string;
    recipient_count: number;
    open_count: number;
    click_count: number;
    sent_at: string | null;
    created_at: string;
}

export default function CampaignsList() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/campaigns', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setCampaigns(data);
            }
        } catch {
            // Mock data
            setCampaigns([
                { id: 1, name: 'January Newsletter', subject: 'Start 2026 Strong with Boucles', status: 'sent', recipient_count: 156, open_count: 89, click_count: 34, sent_at: '2026-01-15', created_at: '2026-01-10' },
                { id: 2, name: 'New Service Announcement', subject: 'Introducing Our Content Services', status: 'scheduled', recipient_count: 200, open_count: 0, click_count: 0, sent_at: null, created_at: '2026-01-20' },
                { id: 3, name: 'Q4 Insights Report', subject: 'African Market Insights Q4 2025', status: 'draft', recipient_count: 0, open_count: 0, click_count: 0, sent_at: null, created_at: '2026-01-22' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-coral text-paper';
            case 'scheduled': return 'bg-indigo text-paper';
            case 'draft': return 'bg-cream border-3 border-ink text-ink';
            default: return 'bg-ink text-paper';
        }
    };

    const getOpenRate = (campaign: Campaign) => {
        if (campaign.recipient_count === 0) return '—';
        return Math.round((campaign.open_count / campaign.recipient_count) * 100) + '%';
    };

    const getClickRate = (campaign: Campaign) => {
        if (campaign.open_count === 0) return '—';
        return Math.round((campaign.click_count / campaign.open_count) * 100) + '%';
    };

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="font-archivo text-3xl uppercase">CAMPAIGNS</h1>
                    <p className="text-ink/60 mt-2">Email marketing campaigns</p>
                </div>
                <button className="brutal-btn-coral flex items-center gap-2">
                    <Plus className="w-5 h-5" /> New Campaign
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="brutal-card p-6 text-center">
                    <p className="font-archivo text-3xl text-coral">{campaigns.filter(c => c.status === 'sent').length}</p>
                    <p className="text-ink/60 text-sm">Sent Campaigns</p>
                </div>
                <div className="brutal-card p-6 text-center">
                    <p className="font-archivo text-3xl text-indigo">{campaigns.reduce((acc, c) => acc + c.recipient_count, 0)}</p>
                    <p className="text-ink/60 text-sm">Total Recipients</p>
                </div>
                <div className="brutal-card p-6 text-center">
                    <p className="font-archivo text-3xl">
                        {campaigns.filter(c => c.status === 'sent').length > 0
                            ? Math.round(campaigns.filter(c => c.status === 'sent').reduce((acc, c) => acc + (c.open_count / c.recipient_count * 100), 0) / campaigns.filter(c => c.status === 'sent').length) + '%'
                            : '—'
                        }
                    </p>
                    <p className="text-ink/60 text-sm">Avg Open Rate</p>
                </div>
            </div>

            {/* Campaigns List */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-ink/50 py-12">Loading...</p>
                ) : campaigns.length === 0 ? (
                    <div className="brutal-card p-12 text-center">
                        <p className="text-ink/50 mb-4">No campaigns yet</p>
                        <button className="brutal-btn-coral">Create Your First Campaign</button>
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <div key={campaign.id} className="brutal-card p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                {/* Campaign Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-archivo text-lg uppercase">{campaign.name}</h3>
                                        <span className={`px-3 py-1 text-xs font-archivo uppercase ${getStatusStyles(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <p className="text-ink/60">{campaign.subject}</p>
                                    <p className="text-ink/40 text-sm mt-2">
                                        {campaign.sent_at ? `Sent ${campaign.sent_at}` : `Created ${campaign.created_at}`}
                                    </p>
                                </div>

                                {/* Stats */}
                                {campaign.status === 'sent' && (
                                    <div className="flex gap-6">
                                        <div className="text-center">
                                            <p className="font-archivo text-2xl">{campaign.recipient_count}</p>
                                            <p className="text-ink/50 text-xs">Recipients</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-archivo text-2xl text-coral">{getOpenRate(campaign)}</p>
                                            <p className="text-ink/50 text-xs">Open Rate</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="font-archivo text-2xl text-indigo">{getClickRate(campaign)}</p>
                                            <p className="text-ink/50 text-xs">Click Rate</p>
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2">
                                    {campaign.status === 'draft' && (
                                        <button className="w-10 h-10 border-3 border-ink flex items-center justify-center hover:bg-coral hover:text-paper hover:border-coral transition-colors">
                                            <Send className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button className="w-10 h-10 border-3 border-ink flex items-center justify-center hover:bg-indigo hover:text-paper hover:border-indigo transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    {campaign.status === 'sent' && (
                                        <button className="w-10 h-10 border-3 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors">
                                            <BarChart3 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
