import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageSquare, TrendingUp, Calendar, Award, Brain, FileQuestion } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Stats {
  users: number;
  readings: number;
  messages: number;
  completedReadings: number;
  quizzes: number;
  challenges: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    users: 0,
    readings: 0,
    messages: 0,
    completedReadings: 0,
    quizzes: 0,
    challenges: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersResult, readingsResult, messagesResult, progressResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('biblical_readings').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('user_reading_progress').select('id', { count: 'exact', head: true }).eq('completed', true),
      ]);

      setStats({
        users: usersResult.count || 0,
        readings: readingsResult.count || 0,
        messages: messagesResult.count || 0,
        completedReadings: progressResult.count || 0,
        quizzes: 0,
        challenges: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Utilisateurs', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Lectures bibliques', value: stats.readings, icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Lectures complétées', value: stats.completedReadings, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Messages', value: stats.messages, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Quiz créés', value: stats.quizzes, icon: Brain, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { title: 'Défis actifs', value: stats.challenges, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d'ensemble de l'activité de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-primary">
                  {loading ? '...' : stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Nouvel utilisateur inscrit', time: 'Il y a 2h' },
                { action: 'Quiz biblique complété', time: 'Il y a 4h' },
                { action: 'Nouveau message de contact', time: 'Il y a 5h' },
                { action: 'Défi de lecture terminé', time: 'Il y a 1j' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <span className="text-sm">{item.action}</span>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-primary" />
              Messages récents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Consultez l'onglet "Messages" pour voir tous les messages de contact.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};