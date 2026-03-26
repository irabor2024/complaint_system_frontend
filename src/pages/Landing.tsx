import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Shield, Clock, BarChart3, MessageSquare, CheckCircle, FileText, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: FileText, title: 'Easy Submission', description: 'Submit complaints quickly with our simple form. No account required.' },
  { icon: Clock, title: 'Real-time Tracking', description: 'Track your complaint status in real-time using your unique ticket ID.' },
  { icon: MessageSquare, title: 'Direct Communication', description: 'Receive responses and updates directly from hospital staff.' },
  { icon: Shield, title: 'Secure & Private', description: 'Your information is protected with enterprise-grade security.' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Administrators can analyze trends and improve hospital services.' },
  { icon: CheckCircle, title: 'Quick Resolution', description: 'Our dedicated team works to resolve complaints efficiently.' },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-info/5 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6"
          >
            <Activity className="h-4 w-4" />
            Smart Hospital Complaint Management
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
          >
            Your Voice Matters.<br />
            <span className="text-primary">We Listen & Act.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Submit, track, and resolve hospital complaints efficiently. Our smart system ensures every concern is heard and addressed promptly.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/submit-complaint">
              <Button size="lg" className="text-base px-8 h-12">
                <FileText className="mr-2 h-5 w-5" />
                Submit a Complaint
              </Button>
            </Link>
            <Link to="/track">
              <Button variant="outline" size="lg" className="text-base px-8 h-12">
                <Clock className="mr-2 h-5 w-5" />
                Track Complaint
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <Link to="/staff" className="hover:text-primary transition-colors">Staff Login →</Link>
            <Link to="/admin" className="hover:text-primary transition-colors">Admin Login →</Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Our complaint management system is designed to make the process simple, transparent, and efficient.</p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={itemVariants}>
                <motion.div whileHover={{ y: -6, boxShadow: '0 12px 24px -8px hsl(var(--primary) / 0.12)' }} transition={{ type: 'spring', stiffness: 300 }}>
                  <Card className="shadow-sm border-border/50 h-full">
                    <CardContent className="p-6">
                      <motion.div
                        className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4"
                        whileHover={{ rotate: 8, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <f.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: '2,500+', label: 'Complaints Resolved' },
              { value: '98%', label: 'Satisfaction Rate' },
              { value: '<48h', label: 'Avg. Resolution Time' },
              { value: '24/7', label: 'Support Available' },
            ].map((s, i) => (
              <motion.div key={i} variants={itemVariants}>
                <p className="text-3xl md:text-4xl font-bold">{s.value}</p>
                <p className="text-sm mt-1 opacity-80">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
