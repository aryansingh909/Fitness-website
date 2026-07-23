'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Plus, Loader2, Camera, Ruler } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { Profile, ProgressEntry } from '@/lib/types';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';

export default function ProgressPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ weight_kg: '', calories: '', water_ml: '', steps: '', chest_cm: '', waist_cm: '', hip_cm: '', note: '' });

  const load = async () => {
    if (!user) return;
    const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    if (p) setProfile(p as Profile);
    const { data: e } = await supabase.from('progress_entries').select('*').eq('user_id', user.id).order('logged_at', { ascending: true });
    if (e) setEntries(e as ProgressEntry[]);
  };

  useEffect(() => { load(); }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from('progress_entries').insert({
      user_id: user.id,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      calories: form.calories ? parseInt(form.calories) : null,
      water_ml: form.water_ml ? parseInt(form.water_ml) : null,
      steps: form.steps ? parseInt(form.steps) : null,
      chest_cm: form.chest_cm ? parseFloat(form.chest_cm) : null,
      waist_cm: form.waist_cm ? parseFloat(form.waist_cm) : null,
      hip_cm: form.hip_cm ? parseFloat(form.hip_cm) : null,
      note: form.note || null,
    });
    setForm({ weight_kg: '', calories: '', water_ml: '', steps: '', chest_cm: '', waist_cm: '', hip_cm: '', note: '' });
    setShowForm(false);
    setSaving(false);
    load();
  };

  const weightData = entries.filter((e) => e.weight_kg).map((e) => ({ date: e.logged_at, weight: Number(e.weight_kg) }));
  const calorieData = entries.filter((e) => e.calories).map((e) => ({ date: e.logged_at, calories: e.calories }));
  const latest = entries[entries.length - 1];
  const bmi = profile?.height_cm && latest?.weight_kg ? (Number(latest.weight_kg) / Math.pow(profile.height_cm / 100, 2)).toFixed(1) : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Progress Tracking</h1>
          <p className="text-muted-foreground">Track your transformation over time.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2 glow">
          <Plus className="h-4 w-4" /> Log Entry
        </Button>
      </div>

      {showForm && (
        <Card className="glass-card p-6 animate-fade-up">
          <h3 className="mb-4 font-semibold">New Progress Entry</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2"><Label>Weight (kg)</Label><Input type="number" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} /></div>
            <div className="space-y-2"><Label>Calories</Label><Input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} /></div>
            <div className="space-y-2"><Label>Water (ml)</Label><Input type="number" value={form.water_ml} onChange={(e) => setForm({ ...form, water_ml: e.target.value })} /></div>
            <div className="space-y-2"><Label>Steps</Label><Input type="number" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} /></div>
            <div className="space-y-2"><Label>Chest (cm)</Label><Input type="number" value={form.chest_cm} onChange={(e) => setForm({ ...form, chest_cm: e.target.value })} /></div>
            <div className="space-y-2"><Label>Waist (cm)</Label><Input type="number" value={form.waist_cm} onChange={(e) => setForm({ ...form, waist_cm: e.target.value })} /></div>
            <div className="space-y-2"><Label>Hip (cm)</Label><Input type="number" value={form.hip_cm} onChange={(e) => setForm({ ...form, hip_cm: e.target.value })} /></div>
            <div className="space-y-2"><Label>Note</Label><Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Feeling great!" /></div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={save} disabled={saving} className="glow">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Entry'}</Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card p-5">
          <div className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /><span className="text-sm text-muted-foreground">Current Weight</span></div>
          <p className="mt-2 text-2xl font-bold">{latest?.weight_kg ? `${latest.weight_kg} kg` : '—'}</p>
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center gap-2"><Ruler className="h-5 w-5 text-chart-3" /><span className="text-sm text-muted-foreground">BMI</span></div>
          <p className="mt-2 text-2xl font-bold">{bmi || '—'}</p>
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center gap-2"><Camera className="h-5 w-5 text-accent" /><span className="text-sm text-muted-foreground">Entries Logged</span></div>
          <p className="mt-2 text-2xl font-bold">{entries.length}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Weight Trend</h3>
          {weightData.length > 1 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="weight" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#wGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="flex h-[250px] items-center justify-center text-muted-foreground">Log weight entries to see your trend.</p>}
        </Card>
        <Card className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Calorie Intake</h3>
          {calorieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Bar dataKey="calories" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="flex h-[250px] items-center justify-center text-muted-foreground">Log calories to see your intake.</p>}
        </Card>
      </div>

      {/* History */}
      <Card className="glass-card p-6">
        <h3 className="mb-4 font-semibold">Entry History</h3>
        {entries.length > 0 ? (
          <div className="space-y-2">
            {entries.slice().reverse().map((e) => (
              <div key={e.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
                <Badge variant="secondary">{e.logged_at}</Badge>
                {e.weight_kg && <span className="text-sm">{e.weight_kg} kg</span>}
                {e.calories && <span className="text-sm">{e.calories} cal</span>}
                {e.water_ml && <span className="text-sm">{e.water_ml} ml water</span>}
                {e.steps && <span className="text-sm">{e.steps} steps</span>}
                {e.waist_cm && <span className="text-sm">W: {e.waist_cm}cm</span>}
                {e.note && <span className="text-sm text-muted-foreground">— {e.note}</span>}
              </div>
            ))}
          </div>
        ) : <p className="text-muted-foreground">No entries yet. Click &ldquo;Log Entry&rdquo; to start tracking.</p>}
      </Card>
    </div>
  );
}
