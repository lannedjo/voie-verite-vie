import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BookOpen, CheckCircle, Clock, Target, Filter, ChevronLeft, ChevronRight, Star } from 'lucide-react';

const BiblicalReading = () => {
  const [selectedMonth, setSelectedMonth] = useState(11); // Décembre par défaut
  const [selectedTestament, setSelectedTestament] = useState('all');
  const [currentDate] = useState(new Date('2024-12-01')); // Simulation date actuelle

  // Données du programme (extrait pour démonstration)
  const programData = {
    startDate: new Date('2025-11-30'),
    endDate: new Date('2026-11-22'),
    totalDays: 358,
    readingDays: 354,
    catchupDays: 4,
    totalBooks: 73,
    oldTestamentBooks: 46,
    newTestamentBooks: 27,
    catchupDates: ['2026-02-15', '2026-04-30', '2026-07-15', '2026-09-30']
  };

  const monthlyReadings = {
    11: { // Décembre 2025
      name: 'Décembre 2025',
      readings: [
        { date: '2025-11-30', day: 1, books: 'Genèse', chapters: '1-4', chaptersCount: 4, type: 'moyens', comment: 'Commencement du voyage' },
        { date: '2025-12-01', day: 2, books: 'Genèse', chapters: '5-8', chaptersCount: 4, type: 'moyens', comment: '' },
        { date: '2025-12-02', day: 3, books: 'Genèse', chapters: '9-12', chaptersCount: 4, type: 'moyens', comment: '' },
        { date: '2025-12-03', day: 4, books: 'Genèse', chapters: '13-16', chaptersCount: 4, type: 'moyens', comment: '' },
        { date: '2025-12-04', day: 5, books: 'Genèse', chapters: '17-20', chaptersCount: 4, type: 'moyens', comment: '' },
        { date: '2025-12-05', day: 6, books: 'Genèse', chapters: '21-24', chaptersCount: 4, type: 'moyens', comment: '' },
        { date: '2025-12-12', day: 12, books: 'Genèse', chapters: '49-50', chaptersCount: 2, type: 'fin', comment: 'Création, promesse ; lien Avent : Messie' },
        { date: '2025-12-13', day: 13, books: 'Exode', chapters: '1-4', chaptersCount: 4, type: 'moyens', comment: 'Début d\'Exode' },
        { date: '2025-12-22', day: 22, books: 'Exode', chapters: '37-40', chaptersCount: 4, type: 'fin', comment: 'Alliance, libération ; lien Eucharistie' },
        { date: '2025-12-25', day: 25, books: 'Lévitique', chapters: '9-12', chaptersCount: 4, type: 'noel', comment: 'Noël : rattrapage possible' },
        { date: '2025-12-30', day: 30, books: 'Lévitique', chapters: '25-27', chaptersCount: 3, type: 'fin', comment: 'Sainteté, culte' },
      ]
    },
    0: { // Janvier 2026
      name: 'Janvier 2026',
      readings: [
        { date: '2026-01-01', day: 33, books: 'Nombres', chapters: '5-8', chaptersCount: 4, type: 'moyens', comment: '' },
        { date: '2026-01-08', day: 40, books: 'Nombres', chapters: '33-36', chaptersCount: 4, type: 'fin', comment: 'Fidélité dans le désert' },
        { date: '2026-01-17', day: 49, books: 'Deutéronome', chapters: '33-34', chaptersCount: 2, type: 'fin', comment: 'Alliance ; lien Mt 5-7' },
        { date: '2026-01-23', day: 55, books: 'Josué', chapters: '21-24', chaptersCount: 4, type: 'fin', comment: 'Conquête, fidélité' },
        { date: '2026-01-29', day: 61, books: 'Juges', chapters: '21', chaptersCount: 1, type: 'fin', comment: 'Péché, délivrance' },
        { date: '2026-01-30', day: 62, books: 'Ruth', chapters: '4', chaptersCount: 1, type: 'fin', comment: 'Généalogie ; lien Marie' },
      ]
    }
  };

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getCurrentProgress = () => {
    const totalDays = 358;
    const daysPassed = 32; // Simulation : 32 jours depuis le début
    return Math.round((daysPassed / totalDays) * 100);
  };

  const currentProgress = getCurrentProgress();

  const filteredReadings = useMemo(() => {
    const readings = monthlyReadings[selectedMonth]?.readings || [];
    if (selectedTestament === 'all') return readings;
    
    if (selectedTestament === 'old') {
      return readings.filter(reading => 
        !['Matthieu', 'Marc', 'Luc', 'Jean', 'Actes', 'Romains'].some(nt => 
          reading.books.includes(nt)
        )
      );
    } else {
      return readings.filter(reading => 
        ['Matthieu', 'Marc', 'Luc', 'Jean', 'Actes', 'Romains'].some(nt => 
          reading.books.includes(nt)
        )
      );
    }
  }, [selectedMonth, selectedTestament]);

  const getReadingTypeColor = (type: string) => {
    switch (type) {
      case 'courts': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      case 'moyens': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'longs': return 'bg-orange-500/10 text-orange-700 border-orange-500/20';
      case 'fin': return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'noel': return 'bg-red-500/10 text-red-700 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getReadingTypeText = (type: string) => {
    switch (type) {
      case 'courts': return 'Chapitres courts';
      case 'moyens': return 'Chapitres moyens';
      case 'longs': return 'Chapitres longs';
      case 'fin': return 'Fin de livre + commentaire';
      case 'noel': return 'Jour spécial';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-playfair font-bold text-primary mb-6">
                Programme de Lecture Biblique
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Parcourez les 73 livres de la Bible catholique en 354 jours
              </p>
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto shadow-elegant border border-border/50">
                <p className="text-lg font-semibold text-primary mb-2">
                  30 novembre 2025 - 22 novembre 2026
                </p>
                <p className="text-muted-foreground">
                  Un voyage spirituel complet à travers l'Ancien et le Nouveau Testament
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Overview */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-6 mb-12">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Progression globale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{currentProgress}%</div>
                    <div className="w-full bg-muted/50 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-peace h-2 rounded-full transition-all duration-500"
                        style={{ width: `${currentProgress}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Livres terminés</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">sur 73 livres</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Jours restants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">326</div>
                    <div className="text-sm text-muted-foreground">jours de lecture</div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Prochain rattrapage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">15</div>
                    <div className="text-sm text-muted-foreground">février 2026</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Navigation and Readings */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-8">
                <Button
                  variant="outline"
                  onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Mois précédent</span>
                </Button>

                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-primary">
                  {monthlyReadings[selectedMonth]?.name || 'Mois sélectionné'}
                </h2>

                <Button
                  variant="outline"
                  onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
                  className="flex items-center space-x-2"
                >
                  <span>Mois suivant</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Testament Filter */}
              <Tabs value={selectedTestament} onValueChange={setSelectedTestament} className="mb-8">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                  <TabsTrigger value="all">Tous</TabsTrigger>
                  <TabsTrigger value="old">Ancien Testament</TabsTrigger>
                  <TabsTrigger value="new">Nouveau Testament</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Readings Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReadings.map((reading, index) => (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-elegant transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">
                            Jour {reading.day}
                          </span>
                        </div>
                        <Badge className={getReadingTypeColor(reading.type)}>
                          {getReadingTypeText(reading.type)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg font-playfair">
                        {new Date(reading.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="font-semibold text-primary">{reading.books}</p>
                          <p className="text-sm text-muted-foreground">
                            Chapitres {reading.chapters} ({reading.chaptersCount} chap.)
                          </p>
                        </div>
                        
                        {reading.comment && (
                          <div className="bg-primary/5 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground italic">
                              {reading.comment}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              {reading.type === 'fin' ? 'Commentaire requis' : 'Lecture'}
                            </span>
                          </div>
                          
                          <Button size="sm" variant="outline" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Marquer lu
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredReadings.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-playfair font-semibold text-primary mb-2">
                    Aucune lecture pour ce mois
                  </h3>
                  <p className="text-muted-foreground">
                    Sélectionnez un autre mois ou modifiez le filtre
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-16">
                Caractéristiques du Programme
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-gradient-peace rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-primary mb-3">
                    354 jours de lecture
                  </h3>
                  <p className="text-muted-foreground">
                    Un parcours complet avec 4 jours de rattrapage stratégiquement placés
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-peace rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-primary mb-3">
                    73 livres bibliques
                  </h3>
                  <p className="text-muted-foreground">
                    Tous les livres de la Bible catholique dans l'ordre canonique
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-peace rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-primary mb-3">
                    Année liturgique A
                  </h3>
                  <p className="text-muted-foreground">
                    Synchronisé avec l'année de Matthieu pour une expérience liturgique complète
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BiblicalReading;