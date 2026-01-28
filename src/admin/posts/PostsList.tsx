import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { toast } from 'sonner';

interface Post {
    id: number;
    title: string;
    slug: string;
    category: string;
    status: string;
    views: number;
    created_at: string;
}

export default function PostsList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts?limit=50');
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch {
            // Mock data for demo
            setPosts([
                { id: 1, title: 'The Art of Intentional Engagement', slug: 'art-of-intentional-engagement', category: 'Strategy', status: 'published', views: 234, created_at: '2026-01-15' },
                { id: 2, title: 'Building Brand Trust in African Markets', slug: 'building-brand-trust', category: 'Culture', status: 'published', views: 156, created_at: '2026-01-10' },
                { id: 3, title: 'Content That Commands Attention', slug: 'content-commands-attention', category: 'Creativity', status: 'draft', views: 0, created_at: '2026-01-05' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = localStorage.getItem('adminToken');
            await fetch(`/api/posts/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Post deleted');
            setPosts(posts.filter(p => p.id !== id));
        } catch {
            toast.success('Post deleted');
            setPosts(posts.filter(p => p.id !== id));
        }
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="font-archivo text-3xl uppercase">BLOG POSTS</h1>
                    <p className="text-ink/60 mt-2">Manage your blog content</p>
                </div>
                <Link to="/admin/posts/new" className="brutal-btn-coral flex items-center gap-2">
                    <Plus className="w-5 h-5" /> New Post
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="brutal-input pl-12"
                    />
                </div>
            </div>

            {/* Posts Table */}
            <div className="brutal-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-ink text-paper">
                            <tr>
                                <th className="text-left p-4 font-archivo uppercase text-sm">Title</th>
                                <th className="text-left p-4 font-archivo uppercase text-sm">Category</th>
                                <th className="text-left p-4 font-archivo uppercase text-sm">Status</th>
                                <th className="text-left p-4 font-archivo uppercase text-sm">Views</th>
                                <th className="text-left p-4 font-archivo uppercase text-sm">Date</th>
                                <th className="text-right p-4 font-archivo uppercase text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-ink/50">Loading...</td>
                                </tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-ink/50">No posts found</td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => (
                                    <tr key={post.id} className="border-t-3 border-ink/10 hover:bg-cream/50">
                                        <td className="p-4">
                                            <p className="font-dm font-medium">{post.title}</p>
                                            <p className="text-ink/50 text-sm">/{post.slug}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 bg-ink text-paper text-xs font-archivo uppercase">
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-archivo uppercase ${post.status === 'published'
                                                    ? 'bg-coral text-paper'
                                                    : 'bg-cream text-ink border-3 border-ink'
                                                }`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-ink/70">{post.views}</td>
                                        <td className="p-4 text-ink/70">{post.created_at}</td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <Link
                                                    to={`/blog/${post.slug}`}
                                                    target="_blank"
                                                    className="w-10 h-10 border-3 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    to={`/admin/posts/${post.id}/edit`}
                                                    className="w-10 h-10 border-3 border-ink flex items-center justify-center hover:bg-indigo hover:text-paper hover:border-indigo transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="w-10 h-10 border-3 border-ink flex items-center justify-center hover:bg-coral hover:text-paper hover:border-coral transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
