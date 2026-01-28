import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import ScrollToTop from './components/ui/scroll-to-top';
import { SmoothCursor } from './components/ui/smooth-cursor';
import { SmoothScroll } from './components/ui/smooth-scroll';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Team from './pages/Team';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminLogin from './admin/Login';
import Dashboard from './admin/Dashboard';
import PostsList from './admin/posts/PostsList';
import PostEditor from './admin/posts/PostEditor';
import ContactsList from './admin/contacts/ContactsList';
import CampaignsList from './admin/campaigns/CampaignsList';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{ backgroundColor: '#FFBD59' }}>
        <img src="/preloader.gif" alt="Loading..." className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] object-contain" />
      </div>
    );
  }

  return (
    <Router>
      <SmoothScroll>
        <ScrollToTop />
        <SmoothCursor />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0D0D0D',
              color: '#FEF9EF',
              border: '3px solid #0D0D0D',
              borderRadius: '0',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/team" element={<Team />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/:id/edit" element={<PostEditor />} />
            <Route path="contacts" element={<ContactsList />} />
            <Route path="campaigns" element={<CampaignsList />} />
          </Route>
        </Routes>
      </SmoothScroll>
    </Router>
  );
}

export default App;
