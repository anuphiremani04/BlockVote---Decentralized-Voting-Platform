import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, Lock, Globe, Hexagon, ArrowRight } from 'lucide-react';
import WalletConnect from '../components/WalletConnect';

export default function Landing() {
  const features = [
    { title: 'Secure', desc: 'Cryptographically secured voting process using strict modern protocols.', icon: Lock },
    { title: 'Transparent', desc: 'Every single vote is publicly and mathematically verifiable.', icon: Eye },
    { title: 'Tamper-proof', desc: 'Immutable records guaranteed by the Ethereum blockchain.', icon: ShieldCheck },
    { title: 'Decentralized', desc: 'No single point of failure. Distribution of trust.', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white relative font-sans">
      <div className="absolute inset-0 bg-[length:40px_40px] bg-grid-pattern dark:bg-grid-pattern-dark pointer-events-none opacity-50" />
      
      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10 border-b border-black dark:border-white">
        <div className="flex items-center gap-3">
          <Hexagon className="w-8 h-8" />
          <span className="text-2xl font-bold uppercase tracking-widest">BlockVote</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="btn-outline">Login</Link>
          <WalletConnect fullWidth={false} />
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mb-24 border-l-4 border-black dark:border-white pl-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter uppercase leading-[0.9]"
          >
            Secure <br/>
            Blockchain <br/>
            Voting Platform
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-mono-600 dark:text-mono-400 mb-10 max-w-2xl font-medium"
          >
            Experience next-generation democracy. Transparent, secure, and decentralized elections powered by modern Web3 infrastructure.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link to="/dashboard" className="btn-primary py-4 px-10 text-lg shadow-flat dark:shadow-flat-dark">
              Enter Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-black dark:border-white"
        >
          {features.map((feature, idx) => (
            <div key={idx} className="p-8 border-b border-r border-black dark:border-white bg-white dark:bg-black hover:bg-mono-100 dark:hover:bg-mono-900 transition-colors group">
              <div className="w-12 h-12 mb-6 border-2 border-black dark:border-white flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase mb-3">{feature.title}</h3>
              <p className="text-mono-600 dark:text-mono-400 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
