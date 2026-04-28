import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Vote, BarChart3, User, Settings, Sun, Moon, LogOut, Hexagon } from 'lucide-react';
import WalletConnect from './WalletConnect';

export default function Sidebar() {
  const userStr = localStorage.getItem('user');
  let user = { role: 'user' };
  try { if (userStr) user = JSON.parse(userStr); } catch(e){}

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vote', path: '/vote', icon: Vote },
    { name: 'Results', path: '/results', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (user.role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: Settings });
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <aside className="w-64 border-r border-black dark:border-white flex flex-col h-full sticky top-0 left-0 z-20 bg-white dark:bg-black">
      <div className="p-6 flex items-center gap-3 border-b border-black dark:border-white">
        <Hexagon className="w-8 h-8 text-black dark:text-white" />
        <span className="text-xl font-bold uppercase tracking-widest">BlockVote</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide transition-colors ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-mono-600 dark:text-mono-400 hover:text-black dark:hover:text-white hover:bg-mono-100 dark:hover:bg-mono-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 space-y-4 border-t border-black dark:border-white">
        <WalletConnect />
        <div className="flex items-center justify-between gap-2">
          <NavLink to="/login" onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 p-3 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
