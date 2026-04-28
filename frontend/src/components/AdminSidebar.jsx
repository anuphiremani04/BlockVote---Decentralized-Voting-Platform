import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Vote, Users, FileText, CheckSquare, BarChart3, Link as LinkIcon, Settings, LogOut, Hexagon } from 'lucide-react';
import WalletConnect from './WalletConnect';

export default function AdminSidebar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Elections', path: '/admin/elections', icon: Vote },
    { name: 'Candidates', path: '/admin/candidates', icon: Users },
    { name: 'Users', path: '/admin/users', icon: FileText },
    { name: 'Votes', path: '/admin/votes', icon: CheckSquare },
    { name: 'Results', path: '/admin/results', icon: BarChart3 },
    { name: 'Blockchain', path: '/admin/blockchain', icon: LinkIcon },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-black flex flex-col h-full sticky top-0 left-0 z-20 bg-white">
      <div className="p-6 flex items-center gap-3 border-b border-black bg-black text-white">
        <Hexagon className="w-8 h-8 text-white" />
        <span className="text-xl font-bold uppercase tracking-widest">Admin</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-bold uppercase tracking-wide transition-colors ${
                isActive
                  ? 'bg-black text-white'
                  : 'text-mono-600 hover:text-black hover:bg-mono-100'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 space-y-4 border-t border-black">
        <WalletConnect />
        <div className="flex items-center justify-between gap-2">
          <NavLink to="/login" onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 p-3 border border-black font-bold uppercase text-xs hover:bg-black hover:text-white transition-colors" title="Logout">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
