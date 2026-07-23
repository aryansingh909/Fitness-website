'use client';

import { useEffect, useState } from 'react';
import { Dumbbell, Check, RotateCw, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { WorkoutPlan, Profile } from '@/lib/types';
import { generateWorkoutPlan } from '@/lib/ai-generator';

export default function WorkoutsPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeDay, setActiveDay] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (p) setProfile(p as Profile);
      const { data: w } = await supabase.from('workouts').select('plan').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (w) setPlan(w.plan as WorkoutPlan);
    })();
  }, [user]);

  const toggleDone = (key: string) => setDone((d) => ({ ...d, [key]: !d[key] }));

  const regenerate = async () => {
    if (!user || !profile) return;
    setRegenerating(true);
    const newPlan = generateWorkoutPlan(profile);
    await supabase.from('workouts').insert({ user_id: user.id, plan: newPlan });
    setPlan(newPlan);
    setActiveDay(0);
    setDone({});
    setRegenerating(false);
  };

  const currentDay = plan?.days[activeDay];
  const dayDoneCount = currentDay ? currentDay.exercises.filter((_, i) => done[`${activeDay}-${i}`]).length : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Workout Plans</h1>
          <p className="text-muted-foreground">{plan?.title || 'Your personalized AI-generated training plan'}</p>
        </div>
        <Button onClick={regenerate} disabled={regenerating} variant="outline" className="gap-2">
          {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />} Regenerate Plan
        </Button>
      </div>

      {/* Day tabs */}
      {plan && (
        <div className="flex flex-wrap gap-2">
          {plan.days.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`rounded-lg border px-4 py-2 text-sm transition-all ${activeDay === i ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
            >
              {d.day}: {d.focus}
            </button>
          ))}
        </div>
      )}

      {currentDay ? (
        <Card className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">{currentDay.focus}</h2>
            </div>
            <Badge variant="secondary">{dayDoneCount}/{currentDay.exercises.length} done</Badge>
          </div>
          <div className="space-y-3">
            {currentDay.exercises.map((ex, i) => {
              const key = `${activeDay}-${i}`;
              const isDone = done[key];
              return (
                <div key={i} className={`rounded-xl border p-4 transition-all ${isDone ? 'border-primary bg-primary/5' : 'border-border'}`}>
                  <div className="flex gap-4">
                    <img src={ex.image} alt={ex.name} className="h-20 w-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className={`font-medium ${isDone ? 'line-through opacity-60' : ''}`}>{ex.name}</h3>
                        <button
                          onClick={() => toggleDone(key)}
                          className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all ${isDone ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}
                        >
                          {isDone && <Check className="h-4 w-4" />}
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">{ex.sets} sets</Badge>
                        <Badge variant="secondary">{ex.reps} reps</Badge>
                        <Badge variant="secondary">Rest {ex.rest}</Badge>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{ex.instructions}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {dayDoneCount === currentDay.exercises.length && (
            <div className="mt-4 rounded-xl border border-primary bg-primary/10 p-4 text-center">
              <p className="font-medium text-primary">Workout complete! +50 points earned.</p>
            </div>
          )}
        </Card>
      ) : (
        <Card className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No workout plan yet. Complete onboarding to generate your plan.</p>
        </Card>
      )}
    </div>
  );
}
