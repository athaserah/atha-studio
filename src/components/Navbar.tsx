import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Menu, X, Home, User, Mail, Image, LogIn, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import athaStudioLogo from "@/assets/atha-studio-logo.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const navItems = [
    { href: "/", label: "Beranda", icon: Home },
    { href: "/gallery", label: "Galeri Kece", icon: Image },
    { href: "/about", label: "Tentang Gue", icon: User },
    { href: "/pricing", label: "Harga", icon: Mail },
    { href: "/contact", label: "Hit Me Up", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img 
              src={athaStudioLogo} 
              alt="Atha Studio Logo" 
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                  isActive("/admin")
                    ? "text-primary bg-primary/10"
                    : "text-foreground hover:text-primary hover:bg-primary/5"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Mode Sultan</span>
              </Link>
            )}
            {user ? (
              <Button variant="premium" size="sm" asChild>
                <Link to="/dashboard">
                  <User className="h-4 w-4" />
                  Dashboard Gue
                </Link>
              </Button>
            ) : (
              <Button variant="premium" size="sm" asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Masuk Dong
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-lg">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive("/admin")
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Mode Sultan</span>
                </Link>
              )}
              <div className="px-4 pt-2">
                {user ? (
                  <Button variant="premium" className="w-full" asChild>
                    <Link to="/dashboard">
                      <User className="h-4 w-4" />
                      Dashboard Gue
                    </Link>
                  </Button>
                ) : (
                  <Button variant="premium" className="w-full" asChild>
                    <Link to="/auth">
                      <LogIn className="h-4 w-4" />
                      Masuk Dong
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
export { Navbar };