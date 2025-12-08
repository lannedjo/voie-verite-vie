import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar, BookOpen, CheckCircle, Brain, Library } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { QuizModal } from '@/components/QuizModal';
import { BibleBookSelector } from '@/components/BibleBookSelector';
import { logger } from '@/lib/logger';
import { groupReadingsByDay, GroupedReading } from '@/lib/reading-grouper';

interface Reading {
  id: string;
  day_number: number;
  date: string;
  month: number;
  year?: number;
  books: string;
  chapters: string;
  chapters_count: number;
  type: string;
  comment: string | null;
}

interface UserProgress {
  reading_id: string;
  completed: boolean;
  completed_at?: string | null;
}

const BiblicalReading = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedTestament, setSelectedTestament] = useState('all');
  const [activeTab, setActiveTab] = useState('program');
  const [allReadings, setAllReadings] = useState<Reading[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizReading, setQuizReading] = useState<Reading | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Charger depuis cache d'abord pour une expérience rapide
    const cached = localStorage.getItem('biblical_readings_cache');
    if (cached) {
      try {
        setAllReadings(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        setLoading(true);
      }
    } else {
      setLoading(true);
    }
    
    // Puis charger les données fraîches en arrière-plan
    loadAllReadings();
    if (user) loadUserProgress();
  }, [user]);

  const loadAllReadings = async () => {
    try {
      const { data } = await supabase
        .from('biblical_readings')
        .select('id, day_number, date, month, year, books, chapters, chapters_count, type, comment')
        .order('day_number');
      
      if (data) {
        setAllReadings(data);
        // Mettre en cache pour les chargements futurs
        localStorage.setItem('biblical_readings_cache', JSON.stringify(data));
      }
    } catch (error) {
      logger.error('Erreur chargement lectures', {}, error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_reading_progress')
      .select('reading_id, completed')
      .eq('user_id', user.id);
    setUserProgress(data || []);
  };

  const toggleReadingComplete = async (reading: Reading) => {
    if (!user) return navigate('/auth');
    
    const existing = userProgress.find(p => p.reading_id === reading.id);
    const wasCompleted = existing?.completed;
    
    try {
      if (existing) {
        await supabase.from('user_reading_progress')
          .update({ completed: !existing.completed, completed_at: !existing.completed ? new Date().toISOString() : null })
          .eq('user_id', user.id).eq('reading_id', reading.id);
      } else {
        await supabase.from('user_reading_progress')
          .insert({ user_id: user.id, reading_id: reading.id, completed: true, completed_at: new Date().toISOString() });
      }
      
      await loadUserProgress();
      
      // Si on vient de marquer comme lu, proposer le quiz
      if (!wasCompleted) {
        setQuizReading(reading);
        setShowQuiz(true);
        toast({ title: "Lecture complétée !" });
      }
    } catch (error) {
      logger.error('Erreur lors de la mise à jour du statut de lecture', 
        { readingId: reading.id, userId: user.id }, 
        error instanceof Error ? error : new Error(String(error))
      );
      toast({ title: "Erreur", description: "Impossible de mettre à jour votre progression", variant: "destructive" });
    }
  };

  const openQuizForReading = (reading: Reading) => {
    setQuizReading(reading);
    setShowQuiz(true);
  };

  const toggleGroupComplete = async (group: GroupedReading) => {
    if (!user) return navigate('/auth');
    
    // Marquer tous les jours du groupe comme complétés
    for (const reading of group.readings) {
      try {
        const existing = userProgress.find(p => p.reading_id === reading.id);
        
        if (existing) {
          if (!existing.completed) {
            // Marquer comme complété
            await supabase.from('user_reading_progress')
              .update({ completed: true, completed_at: new Date().toISOString() })
              .eq('user_id', user.id).eq('reading_id', reading.id);
          }
        } else {
          // Créer une entrée
          await supabase.from('user_reading_progress')
            .insert({ 
              user_id: user.id, 
              reading_id: reading.id, 
              completed: true, 
              completed_at: new Date().toISOString() 
            });
        }
      } catch (error) {
        console.error(`Erreur pour le jour ${reading.day_number}:`, error);
      }
    }
    
    await loadUserProgress();
    setQuizReading(group.readings[0]);
    setShowQuiz(true);
    toast({ title: "Groupe de lectures marqué comme complété !" });
  };

  const filteredReadings = useMemo(() => {
    let filtered = allReadings;
    
    if (selectedMonth !== 'all') {
      const [month, year] = selectedMonth.split('-').map(Number);
      filtered = filtered.filter(r => r.month === month && r.year === year);
    }
    
    if (selectedTestament !== 'all') {
      const ntBooks = ['Matthieu', 'Marc', 'Luc', 'Jean', 'Actes', 'Romains', 'Corinthiens', 'Galates', 'Éphésiens', 'Philippiens', 'Colossiens', 'Thessaloniciens', 'Timothée', 'Tite', 'Philémon', 'Hébreux', 'Jacques', 'Pierre', 'Jude', 'Apocalypse'];
      filtered = selectedTestament === 'old' 
        ? filtered.filter(r => !ntBooks.some(nt => r.books.includes(nt)))
        : filtered.filter(r => ntBooks.some(nt => r.books.includes(nt)));
    }
    
    return filtered;
  }, [allReadings, selectedMonth, selectedTestament]);

  const monthsOrder = [
    { key: '11-2025', name: 'Nov 2025' },
    { key: '12-2025', name: 'Déc 2025' },
    { key: '1-2026', name: 'Jan 2026' },
    { key: '2-2026', name: 'Fév 2026' },
    { key: '3-2026', name: 'Mar 2026' },
    { key: '4-2026', name: 'Avr 2026' },
    { key: '5-2026', name: 'Mai 2026' },
    { key: '6-2026', name: 'Juin 2026' },
    { key: '7-2026', name: 'Juil 2026' },
    { key: '8-2026', name: 'Août 2026' },
    { key: '9-2026', name: 'Sep 2026' },
    { key: '10-2026', name: 'Oct 2026' },
    { key: '11-2026', name: 'Nov 2026' },
  ];
  
  const completedCount = userProgress.filter(p => p.completed).length;
  const progressPercentage = Math.round((completedCount / 358) * 100);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-6 md:py-10 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-5xl font-playfair font-bold text-primary mb-3">Programme de Lecture Biblique</h1>
              <p className="text-base md:text-lg text-muted-foreground">Parcourez les 73 livres de la Bible catholique en 354 jours</p>
            </div>
          </div>
        </section>

        <section className="py-4 md:py-6">
          <div className="container mx-auto px-4 max-w-6xl">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="program" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Programme 354j</span>
                </TabsTrigger>
                <TabsTrigger value="books" className="flex items-center gap-2">
                  <Library className="w-4 h-4" />
                  <span>73 Livres</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="program" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <Card><CardHeader className="pb-1 pt-3"><CardTitle className="text-xs">Progression</CardTitle></CardHeader><CardContent className="pb-3"><div className="text-lg md:text-xl font-bold text-primary">{progressPercentage}%</div></CardContent></Card>
                  <Card><CardHeader className="pb-1 pt-3"><CardTitle className="text-xs">Complétées</CardTitle></CardHeader><CardContent className="pb-3"><div className="text-lg md:text-xl font-bold text-primary">{completedCount}/358</div></CardContent></Card>
                  <Card><CardHeader className="pb-1 pt-3"><CardTitle className="text-xs">Affichées</CardTitle></CardHeader><CardContent className="pb-3"><div className="text-lg md:text-xl font-bold text-primary">{filteredReadings.length}</div></CardContent></Card>
                  <Card><CardHeader className="pb-1 pt-3"><CardTitle className="text-xs">Restants</CardTitle></CardHeader><CardContent className="pb-3"><div className="text-lg md:text-xl font-bold text-primary">{358 - completedCount}</div></CardContent></Card>
                </div>

                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
                  <Button 
                    variant={selectedMonth === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedMonth('all')}
                  >
                    Tous
                  </Button>
                  {monthsOrder.map((month) => {
                    const [m, y] = month.key.split('-').map(Number);
                    const monthReadings = allReadings.filter(r => r.month === m && r.year === y);
                    const readingsInMonth = monthReadings.length;
                    if (readingsInMonth === 0) return null;
                    const completedInMonth = monthReadings.filter(r => 
                      userProgress.some(p => p.reading_id === r.id && p.completed)
                    ).length;
                    const monthProgress = Math.round((completedInMonth / readingsInMonth) * 100);
                    return (
                      <div key={month.key} className="flex flex-col items-center gap-1">
                        <Button 
                          variant={selectedMonth === month.key ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setSelectedMonth(month.key)}
                          className="w-full"
                        >
                          {month.name} <Badge variant="secondary" className="ml-1 text-xs">{completedInMonth}/{readingsInMonth}</Badge>
                        </Button>
                        <Progress value={monthProgress} className="w-full h-1.5" />
                      </div>
                    );
                  })}
                </div>

                <Tabs value={selectedTestament} onValueChange={setSelectedTestament} className="mb-6">
                  <TabsList className="grid w-full max-w-xs mx-auto grid-cols-3">
                    <TabsTrigger value="all">Tous</TabsTrigger>
                    <TabsTrigger value="old">A.T.</TabsTrigger>
                    <TabsTrigger value="new">N.T.</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Afficher les lectures groupées par jour */}
                {useMemo(() => {
                  const groupedReadings = groupReadingsByDay(filteredReadings);
                  
                  return (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {groupedReadings.map((group: GroupedReading) => {
                        // Vérifier si TOUS les jours du groupe sont complétés
                        const allCompleted = group.readings.every(r =>
                          userProgress.some(p => p.reading_id === r.id && p.completed)
                        );
                        
                        // Vérifier si AU MOINS UN jour est complété
                        const anyCompleted = group.readings.some(r =>
                          userProgress.some(p => p.reading_id === r.id && p.completed)
                        );

                        return (
                          <Card key={group.groupId} className={allCompleted ? 'ring-2 ring-primary/20' : ''}>
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-primary" />
                                  <span className="text-sm font-medium text-primary">
                                    Jour{group.startDay !== group.endDay ? `s ${group.startDay}-${group.endDay}` : ` ${group.startDay}`}
                                  </span>
                                </div>
                                {anyCompleted && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2"
                                    onClick={() => openQuizForReading(group.readings[0])}
                                  >
                                    <Brain className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              <CardTitle className="text-base md:text-lg font-playfair">
                                {new Date(group.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div>
                                  <p className="font-semibold text-primary">{group.label}</p>
                                  <p className="text-xs md:text-sm text-muted-foreground">
                                    {group.totalChapters} chapitre{group.totalChapters > 1 ? 's' : ''}
                                  </p>
                                </div>
                                {group.comments.length > 0 && (
                                  <div className="bg-primary/5 rounded-lg p-3">
                                    <p className="text-xs italic text-muted-foreground">{group.comments[0]}</p>
                                  </div>
                                )}
                                <Button 
                                  size="sm" 
                                  variant={allCompleted ? "default" : "outline"} 
                                  className="w-full text-xs" 
                                  onClick={() => toggleGroupComplete(group)}
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  {allCompleted ? "Complété" : "Marquer tout lu"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  );
                }, [filteredReadings, userProgress])}
              </TabsContent>

              <TabsContent value="books" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Explorez les 73 Livres Bibliques
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      Accédez à tous les livres de la Bible catholique avec leurs chapitres et abréviations
                    </p>
                  </CardHeader>
                  <CardContent>
                    <BibleBookSelector />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <QuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        reading={quizReading}
      />
    </div>
  );
};

export default BiblicalReading;
