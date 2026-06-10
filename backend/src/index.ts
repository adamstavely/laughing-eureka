import express from 'express';
import cors from 'cors';
import { STANDARDS, ENABLERS, CATEGORIES, TEAMS, COMPLIANCE, STATUS } from './data/standards';
import { TECH } from './data/tech-data';

// Attach tech data to standards
STANDARDS.forEach((s) => {
  s.tech = TECH[s.id] ?? null;
});

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

// ── Standards ─────────────────────────────────────────────────────────────────

app.get('/api/standards', (_req, res) => {
  res.json(STANDARDS);
});

app.get('/api/standards/:id', (req, res) => {
  const standard = STANDARDS.find((s) => s.id === req.params.id);
  if (!standard) {
    res.status(404).json({ error: 'Standard not found' });
    return;
  }
  res.json(standard);
});

// ── Enablers ──────────────────────────────────────────────────────────────────

app.get('/api/enablers', (_req, res) => {
  res.json(ENABLERS);
});

app.get('/api/enablers/:id', (req, res) => {
  const enabler = ENABLERS.find((e) => e.id === req.params.id);
  if (!enabler) {
    res.status(404).json({ error: 'Enabler not found' });
    return;
  }
  res.json(enabler);
});

// ── Categories & metadata ─────────────────────────────────────────────────────

app.get('/api/categories', (_req, res) => {
  res.json(CATEGORIES);
});

app.get('/api/teams', (_req, res) => {
  res.json(TEAMS);
});

app.get('/api/compliance', (_req, res) => {
  res.json(COMPLIANCE);
});

app.get('/api/status', (_req, res) => {
  res.json(STATUS);
});

// ── Health ────────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Standards Portal API running on http://localhost:${PORT}`);
});
