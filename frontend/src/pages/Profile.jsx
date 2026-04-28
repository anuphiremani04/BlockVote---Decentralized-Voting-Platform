import { useContext } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, ExternalLink, Key } from 'lucide-react';
import { WalletContext } from '../context/WalletContext';

export default function Profile() {
  const { address } = useContext(WalletContext);
  const history = [
    { date: 'Oct 24, 2026', election: 'Presidential Election 2026', hash: '0xabc...123', status: 'Confirmed' },
    { date: 'Jun 12, 2025', election: 'Local Council Members', hash: '0xdef...456', status: 'Confirmed' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl mx-auto">
      <header className="border-b-2 border-black dark:border-white pb-6">
        <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Identity Profile</h1>
        <p className="text-mono-600 dark:text-mono-400 font-medium">Cryptographic identity and transaction history.</p>
      </header>

      <div className="glass-panel flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="w-32 h-32 border-4 border-black dark:border-white flex items-center justify-center bg-mono-100 dark:bg-mono-900">
          <span className="text-5xl grayscale">👤</span>
        </div>
        <div className="flex-1 text-center md:text-left w-full">
          <h2 className="text-3xl font-bold uppercase tracking-tight mb-2">Voter Identity</h2>
          <div className="flex items-center justify-center md:justify-start gap-2 text-mono-600 dark:text-mono-400 font-medium mb-6 uppercase tracking-wider text-sm">
            <User className="w-4 h-4" /> Authenticated Citizen
          </div>
          <div className="border-2 border-black dark:border-white p-4 flex items-center justify-between">
            <div className="font-mono text-sm break-all font-bold">
              {address || 'No wallet connected'}
            </div>
            <button className="p-2 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
              <Key className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="glass-panel p-0">
        <div className="p-6 border-b border-black dark:border-white">
          <h3 className="text-2xl font-bold uppercase tracking-wide flex items-center gap-3">
            <Shield className="w-6 h-6" /> Transaction Ledger
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black dark:border-white bg-mono-50 dark:bg-mono-950">
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm">Date</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm">Election</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm">Tx Hash</th>
                <th className="py-4 px-6 font-bold uppercase tracking-wider text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx} className="border-b border-mono-200 dark:border-mono-800 hover:bg-mono-100 dark:hover:bg-mono-900 transition-colors">
                  <td className="py-5 px-6 text-sm font-medium">{item.date}</td>
                  <td className="py-5 px-6 font-bold uppercase">{item.election}</td>
                  <td className="py-5 px-6 font-mono text-xs flex items-center gap-2 cursor-pointer hover:underline">
                    {item.hash} <ExternalLink className="w-4 h-4" />
                  </td>
                  <td className="py-5 px-6">
                    <span className="border border-black dark:border-white px-3 py-1 text-xs font-bold uppercase">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
