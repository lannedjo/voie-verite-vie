import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, BookOpen, Calendar, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface BiblicalReading {
  id: string;
  date: string;
  day_number: number;
  books: string;
  chapters: string;
  chapters_count: number;
  type: string;
  comment: string | null;
  month: number;
  year: number;
}

export const AdminReadings = () => {
  const [readings, setReadings] = useState<BiblicalReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    try {
      const { data, error } = await supabase
        .from('biblical_readings')
        .select('*')
        .order('date', { ascending: true })
        .limit(100);

      if (error) throw error;
      setReadings(data || []);
    } catch (error) {
      console.error('Error loading readings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les lectures",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      lecture: 'bg-blue-500/10 text-blue-700',
      rattrapage: 'bg-orange-500/10 text-orange-700',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-700';
  };

  const filteredReadings = readings.filter(reading =>
    reading.books.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.chapters.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Lectures bibliques</h2>
          <p className="text-muted-foreground">Programme de lecture annuel (358 jours)</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un livre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total lectures</p>
                <p className="text-2xl font-bold">{readings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/10 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Jours de rattrapage</p>
                <p className="text-2xl font-bold">{readings.filter(r => r.type === 'rattrapage').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/10 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chapitres totaux</p>
                <p className="text-2xl font-bold">{readings.reduce((sum, r) => sum + r.chapters_count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Liste des lectures
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jour</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Livres</TableHead>
                    <TableHead>Chapitres</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReadings.map((reading) => (
                    <TableRow key={reading.id}>
                      <TableCell className="font-medium">
                        Jour {reading.day_number}
                      </TableCell>
                      <TableCell>
                        {new Date(reading.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <span className="font-medium">{reading.books}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {reading.chapters_count} chapitres
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(reading.type)}>
                          {reading.type === 'rattrapage' ? 'Rattrapage' : 'Lecture'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};