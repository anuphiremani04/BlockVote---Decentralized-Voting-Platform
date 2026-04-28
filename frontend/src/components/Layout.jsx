import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen bg-white text-black font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
