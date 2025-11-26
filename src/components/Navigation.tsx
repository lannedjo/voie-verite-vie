import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Cross, 
  BookOpen, 
  Calendar, 
  Mail, 
  Camera,
  HelpCircle,
  User,
  LogOut,
  Shield,
  Bot
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import logo3v from '@/assets/logo-3v.png';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    navigate('/');
  };

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
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logo3v} 
              alt="Logo 3V - Voie, Vérité, Vie" 
              className="h-10 w-auto"
            />
            <span className="text-xl font-playfair font-semibold text-primary hidden sm:inline">
              Voie, Vérité, Vie
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions Desktop */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                <Button
                  onClick={() => navigate('/ai-chat')}
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  <Bot className="w-4 h-4" />
                  Assistant IA
                </Button>
                {isAdmin && (
                  <Button
                    onClick={() => navigate('/admin')}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Button>
                )}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="ghost"
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
                <Button
                  onClick={() => navigate('/auth')}
                  variant="default"
                  size="sm"
                  className="divine-glow"
                >
                  Rejoignez-nous
                </Button>
              </>
            )}
          </div>

          {/* Menu Mobile - Sheet à droite */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[30%] min-w-[250px] sm:w-[30%]">
              <div className="flex flex-col h-full py-6">
                <div className="space-y-4 flex-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="flex items-center space-x-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
                <div className="border-t border-border/50 pt-4 space-y-2">
                  {user ? (
                    <>
                      <Button
                        onClick={() => {
                          navigate('/ai-chat');
                          setIsMenuOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <Bot className="w-4 h-4 mr-2" />
                        Assistant IA
                      </Button>
                      {isAdmin && (
                        <Button
                          onClick={() => {
                            navigate('/admin');
                            setIsMenuOpen(false);
                          }}
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Connexion
                      </Button>
                      <Button
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                        variant="default"
                        className="w-full divine-glow"
                      >
                        Rejoignez-nous
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;