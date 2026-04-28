const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');

// GET /api/elections/active
router.get('/active', async (req, res) => {
  try {
    const election = await Election.findOne({ status: 'ACTIVE' });
    if (!election) return res.status(404).json({ error: 'No active election found' });
    
    const candidates = await Candidate.find({ electionId: election._id });
    
    res.json({ election, candidates });
  } catch (error) {
    console.error("Error fetching active election:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/elections
router.get('/', async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/elections/results
router.get('/results', async (req, res) => {
  try {
    const Vote = require('../models/Vote');
    const election = await Election.findOne({ status: 'ACTIVE' }) || await Election.findOne();
    if (!election) return res.status(404).json({ error: 'No election found' });
    
    const candidates = await Candidate.find({ electionId: election._id }).lean();
    const votes = await Vote.find({ electionId: election._id }).lean();

    const counts = {};
    votes.forEach(v => {
      counts[v.candidateId] = (counts[v.candidateId] || 0) + 1;
    });

    const results = candidates.map(c => ({
      id: c._id,
      name: c.name,
      party: c.party,
      votes: counts[c._id] || 0,
      fill: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0') // Add random hex colors for charts
    }));

    // Sort by votes descending
    results.sort((a, b) => b.votes - a.votes);

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
