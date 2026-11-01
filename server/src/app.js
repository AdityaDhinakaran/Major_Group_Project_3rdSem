import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ensureDatabase, pool } from './db.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '20kb' }));

const starterPaths = [
  { id: 'linear-algebra', title: 'Linear Algebra', category: 'FOUNDATIONS', level: 'Beginner', icon: '▦', color: 'lavender', description: 'See the geometry hiding inside equations, transformations, and data.', topics: 12, hours: 18, learners: 2840, progress: 35, tags: ['Vectors', 'Matrices', 'Visual'], featured: true },
  { id: 'probability', title: 'Probability', category: 'CHANCE & UNCERTAINTY', level: 'Beginner', icon: '◌', color: 'peach', description: 'Get comfortable reasoning about randomness and the unexpected.', topics: 9, hours: 12, learners: 1960, progress: 0, tags: ['Chance', 'Games', 'Real life'] },
  { id: 'calculus', title: 'Calculus', category: 'CHANGE & MOTION', level: 'Intermediate', icon: '∫', color: 'mint', description: 'Understand how tiny changes add up to a much bigger picture.', topics: 16, hours: 24, learners: 3240, progress: 0, tags: ['Limits', 'Motion', 'Visual'] },
  { id: 'number-theory', title: 'Number Theory', category: 'PATTERNS & PROOFS', level: 'Beginner', icon: '∴', color: 'lemon', description: 'Find surprisingly rich patterns in the numbers you already know.', topics: 8, hours: 10, learners: 1580, progress: 0, tags: ['Primes', 'Puzzles', 'Patterns'] },
  { id: 'statistics', title: 'Statistics', category: 'DATA & DECISIONS', level: 'Intermediate', icon: '▥', color: 'blue', description: 'Turn messy data into clearer questions, stories, and decisions.', topics: 11, hours: 16, learners: 2130, progress: 0, tags: ['Data', 'Evidence', 'Visual'] },
  { id: 'discrete-math', title: 'Discrete Mathematics', category: 'LOGIC & STRUCTURE', level: 'Intermediate', icon: '⌘', color: 'pink', description: 'Explore the logic and structures that make computing possible.', topics: 10, hours: 14, learners: 1760, progress: 0, tags: ['Logic', 'Graphs', 'Computing'] },
];

app.get('/api/health', async (_req, res) => {
  if (!pool) return res.json({ status: 'ok', database: 'not configured' });
  try { await ensureDatabase(); await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch { res.status(503).json({ status: 'error', database: 'unavailable' }); }
});

app.get('/api/roadmaps', async (_req, res) => {
  if (!pool) return res.json(starterPaths);
  try {
    await ensureDatabase();
    const { rows } = await pool.query('SELECT id, title, category, level, icon, color, description, topics, hours, learners, progress, tags, featured FROM roadmaps ORDER BY created_at DESC');
    res.json(rows.length ? rows : starterPaths);
  } catch (error) {
    console.error('Could not load roadmaps:', error.message);
    res.status(500).json({ error: 'Roadmaps could not be loaded.' });
  }
});

app.post('/api/roadmaps', async (req, res) => {
  const { id, title, category = 'COMMUNITY PICKS', level = 'Beginner', icon = '✳', color = 'pink', description, topics = 1, hours = 1, learners = 1, progress = 0, tags = ['Community', 'New'] } = req.body ?? {};
  if (!title?.trim() || !description?.trim()) return res.status(400).json({ error: 'A title and description are required.' });
  if (!['Beginner', 'Intermediate'].includes(level)) return res.status(400).json({ error: 'Choose a valid starting level.' });
  const safeId = (id || title).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  if (!safeId) return res.status(400).json({ error: 'The path needs a valid name.' });
  const roadmap = { id: safeId, title: title.trim().slice(0, 60), category: String(category).slice(0, 40), level, icon, color, description: description.trim().slice(0, 240), topics: Number(topics) || 1, hours: Number(hours) || 1, learners: Number(learners) || 1, progress: Number(progress) || 0, tags: Array.isArray(tags) ? tags.slice(0, 5).map(String) : [] };
  if (pool) {
    try {
      await ensureDatabase();
      const { rows } = await pool.query(
        `INSERT INTO roadmaps (id, title, category, level, icon, color, description, topics, hours, learners, progress, tags)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
         ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, category=EXCLUDED.category, level=EXCLUDED.level, icon=EXCLUDED.icon, color=EXCLUDED.color, description=EXCLUDED.description, topics=EXCLUDED.topics, hours=EXCLUDED.hours, tags=EXCLUDED.tags
         RETURNING id, title, category, level, icon, color, description, topics, hours, learners, progress, tags, featured`,
        [roadmap.id, roadmap.title, roadmap.category, roadmap.level, roadmap.icon, roadmap.color, roadmap.description, roadmap.topics, roadmap.hours, roadmap.learners, roadmap.progress, roadmap.tags],
      );
      return res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Could not save roadmap:', error.message);
      return res.status(500).json({ error: 'The roadmap could not be saved.' });
    }
  }
  res.status(201).json(roadmap);
});

app.use((_req, res) => res.status(404).json({ error: 'That endpoint does not exist.' }));
export default app;
