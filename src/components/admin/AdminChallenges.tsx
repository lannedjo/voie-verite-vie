import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Award, Plus, Trash2, Target, Calendar, Users, Trophy } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'lecture' | 'priere' | 'communaute' | 'memorisation';
  duration: string;
  points: number;
  participants: number;
  startDate: string;
  endDate: string;
  status: 'actif' | 'termine' | 'a_venir';
}

export const AdminChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Défi 7 jours de lecture',
      description: 'Lisez un chapitre par jour pendant 7 jours consécutifs',
      type: 'lecture',
      duration: '7 jours',
      points: 100,
      participants: 45,
      startDate: '2024-12-01',
      endDate: '2024-12-08',
      status: 'actif',
    },
    {
      id: '2',
      title: 'Mémorisation des Béatitudes',
      description: 'Apprenez par cœur les 8 Béatitudes de Matthieu 5',
      type: 'memorisation',
      duration: '14 jours',
      points: 200,
      participants: 28,
      startDate: '2024-12-15',
      endDate: '2024-12-29',
      status: 'a_venir',
    },
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newChallenge, setNewChallenge] = useState<Partial<Challenge>>({
    title: '',
    description: '',
    type: 'lecture',
    duration: '',
    points: 100,
  });
  const { toast } = useToast();

  const handleCreateChallenge = () => {
    if (!newChallenge.title || !newChallenge.description) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const challenge: Challenge = {
      id: Date.now().toString(),
      title: newChallenge.title!,
      description: newChallenge.description!,
      type: newChallenge.type as Challenge['type'],
      duration: newChallenge.duration || '7 jours',
      points: newChallenge.points || 100,
      participants: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'actif',
    };

    setChallenges(prev => [...prev, challenge]);
    setNewChallenge({ title: '', description: '', type: 'lecture', duration: '', points: 100 });
    setShowCreateForm(false);
    toast({
      title: "Défi créé",
      description: "Le défi a été créé avec succès",
    });
  };

  const deleteChallenge = (id: string) => {
    setChallenges(prev => prev.filter(c => c.id !== id));
    toast({
      title: "Défi supprimé",
      description: "Le défi a été supprimé",
    });
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      lecture: 'Lecture',
      priere: 'Prière',
      communaute: 'Communauté',
      memorisation: 'Mémorisation',
    };
    return types[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      lecture: 'bg-blue-500/10 text-blue-700',
      priere: 'bg-purple-500/10 text-purple-700',
      communaute: 'bg-green-500/10 text-green-700',
      memorisation: 'bg-orange-500/10 text-orange-700',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      actif: 'bg-green-500/10 text-green-700',
      termine: 'bg-gray-500/10 text-gray-700',
      a_venir: 'bg-blue-500/10 text-blue-700',
    };
    return colors[status] || 'bg-gray-500/10 text-gray-700';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      actif: 'Actif',
      termine: 'Terminé',
      a_venir: 'À venir',
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Défis spirituels</h2>
          <p className="text-muted-foreground">Créez des défis pour motiver la communauté</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau défi
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Défis actifs</p>
                <p className="text-2xl font-bold">
                  {challenges.filter(c => c.status === 'actif').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Participants</p>
                <p className="text-2xl font-bold">
                  {challenges.reduce((sum, c) => sum + c.participants, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Points totaux</p>
                <p className="text-2xl font-bold">
                  {challenges.reduce((sum, c) => sum + c.points, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">À venir</p>
                <p className="text-2xl font-bold">
                  {challenges.filter(c => c.status === 'a_venir').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showCreateForm && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Créer un nouveau défi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Titre du défi *</Label>
                <Input
                  placeholder="Ex: Défi 30 jours de prière"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Type de défi</Label>
                <Select
                  value={newChallenge.type}
                  onValueChange={(value: Challenge['type']) => 
                    setNewChallenge(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="priere">Prière</SelectItem>
                    <SelectItem value="communaute">Communauté</SelectItem>
                    <SelectItem value="memorisation">Mémorisation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Décrivez les objectifs et règles du défi..."
                value={newChallenge.description}
                onChange={(e) => setNewChallenge(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Durée</Label>
                <Input
                  placeholder="Ex: 7 jours"
                  value={newChallenge.duration}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Points de récompense</Label>
                <Input
                  type="number"
                  placeholder="100"
                  value={newChallenge.points}
                  onChange={(e) => setNewChallenge(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateChallenge}>
                Créer le défi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge className={getTypeColor(challenge.type)}>
                        {getTypeLabel(challenge.type)}
                      </Badge>
                      <Badge className={getStatusColor(challenge.status)}>
                        {getStatusLabel(challenge.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => deleteChallenge(challenge.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-primary">{challenge.points}</p>
                  <p className="text-xs text-muted-foreground">Points</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{challenge.participants}</p>
                  <p className="text-xs text-muted-foreground">Participants</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{challenge.duration}</p>
                  <p className="text-xs text-muted-foreground">Durée</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};