import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';
import heroDove from '@/assets/hero-dove.jpg';
import logo3v from '@/assets/logo-3v.png';

const HeroSection = () => {
  const [currentVerse, setCurrentVerse] = useState(0);
  
  const biblicalVerses = [
    {
      text: "Je suis le chemin, la vérité et la vie. Nul ne vient au Père que par moi.",
      reference: "Jean 14:6"
    },
    {
      text: "Ne vous conformez pas au monde actuel, mais soyez transformés par le renouvellement de l'intelligence.",
      reference: "Romains 12:2"
    },
    {
      text: "Fuyez l'immoralité sexuelle. Tout autre péché qu'un homme peut commettre est extérieur au corps.",
      reference: "1 Corinthiens 6:18"
    },
    {
      text: "Vous connaîtrez la vérité, et la vérité vous affranchira.",
      reference: "Jean 8:32"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % biblicalVerses.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [biblicalVerses.length]);

  return (
    <section className="hero-section min-h-screen flex items-center relative pt-16">
      {/* Image de fond */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroDove}
          alt="Colombe spirituelle symbolisant la paix divine"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-blue/20 via-transparent to-life-green/10"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo et titre principal */}
          <div className="fade-in-up mb-8">
            <div className="inline-flex items-center justify-center mb-6">
              <img 
                src={logo3v} 
                alt="Logo 3V - Voie, Vérité, Vie" 
                className="h-32 w-auto divine-glow"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-foreground mb-4">
              Voie, Vérité, Vie
            </h1>
            <div className="w-24 h-1 bg-gradient-peace mx-auto mb-6"></div>
          </div>

          {/* Slogan principal */}
          <div className="fade-in-up mb-12" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-2xl md:text-4xl font-playfair font-medium text-primary mb-6">
              Trouvez la paix en Christ
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Un sanctuaire spirituel et un phare d'espérance pour la jeunesse confrontée 
              aux défis moraux de notre société moderne
            </p>
          </div>

          {/* Verset biblique rotatif */}
          <div className="fade-in-up mb-12 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg max-w-3xl mx-auto" style={{ animationDelay: '0.6s' }}>
            <div className="min-h-[120px] flex items-center justify-center">
              <div key={currentVerse} className="fade-in text-center">
                <blockquote className="verse-highlight text-lg md:text-xl mb-4 leading-relaxed">
                  {biblicalVerses[currentVerse].text}
                </blockquote>
                <cite className="text-divine-gold-deep font-medium">
                  — {biblicalVerses[currentVerse].reference}
                </cite>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4 mt-6">
              <div className="flex justify-center space-x-2">
                {biblicalVerses.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentVerse ? 'bg-primary w-6' : 'bg-muted'
                    }`}
                    onClick={() => setCurrentVerse(index)}
                  />
                ))}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Verset {currentVerse + 1} sur {biblicalVerses.length} • 1000+ versets bibliques disponibles
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animationDelay: '0.9s' }}>
            <Button 
              size="lg" 
              className="divine-glow text-lg px-8 py-6 bg-gradient-peace hover:scale-105 transition-all duration-300"
              onClick={() => {
                // Ouvrir les deux liens WhatsApp dans des onglets
                window.open('https://whatsapp.com/channel/0029VbB0GplLY6d6hkP5930J', '_blank');
                window.open('https://chat.whatsapp.com/HE3xPcQPyFFLUgTLWV96N1', '_blank');
              }}
            >
              Rejoignez notre communauté
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 border-2 border-primary/30 hover:bg-primary/5 hover:scale-105 transition-all duration-300"
              asChild
            >
              <Link to="/activities">
                <BookOpen className="mr-2 w-5 h-5" />
                Découvrir nos activités
              </Link>
            </Button>
          </div>

          {/* Statistiques inspirantes */}
          <div className="fade-in-up mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto" style={{ animationDelay: '1.2s' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Versets bibliques</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">73</div>
              <div className="text-sm text-muted-foreground">Livres de la Bible</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">358</div>
              <div className="text-sm text-muted-foreground">Jours de lecture</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-divine-gold mb-2">∞</div>
              <div className="text-sm text-muted-foreground">Grâce divine</div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;