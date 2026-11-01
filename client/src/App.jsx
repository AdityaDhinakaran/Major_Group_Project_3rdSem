import { useEffect, useMemo, useState } from 'react';
import { initialRoadmaps, resources } from './data.js';

const filters = ['All paths', 'Beginner', 'Intermediate'];
const formatLearners = (n) => new Intl.NumberFormat('en', { notation: n > 999 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(n);

function App() {
  const [roadmaps, setRoadmaps] = useState(initialRoadmaps);
  const [activeFilter, setActiveFilter] = useState('All paths');
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Explore');
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(new Set(['linear-algebra']));
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch('/api/roadmaps').then((r) => r.ok ? r.json() : []).then((data) => { if (data.length) setRoadmaps(data); }).catch(() => {});
  }, []);

  const visible = useMemo(() => roadmaps.filter((path) => {
    const matchesLevel = activeFilter === 'All paths' || path.level === activeFilter;
    const matchesQuery = `${path.title} ${path.description} ${path.tags?.join(' ')}`.toLowerCase().includes(query.toLowerCase());
    const matchesTab = activeTab !== 'My learning' || saved.has(path.id);
    return matchesLevel && matchesQuery && matchesTab;
  }), [roadmaps, activeFilter, query, activeTab, saved]);

  function toggleSaved(id) {
    setSaved((previous) => {
      const next = new Set(previous);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setNotice(saved.has(id) ? 'Removed from your learning paths' : 'Added to your learning paths');
    window.setTimeout(() => setNotice(''), 2400);
  }

  async function addRoadmap(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get('title')?.toString().trim();
    const description = form.get('description')?.toString().trim();
    if (!title || !description) return;
    const roadmap = { id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), title, category: 'COMMUNITY PICKS', level: form.get('level'), icon: '✳', color: 'pink', description, topics: 1, hours: 1, learners: 1, progress: 0, tags: ['Community', 'New'] };
    setRoadmaps((current) => [roadmap, ...current]);
    setShowForm(false);
    event.currentTarget.reset();
    try {
      await fetch('/api/roadmaps', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(roadmap) });
    } catch { /* The new suggestion stays available in this session. */ }
    setNotice('Your roadmap suggestion is live!');
    window.setTimeout(() => setNotice(''), 3000);
  }

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="Mathpath home"><span className="brand-mark">m<span>.</span></span><span className="brand-name">mathpath</span></a>
      <div className="sidebar-label">YOUR SPACE</div>
      <nav className="primary-nav" aria-label="Main navigation">
        {['Explore', 'My learning'].map((tab) => <button key={tab} className={`nav-item ${activeTab === tab ? 'selected' : ''}`} onClick={() => setActiveTab(tab)}><span className="nav-icon">{tab === 'Explore' ? '⌕' : '▤'}</span>{tab}{tab === 'My learning' && <span className="nav-count">{saved.size}</span>}</button>)}
        <button className="nav-item" onClick={() => { setShowForm(true); setActiveTab('Explore'); }}><span className="nav-icon">＋</span>Suggest a path</button>
      </nav>
      <div className="sidebar-rule" />
      <div className="sidebar-label">YOUR CURIOSITY</div>
      <div className="interest-list"><span>◒ &nbsp;Visual thinking</span><span>✳ &nbsp;Puzzles</span><span>⌘ &nbsp;Computer science</span></div>
      <div className="sidebar-bottom"><div className="avatar">A</div><div><strong>Curious learner</strong><small>Building a little every day</small></div><button className="more-button" aria-label="More options">···</button></div>
    </aside>

    <main className="main-content" id="top">
      <header className="topbar"><div className="breadcrumbs">Your space <span>/</span> <strong>{activeTab === 'Explore' ? 'Explore' : 'My learning'}</strong></div><button className="top-contribute" onClick={() => setShowForm(true)}><span>＋</span> Contribute</button></header>
      <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="sparkle">✳</span> YOUR MATH, YOUR WAY</div><h1>Follow what<br />makes you <em>curious.</em></h1><p>Hand-picked learning paths that connect the dots between what you know and what you want to explore.</p><a href="#roadmaps" className="hero-link">Find your next idea <span>↓</span></a></div><div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orb orb-main">∫</div><div className="orb orb-small orb-a">π</div><div className="orb orb-small orb-b">∑</div><div className="orb orb-small orb-c">∞</div><span className="art-star">✳</span><span className="art-dot"/></div><div className="hero-note"><span>✦</span><div><strong>There’s no one right way.</strong><br />Start anywhere. Follow a question.</div></div></section>
      <section className="content-section" id="roadmaps"><div className="section-heading"><div><div className="eyebrow muted-eyebrow">A GOOD PLACE TO BEGIN</div><h2>{activeTab === 'Explore' ? 'Learning paths' : 'Your learning paths'} <span className="result-count">{visible.length.toString().padStart(2, '0')}</span></h2></div><button className="text-button" onClick={() => setShowForm(true)}>＋ Suggest a path</button></div>
        <div className="toolbar"><div className="filter-pills">{filters.map((filter) => <button key={filter} className={`filter-pill ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><label className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a topic..." aria-label="Find a topic"/><kbd>⌘ K</kbd></label></div>
        <div className="roadmap-grid">{visible.map((path, index) => <article className={`roadmap-card ${path.featured ? 'featured-card' : ''}`} key={path.id} style={{ '--card-order': index }}><button className={`bookmark ${saved.has(path.id) ? 'is-saved' : ''}`} aria-label={saved.has(path.id) ? 'Remove from my learning' : 'Add to my learning'} onClick={() => toggleSaved(path.id)}>{saved.has(path.id) ? '♥' : '♡'}</button><div className="card-topline"><div className={`subject-icon ${path.color}`}>{path.icon}</div><span className={`level-badge ${path.level.toLowerCase()}`}>{path.level}</span></div><div className="card-category">{path.category}</div><button className="card-title" onClick={() => setSelected(path)}>{path.title}<span>↗</span></button><p className="card-description">{path.description}</p><div className="tag-list">{path.tags?.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><div className="card-footer"><span>◎ &nbsp;{path.topics} topics</span><span>◷ &nbsp;{path.hours} hrs</span><span>↗ &nbsp;{formatLearners(path.learners)}</span></div>{path.progress > 0 && <div className="progress-wrap"><div className="progress-caption"><span>YOUR PROGRESS</span><strong>{path.progress}%</strong></div><div className="progress-track"><span style={{ width: `${path.progress}%` }}/></div></div>}</article>)}</div>
        {visible.length === 0 && <div className="empty-state"><span>⌕</span><h3>No paths found just yet</h3><p>Try another search or suggest a learning path for the community.</p><button className="text-button" onClick={() => setShowForm(true)}>＋ Suggest a path</button></div>}
        <div className="community-banner"><div className="community-graphic" aria-hidden="true"><span>∑</span><i>✳</i><b>↗</b></div><div><span className="eyebrow muted-eyebrow">BUILT BY CURIOUS MINDS</span><h3>A great path starts with a good question.</h3><p>Share something that made math click for you. Your next contribution might be someone’s lightbulb moment.</p><button className="button-dark" onClick={() => setShowForm(true)}>Share a resource <span>→</span></button></div><div className="banner-stat"><strong>2.4k</strong><span>curious minds<br />learning together</span><div className="mini-avatars"><i>A</i><i>M</i><i>J</i><i>+</i></div></div></div>
      </section>
      <footer className="site-footer"><span>mathpath <i>·</i> made for the mathematically curious</span><span>Small steps count. So do big questions. <b>✳</b></span></footer>
    </main>

    <aside className="right-panel"><div className="panel-heading"><div><span className="eyebrow muted-eyebrow">FOR THE CURIOUS</span><h3>Little things<br />to explore</h3></div><span className="panel-sparkle">✳</span></div><div className="week-note"><span className="week-label">QUESTION OF THE WEEK <span>↗</span></span><p>Why do numbers in the Fibonacci sequence keep showing up in nature?</p><button onClick={() => setSelected(roadmaps.find((path) => path.id === 'number-theory'))}>Follow the rabbit hole <span>→</span></button></div><div className="resource-heading"><h4>On this path</h4><button onClick={() => setSelected(roadmaps[0])}>Linear Algebra <span>⌄</span></button></div><div className="resource-list">{resources.map((resource) => <button className="resource-card" key={resource.title} onClick={() => setNotice(`${resource.title} added to your reading list`)}><span className={`resource-icon ${resource.color}`}>{resource.icon}</span><span className="resource-copy"><span className="resource-type">{resource.type}</span><strong>{resource.title}</strong><small>{resource.creator}</small></span><span className="resource-duration">{resource.duration}</span></button>)}</div><button className="browse-resources" onClick={() => setNotice('More community resources are coming soon')}>Browse all resources <span>→</span></button><div className="streak-card"><div className="streak-top"><span>YOUR LITTLE STREAK</span><span className="streak-icon">✳</span></div><strong>3 days <span>in a row!</span></strong><div className="week-days">{['M','T','W','T','F','S','S'].map((day, i) => <span key={i} className={i < 3 ? 'done' : ''}>{i < 3 ? '✓' : day}</span>)}</div><p>Ten minutes of curiosity counts.</p></div><div className="quote-card"><span>“</span><p>Pure mathematics is, in its way, the poetry of logical ideas.</p><small>— ALBERT EINSTEIN</small><div className="quote-scribble">∿ ⌁ ∿</div></div></aside>

    {showForm && <div className="modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && setShowForm(false)}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close">×</button><div className="eyebrow muted-eyebrow">GROW THE COMMUNITY LIBRARY</div><h2 id="modal-title">Suggest a learning path</h2><p>What would you love to help someone explore?</p><form onSubmit={addRoadmap}><label>Path name<input name="title" required placeholder="e.g. Graph Theory" maxLength="48" /></label><label>A little about it<textarea name="description" required placeholder="What makes this topic interesting?" maxLength="150" /></label><label>Starting level<select name="level"><option>Beginner</option><option>Intermediate</option></select></label><button className="button-dark" type="submit">Add to the library <span>→</span></button></form></section></div>}
    {selected && <div className="modal-backdrop" role="presentation" onClick={(event) => event.target === event.currentTarget && setSelected(null)}><section className="modal detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close">×</button><div className={`subject-icon ${selected.color}`}>{selected.icon}</div><div className="eyebrow muted-eyebrow">{selected.category}</div><h2 id="detail-title">{selected.title}</h2><p>{selected.description}</p><div className="detail-stats"><span>{selected.topics} topics</span><span>{selected.hours} hours</span><span>{selected.level}</span></div><h4>Your first three steps</h4><ol>{['Get curious: meet the big idea', 'Build intuition with a visual', 'Try a problem of your own'].map((step) => <li key={step}><span>✳</span>{step}<small>Explore · 10 min</small></li>)}</ol><button className="button-dark" onClick={() => { toggleSaved(selected.id); setSelected(null); }}> {saved.has(selected.id) ? 'Remove from my learning' : 'Start this learning path'} <span>→</span></button></section></div>}
    {notice && <div className="toast" role="status"><span>✓</span>{notice}</div>}
  </div>;
}

export default App;
