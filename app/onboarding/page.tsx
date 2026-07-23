'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dumbbell, User, Target, Activity, Apple, HeartPulse, ArrowRight, ArrowLeft, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { generateWorkoutPlan, generateMealPlan } from '@/lib/ai-generator';

const goals = [
  { key: 'fat_loss', label: 'Fat Loss', icon: '🔥' },
  { key: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
  { key: 'strength', label: 'Strength', icon: '⚡' },
  { key: 'maintenance', label: 'Maintenance', icon: '⚖️' },
];
const experiences = [
  { key: 'beginner', label: 'Beginner', desc: 'New to fitness' },
  { key: 'intermediate', label: 'Intermediate', desc: '1-2 years training' },
  { key: 'advanced', label: 'Advanced', desc: '3+ years training' },
];
const workoutTypes = [
  { key: 'gym', label: 'Gym', icon: '🏋️' },
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'no_equipment', label: 'No Equipment', icon: '🤸' },
];
const diets = [
  { key: 'vegetarian', label: 'Vegetarian', icon: '🥗' },
  { key: 'non_vegetarian', label: 'Non-Vegetarian', icon: '🍗' },
  { key: 'vegan', label: 'Vegan', icon: '🌱' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    age: '',
    gender: 'male',
    height_cm: '',
    weight_kg: '',
    goal: 'fat_loss',
    experience: 'beginner',
    workout_type: 'gym',
    diet: 'non_vegetarian',
    injuries: '',
  });
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) router.push('/signup');
  }, [user, loading, router]);

  const steps = ['Personal', 'Goal', 'Experience', 'Workout', 'Diet', 'Health'];

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = async () => {
    if (!user) return;
    setSaving(true);
    const profileData = {
      id: user.id,
      full_name: form.full_name,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      goal: form.goal,
      experience: form.experience,
      workout_type: form.workout_type,
      diet: form.diet,
      injuries: form.injuries || null,
    };
    const { error } = await supabase.from('profiles').upsert(profileData);
    if (error) {
      setSaving(false);
      return;
    }
    const workoutPlan = generateWorkoutPlan(profileData);
    await supabase.from('workouts').insert({ user_id: user.id, plan: workoutPlan });
    const mealPlan = generateMealPlan(profileData);
    await supabase.from('meals').insert({ user_id: user.id, plan: mealPlan });
    await supabase.from('subscriptions').insert({ user_id: user.id, plan: 'free', status: 'active' });
    router.push('/dashboard');
  };

  if (loading) return null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && <div className={`h-0.5 w-8 ${i < step ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <Card className="glass-card p-8 animate-fade-up">
          {step === 0 && (
            <div className="space-y-4">
              <div className="mb-4 flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Personal Details</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="25" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <div className="flex gap-2">
                    {['male', 'female', 'other'].map((g) => (
                      <Button key={g} type="button" variant={form.gender === g ? 'default' : 'outline'} size="sm" className="flex-1 capitalize" onClick={() => setForm({ ...form, gender: g })}>{g}</Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Height (cm)</Label>
                  <Input type="number" value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} placeholder="175" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Weight (kg)</Label>
                  <Input type="number" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} placeholder="70" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="mb-4 flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">What is Your Goal?</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {goals.map((g) => (
                  <button key={g.key} onClick={() => setForm({ ...form, goal: g.key })} className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${form.goal === g.key ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                    <span className="text-2xl">{g.icon}</span>
                    <span className="font-medium">{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="mb-4 flex items-center gap-3">
                <Activity className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Experience Level</h2>
              </div>
              <div className="space-y-3">
                {experiences.map((e) => (
                  <button key={e.key} onClick={() => setForm({ ...form, experience: e.key })} className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-all ${form.experience === e.key ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                    <div>
                      <p className="font-medium">{e.label}</p>
                      <p className="text-sm text-muted-foreground">{e.desc}</p>
                    </div>
                    {form.experience === e.key && <Check className="h-5 w-5 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="mb-4 flex items-center gap-3">
                <Dumbbell className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Workout Preference</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {workoutTypes.map((w) => (
                  <button key={w.key} onClick={() => setForm({ ...form, workout_type: w.key })} className={`flex flex-col items-center gap-2 rounded-xl border p-6 transition-all ${form.workout_type === w.key ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                    <span className="text-3xl">{w.icon}</span>
                    <span className="font-medium">{w.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="mb-4 flex items-center gap-3">
                <Apple className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Diet Preference</h2>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {diets.map((d) => (
                  <button key={d.key} onClick={() => setForm({ ...form, diet: d.key })} className={`flex flex-col items-center gap-2 rounded-xl border p-6 transition-all ${form.diet === d.key ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}>
                    <span className="text-3xl">{d.icon}</span>
                    <span className="font-medium">{d.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="mb-4 flex items-center gap-3">
                <HeartPulse className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Health & Limitations</h2>
              </div>
              <div className="space-y-2">
                <Label>Injuries or Limitations (optional)</Label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.injuries}
                  onChange={(e) => setForm({ ...form, injuries: e.target.value })}
                  placeholder="e.g. Lower back pain, knee injury, etc."
                />
                <p className="text-sm text-muted-foreground">This helps your AI coach customize exercises and avoid aggravating existing issues.</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Button variant="ghost" onClick={back} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {step < 5 ? (
              <Button onClick={next} className="glow">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={finish} className="glow" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate My Plan'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
