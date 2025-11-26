import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessage: Message) => {
    const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
    
    try {
      // Get the session token for authenticated requests
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
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

  return (
    <Card className="h-full flex flex-col shadow-lg border-primary/20">
      <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-primary rounded-lg">
            <Bot className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-playfair">Assistant Spirituel IA</h2>
            <p className="text-xs text-muted-foreground font-normal">Posez vos questions sur la Bible et la foi</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                  <Bot className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Bienvenue !</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Je suis votre assistant spirituel. Posez-moi vos questions sur la Bible, la théologie chrétienne, ou demandez des conseils spirituels.
                </p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-in fade-in slide-in-from-bottom-4 duration-300`}
              >
                {message.role === 'assistant' && (
                  <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-5 h-5 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-[85%] shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted border border-border'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="bg-secondary rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="w-5 h-5 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="bg-muted border border-border rounded-2xl p-4 shadow-sm">
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
        <div className="p-4 border-t bg-muted/30">
          <div className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre question ici..."
              disabled={isLoading}
              className="flex-1 h-12 px-4 rounded-xl border-2 focus-visible:ring-primary"
            />
            <Button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()}
              size="lg"
              className="h-12 px-6 rounded-xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};