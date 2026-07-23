'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Dumbbell, LayoutDashboard, Salad, MessageCircle, LineChart, Award, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/lib/types';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/dashboard/meals', label: 'Meals', icon: Salad },
  { href: '/dashboard/coach', label: 'AI Coach', icon: MessageCircle },
  { href: '/dashboard/progress', label: 'Progress', icon: LineChart },
  { href: '/dashboard/achievements', label: 'Achievements', icon: Award },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle().then(({ data }) => {
        if (data) setProfile(data as Profile);
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <div className="fixed top-0 z-40 flex w-full items-center justify-between glass px-4 py-3 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Dumbbell className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">snack2<span className="text-primary">sixpack</span></span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-30 h-full w-64 glass transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full flex-col p-4">
          <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2 pt-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">snack2<span className="text-primary">sixpack</span></span>
          </Link>
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border pt-4">
            <div className="mb-3 px-3">
              <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground">{profile?.goal ? profile.goal.replace('_', ' ') : 'Member'}</p>
            </div>
            <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="md:ml-64">
        <div className="min-h-screen px-4 py-6 pt-20 md:px-8 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
