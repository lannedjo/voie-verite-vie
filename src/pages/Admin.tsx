import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, BookOpen, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    readings: 0,
    messages: 0,
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      loadStats();
    }
  }, [user, isAdmin]);

  const loadStats = async () => {
    try {
      const [usersResult, readingsResult, messagesResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('biblical_readings').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        users: usersResult.count || 0,
        readings: readingsResult.count || 0,
        messages: messagesResult.count || 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-playfair font-bold">Administration</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Lectures bibliques</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.readings}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Messages de contact</CardTitle>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.messages}</div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="readings" className="space-y-4">
            <TabsList>
              <TabsTrigger value="readings">Lectures bibliques</TabsTrigger>
              <TabsTrigger value="users">Utilisateurs</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="readings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des lectures bibliques</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Accédez à la base de données pour gérer les lectures bibliques.
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('https://lovable.dev', '_blank');
                    }}
                    className="text-primary hover:underline"
                  >
                    Ouvrir la base de données
                  </a>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gestion des utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Accédez à la base de données pour gérer les utilisateurs et leurs rôles.
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('https://lovable.dev', '_blank');
                    }}
                    className="text-primary hover:underline"
                  >
                    Ouvrir la base de données
                  </a>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Messages de contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Accédez à la base de données pour consulter les messages de contact.
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('https://lovable.dev', '_blank');
                    }}
                    className="text-primary hover:underline"
                  >
                    Ouvrir la base de données
                  </a>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;