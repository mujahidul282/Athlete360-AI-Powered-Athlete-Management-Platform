import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Stethoscope, 
  Utensils, 
  Wallet, 
  Video, 
  User, 
  Menu, 
  X,
  Moon,
  Sun
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Performance', icon: <Activity size={20} />, path: '/performance' },
    { name: 'Injury & Rehab', icon: <Stethoscope size={20} />, path: '/injury' },
    { name: 'Diet & Nutrition', icon: <Utensils size={20} />, path: '/diet' },
    { name: 'Practice Capture', icon: <Video size={20} />, path: '/practice' },
    { name: 'Career & Finance', icon: <Wallet size={20} />, path: '/career' },
    { name: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'dark' : ''}`}>
      {/* Mobile Header */}
      <header className="md:hidden bg-white dark:bg-slate-800 p-4 flex justify-between items-center shadow-sm z-20 sticky top-0">
        <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Athlete360</h1>
        <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700">
                {darkMode ? <Sun size={20} className="text-yellow-400"/> : <Moon size={20} className="text-slate-600"/>}
            </button>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} className="text-slate-700 dark:text-slate-200" /> : <Menu size={24} className="text-slate-700 dark:text-slate-200" />}
            </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 hidden md:flex justify-between items-center border-b border-gray-100 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Athlete360</h1>
        </div>
        
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6 hidden md:block">
           <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <span className="text-sm text-slate-500 dark:text-slate-400">Theme</span>
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-white dark:hover:bg-slate-600 shadow-sm transition-all">
                {darkMode ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-slate-600"/>}
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;