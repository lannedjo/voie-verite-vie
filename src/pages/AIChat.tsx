import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Mic, MicOff, Paperclip, Trash2, MessageSquare, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Message { role: 'user' | 'assistant'; content: string; }
interface Conversation { id: string; title: string | null; created_at: string; }

const AIChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!user) navigate('/auth'); else loadConversations(); }, [user, navigate]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const loadConversations = async () => {
    if (!user) return;
    const { data } = await supabase.from('ai_conversations').select('id, title, created_at').eq('user_id', user.id).order('updated_at', { ascending: false }).limit(10);
    setConversations(data || []);
  };

  const loadMessages = async (conversationId: string) => {
    const { data } = await supabase.from('ai_messages').select('role, content').eq('conversation_id', conversationId).order('created_at', { ascending: true });
    setMessages((data || []) as Message[]);
    setCurrentConversationId(conversationId);
    setShowSidebar(false);
  };

  const createNewConversation = async () => {
    if (!user) return null;
    const { data } = await supabase.from('ai_conversations').insert({ user_id: user.id, title: 'Nouvelle conversation' }).select().single();
    if (!data) return null;
    await loadConversations();
    return data.id;
  };

  const saveMessage = async (conversationId: string, role: string, content: string) => {
    await supabase.from('ai_messages').insert({ conversation_id: conversationId, role, content });
    if (role === 'user') {
      await supabase.from('ai_conversations').update({ title: content.substring(0, 50), updated_at: new Date().toISOString() }).eq('id', conversationId);
    }
  };

  const deleteConversation = async (id: string) => {
    await supabase.from('ai_messages').delete().eq('conversation_id', id);
    await supabase.from('ai_conversations').delete().eq('id', id);
    if (currentConversationId === id) { setCurrentConversationId(null); setMessages([]); }
    await loadConversations();
    toast({ title: "Conversation supprimée" });
  };

  const streamChat = async (userMessage: Message, convId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.access_token}` },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      if (!response.ok) { toast({ title: "Erreur", variant: "destructive" }); return; }
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '', textBuffer = '';
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, idx); textBuffer = textBuffer.slice(idx + 1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const content = JSON.parse(jsonStr).choices?.[0]?.delta?.content;
            if (content) { assistantMessage += content; setMessages(prev => { const last = prev[prev.length - 1]; return last?.role === 'assistant' ? prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantMessage } : m) : [...prev, { role: 'assistant', content: assistantMessage }]; }); }
          } catch { break; }
        }
      }
      if (assistantMessage) await saveMessage(convId, 'assistant', assistantMessage);
    } catch { toast({ title: "Erreur", variant: "destructive" }); }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    let convId = currentConversationId || await createNewConversation();
    if (!convId) return;
    setCurrentConversationId(convId);
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]); setInput(''); setIsLoading(true);
    await saveMessage(convId, 'user', input);
    await streamChat(userMessage, convId);
    await loadConversations(); setIsLoading(false);
  };

  const toggleRecording = async () => {
    if (isRecording) { mediaRecorderRef.current?.stop(); setIsRecording(false); }
    else { try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const mr = new MediaRecorder(stream); mr.onstop = () => { stream.getTracks().forEach(t => t.stop()); toast({ title: "Audio enregistré" }); }; mr.start(); mediaRecorderRef.current = mr; setIsRecording(true); } catch { toast({ title: "Erreur microphone", variant: "destructive" }); } }
  };

  const newChat = useCallback(() => { setCurrentConversationId(null); setMessages([]); setShowSidebar(false); }, []);

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="border-b p-3 flex items-center justify-between bg-card">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}><ArrowLeft className="w-5 h-5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setShowSidebar(!showSidebar)} className="md:hidden"><MessageSquare className="w-5 h-5" /></Button>
          <div className="p-2 bg-primary rounded-lg"><Bot className="w-5 h-5 text-primary-foreground" /></div>
          <div><h1 className="font-semibold text-primary text-sm">Assistant Spirituel 3V</h1></div>
        </div>
        <Button variant="outline" size="sm" onClick={newChat}><Plus className="w-4 h-4 mr-1" />Nouveau</Button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-56 border-r bg-muted/30 overflow-y-auto`}>
          <div className="p-2 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground mb-2">Conversations</p>
            {conversations.map(c => (
              <div key={c.id} className={`flex items-center gap-2 p-2 rounded cursor-pointer group ${currentConversationId === c.id ? 'bg-primary/10' : 'hover:bg-muted'}`} onClick={() => loadMessages(c.id)}>
                <MessageSquare className="w-4 h-4 flex-shrink-0" /><span className="text-xs truncate flex-1">{c.title || 'Sans titre'}</span>
                <Button variant="ghost" size="icon" className="h-5 w-5 opacity-0 group-hover:opacity-100" onClick={e => { e.stopPropagation(); deleteConversation(c.id); }}><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="max-w-2xl mx-auto space-y-3">
              {messages.length === 0 && <div className="text-center py-12"><Bot className="w-12 h-12 text-primary mx-auto mb-3" /><h3 className="font-semibold text-primary mb-1">Bienvenue !</h3><p className="text-muted-foreground text-sm">Posez vos questions sur la Bible et la foi.</p></div>}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'assistant' && <div className="bg-primary rounded w-7 h-7 flex items-center justify-center"><Bot className="w-4 h-4 text-primary-foreground" /></div>}
                  <div className={`rounded-lg p-3 max-w-[80%] text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}><p className="whitespace-pre-wrap">{m.content}</p></div>
                  {m.role === 'user' && <div className="bg-secondary rounded w-7 h-7 flex items-center justify-center"><User className="w-4 h-4" /></div>}
                </div>
              ))}
              {isLoading && <div className="flex gap-2"><div className="bg-primary rounded w-7 h-7 flex items-center justify-center"><Bot className="w-4 h-4 text-primary-foreground" /></div><div className="bg-muted rounded-lg p-3"><div className="flex gap-1"><div className="w-2 h-2 bg-primary rounded-full animate-bounce" /><div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} /><div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} /></div></div></div>}
            </div>
          </ScrollArea>
          <div className="border-t p-3 bg-card">
            <div className="max-w-2xl mx-auto flex gap-2">
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={() => toast({ title: "Fichier sélectionné" })} />
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="w-5 h-5" /></Button>
              <Button variant={isRecording ? "destructive" : "ghost"} size="icon" onClick={toggleRecording}>{isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}</Button>
              <Input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} placeholder="Posez votre question..." disabled={isLoading} className="flex-1" />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
