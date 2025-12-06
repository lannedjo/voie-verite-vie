import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area
import { Send, Bot, User, RefreshCw, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = useCallback(async (userMessage: Message, allMessages: Message[]) => {
    const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(chatUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: [...allMessages, userMessage] }),
      });

      if (!response.ok) return;

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
    } catch {
      // Silent error handling
    }
  }, [toast]);

  const handleSend = useCallback(async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading || !user) return;

    const userMessage: Message = { role: 'user', content: messageText };
    const currentMessages = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    await streamChat(userMessage, currentMessages);
    setIsLoading(false);
  }, [input, isLoading, user, messages, streamChat, toast]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  if (authLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden border">
      <CardHeader className="border-b p-3 md:p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Bot className="w-4 h-4 md:w-5 md:h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-primary text-sm md:text-base">Assistant Spirituel 3V</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Guidé par la foi catholique</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearChat} className="text-xs">
              <RefreshCw className="w-3 h-3 md:w-4 md:h-4 mr-1" />
              <span className="hidden sm:inline">Nouveau</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
        <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
          <div className="space-y-3 md:space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <Bot className="w-10 h-10 md:w-12 md:h-12 text-primary mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold text-primary mb-2">
                  {user ? `Bienvenue, ${user.email?.split('@')[0]} !` : 'Bienvenue !'}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm max-w-md mx-auto px-4">
                  Je suis votre assistant spirituel. Posez-moi vos questions sur la Bible, 
                  la théologie ou la vie chrétienne.
                </p>
                {!user && (
                  <p className="text-xs text-muted-foreground mt-4">
                    Connectez-vous pour commencer
                  </p>
                )}
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 md:gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="bg-primary rounded-lg w-7 h-7 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`rounded-lg p-2.5 md:p-3 max-w-[85%] md:max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-xs md:text-sm">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="bg-secondary rounded-lg w-7 h-7 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 md:gap-3 justify-start">
                <div className="bg-primary rounded-lg w-7 h-7 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-lg p-2.5 md:p-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-3 md:p-4 border-t flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={user ? "Posez votre question..." : "Connectez-vous..."}
              disabled={isLoading || !user}
              className="flex-1 text-sm"
            />
            <Button 
              onClick={() => handleSend()} 
              disabled={isLoading || !input.trim() || !user}
              size="sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
