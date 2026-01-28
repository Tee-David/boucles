import { useState } from 'react';
import { Send, MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Layout from '../components/layout/Layout';
import { DraggableCardBody, DraggableCardContainer } from '../components/ui/draggable-card';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    form_type: 'contact',
                }),
            });

            if (response.ok) {
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                toast.error('Failed to send message. Please try again.');
            }
        } catch {
            toast.error('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            {/* Header */}
            <section className="section-brutal bg-paper border-b-3 border-ink">
                <div className="container-brutal text-center">
                    <h1 className="text-hero font-archivo mb-6">
                        GET IN <span className="text-coral">TOUCH</span>
                    </h1>
                    <p className="text-xl text-ink/70 max-w-2xl mx-auto font-outfit">
                        Ready to start your next project? We'd love to hear from you.
                        Fill out the form below or reach out directly.
                    </p>
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Contact Form */}
                <div className="p-8 md:p-16 lg:p-24 bg-cream flex items-center">
                    <div className="w-full max-w-xl mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="brutal-input bg-paper"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block font-archivo text-sm uppercase mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="brutal-input bg-paper"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-archivo text-sm uppercase mb-2">Subject</label>
                                <select
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    className="brutal-input bg-paper"
                                >
                                    <option value="">Select a topic...</option>
                                    <option value="Marketing">Marketing Inquiry</option>
                                    <option value="Branding">Branding Project</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-archivo text-sm uppercase mb-2">Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="brutal-input bg-paper resize-none"
                                    placeholder="Tell us about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="brutal-btn-coral w-full flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* Contact Info & Draggable Card */}
                <div className="p-8 md:p-16 lg:p-24 bg-ink text-paper flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute inset-0 pattern-dots opacity-10" />

                    <div className="relative z-10 max-w-xl mx-auto space-y-12">
                        <div>
                            <h2 className="font-archivo text-3xl mb-8">CONTACT INFO</h2>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-coral border-3 border-paper flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6 text-paper" />
                                    </div>
                                    <div>
                                        <h3 className="font-archivo text-lg mb-1">Visit Us</h3>
                                        <p className="text-paper/70 font-outfit">
                                            123 Innovation Drive<br />
                                            Lagos, Nigeria
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-acid border-3 border-paper flex items-center justify-center shrink-0">
                                        <Mail className="w-6 h-6 text-ink" />
                                    </div>
                                    <div>
                                        <h3 className="font-archivo text-lg mb-1">Email Us</h3>
                                        <p className="text-paper/70 font-outfit">hello@boucles.africa</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-indigo border-3 border-paper flex items-center justify-center shrink-0">
                                        <Phone className="w-6 h-6 text-paper" />
                                    </div>
                                    <div>
                                        <h3 className="font-archivo text-lg mb-1">Call Us</h3>
                                        <p className="text-paper/70 font-outfit">+234 (0) 123 456 7890</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Draggable Feedback Cards Stack */}
                        <div className="py-8 relative h-[400px] w-full flex items-center justify-center">
                            <p className="absolute top-0 left-0 font-archivo text-sm uppercase tracking-wider mb-4 opacity-70">
                                Drag them all!
                            </p>

                            {/* Card 1 */}
                            <DraggableCardContainer className="absolute top-10 left-10 z-30">
                                <DraggableCardBody className="bg-paper border-3 border-ink w-[300px] h-auto p-4 rotate-2 shadow-brutal-sm">
                                    <img src="/testimonial_1.jpg" alt="Client" className="w-full h-40 object-cover mb-4 border-2 border-ink grayscale hover:grayscale-0 transition-all" />
                                    <p className="font-bold text-ink">"Incredible work!"</p>
                                </DraggableCardBody>
                            </DraggableCardContainer>

                            {/* Card 2 */}
                            <DraggableCardContainer className="absolute top-20 right-10 z-20">
                                <DraggableCardBody className="bg-acid border-3 border-ink w-[300px] h-auto p-4 -rotate-3 shadow-brutal-sm">
                                    <img src="/testimonial_2.jpg" alt="Client" className="w-full h-40 object-cover mb-4 border-2 border-ink grayscale hover:grayscale-0 transition-all" />
                                    <p className="font-bold text-ink">"They get it."</p>
                                </DraggableCardBody>
                            </DraggableCardContainer>

                            {/* Card 3 */}
                            <DraggableCardContainer className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
                                <DraggableCardBody className="bg-coral border-3 border-ink w-[300px] h-auto p-4 rotate-1 shadow-brutal-sm">
                                    <img src="/testimonial_3.jpg" alt="Client" className="w-full h-40 object-cover mb-4 border-2 border-ink grayscale hover:grayscale-0 transition-all" />
                                    <p className="font-bold text-paper">"Simply the best."</p>
                                </DraggableCardBody>
                            </DraggableCardContainer>

                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
