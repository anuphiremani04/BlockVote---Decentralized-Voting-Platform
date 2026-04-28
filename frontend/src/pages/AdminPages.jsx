import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckSquare, BarChart3, Settings } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => (
  <header className="border-b-2 border-black pb-6 mb-8">
    <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">{title}</h1>
    <p className="text-mono-600 font-medium">{subtitle}</p>
  </header>
);

export function AdminDashboard() {
  const [stats, setStats] = useState({ elections: 0, users: 0, votes: 0 });
  const [recentVotes, setRecentVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(res => res.json()),
      fetch('/api/admin/votes').then(res => res.json())
    ]).then(([statsData, votesData]) => {
      setStats(statsData);
      setRecentVotes(votesData.slice(0, 3));
      setLoading(false);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader title="System Overview" subtitle="High-level metrics and recent platform activity." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {t:'Total Elections', v: loading ? '...' : stats.elections}, 
          {t:'Total Users', v: loading ? '...' : stats.users}, 
          {t:'Total Votes', v: loading ? '...' : stats.votes}
        ].map((s,i) => (
          <div key={i} className="glass-panel hover:bg-black hover:text-white transition-colors">
            <p className="text-xs uppercase font-bold tracking-wider mb-2 opacity-70">{s.t}</p>
            <h3 className="text-4xl font-bold tracking-tighter">{s.v}</h3>
          </div>
        ))}
      </div>
      <div className="glass-panel">
        <h2 className="text-xl font-bold uppercase mb-4 border-b border-black pb-2">Recent System Activity</h2>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-black text-sm uppercase tracking-wide opacity-70">
            <th className="py-3">Action</th><th className="py-3">Details</th><th className="py-3">Time</th>
          </tr></thead>
          <tbody>
            {recentVotes.length > 0 ? recentVotes.map((v) => (
              <tr key={v._id} className="border-b border-mono-200">
                <td className="py-3 font-bold">Vote Cast</td>
                <td className="py-3 text-mono-600">Candidate: {v.candidateId ? v.candidateId.name : 'Unknown'}</td>
                <td className="py-3">{new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="py-3 text-mono-500">No activity yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export function AdminElections() {
  const [elections, setElections] = useState([]);

  const fetchElections = () => fetch('/api/admin/elections').then(res => res.json()).then(setElections);
  useEffect(() => { fetchElections(); }, []);

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'ENDED' : 'ACTIVE';
    await fetch(`/api/admin/elections/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchElections();
  };

  const handleCreate = async () => {
    const title = prompt("Enter Election Title:");
    if (title) {
      await fetch('/api/admin/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: 'New Election' })
      });
      fetchElections();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Elections" subtitle="Create, edit, and manage voting events." />
      <div className="glass-panel">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold uppercase">All Elections</h2>
          <button onClick={handleCreate} className="btn-primary px-4 py-2 text-sm">Create New</button>
        </div>
        {elections.map(election => (
          <div key={election._id} className="flex justify-between items-center p-4 border-2 border-black hover:bg-mono-50 transition-colors mb-4">
            <div>
              <h3 className="font-bold text-lg uppercase tracking-wide">{election.title}</h3>
              <p className="text-sm font-medium mt-1">Status: <span className="bg-black text-white px-2 py-0.5 ml-1 text-xs">{election.status || 'ACTIVE'}</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleStatusChange(election._id, election.status)} className="btn-outline px-4 py-2 text-sm">
                Toggle Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function AdminCandidates() {
  const [candidates, setCandidates] = useState([]);

  const fetchCandidates = () => fetch('/api/admin/candidates').then(res => res.json()).then(setCandidates);
  useEffect(() => { fetchCandidates(); }, []);

  const handleAdd = async () => {
    const name = prompt("Enter Candidate Name:");
    const party = prompt("Enter Party:");
    if (name && party) {
      await fetch('/api/admin/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, party })
      });
      fetchCandidates();
    }
  };

  const handleRemove = async (id) => {
    if(confirm("Are you sure you want to remove this candidate?")) {
      await fetch(`/api/admin/candidates/${id}`, { method: 'DELETE' });
      fetchCandidates();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <PageHeader title="Candidates" subtitle="Manage candidate profiles and election assignments." />
      <div className="glass-panel">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold uppercase">Registered Candidates</h2>
          <button onClick={handleAdd} className="btn-primary px-4 py-2 text-sm">Add Candidate</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-black text-sm uppercase tracking-wide">
            <th className="py-3">Name</th><th className="py-3">Party</th><th className="py-3 text-right">Actions</th>
          </tr></thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c._id} className="border-b border-mono-200 hover:bg-mono-50">
                <td className="py-4 font-bold">{c.name}</td>
                <td className="py-4 text-mono-600">{c.party}</td>
                <td className="py-4 text-right">
                  <button onClick={() => handleRemove(c._id)} className="text-sm font-bold uppercase underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/admin/users').then(res => res.json()).then(setUsers);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Users" subtitle="View and manage registered voters." />
      <div className="glass-panel">
        <div className="flex gap-4 mb-6">
          <input type="text" placeholder="Search by email..." className="input-field flex-1" />
          <button className="btn-primary px-6">Search</button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-black text-sm uppercase tracking-wide">
            <th className="py-3">Name</th><th className="py-3">Email</th><th className="py-3 text-right">Status</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b border-mono-200">
                <td className="py-4 font-bold">{u.name}</td><td className="py-4">{u.email}</td>
                <td className="py-4 text-right"><span className="text-xs bg-black text-white px-2 py-1">Verified</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export function AdminVotes() {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    fetch('/api/admin/votes').then(res => res.json()).then(setVotes);
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Votes & Transactions" subtitle="Immutable ledger of all cast ballots." />
      <div className="glass-panel">
        <table className="w-full text-left border-collapse">
          <thead><tr className="border-b border-black text-sm uppercase tracking-wide">
            <th className="py-3">Voter Address / ID</th><th className="py-3">Transaction Hash</th><th className="py-3 text-right">Time</th>
          </tr></thead>
          <tbody>
            {votes.length > 0 ? votes.map(v => (
              <tr key={v._id} className="border-b border-mono-200">
                <td className="py-4 font-mono text-sm">{v.userId ? v.userId.walletAddress || v.userId._id : 'Unknown'}</td>
                <td className="py-4 font-mono text-xs bg-mono-100 px-2">{v.transactionHash}</td>
                <td className="py-4 text-right text-sm">{new Date(v.createdAt).toLocaleString()}</td>
              </tr>
            )) : (
              <tr><td colSpan="3" className="py-4 text-center text-mono-500">No votes cast yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export function AdminResults() {
  const [results, setResults] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetch('/api/elections/results').then(res => res.json()).then(data => {
      setResults(data);
      setTotalVotes(data.reduce((sum, c) => sum + c.votes, 0));
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Election Results" subtitle="Live analytics and finalized voting outcomes." />
      <div className="glass-panel">
        <h2 className="text-xl font-bold uppercase mb-6">Current Standings</h2>
        <div className="space-y-4">
          {results.map((c, i) => {
            const percentage = totalVotes === 0 ? 0 : ((c.votes / totalVotes) * 100).toFixed(1);
            return (
              <div key={c.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold">{c.name}</span>
                  <span>{c.votes} Votes ({percentage}%)</span>
                </div>
                <div className="w-full bg-mono-200 h-4">
                  <div className="bg-black h-4 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
            )
          })}
        </div>
        <button onClick={() => alert("Results Published!")} className="btn-primary w-full mt-8 py-4 uppercase font-bold text-sm">Publish Final Results</button>
      </div>
    </motion.div>
  );
}

export function AdminBlockchain() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Blockchain Status" subtitle="Network connectivity and smart contract details." />
      <div className="glass-panel space-y-4">
        <div className="p-4 border border-black flex justify-between items-center">
          <div><p className="text-sm font-bold uppercase opacity-70">Network</p><p className="font-mono font-bold">Ethereum Sepolia</p></div>
          <div className="w-4 h-4 bg-black animate-pulse"></div>
        </div>
        <div className="p-4 border border-black"><p className="text-sm font-bold uppercase opacity-70">Contract Address</p><p className="font-mono font-bold break-all">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p></div>
      </div>
    </motion.div>
  );
}

export function AdminSettings() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Settings" subtitle="System configuration and admin profile." />
      <div className="glass-panel max-w-lg">
        <form className="space-y-4">
          <div><label className="block text-sm font-bold uppercase mb-2">Admin Email</label><input type="email" value="anup04@gmail.com" disabled className="input-field bg-mono-100" /></div>
          <div><label className="block text-sm font-bold uppercase mb-2">New Password</label><input type="password" placeholder="••••••••" className="input-field" /></div>
          <button className="btn-primary w-full py-4 uppercase font-bold text-sm">Save Changes</button>
        </form>
      </div>
    </motion.div>
  );
}
