import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Results() {
  const [activeTab, setActiveTab] = useState('live');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = () => {
      fetch('/api/elections/results')
        .then(res => res.json())
        .then(fetchedData => {
          const formattedData = fetchedData.map(d => ({
            name: d.name,
            party: d.party,
            votes: d.votes,
            fill: d.fill || '#000000'
          }));
          setData(formattedData);
          setLoading(false);
        }).catch(console.error);
    };

    // Initial fetch
    fetchResults();

    // Poll for live updates every 5 seconds
    const intervalId = setInterval(fetchResults, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const totalVotes = data.reduce((sum, item) => sum + item.votes, 0) || 1; // prevent divide by zero

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="border-b-2 border-black dark:border-white pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Ledger Results</h1>
          <p className="text-mono-600 dark:text-mono-400 font-medium">Real-time, trustless data visualization.</p>
        </div>
        <div className="flex items-center gap-2 border-2 border-black dark:border-white px-4 py-2 font-bold text-sm uppercase">
          <ShieldCheck className="w-5 h-5" /> Verified On-Chain
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel h-[500px] flex flex-col">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-8 border-b border-black dark:border-white pb-4">Live Vote Count</h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d4d4d4" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} className="text-sm font-bold uppercase fill-black dark:fill-white" />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', borderRadius: '0', color: '#000', fontWeight: 'bold' }} />
                <Bar dataKey="votes" radius={[0, 0, 0, 0]} barSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? 'currentColor' : index === 1 ? '#737373' : '#d4d4d4'} className="fill-black dark:fill-white" style={{ opacity: 1 - (index * 0.3) }} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel">
          <h2 className="text-2xl font-bold uppercase tracking-wide mb-6 border-b border-black dark:border-white pb-4">Rankings</h2>
          <div className="space-y-4">
            {[...data].sort((a,b) => b.votes - a.votes).map((candidate, idx) => (
              <div key={candidate.id || idx} className="flex items-center justify-between p-4 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border-2 border-current flex items-center justify-center font-bold text-xl">
                    {idx + 1}
                  </div>
                  <span className="font-bold uppercase tracking-wide">{candidate.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{(candidate.votes || 0).toLocaleString()}</p>
                  <p className="text-xs font-mono group-hover:text-current text-mono-500">{(((candidate.votes || 0) / totalVotes) * 100).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
