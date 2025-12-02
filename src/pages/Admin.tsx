import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, LayoutDashboard, Users, BookOpen, MessageSquare, Brain, Award, BookHeart } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { AdminMessages } from '@/components/admin/AdminMessages';
import { AdminReadings } from '@/components/admin/AdminReadings';
import { AdminQuizzes } from '@/components/admin/AdminQuizzes';
import { AdminChallenges } from '@/components/admin/AdminChallenges';
import { AdminLectioDivina } from '@/components/admin/AdminLectioDivina';

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/');
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'readings', label: 'Lectures', icon: BookOpen },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'quizzes', label: 'Quiz', icon: Brain },
    { id: 'challenges', label: 'Défis', icon: Award },
    { id: 'lectio', label: 'Lectio Divina', icon: BookHeart },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navigation />
      <main className="pt-16 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 pt-4">
            <div className="bg-primary/10 p-3 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-playfair font-bold text-primary">Administration</h1>
              <p className="text-muted-foreground">Gérez votre plateforme 3V</p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex h-auto p-1 bg-muted/50 rounded-xl">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm whitespace-nowrap"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden md:inline">{tab.label}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-6">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <AdminUsers />
            </TabsContent>

            <TabsContent value="readings" className="mt-6">
              <AdminReadings />
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <AdminMessages />
            </TabsContent>

            <TabsContent value="quizzes" className="mt-6">
              <AdminQuizzes />
            </TabsContent>

            <TabsContent value="challenges" className="mt-6">
              <AdminChallenges />
            </TabsContent>

            <TabsContent value="lectio" className="mt-6">
              <AdminLectioDivina />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Admin;