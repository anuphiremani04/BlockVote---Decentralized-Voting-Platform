import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-white text-black font-sans overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
