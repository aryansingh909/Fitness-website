'use client';

import { useEffect, useState } from 'react';
import { Award, Flame, Trophy, Star, Target, Zap, Medal, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

const allBadges = [
  { key: 'first_workout', label: 'First Workout', desc: 'Complete your first workout', icon: Zap, color: 'text-primary' },
  { key: 'streak_7', label: '7-Day Streak', desc: 'Work out 7 days in a row', icon: Flame, color: 'text-accent' },
  { key: 'streak_30', label: '30-Day Streak', desc: 'Work out 30 days in a row', icon: Flame, color: 'text-destructive' },
  { key: 'first_meal', label: 'Meal Logger', desc: 'Log your first meal plan', icon: Trophy, color: 'text-chart-3' },
  { key: 'weight_logged', label: 'Scale Master', desc: 'Log your weight 10 times', icon: Target, color: 'text-chart-4' },
  { key: 'points_500', label: 'Point Hunter', desc: 'Earn 500 points', icon: Star, color: 'text-accent' },
  { key: 'points_1000', label: 'Fitness Champion', desc: 'Earn 1000 points', icon: Medal, color: 'text-primary' },
  { key: 'goal_done', label: 'Goal Crusher', desc: 'Reach your fitness goal', icon: Crown, color: 'text-accent' },
];

const leaderboard = [
  { name: 'Arjun M.', points: 2840, avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Sarah J.', points: 2210, avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Raj P.', points: 1980, avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'Emma W.', points: 1640, avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200' },
  { name: 'You', points: 0, avatar: '', isYou: true },
];

export default function AchievementsPage() {
  const { user } = useAuth();
  const [earned, setEarned] = useState<string[]>([]);
  const [profile, setProfile] = useState<{ streak: number; points: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: p } = await supabase.from('profiles').select('streak, points').eq('id', user.id).maybeSingle();
      if (p) setProfile(p as { streak: number; points: number });
      const { data: a } = await supabase.from('achievements').select('badge_key').eq('user_id', user.id);
      if (a) setEarned(a.map((x: { badge_key: string }) => x.badge_key));
    })();
  }, [user]);

  const earnedSet = new Set(earned);
  const myPoints = profile?.points || 0;
  leaderboard[4].points = myPoints;
  const sorted = [...leaderboard].sort((a, b) => b.points - a.points);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Achievements</h1>
        <p className="text-muted-foreground">Earn badges, build streaks, and climb the leaderboard.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="glass-card p-5">
          <Flame className="h-6 w-6 text-accent" />
          <p className="mt-2 text-2xl font-bold">{profile?.streak || 0}</p>
          <p className="text-sm text-muted-foreground">Day Streak</p>
        </Card>
        <Card className="glass-card p-5">
          <Trophy className="h-6 w-6 text-primary" />
          <p className="mt-2 text-2xl font-bold">{myPoints}</p>
          <p className="text-sm text-muted-foreground">Total Points</p>
        </Card>
        <Card className="glass-card p-5">
          <Award className="h-6 w-6 text-chart-3" />
          <p className="mt-2 text-2xl font-bold">{earnedSet.size}/{allBadges.length}</p>
          <p className="text-sm text-muted-foreground">Badges Earned</p>
        </Card>
      </div>

      {/* Badges */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Badges</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {allBadges.map((b) => {
            const has = earnedSet.has(b.key);
            return (
              <Card key={b.key} className={`glass-card p-5 text-center transition-all ${has ? 'glow border-primary' : 'opacity-60'}`}>
                <div className={`mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full ${has ? 'bg-primary/20' : 'bg-muted'}`}>
                  <b.icon className={`h-7 w-7 ${has ? b.color : 'text-muted-foreground'}`} />
                </div>
                <p className="font-medium">{b.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
                {has ? <Badge className="mt-3 bg-primary text-primary-foreground">Earned</Badge> : <Badge variant="secondary" className="mt-3">Locked</Badge>}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Leaderboard */}
      <Card className="glass-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Leaderboard</h2>
        </div>
        <div className="space-y-2">
          {sorted.map((entry, i) => (
            <div key={i} className={`flex items-center gap-4 rounded-lg p-3 ${entry.isYou ? 'border border-primary bg-primary/10' : 'border border-border'}`}>
              <span className={`w-8 text-center text-lg font-bold ${i === 0 ? 'text-accent' : i === 1 ? 'text-muted-foreground' : i === 2 ? 'text-chart-4' : 'text-muted-foreground'}`}>
                {i + 1}
              </span>
              {entry.avatar ? (
                <img src={entry.avatar} alt={entry.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">Y</div>
              )}
              <span className="flex-1 font-medium">{entry.name}</span>
              <span className="font-bold text-primary">{entry.points} pts</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Goal progress */}
      <Card className="glass-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Goal Progress</h2>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm"><span>Weekly workout goal</span><span>4/5 days</span></div>
            <Progress value={80} className="mt-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm"><span>Monthly streak goal</span><span>{profile?.streak || 0}/30 days</span></div>
            <Progress value={((profile?.streak || 0) / 30) * 100} className="mt-2" />
          </div>
          <div>
            <div className="flex justify-between text-sm"><span>Points to next badge</span><span>{myPoints}/500 pts</span></div>
            <Progress value={(myPoints / 500) * 100} className="mt-2" />
          </div>
        </div>
      </Card>
    </div>
  );
}
