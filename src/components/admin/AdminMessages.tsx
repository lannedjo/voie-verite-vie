import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, MessageSquare, Mail, Eye, Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  type: string;
  subject: string;
  message: string;
  created_at: string;
}

export const AdminMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      question: 'Question',
      adhesion: 'Adhésion',
      activite: 'Activité',
      don: 'Don',
      temoignage: 'Témoignage',
      autre: 'Autre',
    };
    return types[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      question: 'bg-blue-500/10 text-blue-700',
      adhesion: 'bg-green-500/10 text-green-700',
      activite: 'bg-purple-500/10 text-purple-700',
      don: 'bg-yellow-500/10 text-yellow-700',
      temoignage: 'bg-pink-500/10 text-pink-700',
      autre: 'bg-gray-500/10 text-gray-700',
    };
    return colors[type] || 'bg-gray-500/10 text-gray-700';
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-primary mb-2">Messages de contact</h2>
          <p className="text-muted-foreground">Gérez les messages reçus via le formulaire de contact</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Messages ({filteredMessages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun message trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Expéditeur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sujet</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{msg.name}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {msg.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(msg.type)}>
                          {getTypeLabel(msg.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {msg.subject || 'Sans sujet'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedMessage(msg)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Détail du message</DialogTitle>
                              </DialogHeader>
                              {selectedMessage && (
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground">De</p>
                                    <p className="font-medium">{selectedMessage.name}</p>
                                    <p className="text-sm">{selectedMessage.email}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <Badge className={getTypeColor(selectedMessage.type)}>
                                      {getTypeLabel(selectedMessage.type)}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Sujet</p>
                                    <p className="font-medium">{selectedMessage.subject || 'Sans sujet'}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Message</p>
                                    <p className="mt-1 p-3 bg-muted rounded-lg whitespace-pre-wrap">
                                      {selectedMessage.message}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-muted-foreground">Reçu le</p>
                                    <p>{new Date(selectedMessage.created_at).toLocaleString('fr-FR')}</p>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteMessage(msg.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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