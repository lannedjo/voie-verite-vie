import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Cross, 
  BookOpen, 
  Users, 
  Calendar, 
  Mail, 
  Camera,
  HelpCircle,
  User
} from 'lucide-react';
import logo3v from '@/assets/logo-3v.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Accueil', href: '/', icon: Cross },
    { name: 'À propos', href: '/about', icon: BookOpen },
    { name: 'Activités', href: '/activities', icon: Calendar },
    { name: 'Lecture Biblique', href: '/biblical-reading', icon: BookOpen },
    { name: 'Galerie', href: '/gallery', icon: Camera },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3">
            <img 
              src={logo3v} 
              alt="Logo 3V - Voie, Vérité, Vie" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-playfair font-semibold text-primary">
              Voie, Vérité, Vie
            </span>
          </a>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.slice(0, 6).map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-105"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              Connexion
            </Button>
            <Button variant="default" size="sm" className="divine-glow">
              Rejoignez-nous
            </Button>
          </div>

          {/* Menu Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background/98 backdrop-blur-md border-b border-border/50 shadow-lg">
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </a>
                );
              })}
              <div className="border-t border-border/50 pt-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
                <Button variant="default" className="w-full divine-glow">
                  Rejoignez-nous
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;