const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  transactionHash: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent double voting at the DB level (compound index)
VoteSchema.index({ userId: 1, electionId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
