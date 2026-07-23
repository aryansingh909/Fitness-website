'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flame, Dumbbell, Salad, TrendingUp, Award, Droplets, Footprints, ArrowRight, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { Profile, WorkoutPlan, MealPlan, ProgressEntry } from '@/lib/types';
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from 'recharts';

export default function DashboardHome() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [meals, setMeals] = useState<MealPlan | null>(null);
  const [progress, setProgress] = useState<ProgressEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (p) setProfile(p as Profile);
      const { data: w } = await supabase.from('workouts').select('plan').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (w) setWorkout(w.plan as WorkoutPlan);
      const { data: m } = await supabase.from('meals').select('plan').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (m) setMeals(m.plan as MealPlan);
      const { data: pr } = await supabase.from('progress_entries').select('*').eq('user_id', user.id).order('logged_at', { ascending: true }).limit(14);
      if (pr) setProgress(pr as ProgressEntry[]);
    })();
  }, [user]);

  const todayWorkout = workout?.days[0];
  const todayMeals = meals?.meals || [];
  const caloriesConsumed = todayMeals.reduce((sum, m) => sum + m.calories, 0);
  const proteinConsumed = todayMeals.reduce((sum, m) => sum + m.protein, 0);
  const calorieTarget = meals?.daily_target || 2000;
  const proteinTarget = profile ? Math.round((profile.weight_kg || 70) * 1.8) : 126;

  const weightData = progress
    .filter((p) => p.weight_kg)
    .map((p) => ({ date: p.logged_at, weight: Number(p.weight_kg) }));

  const bmi = profile?.height_cm && profile?.weight_kg
    ? (profile.weight_kg / Math.pow(profile.height_cm / 100, 2)).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Welcome back, {profile?.full_name || 'Athlete'}!</h1>
          <p className="text-muted-foreground">Here is your fitness overview for today.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <Flame className="h-4 w-4 text-accent" /> {profile?.streak || 0} day streak
          </Badge>
          <Badge variant="secondary" className="gap-1.5">
            <Trophy className="h-4 w-4 text-primary" /> {profile?.points || 0} points
          </Badge>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Calories</p>
            <Flame className="h-5 w-5 text-accent" />
          </div>
          <p className="mt-2 text-2xl font-bold">{caloriesConsumed} <span className="text-sm text-muted-foreground">/ {calorieTarget}</span></p>
          <Progress value={(caloriesConsumed / calorieTarget) * 100} className="mt-3" />
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Protein</p>
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">{proteinConsumed}g <span className="text-sm text-muted-foreground">/ {proteinTarget}g</span></p>
          <Progress value={(proteinConsumed / proteinTarget) * 100} className="mt-3" />
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">BMI</p>
            <TrendingUp className="h-5 w-5 text-chart-3" />
          </div>
          <p className="mt-2 text-2xl font-bold">{bmi || '—'}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {bmi ? (Number(bmi) < 18.5 ? 'Underweight' : Number(bmi) < 25 ? 'Healthy' : Number(bmi) < 30 ? 'Overweight' : 'Obese') : 'Log your weight'}
          </p>
        </Card>
        <Card className="glass-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Water</p>
            <Droplets className="h-5 w-5 text-chart-3" />
          </div>
          <p className="mt-2 text-2xl font-bold">2.0L <span className="text-sm text-muted-foreground">/ 3.0L</span></p>
          <Progress value={66} className="mt-3" />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's workout */}
        <Card className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Today&apos;s Workout</h2>
            </div>
            <Link href="/dashboard/workouts"><Button variant="ghost" size="sm" className="gap-1">View all <ArrowRight className="h-3 w-3" /></Button></Link>
          </div>
          {todayWorkout ? (
            <div>
              <p className="mb-3 font-medium text-primary">{todayWorkout.focus}</p>
              <div className="space-y-2">
                {todayWorkout.exercises.slice(0, 4).map((ex, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <img src={ex.image} alt={ex.name} className="h-12 w-12 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{ex.name}</p>
                      <p className="text-xs text-muted-foreground">{ex.sets} sets × {ex.reps} • Rest {ex.rest}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No workout plan yet. Complete onboarding to generate one.</p>
          )}
        </Card>

        {/* Today's meals */}
        <Card className="glass-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Salad className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Today&apos;s Meals</h2>
            </div>
            <Link href="/dashboard/meals"><Button variant="ghost" size="sm" className="gap-1">View all <ArrowRight className="h-3 w-3" /></Button></Link>
          </div>
          <div className="space-y-2">
            {todayMeals.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <img src={m.image} alt={m.name} className="h-12 w-12 rounded-md object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.calories} cal • {m.protein}g protein</p>
                </div>
                <Badge variant="secondary">{m.type}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weight chart + quick stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Weight Progress</h2>
          </div>
          {weightData.length > 1 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="weight" stroke="hsl(var(--chart-1))" strokeWidth={2} fill="url(#weightGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-muted-foreground">
              <p>Log your weight to see progress.</p>
            </div>
          )}
        </Card>

        <Card className="glass-card p-6">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Weekly Summary</h2>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm"><span>Workouts</span><span className="font-medium">4/5</span></div>
              <Progress value={80} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm"><span>Calorie goal</span><span className="font-medium">{Math.round((caloriesConsumed / calorieTarget) * 100)}%</span></div>
              <Progress value={(caloriesConsumed / calorieTarget) * 100} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm"><span>Steps</span><span className="font-medium flex items-center gap-1"><Footprints className="h-3 w-3" /> 7,420</span></div>
              <Progress value={74} className="mt-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm"><span>Goal completion</span><span className="font-medium">35%</span></div>
              <Progress value={35} className="mt-2" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
