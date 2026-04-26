import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { Shield, Clock, BarChart3, Users, CheckCircle, ArrowRight, MessageSquare, Search, FileText, Building2, Heart, Stethoscope, Sun, Moon } from 'lucide-react';
import heroImage from '@/assets/hero.png';

const fadeInUp = {
  initial: { opacity: 0, y: 24 } as const,
  whileInView: { opacity: 1, y: 0 } as const,
  viewport: { once: true, margin: '-40px' } as const,
  transition: { duration: 0.5 } as const,
};

const stagger = {
  initial: {} as const,
  whileInView: { transition: { staggerChildren: 0.1 } } as const,
  viewport: { once: true } as const,
};

const features = [
  { icon: FileText, title: 'Easy Submission', desc: 'Submit complaints with a simple, guided form in minutes.' },
  { icon: Search, title: 'Real-time Tracking', desc: 'Track your complaint status with a unique ticket ID anytime.' },
  { icon: Clock, title: 'Fast Resolution', desc: 'SLA-driven process ensures timely resolution of all complaints.' },
  { icon: Shield, title: 'Secure & Private', desc: 'Your data is protected with enterprise-grade security.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Admins get powerful dashboards and analytics to optimize operations.' },
  { icon: Users, title: 'Staff Management', desc: 'Assign, track, and manage staff workloads efficiently.' },
];

const steps = [
  { num: '01', title: 'Submit', desc: 'Fill out the complaint form with details about your concern.' },
  { num: '02', title: 'Track', desc: 'Receive a unique ticket ID and track progress in real-time.' },
  { num: '03', title: 'Resolve', desc: 'Our staff reviews, responds, and resolves your complaint.' },
];

const trustedBy = [
  { icon: Building2, name: 'MedCity Hospital' },
  { icon: Heart, name: 'CarePlus Health' },
  { icon: Stethoscope, name: 'LifeLine Medical' },
];

function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggle } = useTheme();
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className ?? 'rounded-xl shrink-0'}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      {/* Navbar */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 md:py-0 md:h-16 flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex items-center justify-between gap-4 min-w-0 md:justify-start md:shrink-0">
            <Link to="/" className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-xl bg-primary flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-base sm:text-lg text-foreground truncate">SmartCare</span>
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 md:hidden">
              <ThemeToggle className="rounded-xl h-9 w-9 shrink-0" />
              <Link to="/login">
                <Button variant="ghost" size="sm" className="rounded-xl">Sign in</Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="rounded-xl">Sign up</Button>
              </Link>
            </div>
          </div>
          <nav className="flex md:hidden justify-center gap-8 text-sm text-muted-foreground border-t border-border/50 pt-3">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
          </nav>
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          </nav>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <ThemeToggle className="rounded-xl" />
            <Link to="/login">
              <Button variant="ghost" className="rounded-xl">Sign in</Button>
            </Link>
            <Link to="/login">
              <Button className="rounded-xl">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — split layout with gradient bg */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50/40 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-100/50 to-transparent dark:from-blue-900/10 dark:to-transparent" />

        <div className="container mx-auto px-5 sm:px-8 md:px-10 lg:px-14 py-12 sm:py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <motion.h1
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Smart Hospital{' '}
                <span className="text-primary">Complaint</span>{' '}
                Management
              </motion.h1>

              <motion.p
                className="text-base md:text-lg text-muted-foreground mt-6 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Streamline patient complaints with real-time tracking, intelligent routing, and powerful analytics. Improve patient satisfaction and operational efficiency.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <Link to="/login" className="w-full sm:w-auto">
                  <Button size="lg" className="rounded-xl px-8 gap-2 w-full sm:w-auto">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto text-center sm:text-left">
                  <Button size="lg" variant="link" className="text-primary gap-1 w-full sm:w-auto">
                    How it works?
                  </Button>
                </a>
              </motion.div>

              {/* Trusted by strip */}
              <motion.div
                className="mt-14"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Trusted by leading hospitals</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6">
                  {trustedBy.map((t) => (
                    <div key={t.name} className="flex items-center gap-1.5 text-muted-foreground/60 min-w-0">
                      <t.icon className="w-4 h-4 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold truncate">{t.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right — hero (src/assets/hero.png) */}
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            >
              <img
                src={heroImage}
                alt="Doctor with SmartCare mobile health illustration"
                width={500}
                height={500}
                className="w-full max-w-xs sm:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto px-4 py-14 sm:py-20">
        <motion.div className="text-center mb-8 sm:mb-12" {...fadeInUp}>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground px-1">Why Choose SmartCare?</h2>
          <p className="text-muted-foreground mt-3">Everything you need to manage hospital complaints efficiently.</p>
        </motion.div>
        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" {...stagger}>
          {features.map((f, i) => (
            <motion.div key={f.title} variants={{ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } }} transition={{ delay: i * 0.08 }}>
              <Card className="rounded-2xl border-border hover:shadow-md transition-shadow hover:-translate-y-1 duration-300">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-muted/50 py-14 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-8 sm:mb-12" {...fadeInUp}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground px-1">How It Works</h2>
            <p className="text-muted-foreground mt-3">Three simple steps to resolve your complaint.</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto" {...stagger}>
            {steps.map((s, i) => (
              <motion.div key={s.num} className="text-center" variants={{ initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 } }} transition={{ delay: i * 0.15 }}>
                <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}