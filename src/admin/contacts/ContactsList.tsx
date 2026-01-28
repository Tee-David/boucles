import { useEffect, useState } from 'react';
import { Search, Plus, Mail, Tag, MoreVertical } from 'lucide-react';


interface Contact {
    id: number;
    name: string;
    email: string;
    company: string;
    status: string;
    tags: string[];
    created_at: string;
}

const statusColors: Record<string, string> = {
    lead: 'bg-acid text-ink',
    prospect: 'bg-indigo text-paper',
    client: 'bg-coral text-paper',
    partner: 'bg-ink text-paper',
};

export default function ContactsList() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/contacts', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) {
                const data = await response.json();
                setContacts(data);
            }
        } catch {
            // Mock data
            setContacts([
                { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Acme Inc', status: 'lead', tags: ['Marketing'], created_at: '2026-01-20' },
                { id: 2, name: 'Jane Smith', email: 'jane@corp.com', company: 'Corp Ltd', status: 'prospect', tags: ['Content'], created_at: '2026-01-18' },
                { id: 3, name: 'Bob Johnson', email: 'bob@startup.io', company: 'Startup.io', status: 'client', tags: ['Marketing', 'Communication'], created_at: '2026-01-15' },
                { id: 4, name: 'Alice Brown', email: 'alice@brand.co', company: 'Brand Co', status: 'partner', tags: ['VIP'], created_at: '2026-01-10' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch =
            contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="font-archivo text-3xl uppercase">CONTACTS</h1>
                    <p className="text-ink/60 mt-2">Manage your CRM contacts</p>
                </div>
                <button className="brutal-btn-coral flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add Contact
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                    <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="brutal-input pl-12"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="brutal-input w-auto"
                >
                    <option value="all">All Status</option>
                    <option value="lead">Leads</option>
                    <option value="prospect">Prospects</option>
                    <option value="client">Clients</option>
                    <option value="partner">Partners</option>
                </select>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center text-ink/50 py-12">Loading...</p>
                ) : filteredContacts.length === 0 ? (
                    <p className="col-span-full text-center text-ink/50 py-12">No contacts found</p>
                ) : (
                    filteredContacts.map((contact) => (
                        <div key={contact.id} className="brutal-card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-ink text-paper flex items-center justify-center font-archivo text-xl">
                                    {contact.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <button className="w-10 h-10 border-3 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>

                            <h3 className="font-archivo text-lg uppercase">{contact.name}</h3>
                            <p className="text-ink/60 text-sm">{contact.company}</p>

                            <div className="flex items-center gap-2 mt-3 text-ink/70">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm truncate">{contact.email}</span>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                <span className={`px-3 py-1 text-xs font-archivo uppercase ${statusColors[contact.status] || 'bg-cream'}`}>
                                    {contact.status}
                                </span>
                                {contact.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="px-2 py-1 text-xs border-2 border-ink/30 flex items-center gap-1">
                                        <Tag className="w-3 h-3" /> {tag}
                                    </span>
                                ))}
                            </div>

                            <p className="text-ink/40 text-xs mt-4">Added {contact.created_at}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
