const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockvote')
  .then(async () => {
    console.log('MongoDB connected for seeding voters...');
    
    // Clean up previously seeded dummy voters to prevent email collision errors
    await User.deleteMany({ role: 'user', email: { $regex: /^voter\d+@blockvote\.com$/ } });

    // Hash the universal password requested by the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const voters = [];
    for (let i = 1; i <= 10; i++) {
      voters.push({
        name: `voter${i}`,
        email: `voter${i}@blockvote.com`,
        password: hashedPassword,
        role: 'user',
        walletAddress: '' // Empty by default until they connect MetaMask
      });
    }

    // Insert all 10 voters into the database
    await User.insertMany(voters);
    console.log('✅ Successfully added 10 voters (voter1 to voter10) to the database!');
    console.log('All passwords are set to: password123');
    process.exit();
  }).catch(err => {
    console.error('❌ Seeding Error:', err);
    process.exit(1);
  });
