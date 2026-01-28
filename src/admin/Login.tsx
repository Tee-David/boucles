import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                toast.success('Welcome back!');
                navigate('/admin');
            } else {
                toast.error(data.error || 'Invalid credentials');
            }
        } catch {
            // For demo purposes, allow login with any credentials
            localStorage.setItem('adminToken', 'demo-token');
            localStorage.setItem('adminUser', JSON.stringify({
                name: 'Admin User',
                email: formData.email || 'admin@bouclesafrica.com',
            }));
            toast.success('Welcome back!');
            navigate('/admin');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-12">
                    <h1 className="font-archivo text-4xl">
                        BOUCLES<span className="text-coral">.</span>
                    </h1>
                    <p className="text-ink/60 mt-2">Admin Panel</p>
                </div>

                {/* Login Form */}
                <div className="brutal-card p-8 md:p-12">
                    <h2 className="font-archivo text-2xl uppercase mb-8 text-center">
                        SIGN <span className="text-coral">IN</span>
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block font-archivo text-sm uppercase mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="admin@bouclesafrica.com"
                                    className="brutal-input pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block font-archivo text-sm uppercase mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="brutal-input pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="brutal-btn-coral w-full flex items-center justify-center gap-3"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-ink/50 text-sm mt-8">
                        Demo: Use any email/password to login
                    </p>
                </div>

                {/* Back to site */}
                <div className="text-center mt-8">
                    <a href="/" className="text-ink/60 hover:text-coral transition-colors text-sm">
                        ← Back to website
                    </a>
                </div>
            </div>
        </div>
    );
}
