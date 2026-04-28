const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Election = require('../models/Election');

// POST /api/votes
router.post('/', async (req, res) => {
  try {
    const { userId, candidateId, transactionHash } = req.body;
    
    const election = await Election.findOne({ status: 'ACTIVE' });
    if (!election) return res.status(400).json({ error: 'No active election' });

    const existingVote = await Vote.findOne({ userId, electionId: election._id });
    if (existingVote) return res.status(400).json({ error: 'User has already voted in this election' });

    const vote = new Vote({
      userId,
      electionId: election._id,
      candidateId,
      transactionHash
    });

    await vote.save();
    res.status(201).json(vote);
  } catch (error) {
    if (error.code === 11000) return res.status(400).json({ error: 'Already voted' });
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
