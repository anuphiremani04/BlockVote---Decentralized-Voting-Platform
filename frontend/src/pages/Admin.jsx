import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Play, Square, Settings } from 'lucide-react';

export default function Admin() {
  const [electionActive, setElectionActive] = useState(true);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <header className="border-b-2 border-black dark:border-white pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Control Panel</h1>
        <p className="text-mono-600 dark:text-mono-400 font-medium">System administration and protocol configuration.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel">
            <div className="flex justify-between items-center mb-8 border-b border-black dark:border-white pb-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide">Deploy Election</h2>
              <button className="btn-outline py-2 px-4 text-xs"><Plus className="w-4 h-4" /> Create Contract</button>
            </div>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold uppercase tracking-wide mb-2">Election Identifier</label>
                <input type="text" className="input-field font-mono" placeholder="E.G. BOARD_VOTE_2026" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-2">Start Timestamp</label>
                  <input type="date" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wide mb-2">End Timestamp</label>
                  <input type="date" className="input-field" />
                </div>
              </div>
            </form>
          </div>

          <div className="glass-panel">
            <h2 className="text-2xl font-bold uppercase tracking-wide mb-6 border-b border-black dark:border-white pb-4">Candidate Roster</h2>
            <div className="space-y-4">
              {['Alice Johnson', 'Bob Smith'].map((name, i) => (
                <div key={i} className="flex justify-between items-center p-4 border border-mono-200 dark:border-mono-800 bg-mono-50 dark:bg-mono-950">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-black dark:border-white bg-mono-200 dark:bg-mono-800 flex items-center justify-center font-bold text-sm">C{i+1}</div>
                    <span className="font-bold uppercase tracking-wide">{name}</span>
                  </div>
                  <button className="text-sm font-bold uppercase tracking-wide underline hover:no-underline">Remove</button>
                </div>
              ))}
              <button className="w-full py-4 border-2 border-dashed border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex justify-center items-center gap-2 font-bold uppercase tracking-wide mt-4">
                <Plus className="w-5 h-5" /> Register Candidate
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel">
            <h2 className="text-2xl font-bold uppercase tracking-wide mb-6 border-b border-black dark:border-white pb-4">State Controls</h2>
            <div className="p-6 border-2 border-black dark:border-white mb-6 bg-mono-50 dark:bg-mono-950">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold uppercase tracking-wide">Current State</span>
                <span className={`px-3 py-1 border text-xs font-bold uppercase tracking-widest ${electionActive ? 'border-black text-black bg-white dark:border-white dark:text-white dark:bg-black' : 'border-mono-500 text-mono-500 bg-transparent'}`}>
                  {electionActive ? 'ACTIVE' : 'HALTED'}
                </span>
              </div>
              <p className="font-mono text-sm opacity-70 break-all">Contract: 0x82f...29A</p>
            </div>
            <button 
              onClick={() => setElectionActive(!electionActive)}
              className={`w-full py-4 font-bold uppercase tracking-widest border-2 transition-all active:scale-95 flex justify-center items-center gap-3 ${
                electionActive 
                  ? 'border-black bg-white text-black hover:bg-black hover:text-white dark:border-white dark:bg-black dark:text-white dark:hover:bg-white dark:hover:text-black' 
                  : 'border-black bg-black text-white hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white'
              }`}
            >
              {electionActive ? <><Square className="w-5 h-5" /> Halt Voting</> : <><Play className="w-5 h-5" /> Initiate Voting</>}
            </button>
          </div>

          <div className="glass-panel">
            <h2 className="text-xl font-bold uppercase tracking-wide mb-6 border-b border-black dark:border-white pb-4">Configuration</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-4 p-3 border border-transparent hover:border-black dark:hover:border-white transition-colors cursor-pointer font-bold uppercase tracking-wide text-sm">
                <Users className="w-5 h-5" /> Access Control List
              </li>
              <li className="flex items-center gap-4 p-3 border border-transparent hover:border-black dark:hover:border-white transition-colors cursor-pointer font-bold uppercase tracking-wide text-sm">
                <Settings className="w-5 h-5" /> Protocol Parameters
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
