import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Sparkles, BookOpen, Heart, Cross, Lightbulb, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedQuestions = [
  { icon: BookOpen, text: "Qu'est-ce que la Lectio Divina ?" },
  { icon: Heart, text: "Comment développer ma vie de prière ?" },
  { icon: Cross, text: "Que dit la Bible sur le pardon ?" },
  { icon: Lightbulb, text: "Comment résister aux tentations ?" },
];

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: Message) => {
    const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Non authentifié",
          description: "Veuillez vous connecter pour utiliser l'assistant IA",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Limite atteinte",
            description: "Trop de requêtes, veuillez réessayer plus tard.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Crédits insuffisants",
            description: "Crédits IA insuffisants.",
            variant: "destructive",
          });
          return;
        }
        throw new Error('Erreur lors de la connexion à l\'IA');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';
      let textBuffer = '';

      if (!reader) throw new Error('Impossible de lire la réponse');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, content: assistantMessage } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantMessage }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error streaming chat:', error);
      toast({
        title: "Erreur",
        description: "Impossible de communiquer avec l'assistant IA",
        variant: "destructive",
      });
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await streamChat(userMessage);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden bg-gradient-to-b from-card to-card/95 shadow-2xl border-2 border-primary/10">
      {/* Header élégant */}
      <CardHeader className="border-b bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
                <Bot className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-playfair font-bold text-primary flex items-center gap-2">
                Assistant Spirituel
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </h2>
              <p className="text-sm text-muted-foreground">Guidé par la foi catholique</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-primary">
              <RefreshCw className="w-4 h-4 mr-1" />
              Nouvelle discussion
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                {/* Welcome Message */}
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                  <div className="relative p-6 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full">
                    <Bot className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-playfair font-bold text-primary mb-2">
                  {user ? `Bienvenue, ${user.email?.split('@')[0]} !` : 'Bienvenue !'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  Je suis votre assistant spirituel, ici pour vous guider dans votre cheminement de foi. 
                  Posez-moi vos questions sur la Bible, la théologie ou la vie chrétienne.
                </p>

                {/* Suggested Questions */}
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Suggestions de questions :</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-xl mx-auto">
                    {suggestedQuestions.map((q, index) => {
                      const Icon = q.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSend(q.text)}
                          className="justify-start gap-2 text-left h-auto py-3 px-4 hover:bg-primary/5 hover:border-primary/30 transition-all"
                        >
                          <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{q.text}</span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {message.role === 'assistant' && (
                  <div className="relative flex-shrink-0">
                    <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl w-10 h-10 flex items-center justify-center shadow-md">
                      <Bot className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-[85%] shadow-md ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-sm'
                      : 'bg-muted/80 border border-border/50 rounded-bl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="bg-secondary rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="bg-muted/80 border border-border/50 rounded-2xl rounded-bl-sm p-4 shadow-md">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t bg-gradient-to-r from-muted/50 to-muted/30">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question spirituelle..."
                disabled={isLoading}
                className="h-12 px-4 pr-12 rounded-xl border-2 border-border/50 focus-visible:ring-primary focus-visible:border-primary/50 bg-background/80 backdrop-blur-sm"
              />
              <Badge variant="secondary" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs hidden md:flex">
                Entrée ↵
              </Badge>
            </div>
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim()}
              size="lg"
              className="h-12 px-5 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};