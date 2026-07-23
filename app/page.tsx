'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Dumbbell,
  Salad,
  MessageCircle,
  LineChart,
  Flame,
  Users,
  Activity,
  Check,
  ArrowRight,
  Star,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

const features = [
  {
    icon: Dumbbell,
    title: 'AI Workout Generator',
    desc: 'Personalized training plans based on your age, height, weight, goal, fitness level, equipment, and injuries.',
    image: 'https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: Salad,
    title: 'AI Nutrition Planner',
    desc: 'Meal plans tailored to your calories, protein needs, budget, diet preference, allergies, and local foods.',
    image: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: MessageCircle,
    title: 'AI Fitness Chat Coach',
    desc: 'Ask about workouts, diet, motivation, or recovery. Your coach remembers your goals and adapts advice.',
    image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    icon: LineChart,
    title: 'Progress Tracking',
    desc: 'Track weight, measurements, calories, water, steps, workout history, photos, and achievements.',
    image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'Lost 12kg in 4 months',
    text: 'FitForge AI completely changed how I train. The AI workout plans adapted as I got stronger, and the meal plans fit my Indian vegetarian diet perfectly.',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Sarah Johnson',
    role: 'Gained 5kg lean muscle',
    text: 'The AI coach feels like a real personal trainer. It remembers my goals, adjusts my plan, and keeps me motivated every single day.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    name: 'Raj Patel',
    role: '180-day streak',
    text: 'The streak system and achievements keep me hooked. I have not missed a workout in 6 months. Best fitness app I have ever used.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

const pricing = [
  {
    name: 'Free',
    price: '₹0',
    period: 'forever',
    features: ['Basic workout generation', 'Basic meal plan', 'Limited AI messages', 'Progress tracking'],
    cta: 'Start Free',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '₹499',
    period: 'per month',
    features: [
      'Unlimited AI coach',
      'Advanced workout plans',
      'Nutrition adjustments',
      'Progress analytics',
      'Personalized recommendations',
      'Achievement badges',
    ],
    cta: 'Go Premium',
    highlight: true,
  },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full glass">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">FitForge<span className="text-primary">AI</span></span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</Link>
            <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
            <Link href="/login"><Button variant="ghost" size="sm">Log In</Button></Link>
            <Link href="/signup"><Button size="sm" className="glow">Get Started</Button></Link>
          </div>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-border px-4 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link href="/#features" onClick={() => setMenuOpen(false)}>Features</Link>
              <Link href="/#testimonials" onClick={() => setMenuOpen(false)}>Reviews</Link>
              <Link href="/#pricing" onClick={() => setMenuOpen(false)}>Pricing</Link>
              <Link href="/login" onClick={() => setMenuOpen(false)}><Button variant="ghost" className="w-full">Log In</Button></Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)}><Button className="w-full glow">Get Started</Button></Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <Badge variant="secondary" className="mb-6 gap-1.5">
                <Flame className="h-3.5 w-3.5 text-accent" /> AI-Powered Personal Training
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Your Personal <span className="text-gradient">AI Fitness Coach</span> That Evolves With You
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                Get personalized workouts, nutrition plans, and AI guidance designed around your body, goals, and lifestyle.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/signup">
                  <Button size="lg" className="w-full glow sm:w-auto gap-2">
                    Start Your Fitness Journey <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/#features">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">Explore Features</Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src="https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Fitness training"
                  className="h-[500px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass-card animate-float rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">AI Coach</p>
                    <p className="text-xs text-muted-foreground">Always with you</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Dumbbell, label: 'Plans Generated', value: 125000, suffix: '+' },
              { icon: Users, label: 'Active Users', value: 48000, suffix: '+' },
              { icon: Flame, label: 'Calories Tracked', value: 32, suffix: 'M+' },
            ].map((stat, i) => (
              <Card key={i} className="glass-card animate-fade-up p-6 text-center" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <stat.icon className="mx-auto mb-3 h-8 w-8 text-primary" />
                <p className="text-3xl font-bold text-gradient"><AnimatedNumber value={stat.value} suffix={stat.suffix} /></p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything You Need to <span className="text-gradient">Transform</span></h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">Four powerful AI-driven features that adapt to your body and evolve as you progress.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <Card key={i} className="glass-card group overflow-hidden p-0 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={f.image} alt={f.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                      <f.icon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold">{f.title}</h3>
                  </div>
                </div>
                <p className="p-6 text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Loved by <span className="text-gradient">Thousands</span></h2>
            <p className="mt-4 text-muted-foreground">Real results from real users.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i} className="glass-card animate-fade-up p-6" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mb-6 text-muted-foreground">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-primary">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Simple, <span className="text-gradient">Transparent</span> Pricing</h2>
            <p className="mt-4 text-muted-foreground">Start free. Upgrade when you are ready.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {pricing.map((p, i) => (
              <Card
                key={i}
                className={`glass-card relative p-8 animate-fade-up ${p.highlight ? 'glow border-primary' : ''}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {p.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">Most Popular</Badge>
                )}
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{p.price}</span>
                  <span className="text-muted-foreground">/{p.period}</span>
                </div>
                <ul className="mt-6 space-y-3">
                  {p.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button className={`mt-8 w-full ${p.highlight ? 'glow' : ''}`} variant={p.highlight ? 'default' : 'outline'}>
                    {p.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="glass-card glow p-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to <span className="text-gradient">Forge</span> Your Best Self?</h2>
            <p className="mt-4 text-muted-foreground">Join 48,000+ users transforming their bodies with AI coaching.</p>
            <Link href="/signup">
              <Button size="lg" className="mt-8 glow gap-2">
                Start Free Today <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Dumbbell className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">FitForge<span className="text-primary">AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 FitForge AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
