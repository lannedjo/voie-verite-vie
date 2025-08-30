import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Cross, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube,
  Heart,
  Send
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    navigation: [
      { name: 'Accueil', href: '#accueil' },
      { name: 'À propos', href: '#apropos' },
      { name: 'Activités', href: '#activites' },
      { name: 'Lecture Biblique', href: '#lecture' },
    ],
    community: [
      { name: 'Communauté', href: '#communaute' },
      { name: 'Galerie', href: '#galerie' },
      { name: 'Témoignages', href: '#temoignages' },
      { name: 'Blog', href: '#blog' },
    ],
    support: [
      { name: 'Contact', href: '#contact' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Nous soutenir', href: '#don' },
      { name: 'Rejoindre', href: '#adhesion' },
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4">
        {/* Section principale */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Logo et mission */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-peace rounded-full flex items-center justify-center">
                  <Cross className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-playfair font-semibold">
                  Voie, Vérité, Vie
                </span>
              </div>
              <p className="text-background/80 leading-relaxed mb-6">
                Un sanctuaire spirituel et un phare d'espérance pour la jeunesse, 
                fondé sur les enseignements du Christ et les valeurs évangéliques.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className="w-10 h-10 bg-background/10 hover:bg-background/20 rounded-full flex items-center justify-center transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Liens de navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-8 lg:col-span-2">
              <div>
                <h4 className="font-semibold mb-4 text-primary-glow">Navigation</h4>
                <ul className="space-y-3">
                  {links.navigation.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-background/80 hover:text-background transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-secondary-light">Communauté</h4>
                <ul className="space-y-3">
                  {links.community.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-background/80 hover:text-background transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-accent-light">Support</h4>
                <ul className="space-y-3">
                  {links.support.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-background/80 hover:text-background transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter et contact */}
            <div className="lg:col-span-1">
              <h4 className="font-semibold mb-4 text-accent-light">Restons connectés</h4>
              <p className="text-background/80 mb-4 text-sm">
                Recevez nos méditations quotidiennes et les actualités de notre communauté.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Votre email"
                    className="bg-background/10 border-background/20 text-background placeholder:text-background/60"
                  />
                  <Button size="sm" variant="secondary">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-primary-glow" />
                  <span className="text-background/80">contact@voie-verite-vie.org</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-secondary-light" />
                  <span className="text-background/80">+33 (0)1 23 45 67 89</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-accent-light" />
                  <span className="text-background/80">Paris, France</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-background/20"></div>

        {/* Section bottom */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-background/80">
              <span>© {currentYear} Association Voie, Vérité, Vie.</span>
              <span>Fondée avec</span>
              <Heart className="w-4 h-4 text-red-400" />
              <span>le 1er janvier 2024</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <a href="#mentions" className="text-background/80 hover:text-background transition-colors">
                Mentions légales
              </a>
              <a href="#confidentialite" className="text-background/80 hover:text-background transition-colors">
                Confidentialité
              </a>
              <a href="#rgpd" className="text-background/80 hover:text-background transition-colors">
                RGPD
              </a>
            </div>
          </div>
          
          {/* Citation spirituelle finale */}
          <div className="mt-8 text-center">
            <blockquote className="text-background/60 italic text-sm">
              "Car où est votre trésor, là aussi sera votre cœur."
            </blockquote>
            <cite className="text-background/40 text-xs">— Matthieu 6:21</cite>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;