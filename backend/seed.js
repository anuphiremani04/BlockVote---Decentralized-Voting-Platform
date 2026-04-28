const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Election = require('./models/Election');
const Candidate = require('./models/Candidate');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockvote', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB Connected for Seeding');

  // Clear existing data
  await Election.deleteMany({});
  await Candidate.deleteMany({});
  
  // Create an Active Election
  const election = new Election({
    title: 'National Assembly Election 2026',
    status: 'ACTIVE',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  await election.save();

  // Create Realistic Candidates
  const candidates = [
    { name: 'Rajesh Sharma', party: 'National Development Party', electionId: election._id },
    { name: 'Priya Patel', party: 'Progressive India Coalition', electionId: election._id },
    { name: 'Amit Singh', party: 'United Citizens Front', electionId: election._id },
    { name: 'Sneha Reddy', party: 'Democratic Alliance', electionId: election._id },
    { name: 'Vikram Malhotra', party: 'People\'s Voice Party', electionId: election._id },
    { name: 'Anjali Desai', party: 'Green Future Initiative', electionId: election._id }
  ];
  await Candidate.insertMany(candidates);

  console.log('✅ Database successfully seeded with real Election and Candidate data!');
  process.exit();
}).catch(err => {
  console.error('❌ Seeding Error:', err);
  process.exit(1);
});
