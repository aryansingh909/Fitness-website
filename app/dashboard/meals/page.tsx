'use client';

import { useEffect, useState } from 'react';
import { Salad, RotateCw, Loader2, Flame, Beef, Wheat, Droplet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { MealPlan, Profile, Meal } from '@/lib/types';
import { generateMealPlan } from '@/lib/ai-generator';

const replacementMeals: Meal[] = [
  { name: 'Protein Smoothie', type: 'Snack', calories: 240, protein: 25, carbs: 28, fats: 5, image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Whey, banana, spinach, almond milk, blend.' },
  { name: 'Chicken Salad', type: 'Lunch', calories: 450, protein: 38, carbs: 25, fats: 18, image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Grilled chicken, mixed greens, olive oil dressing.' },
  { name: 'Oatmeal Bowl', type: 'Breakfast', calories: 350, protein: 12, carbs: 55, fats: 9, image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Oats, almond milk, berries, honey, nuts.' },
  { name: 'Veggie Stir-Fry', type: 'Dinner', calories: 480, protein: 18, carbs: 60, fats: 16, image: 'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg?auto=compress&cs=tinysrgb&w=600', recipe: 'Mixed veggies, tofu, soy sauce, brown rice.' },
];

export default function MealsPage() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [replacingIdx, setReplacingIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (p) setProfile(p as Profile);
      const { data: m } = await supabase.from('meals').select('plan').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (m) setPlan(m.plan as MealPlan);
    })();
  }, [user]);

  const regenerate = async () => {
    if (!user || !profile) return;
    setRegenerating(true);
    const newPlan = generateMealPlan(profile);
    await supabase.from('meals').insert({ user_id: user.id, plan: newPlan });
    setPlan(newPlan);
    setRegenerating(false);
  };

  const replaceMeal = (idx: number) => {
    if (!plan) return;
    const replacement = replacementMeals[Math.floor(Math.random() * replacementMeals.length)];
    const newMeals = [...plan.meals];
    newMeals[idx] = replacement;
    setPlan({ ...plan, meals: newMeals });
    setReplacingIdx(null);
  };

  const totalCalories = plan?.meals.reduce((s, m) => s + m.calories, 0) || 0;
  const totalProtein = plan?.meals.reduce((s, m) => s + m.protein, 0) || 0;
  const totalCarbs = plan?.meals.reduce((s, m) => s + m.carbs, 0) || 0;
  const totalFats = plan?.meals.reduce((s, m) => s + m.fats, 0) || 0;
  const target = plan?.daily_target || 2000;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Meal Plans</h1>
          <p className="text-muted-foreground">Your personalized AI nutrition plan</p>
        </div>
        <Button onClick={regenerate} disabled={regenerating} variant="outline" className="gap-2">
          {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCw className="h-4 w-4" />} Regenerate Plan
        </Button>
      </div>

      {/* Macros summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2"><Flame className="h-4 w-4 text-accent" /><span className="text-sm text-muted-foreground">Calories</span></div>
          <p className="mt-1 text-xl font-bold">{totalCalories}<span className="text-xs text-muted-foreground"> / {target}</span></p>
          <Progress value={(totalCalories / target) * 100} className="mt-2" />
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2"><Beef className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">Protein</span></div>
          <p className="mt-1 text-xl font-bold">{totalProtein}g</p>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2"><Wheat className="h-4 w-4 text-chart-3" /><span className="text-sm text-muted-foreground">Carbs</span></div>
          <p className="mt-1 text-xl font-bold">{totalCarbs}g</p>
        </Card>
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2"><Droplet className="h-4 w-4 text-chart-4" /><span className="text-sm text-muted-foreground">Fats</span></div>
          <p className="mt-1 text-xl font-bold">{totalFats}g</p>
        </Card>
      </div>

      {/* Meals */}
      {plan && (
        <div className="space-y-4">
          {plan.meals.map((m, i) => (
            <Card key={i} className="glass-card overflow-hidden p-0">
              <div className="flex flex-col sm:flex-row">
                <img src={m.image} alt={m.name} className="h-48 w-full object-cover sm:h-auto sm:w-48" />
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">{m.type}</Badge>
                      <h3 className="text-lg font-semibold">{m.name}</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => replaceMeal(i)} className="gap-1">
                      <RotateCw className="h-3 w-3" /> Replace
                    </Button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <span className="text-muted-foreground">{m.calories} cal</span>
                    <span className="text-primary">{m.protein}g protein</span>
                    <span className="text-chart-3">{m.carbs}g carbs</span>
                    <span className="text-chart-4">{m.fats}g fats</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{m.recipe}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
