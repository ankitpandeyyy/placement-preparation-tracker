import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, BookOpen, Sun, Moon, FileText } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import DSATracker from './pages/DSATracker';
import Login from './pages/Login';
import Register from './pages/Register';
import ResumeBuilder from './pages/ResumeBuilder';

function Sidebar() {
  const location = useLocation();
  const navItems = [
    { name: 'Resume Builder', path: '/', icon: FileText },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Companies', path: '/companies', icon: Building2 },
    { name: 'DSA Tracker', path: '/dsa', icon: BookOpen },
  ];

  return (
    <div className="w-64 h-full bg-surface border-r border-border p-4 flex flex-col">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          PrepTracker
        </h1>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-muted hover:bg-bg hover:text-text'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-surface border border-border text-text-muted hover:text-text transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

function Layout({ children, user, onLogout }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isResumePage = location.pathname === '/';

  if (isAuthPage || isResumePage) {
    return <div className="w-full h-full bg-bg">{children}</div>;
  }

  return (
    <div className="flex h-screen w-full bg-bg text-text overflow-hidden transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 border-b border-border bg-surface flex items-center justify-end px-6 shrink-0 gap-4">
          <ThemeToggle />
          {user && (
            <button 
              onClick={onLogout}
              className="text-sm font-medium text-text-muted hover:text-text transition-colors px-3 py-1 rounded-md hover:bg-bg"
            >
              Logout
            </button>
          )}
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('userInfo')));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<ResumeBuilder />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onLogin={setUser} />} />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Login onLogin={setUser} />} 
          />
          <Route 
            path="/companies" 
            element={user ? <Companies /> : <Login onLogin={setUser} />} 
          />
          <Route 
            path="/dsa" 
            element={user ? <DSATracker /> : <Login onLogin={setUser} />} 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
