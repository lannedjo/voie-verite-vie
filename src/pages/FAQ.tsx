import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, Book, Heart, Users, Calendar, HelpCircle } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    { id: 'general', name: 'Général', icon: HelpCircle, color: 'bg-blue-500/10 text-blue-700' },
    { id: 'spiritualite', name: 'Spiritualité', icon: Heart, color: 'bg-red-500/10 text-red-700' },
    { id: 'activites', name: 'Activités', icon: Calendar, color: 'bg-green-500/10 text-green-700' },
    { id: 'lecture', name: 'Lecture biblique', icon: Book, color: 'bg-purple-500/10 text-purple-700' },
    { id: 'communaute', name: 'Communauté', icon: Users, color: 'bg-orange-500/10 text-orange-700' }
  ];

  const faqData = [
    {
      id: 1,
      category: 'general',
      question: 'Qu\'est-ce que l\'association Voie, Vérité, Vie (3V) ?',
      answer: 'L\'association Voie, Vérité, Vie (3V) est un sanctuaire spirituel fondé le 1er janvier 2024, dédié à guider les âmes dans leur cheminement de foi. Ancrée dans les principes de la foi chrétienne catholique, elle offre un refuge spirituel et moral aux jeunes confrontés aux défis de la société moderne.',
      verse: 'Jean 14:6'
    },
    {
      id: 2,
      category: 'spiritualite',
      question: 'Comment résister aux tentations dans notre société moderne ?',
      answer: 'La résistance aux tentations passe par la prière quotidienne, la méditation des Écritures, et la fréquentation de la communauté chrétienne. Nous encourageons la transformation de l\'intelligence selon Romains 12:2 : "Ne vous conformez pas au monde actuel, mais soyez transformés par le renouvellement de l\'intelligence".',
      verse: 'Romains 12:2'
    },
    {
      id: 3,
      category: 'activites',
      question: 'Comment puis-je participer aux activités de 3V ?',
      answer: 'Vous pouvez vous inscrire à nos activités via notre site web ou en nous contactant directement. Nos événements incluent des conférences, des retraites spirituelles, des groupes d\'étude biblique, et des projets communautaires. La plupart sont gratuits et ouverts à tous.',
      verse: ''
    },
    {
      id: 4,
      category: 'lecture',
      question: 'En quoi consiste le programme de lecture biblique ?',
      answer: 'Notre programme couvre les 73 livres de la Bible catholique en 354 jours (du 30 novembre 2025 au 22 novembre 2026). Il comprend 3 à 5 chapitres par jour selon leur longueur, avec 4 jours de rattrapage prévus. Le programme est synchronisé avec l\'année liturgique A (Matthieu).',
      verse: ''
    },
    {
      id: 5,
      category: 'spiritualite',
      question: 'Que dit la Bible sur la pureté et la moralité ?',
      answer: 'La Bible nous enseigne à honorer notre corps comme temple de l\'Esprit Saint. Selon 1 Corinthiens 6:18-20, nous devons fuir l\'immoralité sexuelle et glorifier Dieu dans notre corps. La pureté du cœur et des intentions est essentielle pour notre relation avec Dieu.',
      verse: '1 Corinthiens 6:18-20'
    },
    {
      id: 6,
      category: 'communaute',
      question: 'Comment rejoindre la communauté 3V ?',
      answer: 'Pour devenir membre de notre communauté, vous pouvez participer à nos événements, vous inscrire à notre newsletter, et prendre part à nos groupes de discussion. L\'adhésion officielle se fait par une démarche simple auprès de notre équipe.',
      verse: ''
    },
    {
      id: 7,
      category: 'general',
      question: 'Quels sont les objectifs principaux de 3V ?',
      answer: 'Nos objectifs incluent : offrir un refuge spirituel aux jeunes, éduquer aux principes chrétiens, combattre les influences néfastes, promouvoir un mode de vie sain, former des leaders chrétiens, et établir des partenariats avec d\'autres organisations religieuses.',
      verse: ''
    },
    {
      id: 8,
      category: 'spiritualite',
      question: 'Comment développer sa vie de prière ?',
      answer: 'Une vie de prière épanouie se développe par la régularité, la sincérité, et l\'écoute. Commencez par des moments courts mais quotidiens, utilisez les Psaumes comme guide, et n\'hésitez pas à prier avec votre cœur. La prière communautaire enrichit aussi notre relation avec Dieu.',
      verse: 'Matthieu 6:6'
    },
    {
      id: 9,
      category: 'activites',
      question: 'Y a-t-il des frais pour participer aux activités ?',
      answer: 'La plupart de nos activités sont gratuites. Certains ateliers spécialisés ou retraites peuvent demander une participation modique pour couvrir les frais matériels. Nous nous efforçons de garder nos événements accessibles à tous.',
      verse: ''
    },
    {
      id: 10,
      category: 'lecture',
      question: 'Que faire si je prends du retard dans le programme de lecture ?',
      answer: 'Pas de panique ! Nous avons prévu 4 jours de rattrapage dans l\'année (15 février, 30 avril, 15 juillet, 30 septembre 2026). Ces jours sont spécialement dédiés à la révision et au rattrapage. L\'important est la régularité, pas la perfection.',
      verse: ''
    },
    {
      id: 11,
      category: 'communaute',
      question: 'Comment puis-je contribuer à la mission de 3V ?',
      answer: 'Vous pouvez contribuer par le volontariat dans nos projets communautaires, le partage de témoignages, la participation aux groupes de prière, ou le soutien financier. Chaque contribution, petite ou grande, aide à porter notre mission spirituelle.',
      verse: ''
    },
    {
      id: 12,
      category: 'spiritualite',
      question: 'Comment trouver la paix intérieure dans un monde troublé ?',
      answer: 'La paix intérieure vient de notre relation avec Dieu. Jésus nous dit dans Jean 14:27 : "Je vous laisse la paix, je vous donne ma paix". Cette paix se cultive par la prière, la confiance en Dieu, et la mise en pratique de ses enseignements d\'amour et de pardon.',
      verse: 'Jean 14:27'
    }
  ];

  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedFAQ = faqCategories.reduce((acc, category) => {
    acc[category.id] = filteredFAQ.filter(item => item.category === category.id);
    return acc;
  }, {} as Record<string, typeof faqData>);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6">
                Questions Fréquentes
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Trouvez des réponses à vos questions spirituelles et pratiques
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher une question..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 bg-card/50 backdrop-blur-sm border-border/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {faqCategories.map((category) => {
                const categoryFAQs = groupedFAQ[category.id];
                const Icon = category.icon;
                
                if (categoryFAQs.length === 0) return null;

                return (
                  <div key={category.id} className="mb-12">
                    <div className="flex items-center mb-6">
                      <div className="bg-gradient-peace rounded-full w-12 h-12 flex items-center justify-center mr-4 shadow-glow">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary">
                        {category.name}
                      </h2>
                      <Badge className={`ml-3 ${category.color}`}>
                        {categoryFAQs.length} questions
                      </Badge>
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                      {categoryFAQs.map((faq) => (
                        <AccordionItem 
                          key={faq.id} 
                          value={`item-${faq.id}`}
                          className="bg-card/50 backdrop-blur-sm rounded-lg border border-border/50 px-6 shadow-subtle hover:shadow-elegant transition-all duration-300"
                        >
                          <AccordionTrigger className="text-left hover:no-underline py-6">
                            <span className="font-playfair font-semibold text-primary pr-4">
                              {faq.question}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-6">
                            <div className="text-muted-foreground leading-relaxed">
                              <p className="mb-4">{faq.answer}</p>
                              {faq.verse && (
                                <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                                  <p className="text-sm font-semibold text-primary mb-1">
                                    Référence biblique :
                                  </p>
                                  <p className="text-sm italic">
                                    {faq.verse}
                                  </p>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}

              {filteredFAQ.length === 0 && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-playfair font-semibold text-primary mb-2">
                    Aucune question trouvée
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Essayez avec d'autres mots-clés ou consultez toutes nos questions
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-primary hover:underline"
                  >
                    Voir toutes les questions
                  </button>
                </div>
              )}

              {/* Contact for more questions */}
              <div className="mt-16 text-center">
                <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-8 shadow-elegant border border-border/50">
                  <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-playfair font-semibold text-primary mb-3">
                    Vous ne trouvez pas votre réponse ?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Notre équipe est là pour vous accompagner dans votre cheminement spirituel
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 bg-gradient-peace text-white rounded-lg hover:shadow-glow transition-all duration-300 divine-glow"
                  >
                    Nous contacter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQ;