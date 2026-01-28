import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Image, 
  Mail, 
  Settings, 
  LogOut,
  Menu,
  X,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import './AdminApp.css';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface Contact {
  id: number;
  email: string;
  name: string;
  company: string;
  phone: string;
  status: string;
  tags: string[];
  notes?: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: string;
  status: string;
  tags?: string[];
  views: number;
  created_at: string;
}

interface DashboardStats {
  totalContacts: number;
  totalPosts: number;
  recentSubmissions: number;
  totalCampaigns: number;
}

function AdminApp() {
  const [_user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [_loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success('Welcome back!');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setToken('');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    }
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/contacts?search=${searchQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Fetch contacts error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && activeTab === 'contacts') {
      fetchContacts();
    }
    if (token && activeTab === 'posts') {
      fetchPosts();
    }
  }, [token, activeTab]);

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const contactData = {
      email: formData.get('email'),
      name: formData.get('name'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      status: formData.get('status'),
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      notes: formData.get('notes')
    };

    try {
      const url = editingContact ? `/api/contacts/${editingContact.id}` : '/api/contacts';
      const method = editingContact ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(contactData)
      });

      if (response.ok) {
        toast.success(editingContact ? 'Contact updated' : 'Contact created');
        setShowContactForm(false);
        setEditingContact(null);
        fetchContacts();
      } else {
        toast.error('Failed to save contact');
      }
    } catch (error) {
      toast.error('Failed to save contact');
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Contact deleted');
        fetchContacts();
      } else {
        toast.error('Failed to delete contact');
      }
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const savePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const postData = {
      title: formData.get('title'),
      slug: formData.get('slug'),
      excerpt: formData.get('excerpt'),
      content: formData.get('content'),
      category: formData.get('category'),
      status: formData.get('status'),
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      const url = editingPost ? `/api/posts/${editingPost.id}` : '/api/posts';
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        toast.success(editingPost ? 'Post updated' : 'Post created');
        setShowPostForm(false);
        setEditingPost(null);
        fetchPosts();
      } else {
        toast.error('Failed to save post');
      }
    } catch (error) {
      toast.error('Failed to save post');
    }
  };

  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast.success('Post deleted');
        fetchPosts();
      } else {
        toast.error('Failed to delete post');
      }
    } catch (error) {
      toast.error('Failed to delete post');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-near-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-near-black border border-gray-800 p-8 rounded-lg">
          <h1 className="font-serif text-3xl text-warm-white mb-2 text-center">Boucles Africa</h1>
          <p className="text-warm-gray text-center mb-8">Admin Dashboard</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-warm-gray text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@bouclesafrica.com"
                className="bg-gray-900 border-gray-700 text-warm-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-warm-gray text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-gray-900 border-gray-700 text-warm-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gold text-near-black hover:bg-gold/90"
              disabled={loginLoading}
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl text-warm-white">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <p className="text-warm-gray text-sm mb-2">Total Contacts</p>
          <p className="font-serif text-4xl text-warm-white">{stats?.totalContacts || 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <p className="text-warm-gray text-sm mb-2">Blog Posts</p>
          <p className="font-serif text-4xl text-warm-white">{stats?.totalPosts || 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <p className="text-warm-gray text-sm mb-2">Recent Submissions</p>
          <p className="font-serif text-4xl text-warm-white">{stats?.recentSubmissions || 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
          <p className="text-warm-gray text-sm mb-2">Email Campaigns</p>
          <p className="font-serif text-4xl text-warm-white">{stats?.totalCampaigns || 0}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg">
        <h3 className="font-serif text-xl text-warm-white mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => { setActiveTab('contacts'); setShowContactForm(true); }}
            className="bg-gold text-near-black hover:bg-gold/90"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Contact
          </Button>
          <Button 
            onClick={() => { setActiveTab('posts'); setShowPostForm(true); }}
            className="bg-gold text-near-black hover:bg-gold/90"
          >
            <Plus className="w-4 h-4 mr-2" /> Create Post
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl text-warm-white">Contacts</h2>
        <Button 
          onClick={() => setShowContactForm(true)}
          className="bg-gold text-near-black hover:bg-gold/90"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Contact
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && fetchContacts()}
            className="pl-10 bg-gray-900 border-gray-700 text-warm-white"
          />
        </div>
        <Button onClick={fetchContacts} variant="outline" className="border-gray-700 text-warm-white">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Name</th>
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Email</th>
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Company</th>
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Status</th>
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4 text-warm-white">{contact.name || '-'}</td>
                <td className="p-4 text-warm-white">{contact.email}</td>
                <td className="p-4 text-warm-gray">{contact.company || '-'}</td>
                <td className="p-4">
                  <Badge className={`${
                    contact.status === 'lead' ? 'bg-yellow-500/20 text-yellow-500' :
                    contact.status === 'prospect' ? 'bg-blue-500/20 text-blue-500' :
                    contact.status === 'client' ? 'bg-green-500/20 text-green-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {contact.status}
                  </Badge>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingContact(contact); setShowContactForm(true); }}
                      className="p-2 text-warm-gray hover:text-gold transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteContact(contact.id)}
                      className="p-2 text-warm-gray hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-warm-white">
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={saveContact} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-warm-gray text-sm">Name</Label>
              <Input id="name" name="name" defaultValue={editingContact?.name || ''} className="bg-gray-800 border-gray-700 text-warm-white" />
            </div>
            <div>
              <Label htmlFor="email" className="text-warm-gray text-sm">Email *</Label>
              <Input id="email" name="email" type="email" defaultValue={editingContact?.email || ''} className="bg-gray-800 border-gray-700 text-warm-white" required />
            </div>
            <div>
              <Label htmlFor="company" className="text-warm-gray text-sm">Company</Label>
              <Input id="company" name="company" defaultValue={editingContact?.company || ''} className="bg-gray-800 border-gray-700 text-warm-white" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-warm-gray text-sm">Phone</Label>
              <Input id="phone" name="phone" defaultValue={editingContact?.phone || ''} className="bg-gray-800 border-gray-700 text-warm-white" />
            </div>
            <div>
              <Label htmlFor="status" className="text-warm-gray text-sm">Status</Label>
              <Select name="status" defaultValue={editingContact?.status || 'lead'}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-warm-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags" className="text-warm-gray text-sm">Tags (comma separated)</Label>
              <Input id="tags" name="tags" defaultValue={editingContact?.tags?.join(', ') || ''} className="bg-gray-800 border-gray-700 text-warm-white" />
            </div>
            <div>
              <Label htmlFor="notes" className="text-warm-gray text-sm">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={editingContact?.notes || ''} className="bg-gray-800 border-gray-700 text-warm-white" rows={3} />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-gold text-near-black hover:bg-gold/90 flex-1">
                {editingContact ? 'Update' : 'Create'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setShowContactForm(false); setEditingContact(null); }}
                className="border-gray-700 text-warm-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-2xl text-warm-white">Blog Posts</h2>
        <Button 
          onClick={() => setShowPostForm(true)}
          className="bg-gold text-near-black hover:bg-gold/90"
        >
          <Plus className="w-4 h-4 mr-2" /> Create Post
        </Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Title</th>
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Category</th>
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Status</th>
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Views</th>
              <th className="text-left p-4 text-warm-gray text-sm font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4 text-warm-white">{post.title}</td>
                <td className="p-4 text-warm-gray">{post.category || '-'}</td>
                <td className="p-4">
                  <Badge className={`${
                    post.status === 'published' ? 'bg-green-500/20 text-green-500' :
                    post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {post.status}
                  </Badge>
                </td>
                <td className="p-4 text-warm-gray">{post.views}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => window.open(`/${post.slug}`, '_blank')}
                      className="p-2 text-warm-gray hover:text-gold transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => { setEditingPost(post); setShowPostForm(true); }}
                      className="p-2 text-warm-gray hover:text-gold transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deletePost(post.id)}
                      className="p-2 text-warm-gray hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-warm-white">
              {editingPost ? 'Edit Post' : 'Create Post'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={savePost} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-warm-gray text-sm">Title *</Label>
              <Input id="title" name="title" defaultValue={editingPost?.title || ''} className="bg-gray-800 border-gray-700 text-warm-white" required />
            </div>
            <div>
              <Label htmlFor="slug" className="text-warm-gray text-sm">Slug *</Label>
              <Input id="slug" name="slug" defaultValue={editingPost?.slug || ''} className="bg-gray-800 border-gray-700 text-warm-white" required />
            </div>
            <div>
              <Label htmlFor="excerpt" className="text-warm-gray text-sm">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" defaultValue={editingPost?.excerpt || ''} className="bg-gray-800 border-gray-700 text-warm-white" rows={2} />
            </div>
            <div>
              <Label htmlFor="content" className="text-warm-gray text-sm">Content *</Label>
              <Textarea id="content" name="content" defaultValue={editingPost?.content || ''} className="bg-gray-800 border-gray-700 text-warm-white" rows={10} required />
            </div>
            <div>
              <Label htmlFor="category" className="text-warm-gray text-sm">Category</Label>
              <Select name="category" defaultValue={editingPost?.category || 'strategy'}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-warm-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="strategy">Strategy</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="creativity">Creativity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="post-status" className="text-warm-gray text-sm">Status</Label>
              <Select name="status" defaultValue={editingPost?.status || 'draft'}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-warm-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="post-tags" className="text-warm-gray text-sm">Tags (comma separated)</Label>
              <Input id="post-tags" name="tags" defaultValue={editingPost?.tags?.join(', ') || ''} className="bg-gray-800 border-gray-700 text-warm-white" />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-gold text-near-black hover:bg-gold/90 flex-1">
                {editingPost ? 'Update' : 'Create'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => { setShowPostForm(false); setEditingPost(null); }}
                className="border-gray-700 text-warm-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'posts', label: 'Blog Posts', icon: FileText },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'campaigns', label: 'Email Campaigns', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-near-black flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          {sidebarOpen && <span className="font-serif text-xl text-warm-white">Boucles</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-warm-gray hover:text-warm-white">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        <nav className="flex-1 p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-gold/10 text-gold' 
                  : 'text-warm-gray hover:text-warm-white hover:bg-gray-800'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-warm-gray hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'contacts' && renderContacts()}
          {activeTab === 'posts' && renderPosts()}
          {activeTab === 'media' && (
            <div className="text-center py-20">
              <Image className="w-16 h-16 text-warm-gray mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-warm-white mb-2">Media Library</h2>
              <p className="text-warm-gray">Coming soon</p>
            </div>
          )}
          {activeTab === 'campaigns' && (
            <div className="text-center py-20">
              <Mail className="w-16 h-16 text-warm-gray mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-warm-white mb-2">Email Campaigns</h2>
              <p className="text-warm-gray">Coming soon</p>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="text-center py-20">
              <Settings className="w-16 h-16 text-warm-gray mx-auto mb-4" />
              <h2 className="font-serif text-2xl text-warm-white mb-2">Settings</h2>
              <p className="text-warm-gray">Coming soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminApp;
