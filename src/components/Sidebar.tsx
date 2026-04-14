// src/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Swords, Settings, LogOut, User } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // HIDE SIDEBAR ON LOGIN PAGE
  if (pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('adminData');
    window.location.href = '/login'; // HARD navigation (blows away cached states)
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Teams & Roster', href: '/teams', icon: Users },
    { name: 'Player Database', href: '/players', icon: User }, // <--- ADD THIS LINE
    { name: 'Match Results', href: '/matches', icon: Swords },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 tracking-tighter">
          NEXUS GG
        </h2>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">
          Admin Portal
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-500/10 text-blue-400 font-medium' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Update the Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-slate-800/50"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}