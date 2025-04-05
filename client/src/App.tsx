import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SalaryConfiguration from "@/pages/salary-configuration";
import Payroll from "@/pages/payroll";
import Employees from "@/pages/employees";
import Benefits from "@/pages/benefits";
import Settings from "@/pages/settings";
import { useState, useEffect } from "react";
import { apiRequest } from "./lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
  role: string;
}

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  async function handleLogin(username: string, password: string) {
    try {
      const res = await apiRequest('POST', '/api/auth/login', { username, password });
      const userData = await res.json();
      setUser(userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
      return false;
    }
  }

  async function handleLogout() {
    try {
      await apiRequest('POST', '/api/auth/logout', {});
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout failed', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-primary-600 mb-1">PayrollPro</h1>
          <p className="text-sm text-neutral-500 mb-6">Compensation & Benefits Module</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const username = (form.elements.namedItem('username') as HTMLInputElement).value;
            const password = (form.elements.namedItem('password') as HTMLInputElement).value;
            handleLogin(username, password);
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  defaultValue="admin"
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400"
                  defaultValue="admin123"
                />
              </div>
              
              <button type="submit" className="w-full bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition">
                Login
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Demo credentials:</p>
            <p>Username: admin | Password: admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with navigation */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200">
        <div className="p-4 border-b border-neutral-200">
          <h1 className="text-xl font-bold text-primary-600">PayrollPro</h1>
          <p className="text-xs text-neutral-500">Compensation & Benefits</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Main
          </div>
          <Route path="/">
            {(match) => (
              <a href="/" className={`flex items-center px-6 py-2.5 text-sm font-medium ${match ? 'menu-active text-primary-600 border-l-3 border-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                <svg className="mr-3 text-lg" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="3" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="14" y="12" width="7" height="9" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <rect x="3" y="16" width="7" height="5" rx="2" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Dashboard
              </a>
            )}
          </Route>
          <Route path="/payroll">
            {(match) => (
              <a href="/payroll" className={`flex items-center px-6 py-2.5 text-sm font-medium ${match ? 'menu-active text-primary-600 border-l-3 border-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                <svg className="mr-3 text-lg" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Payroll
              </a>
            )}
          </Route>
          <Route path="/benefits">
            {(match) => (
              <a href="/benefits" className={`flex items-center px-6 py-2.5 text-sm font-medium ${match ? 'menu-active text-primary-600 border-l-3 border-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                <svg className="mr-3 text-lg" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Benefits
              </a>
            )}
          </Route>
          <Route path="/salary-configuration">
            {(match) => (
              <a href="/salary-configuration" className={`flex items-center px-6 py-2.5 text-sm font-medium ${match ? 'menu-active text-primary-600 border-l-3 border-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                <svg className="mr-3 text-lg" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.4 15C19.1277 15.6354 19.2583 16.3755 19.73 16.88L19.79 16.94C20.1812 17.3311 20.4001 17.8624 20.4001 18.415C20.4001 18.9676 20.1812 19.4989 19.79 19.89C19.3989 20.2812 18.8676 20.5001 18.315 20.5001C17.7624 20.5001 17.2311 20.2812 16.84 19.89L16.78 19.83C16.2755 19.3583 15.5354 19.2277 14.9 19.5C14.2837 19.7646 13.8734 20.352 13.86 21V21.2C13.86 22.3046 12.9646 23.2 11.86 23.2C10.7554 23.2 9.86 22.3046 9.86 21.2V21.11C9.83473 20.4404 9.39648 19.8546 8.76 19.6C8.12456 19.3277 7.38448 19.4583 6.88 19.93L6.82 19.99C6.42893 20.3812 5.8976 20.6001 5.345 20.6001C4.7924 20.6001 4.26107 20.3812 3.87 19.99C3.47882 19.5989 3.25994 19.0676 3.25994 18.515C3.25994 17.9624 3.47882 17.4311 3.87 17.04L3.93 16.98C4.40167 16.4755 4.53231 15.7354 4.26 15.1C3.99532 14.4837 3.40789 14.0734 2.76 14.06H2.56C1.45543 14.06 0.559998 13.1646 0.559998 12.06C0.559998 10.9554 1.45543 10.06 2.56 10.06H2.65C3.31957 10.0347 3.90533 9.59648 4.16 8.96C4.43231 8.32456 4.30167 7.58448 3.83 7.08L3.77 7.02C3.37882 6.62893 3.15994 6.0976 3.15994 5.545C3.15994 4.9924 3.37882 4.46107 3.77 4.07C4.16107 3.67882 4.6924 3.45994 5.245 3.45994C5.7976 3.45994 6.32893 3.67882 6.72 4.07L6.78 4.13C7.28448 4.60167 8.02456 4.73231 8.66 4.46C9.27634 4.19532 9.68665 3.60789 9.7 2.96V2.76C9.7 1.65543 10.5954 0.759998 11.7 0.759998C12.8046 0.759998 13.7 1.65543 13.7 2.76V2.85C13.7134 3.49789 14.1237 4.08532 14.74 4.35C15.3754 4.62231 16.1155 4.49167 16.62 4.02L16.68 3.96C17.0711 3.56882 17.6024 3.34994 18.155 3.34994C18.7076 3.34994 19.2389 3.56882 19.63 3.96C20.0212 4.35107 20.2401 4.8824 20.2401 5.435C20.2401 5.9876 20.0212 6.51893 19.63 6.91L19.57 6.97C19.0983 7.47448 18.9677 8.21456 19.24 8.85C19.5047 9.46634 20.0921 9.87665 20.74 9.89H20.94C22.0446 9.89 22.94 10.7854 22.94 11.89C22.94 12.9946 22.0446 13.89 20.94 13.89H20.85C20.1921 13.9034 19.6047 14.3137 19.4 14.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Configuration
              </a>
            )}
          </Route>
          
          <div className="px-4 mt-6 mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Administration
          </div>
          <Route path="/employees">
            {(match) => (
              <a href="/employees" className={`flex items-center px-6 py-2.5 text-sm font-medium ${match ? 'menu-active text-primary-600 border-l-3 border-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                <svg className="mr-3 text-lg" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4C16 6.20914 14.2091 8 12 8C9.79086 8 8 6.20914 8 4C8 1.79086 9.79086 0 12 0C14.2091 0 16 1.79086 16 4Z" fill="currentColor"/>
                  <path d="M16 14H8C4.68629 14 2 16.6863 2 20V22H22V20C22 16.6863 19.3137 14 16 14Z" fill="currentColor"/>
                </svg>
                Employees
              </a>
            )}
          </Route>
          <Route path="/settings">
            {(match) => (
              <a href="/settings" className={`flex items-center px-6 py-2.5 text-sm font-medium ${match ? 'menu-active text-primary-600 border-l-3 border-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-100'}`}>
                <svg className="mr-3 text-lg" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M19.4 15C19.1277 15.6354 19.2583 16.3755 19.73 16.88L19.79 16.94C20.1812 17.3311 20.4001 17.8624 20.4001 18.415C20.4001 18.9676 20.1812 19.4989 19.79 19.89C19.3989 20.2812 18.8676 20.5001 18.315 20.5001C17.7624 20.5001 17.2311 20.2812 16.84 19.89L16.78 19.83C16.2755 19.3583 15.5354 19.2277 14.9 19.5C14.2837 19.7646 13.8734 20.352 13.86 21V21.2C13.86 22.3046 12.9646 23.2 11.86 23.2C10.7554 23.2 9.86 22.3046 9.86 21.2V21.11C9.83473 20.4404 9.39648 19.8546 8.76 19.6C8.12456 19.3277 7.38448 19.4583 6.88 19.93L6.82 19.99C6.42893 20.3812 5.8976 20.6001 5.345 20.6001C4.7924 20.6001 4.26107 20.3812 3.87 19.99C3.47882 19.5989 3.25994 19.0676 3.25994 18.515C3.25994 17.9624 3.47882 17.4311 3.87 17.04L3.93 16.98C4.40167 16.4755 4.53231 15.7354 4.26 15.1C3.99532 14.4837 3.40789 14.0734 2.76 14.06H2.56C1.45543 14.06 0.559998 13.1646 0.559998 12.06C0.559998 10.9554 1.45543 10.06 2.56 10.06H2.65C3.31957 10.0347 3.90533 9.59648 4.16 8.96C4.43231 8.32456 4.30167 7.58448 3.83 7.08L3.77 7.02C3.37882 6.62893 3.15994 6.0976 3.15994 5.545C3.15994 4.9924 3.37882 4.46107 3.77 4.07C4.16107 3.67882 4.6924 3.45994 5.245 3.45994C5.7976 3.45994 6.32893 3.67882 6.72 4.07L6.78 4.13C7.28448 4.60167 8.02456 4.73231 8.66 4.46C9.27634 4.19532 9.68665 3.60789 9.7 2.96V2.76C9.7 1.65543 10.5954 0.759998 11.7 0.759998C12.8046 0.759998 13.7 1.65543 13.7 2.76V2.85C13.7134 3.49789 14.1237 4.08532 14.74 4.35C15.3754 4.62231 16.1155 4.49167 16.62 4.02L16.68 3.96C17.0711 3.56882 17.6024 3.34994 18.155 3.34994C18.7076 3.34994 19.2389 3.56882 19.63 3.96C20.0212 4.35107 20.2401 4.8824 20.2401 5.435C20.2401 5.9876 20.0212 6.51893 19.63 6.91L19.57 6.97C19.0983 7.47448 18.9677 8.21456 19.24 8.85C19.5047 9.46634 20.0921 9.87665 20.74 9.89H20.94C22.0446 9.89 22.94 10.7854 22.94 11.89C22.94 12.9946 22.0446 13.89 20.94 13.89H20.85C20.1921 13.9034 19.6047 14.3137 19.4 14.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Settings
              </a>
            )}
          </Route>
        </nav>

        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
              {user.username.substring(0, 2).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-neutral-500">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center px-4 py-2 text-sm text-neutral-600 border border-neutral-300 rounded-md hover:bg-neutral-100 transition"
          >
            <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-neutral-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center md:hidden">
              <button type="button" className="text-neutral-600 hover:text-neutral-900">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="ml-3 text-lg font-bold text-primary-600">PayrollPro</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input type="text" placeholder="Search..." className="w-64 py-1.5 px-3 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400" />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <button type="button" className="relative text-neutral-600 hover:text-neutral-900">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>
              
              <button type="button" className="relative text-neutral-600 hover:text-neutral-900">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/salary-configuration" component={SalaryConfiguration} />
            <Route path="/payroll" component={Payroll} />
            <Route path="/employees" component={Employees} />
            <Route path="/benefits" component={Benefits} />
            <Route path="/settings" component={Settings} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
