import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Cross, Heart, Book, Users, Calendar, Target } from 'lucide-react';

const About = () => {
  const timeline = [
    { year: '2024', event: 'Fondation de l\'association 3V', description: 'Création d\'un sanctuaire spirituel' },
    { year: '2024', event: 'Premiers événements', description: 'Lancement des conférences et ateliers' },
    { year: '2025', event: 'Programme de lecture biblique', description: 'Cycle annuel de 354 jours' },
  ];

  const values = [
    {
      icon: Cross,
      title: 'Voie',
      verse: 'Jean 14:6',
      description: 'Le chemin tracé par Jésus-Christ pour marcher dans ses pas et embrasser ses enseignements d\'amour et de salut.'
    },
    {
      icon: Book,
      title: 'Vérité',
      verse: 'Jean 8:32',
      description: 'La lumière révélée par Jésus, vérité absolue et libératrice qui nous affranchit des illusions du monde.'
    },
    {
      icon: Heart,
      title: 'Vie',
      verse: 'Jean 10:10',
      description: 'L\'abondance spirituelle offerte par le Christ, une plénitude emplie de joie, de paix et de communion avec Dieu.'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6">
                À propos de 3V
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Un sanctuaire spirituel, un phare lumineux guidant les âmes dans un monde en quête de sens
              </p>
            </div>
          </div>
        </section>

        {/* Préambule */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-elegant border border-border/50">
                <div className="flex items-center mb-8">
                  <Cross className="w-8 h-8 text-primary mr-4" />
                  <h2 className="text-2xl md:text-3xl font-playfair font-semibold text-primary">
                    Préambule
                  </h2>
                </div>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Fondée le 1er janvier 2024, l'association Voie, Vérité, Vie (3V) se veut bien plus qu'une simple organisation : 
                    elle est un sanctuaire spirituel, un phare lumineux guidant les âmes dans un monde en quête de sens, 
                    un havre où s'épanouit une vie empreinte de spiritualité, de vérité et de plénitude en Christ.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Ancrée dans les principes intemporels de la foi chrétienne, 3V se dresse comme un rempart face aux tempêtes 
                    de la dépravation morale et des dérives contre nature qui assaillent notre société, en particulier la jeunesse.
                  </p>
                  <div className="bg-gradient-peace/10 rounded-lg p-6 my-8">
                    <blockquote className="text-center italic text-lg">
                      "Je suis le chemin, la vérité et la vie. Nul ne vient au Père que par moi."
                      <cite className="block mt-2 text-primary font-semibold">— Jean 14:6</cite>
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valeurs Fondamentales */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary text-center mb-16">
                Pourquoi Voie, Vérité, Vie ?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={index} className="text-center group">
                      <div className="bg-gradient-peace rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-glow">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-playfair font-semibold text-primary mb-3">
                        {value.title}
                      </h3>
                      <p className="text-sm text-primary/80 font-semibold mb-4">
                        {value.verse}
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary text-center mb-16">
                Notre Histoire
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-peace"></div>
                {timeline.map((item, index) => (
                  <div key={index} className="relative flex items-start mb-12 last:mb-0">
                    <div className="w-8 h-8 bg-gradient-peace rounded-full flex items-center justify-center relative z-10 shadow-glow">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-8">
                      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 shadow-subtle border border-border/50 hover:shadow-elegant transition-all duration-300">
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-playfair font-semibold text-primary mt-3 mb-2">
                          {item.event}
                        </h3>
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Objectifs */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary text-center mb-16">
                Nos Objectifs
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  'Offrir un refuge spirituel et moral aux jeunes confrontés aux défis de la société moderne',
                  'Éduquer et sensibiliser la jeunesse aux principes moraux et spirituels de la foi chrétienne',
                  'Combattre les influences néfastes contraires aux enseignements bibliques',
                  'Promouvoir un mode de vie sain et équilibré, fondé sur les valeurs évangéliques',
                  'Former des leaders chrétiens, agents de transformation dans leurs communautés',
                  'Établir des partenariats avec des organisations religieuses et communautaires'
                ].map((objective, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <Target className="w-6 h-6 text-primary mt-1 group-hover:scale-110 transition-transform duration-300" />
                    <p className="text-muted-foreground leading-relaxed">
                      {objective}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;