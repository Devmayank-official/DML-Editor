// Template library — built-in starter templates
import type { EditorFiles } from '@/core/types';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  files: EditorFiles;
}

const LANDING_PAGE: Template = {
  id: 'landing-page',
  name: 'Landing Page',
  description: 'A modern hero-style landing page',
  category: 'Marketing',
  tags: ['hero', 'gradient', 'cta'],
  files: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Landing Page</title>
</head>
<body>
  <nav class="nav">
    <div class="logo">Brand</div>
    <ul class="nav-links">
      <li><a href="#">Features</a></li>
      <li><a href="#">Pricing</a></li>
      <li><a href="#">About</a></li>
    </ul>
    <button class="btn-outline">Sign In</button>
  </nav>

  <header class="hero">
    <div class="hero-content">
      <span class="badge">New Release</span>
      <h1>Build something <span class="gradient-text">remarkable</span></h1>
      <p>The all-in-one platform that helps you create, launch, and grow your next big idea.</p>
      <div class="cta-group">
        <button class="btn-primary">Get Started Free</button>
        <button class="btn-ghost">Watch Demo →</button>
      </div>
    </div>
    <div class="hero-visual">
      <div class="card-glow">
        <div class="mock-window">
          <div class="mock-header">
            <span></span><span></span><span></span>
          </div>
          <div class="mock-content">
            <div class="line w-75"></div>
            <div class="line w-50"></div>
            <div class="line w-90"></div>
            <div class="line w-60"></div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <section class="features">
    <h2>Everything you need</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <div class="icon">⚡</div>
        <h3>Lightning Fast</h3>
        <p>Built for speed from the ground up</p>
      </div>
      <div class="feature-card">
        <div class="icon">🔒</div>
        <h3>Secure by Default</h3>
        <p>Enterprise-grade security built in</p>
      </div>
      <div class="feature-card">
        <div class="icon">🧩</div>
        <h3>Extensible</h3>
        <p>Plugin architecture for any workflow</p>
      </div>
    </div>
  </section>
</body>
</html>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #050508;
  color: #e2e4ed;
}

.nav {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1.25rem 2rem;
  border-bottom: 1px solid #1a1d24;
  position: sticky;
  top: 0;
  background: rgba(5,5,8,0.85);
  backdrop-filter: blur(12px);
  z-index: 100;
}

.logo { font-weight: 700; font-size: 1.25rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.nav-links { display: flex; gap: 1.5rem; list-style: none; margin-left: auto; }
.nav-links a { color: #8b8fa8; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
.nav-links a:hover { color: #e2e4ed; }

.btn-outline { border: 1px solid #2a2d3a; color: #e2e4ed; background: transparent; padding: 0.5rem 1.25rem; border-radius: 0.5rem; cursor: pointer; font-size: 0.875rem; transition: all 0.2s; }
.btn-outline:hover { border-color: #6366f1; color: #6366f1; }

.hero { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }

.badge { display: inline-block; background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); border-radius: 2rem; padding: 0.25rem 0.75rem; font-size: 0.75rem; font-weight: 600; margin-bottom: 1.5rem; }

h1 { font-size: 3.5rem; font-weight: 800; line-height: 1.1; margin-bottom: 1.5rem; }
.gradient-text { background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.hero-content p { color: #8b8fa8; font-size: 1.125rem; line-height: 1.6; margin-bottom: 2.5rem; }

.cta-group { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
.btn-primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }
.btn-ghost { background: transparent; border: none; color: #8b8fa8; font-size: 1rem; cursor: pointer; transition: color 0.2s; }
.btn-ghost:hover { color: #e2e4ed; }

.card-glow { position: relative; }
.card-glow::before { content: ''; position: absolute; inset: -1px; border-radius: 1rem; background: linear-gradient(135deg, #6366f1, #8b5cf6); z-index: 0; }
.mock-window { position: relative; z-index: 1; background: #13151a; border-radius: calc(1rem - 1px); overflow: hidden; }
.mock-header { display: flex; gap: 0.5rem; padding: 0.75rem 1rem; background: #1a1d24; border-bottom: 1px solid #2a2d3a; }
.mock-header span { width: 0.75rem; height: 0.75rem; border-radius: 50%; }
.mock-header span:nth-child(1) { background: #ef4444; }
.mock-header span:nth-child(2) { background: #f59e0b; }
.mock-header span:nth-child(3) { background: #10b981; }
.mock-content { padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
.line { height: 0.5rem; border-radius: 0.25rem; background: #2a2d3a; }
.w-75 { width: 75%; }
.w-50 { width: 50%; }
.w-90 { width: 90%; }
.w-60 { width: 60%; }

.features { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; text-align: center; }
.features h2 { font-size: 2rem; font-weight: 700; margin-bottom: 3rem; }
.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.feature-card { background: #13151a; border: 1px solid #2a2d3a; border-radius: 1rem; padding: 2rem; transition: all 0.2s; }
.feature-card:hover { border-color: #6366f1; transform: translateY(-4px); box-shadow: 0 12px 32px rgba(99,102,241,0.15); }
.icon { font-size: 2rem; margin-bottom: 1rem; }
.feature-card h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; }
.feature-card p { color: #8b8fa8; font-size: 0.9rem; }

@media (max-width: 768px) {
  .hero { grid-template-columns: 1fr; gap: 2rem; padding: 3rem 1rem; }
  .hero-visual { display: none; }
  h1 { font-size: 2.5rem; }
  .feature-grid { grid-template-columns: 1fr; }
  .nav-links { display: none; }
}`,
    js: `console.log('Landing page loaded!');

document.querySelector('.btn-primary').addEventListener('click', () => {
  alert('Welcome! Sign up flow would go here.');
});`,
  },
};

const PORTFOLIO: Template = {
  id: 'portfolio',
  name: 'Developer Portfolio',
  description: 'Minimal dark developer portfolio',
  category: 'Portfolio',
  tags: ['portfolio', 'developer', 'minimal'],
  files: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Portfolio</title>
</head>
<body>
  <div class="container">
    <aside class="sidebar">
      <div class="avatar"></div>
      <h1>Alex Johnson</h1>
      <p class="role">Full-Stack Developer</p>
      <nav>
        <a href="#about" class="active">About</a>
        <a href="#projects">Projects</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="socials">
        <a href="#" title="GitHub">GH</a>
        <a href="#" title="Twitter">TW</a>
        <a href="#" title="LinkedIn">LI</a>
      </div>
    </aside>

    <main>
      <section id="about">
        <h2><span>01.</span> About Me</h2>
        <p>I'm a passionate developer with 5+ years of experience building modern web applications. I love crafting clean, performant, and accessible user interfaces.</p>
      </section>

      <section id="projects">
        <h2><span>02.</span> Projects</h2>
        <div class="project-list">
          <div class="project">
            <div class="project-header">
              <h3>DML Editor</h3>
              <span class="year">2024</span>
            </div>
            <p>A browser-based IDE built with Next.js and Monaco Editor</p>
            <div class="tags"><span>TypeScript</span><span>React</span><span>Monaco</span></div>
          </div>
          <div class="project">
            <div class="project-header">
              <h3>OpenCommit</h3>
              <span class="year">2023</span>
            </div>
            <p>AI-powered commit message generator CLI tool</p>
            <div class="tags"><span>Node.js</span><span>OpenAI</span><span>CLI</span></div>
          </div>
        </div>
      </section>

      <section id="skills">
        <h2><span>03.</span> Skills</h2>
        <div class="skill-grid">
          <div class="skill-group"><h4>Frontend</h4><span>React</span><span>Next.js</span><span>TypeScript</span><span>CSS</span></div>
          <div class="skill-group"><h4>Backend</h4><span>Node.js</span><span>Go</span><span>PostgreSQL</span><span>Redis</span></div>
          <div class="skill-group"><h4>Tools</h4><span>Git</span><span>Docker</span><span>Linux</span><span>AWS</span></div>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #0a0a0f; color: #c9cbd8; min-height: 100vh; }
.container { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; }
.sidebar { background: #0f1016; border-right: 1px solid #1e2030; padding: 3rem 2rem; display: flex; flex-direction: column; gap: 1.5rem; position: sticky; top: 0; height: 100vh; }
.avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); margin-bottom: 0.5rem; }
.sidebar h1 { font-size: 1.25rem; font-weight: 700; color: #e2e4ed; }
.role { font-size: 0.875rem; color: #6366f1; font-weight: 500; }
nav { display: flex; flex-direction: column; gap: 0.25rem; margin-top: 1rem; }
nav a { color: #8b8fa8; text-decoration: none; padding: 0.5rem 0.75rem; border-radius: 0.5rem; font-size: 0.9rem; transition: all 0.2s; border-left: 2px solid transparent; }
nav a:hover, nav a.active { color: #e2e4ed; background: #1a1d24; border-left-color: #6366f1; }
.socials { display: flex; gap: 0.75rem; margin-top: auto; }
.socials a { color: #8b8fa8; font-size: 0.75rem; font-weight: 600; padding: 0.5rem 0.75rem; border: 1px solid #2a2d3a; border-radius: 0.5rem; text-decoration: none; transition: all 0.2s; }
.socials a:hover { border-color: #6366f1; color: #6366f1; }
main { padding: 4rem 3rem; max-width: 760px; }
section { margin-bottom: 4rem; }
h2 { font-size: 1.5rem; font-weight: 700; color: #e2e4ed; margin-bottom: 1.5rem; }
h2 span { color: #6366f1; margin-right: 0.5rem; font-size: 0.875rem; font-family: monospace; }
section > p { color: #8b8fa8; line-height: 1.7; }
.project-list { display: flex; flex-direction: column; gap: 1rem; }
.project { background: #0f1016; border: 1px solid #1e2030; border-radius: 0.75rem; padding: 1.5rem; transition: all 0.2s; }
.project:hover { border-color: #6366f1; }
.project-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; }
.project h3 { font-size: 1rem; font-weight: 600; color: #e2e4ed; }
.year { font-size: 0.75rem; color: #555874; font-family: monospace; }
.project p { color: #8b8fa8; font-size: 0.875rem; margin-bottom: 1rem; }
.tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tags span { background: rgba(99,102,241,0.1); color: #818cf8; border: 1px solid rgba(99,102,241,0.2); border-radius: 2rem; padding: 0.2rem 0.6rem; font-size: 0.7rem; font-weight: 500; }
.skill-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.skill-group { background: #0f1016; border: 1px solid #1e2030; border-radius: 0.75rem; padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
.skill-group h4 { font-size: 0.8rem; font-weight: 600; color: #6366f1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
.skill-group span { font-size: 0.875rem; color: #8b8fa8; }
@media (max-width: 768px) { .container { grid-template-columns: 1fr; } .sidebar { height: auto; position: static; } main { padding: 2rem 1rem; } .skill-grid { grid-template-columns: 1fr; } }`,
    js: `// Smooth scroll navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    link.classList.add('active');
  });
});`,
  },
};

const DASHBOARD: Template = {
  id: 'dashboard',
  name: 'Analytics Dashboard',
  description: 'A clean admin dashboard layout',
  category: 'Dashboard',
  tags: ['admin', 'dashboard', 'analytics'],
  files: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dashboard</title>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">📊 Dashboard</div>
      <nav>
        <a href="#" class="active">🏠 Overview</a>
        <a href="#">📈 Analytics</a>
        <a href="#">👥 Users</a>
        <a href="#">💳 Billing</a>
        <a href="#">⚙️ Settings</a>
      </nav>
    </aside>
    <main>
      <header class="topbar">
        <h1>Good morning, Alex 👋</h1>
        <div class="topbar-right">
          <span class="badge-status">● Live</span>
          <div class="avatar">A</div>
        </div>
      </header>

      <div class="stats-grid">
        <div class="stat-card"><div class="stat-label">Total Revenue</div><div class="stat-value">$48,295</div><div class="stat-delta positive">↑ 12.5%</div></div>
        <div class="stat-card"><div class="stat-label">Active Users</div><div class="stat-value">3,842</div><div class="stat-delta positive">↑ 8.2%</div></div>
        <div class="stat-card"><div class="stat-label">New Orders</div><div class="stat-value">284</div><div class="stat-delta negative">↓ 2.1%</div></div>
        <div class="stat-card"><div class="stat-label">Conversion</div><div class="stat-value">4.6%</div><div class="stat-delta positive">↑ 0.8%</div></div>
      </div>

      <div class="content-grid">
        <div class="chart-area">
          <div class="card-header">Revenue Overview</div>
          <div class="chart">
            <div class="bar" style="height:60%"><span>Jan</span></div>
            <div class="bar" style="height:80%"><span>Feb</span></div>
            <div class="bar" style="height:50%"><span>Mar</span></div>
            <div class="bar" style="height:90%"><span>Apr</span></div>
            <div class="bar highlight" style="height:75%"><span>May</span></div>
            <div class="bar" style="height:65%"><span>Jun</span></div>
          </div>
        </div>
        <div class="recent-list">
          <div class="card-header">Recent Transactions</div>
          <div class="tx-item"><div class="tx-info"><strong>Premium Plan</strong><span>john@example.com</span></div><div class="tx-amount green">+$99</div></div>
          <div class="tx-item"><div class="tx-info"><strong>Refund</strong><span>alice@example.com</span></div><div class="tx-amount red">-$29</div></div>
          <div class="tx-item"><div class="tx-info"><strong>Enterprise</strong><span>corp@acme.com</span></div><div class="tx-amount green">+$499</div></div>
          <div class="tx-item"><div class="tx-info"><strong>Starter Plan</strong><span>bob@example.com</span></div><div class="tx-amount green">+$19</div></div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #0d0e11; color: #e2e4ed; }
.layout { display: grid; grid-template-columns: 220px 1fr; min-height: 100vh; }
.sidebar { background: #13151a; border-right: 1px solid #2a2d3a; padding: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
.logo { font-size: 1rem; font-weight: 700; padding: 0.5rem 0; margin-bottom: 1rem; color: #e2e4ed; }
nav { display: flex; flex-direction: column; gap: 0.25rem; }
nav a { color: #8b8fa8; text-decoration: none; padding: 0.6rem 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; transition: all 0.15s; }
nav a:hover, nav a.active { background: #1a1d24; color: #e2e4ed; }
nav a.active { color: #6366f1; }
main { padding: 1.5rem 2rem; overflow-y: auto; }
.topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.topbar h1 { font-size: 1.25rem; font-weight: 600; }
.topbar-right { display: flex; align-items: center; gap: 1rem; }
.badge-status { font-size: 0.75rem; color: #10b981; font-weight: 600; }
.avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: white; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card { background: #13151a; border: 1px solid #2a2d3a; border-radius: 0.75rem; padding: 1.25rem; }
.stat-label { font-size: 0.75rem; color: #8b8fa8; margin-bottom: 0.5rem; }
.stat-value { font-size: 1.5rem; font-weight: 700; color: #e2e4ed; }
.stat-delta { font-size: 0.75rem; margin-top: 0.25rem; font-weight: 500; }
.positive { color: #10b981; }
.negative { color: #ef4444; }
.content-grid { display: grid; grid-template-columns: 3fr 2fr; gap: 1rem; }
.chart-area, .recent-list { background: #13151a; border: 1px solid #2a2d3a; border-radius: 0.75rem; padding: 1.25rem; }
.card-header { font-size: 0.875rem; font-weight: 600; color: #e2e4ed; margin-bottom: 1.25rem; }
.chart { display: flex; align-items: flex-end; gap: 0.75rem; height: 140px; }
.bar { flex: 1; background: #2a2d3a; border-radius: 0.25rem 0.25rem 0 0; position: relative; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 0.25rem; transition: background 0.2s; cursor: pointer; }
.bar:hover { background: #6366f150; }
.bar.highlight { background: linear-gradient(to top, #6366f1, #8b5cf6); }
.bar span { font-size: 0.65rem; color: #555874; position: absolute; bottom: -1.25rem; }
.tx-item { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #1a1d24; }
.tx-item:last-child { border-bottom: none; }
.tx-info { display: flex; flex-direction: column; gap: 0.1rem; }
.tx-info strong { font-size: 0.875rem; color: #e2e4ed; }
.tx-info span { font-size: 0.75rem; color: #8b8fa8; }
.tx-amount { font-size: 0.875rem; font-weight: 600; }
.green { color: #10b981; }
.red { color: #ef4444; }
@media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .content-grid { grid-template-columns: 1fr; } }
@media (max-width: 768px) { .layout { grid-template-columns: 1fr; } .sidebar { display: none; } }`,
    js: `// Interactive bar chart
document.querySelectorAll('.bar').forEach(bar => {
  bar.addEventListener('mouseenter', function() {
    const height = parseFloat(this.style.height);
    this.title = Math.round(height * 100) + ' units';
  });
});

// Live clock
function updateTime() {
  const now = new Date();
  const h1 = document.querySelector('.topbar h1');
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  h1.textContent = greeting + ', Alex 👋';
}
updateTime();`,
  },
};

const FORM_PAGE: Template = {
  id: 'form',
  name: 'Contact Form',
  description: 'Styled contact / signup form',
  category: 'Forms',
  tags: ['form', 'contact', 'signup'],
  files: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Contact</title>
</head>
<body>
  <div class="page">
    <div class="card">
      <div class="header">
        <h1>Get in Touch</h1>
        <p>We'll get back to you within 24 hours</p>
      </div>
      <form id="contactForm">
        <div class="row">
          <div class="field">
            <label for="firstName">First name</label>
            <input type="text" id="firstName" placeholder="John" required />
          </div>
          <div class="field">
            <label for="lastName">Last name</label>
            <input type="text" id="lastName" placeholder="Doe" required />
          </div>
        </div>
        <div class="field">
          <label for="email">Email address</label>
          <input type="email" id="email" placeholder="john@example.com" required />
        </div>
        <div class="field">
          <label for="subject">Subject</label>
          <select id="subject">
            <option>General inquiry</option>
            <option>Technical support</option>
            <option>Partnership</option>
            <option>Other</option>
          </select>
        </div>
        <div class="field">
          <label for="message">Message</label>
          <textarea id="message" rows="5" placeholder="Tell us what's on your mind…" required></textarea>
        </div>
        <button type="submit">Send Message</button>
      </form>
      <div id="success" class="success" style="display:none">
        ✅ Message sent successfully!
      </div>
    </div>
  </div>
</body>
</html>`,
    css: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: system-ui, sans-serif; background: #0d0e11; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
.page { width: 100%; max-width: 560px; }
.card { background: #13151a; border: 1px solid #2a2d3a; border-radius: 1rem; padding: 2.5rem; }
.header { margin-bottom: 2rem; text-align: center; }
.header h1 { font-size: 1.75rem; font-weight: 700; color: #e2e4ed; margin-bottom: 0.5rem; }
.header p { color: #8b8fa8; font-size: 0.9rem; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1rem; }
label { font-size: 0.8rem; font-weight: 600; color: #8b8fa8; text-transform: uppercase; letter-spacing: 0.03em; }
input, select, textarea { background: #0d0e11; border: 1px solid #2a2d3a; border-radius: 0.5rem; color: #e2e4ed; padding: 0.65rem 0.875rem; font-size: 0.9rem; font-family: inherit; transition: border-color 0.2s; outline: none; width: 100%; }
input:focus, select:focus, textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.15); }
select { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%238b8fa8' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 0.75rem center; background-size: 1.25rem; }
textarea { resize: vertical; min-height: 100px; }
input::placeholder, textarea::placeholder { color: #555874; }
button[type="submit"] { width: 100%; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; padding: 0.875rem; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 0.5rem; }
button[type="submit"]:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35); }
.success { text-align: center; color: #10b981; font-size: 0.9rem; margin-top: 1rem; padding: 0.75rem; background: rgba(16,185,129,0.1); border-radius: 0.5rem; border: 1px solid rgba(16,185,129,0.2); }
@media (max-width: 480px) { .row { grid-template-columns: 1fr; } .card { padding: 1.5rem; } }`,
    js: `document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    this.style.display = 'none';
    document.getElementById('success').style.display = 'block';
    console.log('Form submitted!', {
      name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
      email: document.getElementById('email').value,
    });
  }, 1200);
});`,
  },
};

const BLANK: Template = {
  id: 'blank',
  name: 'Blank',
  description: 'Start from scratch',
  category: 'Starter',
  tags: ['blank', 'empty', 'starter'],
  files: {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Project</title>
</head>
<body>

</body>
</html>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
}`,
    js: `// Your JavaScript here`,
  },
};

export const TEMPLATES: Template[] = [
  BLANK,
  LANDING_PAGE,
  PORTFOLIO,
  DASHBOARD,
  FORM_PAGE,
];

export function getTemplateById(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
