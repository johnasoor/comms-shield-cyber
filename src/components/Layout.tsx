
import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Shield, LogOut, Menu, X } from 'lucide-react';
import { useSecurity } from '@/contexts/SecurityContext';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoggedIn, logoutUser, secureMode, toggleSecureMode } = useSecurity();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home', requiresAuth: false },
    { path: '/register', label: 'Register', requiresAuth: false, hideWhenLoggedIn: true },
    { path: '/login', label: 'Login', requiresAuth: false, hideWhenLoggedIn: true },
    { path: '/dashboard', label: 'Dashboard', requiresAuth: true },
    { path: '/customers', label: 'Customers', requiresAuth: true },
    { path: '/change-password', label: 'Change Password', requiresAuth: true },
  ];

  const filteredLinks = navLinks.filter(link => 
    (link.requiresAuth ? isLoggedIn : true) && 
    (!link.hideWhenLoggedIn || !isLoggedIn)
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-cyber-primary shadow-sm">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-cyber-accent" />
              <span className="text-xl font-bold text-cyber-text">CommsShield</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <ul className="flex items-center space-x-6">
              {filteredLinks.map((link) => (
                <li key={link.path}>
                  <NavLink 
                    to={link.path} 
                    className={({ isActive }) => cn(
                      "text-sm font-medium transition-colors hover:text-cyber-accent",
                      isActive ? "text-cyber-accent" : "text-cyber-text"
                    )}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            
            <div className="flex items-center space-x-4">
              <Toggle
                pressed={secureMode}
                onPressedChange={toggleSecureMode}
                className={cn(
                  "relative",
                  secureMode ? "bg-cyber-success/20" : "bg-cyber-danger/20"
                )}
              >
                <span className={cn(
                  "absolute -top-2 -right-2 w-3 h-3 rounded-full",
                  secureMode ? "bg-cyber-success" : "bg-cyber-danger",
                  "pulse-dot"
                )}></span>
                {secureMode ? "Secure Mode" : "Vulnerable Mode"}
              </Toggle>
              
              {isLoggedIn && (
                <Button variant="ghost" onClick={handleLogout} className="text-cyber-text hover:text-cyber-danger">
                  <LogOut className="h-5 w-5 mr-2" />
                  <span>Logout</span>
                </Button>
              )}
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-cyber-text"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="container pb-3 pt-2 space-y-1">
              {filteredLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "block py-2 px-3 rounded-md text-sm font-medium",
                    isActive 
                      ? "bg-cyber-secondary text-cyber-accent" 
                      : "text-cyber-text hover:bg-cyber-secondary hover:text-cyber-accent"
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
              
              <div className="py-2 px-3 space-y-3">
                <Toggle
                  pressed={secureMode}
                  onPressedChange={toggleSecureMode}
                  className={cn(
                    "relative w-full justify-start",
                    secureMode ? "bg-cyber-success/20" : "bg-cyber-danger/20"
                  )}
                >
                  <span className={cn(
                    "absolute -top-2 left-2 w-3 h-3 rounded-full",
                    secureMode ? "bg-cyber-success" : "bg-cyber-danger",
                    "pulse-dot"
                  )}></span>
                  {secureMode ? "Secure Mode" : "Vulnerable Mode"}
                </Toggle>
                
                {isLoggedIn && (
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-cyber-text hover:text-cyber-danger"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    <span>Logout</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="flex-1 container py-6">
        {children}
      </main>
      
      <footer className="py-6 border-t bg-cyber-primary text-cyber-text">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">&copy; 2023 CommsShield Cyber Training Platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-sm">
                Educational Cybersecurity Demonstration System
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
