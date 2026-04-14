'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, Swords, Settings, LogOut, User, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // State for Desktop Collapse and Mobile Drawer
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auto-close the mobile drawer when you click a link
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (pathname === '/login') return null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminData');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Teams & Roster', href: '/teams', icon: Users },
    { name: 'Player Database', href: '/players', icon: User },
    { name: 'Match Results', href: '/matches', icon: Swords },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* 📱 MOBILE HAMBURGER BUTTON (Floating Top Left) */}
      <button 
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white shadow-xl transition-colors"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* 📱 MOBILE BACKGROUND DARK OVERLAY */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 💻 THE ACTUAL SIDEBAR (Responsive Width & Position) */}
      <div className={`
        fixed md:sticky top-0 left-0 h-screen z-50
        bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isCollapsed ? 'md:w-20' : 'md:w-64 w-64'}
      `}>
        
        {/* HEADER & TOGGLE BUTTON */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 h-16">
          {!isCollapsed && (
            <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 tracking-tighter truncate">
              NEXUS GG
            </div>
          )}
          
          {/* Desktop Collapse Button */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:block p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-auto"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors ml-auto"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-all group ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-50'
                  }`}
                  title={isCollapsed ? item.name : ''} // Shows tooltip when collapsed!
                >
                  <item.icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-blue-400'}`} />
                  {!isCollapsed && <span className="font-medium truncate">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-3 text-slate-400 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-slate-800/50`}
            title={isCollapsed ? "Sign Out" : ""}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  );
}