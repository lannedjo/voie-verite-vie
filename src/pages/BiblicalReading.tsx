import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BookOpen, CheckCircle, ChevronLeft, ChevronRight, Star, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

interface Reading {
  id: string;
  day_number: number;
  date: string;
  month: number;
  books: string;
  chapters: string;
  chapters_count: number;
  type: string;
  comment: string | null;
}

const BiblicalReading = () => {
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedTestament, setSelectedTestament] = useState('all');
  const [allReadings, setAllReadings] = useState<Reading[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadAllReadings();
    if (user) loadUserProgress();
  }, [user]);

  const loadAllReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('biblical_readings')
        .select('*')
        .order('day_number');
      if (error) throw error;
      setAllReadings(data || []);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de charger les lectures", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('user_reading_progress')
        .select('reading_id, completed')
        .eq('user_id', user.id);
      if (error) throw error;
      setUserProgress(data || []);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const toggleReadingComplete = async (readingId: string) => {
    if (!user) return navigate('/auth');
    try {
      const existing = userProgress.find(p => p.reading_id === readingId);
      if (existing) {
        await supabase.from('user_reading_progress')
          .update({ completed: !existing.completed, completed_at: !existing.completed ? new Date().toISOString() : null })
          .eq('user_id', user.id).eq('reading_id', readingId);
      } else {
        await supabase.from('user_reading_progress')
          .insert({ user_id: user.id, reading_id: readingId, completed: true, completed_at: new Date().toISOString() });
      }
      await loadUserProgress();
      toast({ title: "Progression mise à jour" });
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible de mettre à jour", variant: "destructive" });
    }
  };

  const filteredReadings = useMemo(() => {
    let filtered = allReadings;
    
    // Filtrer par mois
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(r => r.month === selectedMonth);
    }
    
    // Filtrer par testament
    if (selectedTestament !== 'all') {
      const ntBooks = ['Matthieu', 'Marc', 'Luc', 'Jean', 'Actes', 'Romains', 'Corinthiens', 'Galates', 'Éphésiens', 'Philippiens', 'Colossiens', 'Thessaloniciens', 'Timothée', 'Tite', 'Philémon', 'Hébreux', 'Jacques', 'Pierre', 'Jude', 'Apocalypse'];
      filtered = selectedTestament === 'old' 
        ? filtered.filter(r => !ntBooks.some(nt => r.books.includes(nt)))
        : filtered.filter(r => ntBooks.some(nt => r.books.includes(nt)));
    }
    
    return filtered;
  }, [allReadings, selectedMonth, selectedTestament]);

  const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const completedCount = userProgress.filter(p => p.completed).length;
  const progressPercentage = Math.round((completedCount / 358) * 100);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-12 md:py-20 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-6xl font-playfair font-bold text-primary mb-6">Programme de Lecture Biblique</h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">Parcourez les 73 livres de la Bible catholique en 354 jours</p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card><CardHeader className="pb-2"><CardTitle className="text-xs md:text-sm">Progression</CardTitle></CardHeader><CardContent><div className="text-xl md:text-2xl font-bold text-primary">{progressPercentage}%</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-xs md:text-sm">Complétées</CardTitle></CardHeader><CardContent><div className="text-xl md:text-2xl font-bold text-primary">{completedCount}/358</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-xs md:text-sm">Affichées</CardTitle></CardHeader><CardContent><div className="text-xl md:text-2xl font-bold text-primary">{filteredReadings.length}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-xs md:text-sm">Restants</CardTitle></CardHeader><CardContent><div className="text-xl md:text-2xl font-bold text-primary">{358 - completedCount}</div></CardContent></Card>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex flex-wrap justify-center gap-2">
                <Button 
                  variant={selectedMonth === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedMonth('all')}
                  className="min-w-[100px]"
                >
                  Tous les mois
                </Button>
                {months.map((month, idx) => {
                  const monthNum = idx === 10 ? 11 : idx === 11 ? 12 : idx + 1;
                  const readingsInMonth = allReadings.filter(r => r.month === monthNum).length;
                  return (
                    <Button 
                      key={monthNum}
                      variant={selectedMonth === monthNum ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => setSelectedMonth(monthNum)}
                      className="min-w-[80px]"
                    >
                      {month} <Badge variant="secondary" className="ml-1 text-xs">{readingsInMonth}</Badge>
                    </Button>
                  );
                })}
              </div>
            </div>

            <Tabs value={selectedTestament} onValueChange={setSelectedTestament} className="mb-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="old">A.T.</TabsTrigger>
                <TabsTrigger value="new">N.T.</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredReadings.map((reading) => {
                const completed = userProgress.some(p => p.reading_id === reading.id && p.completed);
                return (
                  <Card key={reading.id} className={completed ? 'ring-2 ring-primary/20' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /><span className="text-sm font-medium text-primary">Jour {reading.day_number}</span></div>
                      </div>
                      <CardTitle className="text-base md:text-lg font-playfair">{new Date(reading.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div><p className="font-semibold text-primary">{reading.books}</p><p className="text-xs md:text-sm text-muted-foreground">Chapitres {reading.chapters} ({reading.chapters_count} chap.)</p></div>
                        {reading.comment && <div className="bg-primary/5 rounded-lg p-3"><p className="text-xs italic text-muted-foreground">{reading.comment}</p></div>}
                        <Button size="sm" variant={completed ? "default" : "outline"} className="w-full text-xs" onClick={() => toggleReadingComplete(reading.id)}>
                          <CheckCircle className="w-3 h-3 mr-1" />{completed ? "Lu" : "Marquer lu"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BiblicalReading;