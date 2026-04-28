const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blockvote')
  .then(async () => {
    console.log('\n======================================================');
    console.log('                 REGISTERED VOTERS                    ');
    console.log('======================================================\n');
    
    // Fetch all users with role 'user'
    const users = await User.find({ role: 'user' });
    
    if (users.length === 0) {
      console.log('No voters found in the database.\n');
    } else {
      users.forEach((user, index) => {
        console.log(`[Voter ${index + 1}]`);
        console.log(`Name    : ${user.name}`);
        console.log(`Email   : ${user.email}`);
        console.log(`Wallet  : ${user.walletAddress || 'Not Connected'}`);
        console.log('------------------------------------------------------');
      });
      console.log(`\nTotal Voters Found: ${users.length}`);
    }
    console.log('======================================================\n');
    process.exit();
  }).catch(err => {
    console.error('❌ Connection Error:', err);
    process.exit(1);
  });
