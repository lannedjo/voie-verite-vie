import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Send, User, Calendar, MessageCircle } from 'lucide-react';

interface PrayerRequest {
  id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  prayer_count: number;
  created_at: string;
  user_id: string | null;
  profiles?: { full_name: string | null } | null;
}

const PrayerForum = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrayerRequests();
  }, []);

  const fetchPrayerRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Fetch profiles separately for non-anonymous requests
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          if (!request.is_anonymous && request.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', request.user_id)
              .maybeSingle();
            return { ...request, profiles: profile };
          }
          return { ...request, profiles: null };
        })
      );
      
      setRequests(requestsWithProfiles);
    } catch (error) {
      console.error('Error fetching prayer requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour soumettre une demande de prière.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          is_anonymous: isAnonymous
        });

      if (error) throw error;

      toast({
        title: "Demande soumise",
        description: "Votre intention de prière a été partagée avec la communauté.",
      });

      setTitle('');
      setContent('');
      setIsAnonymous(false);
      fetchPrayerRequests();
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      toast({
        title: "Erreur",
        description: "Impossible de soumettre votre demande.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePray = async (requestId: string, currentCount: number) => {
    try {
      const { error } = await supabase
        .from('prayer_requests')
        .update({ prayer_count: currentCount + 1 })
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev => 
        prev.map(r => 
          r.id === requestId 
            ? { ...r, prayer_count: r.prayer_count + 1 }
            : r
        )
      );

      toast({
        title: "🙏 Merci pour votre prière",
        description: "Que Dieu bénisse cette intention.",
      });
    } catch (error) {
      console.error('Error updating prayer count:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <section className="py-8 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-4">
                Forum de Prière
              </h1>
              <p className="text-lg text-muted-foreground">
                Partagez vos intentions de prière et priez pour les autres membres de notre communauté
              </p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Submit Prayer Request */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl font-playfair text-primary flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Soumettre une intention de prière
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Titre de votre intention"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Décrivez votre intention de prière..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      rows={4}
                      maxLength={1000}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                    />
                    <label htmlFor="anonymous" className="text-sm text-muted-foreground">
                      Publier de manière anonyme
                    </label>
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? (
                      <span>Envoi en cours...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Partager mon intention
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Prayer Requests List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-playfair font-bold text-primary mb-4">
                Intentions de la communauté
              </h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : requests.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Aucune intention de prière pour le moment.</p>
                    <p className="text-sm">Soyez le premier à partager une intention.</p>
                  </CardContent>
                </Card>
              ) : (
                requests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg text-primary">{request.title}</h3>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {request.prayer_count}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                        {request.content}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {request.is_anonymous 
                              ? 'Anonyme' 
                              : request.profiles?.full_name || 'Membre'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(request.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePray(request.id, request.prayer_count)}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Je prie
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PrayerForum;
