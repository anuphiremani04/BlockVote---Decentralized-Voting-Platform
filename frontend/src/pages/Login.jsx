import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center p-6 font-sans relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 font-bold uppercase tracking-widest hover:opacity-70 transition-opacity z-10">
        <ArrowLeft className="w-5 h-5" />
        Home
      </Link>
      <div className="absolute inset-0 bg-[length:40px_40px] bg-grid-pattern dark:bg-grid-pattern-dark pointer-events-none opacity-50" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-black border-4 border-black dark:border-white p-8 relative z-10 shadow-flat dark:shadow-flat-dark"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold uppercase tracking-tight mb-2">Login</h1>
          <p className="text-mono-600 dark:text-mono-400 font-medium">Access your BlockVote account.</p>
        </div>

        {error && <div className="mb-6 bg-black text-white dark:bg-white dark:text-black p-3 font-bold uppercase text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide mb-2">Email Address</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="VOTER@EXAMPLE.COM" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide mb-2">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <button type="submit" className="btn-primary w-full py-4 text-lg">Authenticate</button>
        </form>

        <div className="mt-8 text-center border-t-2 border-black dark:border-white pt-6">
          <p className="font-medium">
            Don't have an account? <Link to="/register" className="font-bold underline hover:no-underline">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
