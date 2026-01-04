
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { DashboardIcon, ProjectIcon, TableIcon, TimeIcon, ChatIcon } from './ui/Icons';

const Layout: React.FC = () => {
  const navItems = [
    { to: '/', icon: <DashboardIcon />, label: 'Dashboard' },
    { to: '/projects', icon: <ProjectIcon />, label: 'Projekty' },
    { to: '/tables', icon: <TableIcon />, label: 'Stringy' },
    { to: '/time', icon: <TimeIcon />, label: 'Práce' },
    { to: '/chat', icon: <ChatIcon />, label: 'Chat' },
  ];

  return (
    <div className="flex h-screen w-full bg-[#020617] text-white overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 glass border-r border-white/10 p-4">
        <div className="mb-8 px-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            MST Tracker
          </h1>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Solar System Pro</p>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-600/30' : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 md:bg-transparent bg-slate-900/50 backdrop-blur-md safe-pt">
          <h2 className="text-lg font-semibold md:block hidden">Přehled</h2>
          <h1 className="text-xl font-bold md:hidden bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            MST
          </h1>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-xs">MS</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <Outlet />
        </section>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 flex items-center justify-around px-2 py-3 safe-pb z-50">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-colors duration-200 ${
                  isActive ? 'text-indigo-400' : 'text-white/40'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-lg ${isActive ? 'bg-indigo-400/10' : ''}`}>
                    {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-tighter">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
