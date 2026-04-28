const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Election = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const elections = await Election.countDocuments();
    const users = await User.countDocuments({ role: 'user' });
    const votes = await Vote.countDocuments();
    res.json({ elections, users, votes });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/elections
router.get('/elections', async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });
    res.json(elections);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/elections
router.post('/elections', async (req, res) => {
  try {
    const election = new Election({ title: req.body.title, description: req.body.description || '', status: 'ACTIVE' });
    await election.save();
    res.json(election);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// PUT /api/admin/elections/:id/status
router.put('/elections/:id/status', async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(election);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/admin/candidates
router.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find().populate('electionId', 'title');
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/candidates
router.post('/candidates', async (req, res) => {
  try {
    // If no electionId is provided, fallback to the first active election
    let electionId = req.body.electionId;
    if (!electionId) {
      const activeElection = await Election.findOne({ status: 'ACTIVE' }) || await Election.findOne();
      if (activeElection) electionId = activeElection._id;
    }
    
    const candidate = new Candidate({ name: req.body.name, party: req.body.party, electionId });
    await candidate.save();
    res.json(candidate);
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// DELETE /api/admin/candidates/:id
router.delete('/candidates/:id', async (req, res) => {
  try {
    await Candidate.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/votes
router.get('/votes', async (req, res) => {
  try {
    const votes = await Vote.find().populate('userId', 'email walletAddress').populate('candidateId', 'name').sort({ createdAt: -1 });
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
