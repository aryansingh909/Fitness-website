'use client';

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, Loader2, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { Profile, ChatMessage } from '@/lib/types';
import { generateCoachReply } from '@/lib/ai-generator';

export default function CoachPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (p) setProfile(p as Profile);
      const { data: msgs } = await supabase.from('chat_messages').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
      if (msgs) {
        const mapped = msgs.map((m: { id: string; role: string; content: string; created_at: string }) => ({ ...m, role: m.role as 'user' | 'coach' })) as ChatMessage[];
        if (mapped.length === 0) {
          mapped.push({ id: 'welcome', role: 'coach', content: `Hi ${p?.full_name || 'there'}! I'm your AI fitness coach. Ask me anything about workouts, nutrition, recovery, or motivation.`, created_at: new Date().toISOString() });
        }
        setMessages(mapped);
      }
    })();
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !user) return;
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: input, created_at: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);

    await supabase.from('chat_messages').insert({ user_id: user.id, role: 'user', content: userMsg.content });

    const reply = generateCoachReply(userMsg.content, profile || {});
    const coachMsg: ChatMessage = { id: crypto.randomUUID(), role: 'coach', content: reply, created_at: new Date().toISOString() };
    setMessages((m) => [...m, coachMsg]);
    setSending(false);

    await supabase.from('chat_messages').insert({ user_id: user.id, role: 'coach', content: reply });
  };

  const suggestions = ['How do I lose fat faster?', 'What should I eat before a workout?', 'I feel demotivated today', 'How do I recover from soreness?'];

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">AI Fitness Coach</h1>
        <p className="text-muted-foreground">Your personal coach that remembers your goals and evolves with you.</p>
      </div>

      <Card className="glass-card flex h-[600px] flex-col p-0">
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'coach' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'glass border border-border'}`}>
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="glass flex items-center gap-1 rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => setInput(s)} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Ask your coach anything..." className="flex-1" />
            <Button onClick={send} disabled={sending || !input.trim()} className="glow gap-2">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
