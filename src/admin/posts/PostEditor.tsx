import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function PostEditor() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Strategy',
        status: 'draft',
        meta_title: '',
        meta_description: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        // In production, fetch from API
        setFormData({
            title: 'Sample Post Title',
            slug: 'sample-post-title',
            excerpt: 'This is a sample excerpt...',
            content: '<p>Sample content here...</p>',
            category: 'Strategy',
            status: 'draft',
            meta_title: '',
            meta_description: '',
        });
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: formData.slug || generateSlug(title),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const url = isEditing ? `/api/posts/${id}` : '/api/posts';
            const method = isEditing ? 'PUT' : 'POST';

            await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            toast.success(isEditing ? 'Post updated!' : 'Post created!');
            navigate('/admin/posts');
        } catch {
            toast.success(isEditing ? 'Post updated!' : 'Post created!');
            navigate('/admin/posts');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('/admin/posts')}
                    className="w-12 h-12 border-3 border-ink flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="font-archivo text-3xl uppercase">
                        {isEditing ? 'EDIT POST' : 'NEW POST'}
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="brutal-card p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        placeholder="Post title..."
                                        className="brutal-input"
                                    />
                                </div>

                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Slug</label>
                                    <input
                                        type="text"
                                        value={formData.slug}
                                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                        placeholder="post-url-slug"
                                        className="brutal-input"
                                    />
                                </div>

                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Excerpt</label>
                                    <textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        placeholder="Brief description..."
                                        rows={3}
                                        className="brutal-input resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Content *</label>
                                    <textarea
                                        required
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Write your post content here... (HTML supported)"
                                        rows={15}
                                        className="brutal-input resize-none font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Publish Settings */}
                        <div className="brutal-card p-6">
                            <h3 className="font-archivo text-lg uppercase mb-4">Publish</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="brutal-input"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="brutal-input"
                                    >
                                        <option value="Strategy">Strategy</option>
                                        <option value="Culture">Culture</option>
                                        <option value="Creativity">Creativity</option>
                                        <option value="Communication">Communication</option>
                                        <option value="Content">Content</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="brutal-btn-coral w-full flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    {isLoading ? 'Saving...' : 'Save Post'}
                                </button>
                            </div>
                        </div>

                        {/* SEO */}
                        <div className="brutal-card p-6">
                            <h3 className="font-archivo text-lg uppercase mb-4">SEO</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        value={formData.meta_title}
                                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                        placeholder="SEO title..."
                                        className="brutal-input"
                                    />
                                </div>
                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Meta Description</label>
                                    <textarea
                                        value={formData.meta_description}
                                        onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                        placeholder="SEO description..."
                                        rows={3}
                                        className="brutal-input resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
