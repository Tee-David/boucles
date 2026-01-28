const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/bouclesafrica',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Contacts API (CRM)
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const { search, status, tag, limit = 50, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM contacts';
    const params = [];
    const conditions = [];
    
    if (search) {
      conditions.push(`(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1} OR company ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }
    
    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (tag) {
      conditions.push(`$${params.length + 1} = ANY(tags)`);
      params.push(tag);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const { email, name, company, phone, source, status, tags, notes } = req.body;
    
    const result = await pool.query(
      `INSERT INTO contacts (email, name, company, phone, source, status, tags, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [email, name, company, phone, source, status, tags, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, company, phone, status, tags, notes } = req.body;
    
    const result = await pool.query(
      `UPDATE contacts 
       SET email = $1, name = $2, company = $3, phone = $4, status = $5, tags = $6, notes = $7, updated_at = CURRENT_TIMESTAMP
       WHERE id = $8 RETURNING *`,
      [email, name, company, phone, status, tags, notes, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Posts API (Journal/Blog)
app.get('/api/posts', async (req, res) => {
  try {
    const { status, category, limit = 10, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM posts';
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/posts/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const result = await pool.query('SELECT * FROM posts WHERE slug = $1', [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment views
    await pool.query('UPDATE posts SET views = views + 1 WHERE id = $1', [result.rows[0].id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { title, slug, excerpt, content, featured_image, category, tags, status, meta_title, meta_description } = req.body;
    
    const result = await pool.query(
      `INSERT INTO posts (title, slug, excerpt, content, featured_image, category, tags, author_id, status, meta_title, meta_description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [title, slug, excerpt, content, featured_image, category, tags, req.user.id, status, meta_title, meta_description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, excerpt, content, featured_image, category, tags, status, meta_title, meta_description } = req.body;
    
    const result = await pool.query(
      `UPDATE posts 
       SET title = $1, slug = $2, excerpt = $3, content = $4, featured_image = $5, category = $6, tags = $7, status = $8, meta_title = $9, meta_description = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11 RETURNING *`,
      [title, slug, excerpt, content, featured_image, category, tags, status, meta_title, meta_description, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Form submissions API
app.post('/api/submissions', async (req, res) => {
  try {
    const { form_name, data, ip_address, user_agent } = req.body;
    
    // Create or update contact
    let contactId = null;
    if (data.email) {
      const contactResult = await pool.query(
        'INSERT INTO contacts (email, name, company, source) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO UPDATE SET name = $2, company = $3 RETURNING id',
        [data.email, data.name, data.company, 'website_form']
      );
      contactId = contactResult.rows[0].id;
    }
    
    const result = await pool.query(
      `INSERT INTO form_submissions (form_name, data, contact_id, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [form_name, data, contactId, ip_address, user_agent]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/submissions', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await pool.query(
      'SELECT * FROM form_submissions ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Analytics API
app.post('/api/analytics', async (req, res) => {
  try {
    const { event_type, page_path, session_id, referrer, metadata } = req.body;
    const ip_address = req.ip;
    const user_agent = req.headers['user-agent'];
    
    const result = await pool.query(
      `INSERT INTO analytics_events (event_type, page_path, session_id, ip_address, user_agent, referrer, metadata) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [event_type, page_path, session_id, ip_address, user_agent, referrer, metadata]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/analytics/dashboard', authenticateToken, async (req, res) => {
  try {
    // Get stats for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [
      pageViewsResult,
      uniqueVisitorsResult,
      contactsResult,
      submissionsResult,
      postsResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM analytics_events WHERE event_type = $1 AND created_at > $2', ['page_view', thirtyDaysAgo]),
      pool.query('SELECT COUNT(DISTINCT session_id) FROM analytics_events WHERE created_at > $1', [thirtyDaysAgo]),
      pool.query('SELECT COUNT(*) FROM contacts WHERE created_at > $1', [thirtyDaysAgo]),
      pool.query('SELECT COUNT(*) FROM form_submissions WHERE created_at > $1', [thirtyDaysAgo]),
      pool.query('SELECT COUNT(*) FROM posts WHERE status = $1', ['published'])
    ]);
    
    res.json({
      pageViews: parseInt(pageViewsResult.rows[0].count),
      uniqueVisitors: parseInt(uniqueVisitorsResult.rows[0].count),
      newContacts: parseInt(contactsResult.rows[0].count),
      formSubmissions: parseInt(submissionsResult.rows[0].count),
      publishedPosts: parseInt(postsResult.rows[0].count)
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard stats
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const [
      contactsResult,
      postsResult,
      submissionsResult,
      campaignsResult
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM contacts'),
      pool.query('SELECT COUNT(*) FROM posts'),
      pool.query('SELECT COUNT(*) FROM form_submissions WHERE created_at > CURRENT_DATE - INTERVAL \'7 days\''),
      pool.query('SELECT COUNT(*) FROM campaigns')
    ]);
    
    res.json({
      totalContacts: parseInt(contactsResult.rows[0].count),
      totalPosts: parseInt(postsResult.rows[0].count),
      recentSubmissions: parseInt(submissionsResult.rows[0].count),
      totalCampaigns: parseInt(campaignsResult.rows[0].count)
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
