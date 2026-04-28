import { useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Vote, CheckCircle } from 'lucide-react';
import { WalletContext } from '../context/WalletContext';

export default function Dashboard() {
  const { address } = useContext(WalletContext);
  const [statsData, setStatsData] = useState({ elections: 0, users: 0, votes: 0 });
  const [recentVotes, setRecentVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(res => res.json()),
      fetch('/api/admin/votes').then(res => res.json())
    ]).then(([stats, votes]) => {
      setStatsData(stats);
      setRecentVotes(votes.slice(0, 3)); // Only take 3 most recent
      setLoading(false);
    }).catch(console.error);
  }, []);

  const stats = [
    { title: 'Active Elections', value: loading ? '...' : statsData.elections, icon: Vote },
    { title: 'Total Votes Cast', value: loading ? '...' : statsData.votes, icon: CheckCircle },
    { title: 'Registered Voters', value: loading ? '...' : statsData.users, icon: Users },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="border-b-2 border-black dark:border-white pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Dashboard</h1>
        <p className="text-mono-600 dark:text-mono-400 font-medium">Welcome back. System status: Operational.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 border-2 border-current flex items-center justify-center">
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider mb-1 opacity-70">{stat.title}</p>
                <h3 className="text-3xl font-bold tracking-tighter">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel w-full">
        <h2 className="text-2xl font-bold uppercase tracking-wide mb-6 border-b border-black dark:border-white pb-4">Activity Log</h2>
        <div className="space-y-0">
          {recentVotes.length > 0 ? recentVotes.map((vote, index) => (
            <div key={vote._id} className={`flex items-center justify-between p-4 ${index !== recentVotes.length -1 ? 'border-b border-mono-200 dark:border-mono-800' : ''}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-black dark:border-white flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold uppercase text-sm">Vote Cast</p>
                  <p className="text-sm text-mono-600 dark:text-mono-400 font-medium">To: {vote.candidateId ? vote.candidateId.name : 'Unknown Candidate'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{new Date(vote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="text-xs font-mono uppercase bg-mono-100 dark:bg-mono-900 px-2 py-1 mt-1">{vote.transactionHash.substring(0,10)}...</p>
              </div>
            </div>
          )) : (
            <p className="p-4 text-mono-500 font-medium text-center">No recent activity detected.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
