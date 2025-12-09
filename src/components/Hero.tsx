import { Button } from "@/components/ui/button";
import { Camera, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-photography.jpg";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";

interface HeroStat {
  id: string;
  icon_name: string;
  value: string;
  label: string;
  sort_order: number;
}

// Counter Animation Component
const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          // Extract number from value
          const numMatch = value.match(/(\d+)/);
          if (numMatch) {
            const target = parseInt(numMatch[1]);
            const suffix = value.replace(/\d+/, '');
            let current = 0;
            const increment = target / 30;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setDisplayValue(value);
                clearInterval(timer);
              } else {
                setDisplayValue(Math.floor(current) + suffix);
              }
            }, 50);
          } else {
            setDisplayValue(value);
          }
        }
      },
      { threshold: 0.5 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);
  
  return (
    <div ref={ref} className="text-2xl lg:text-3xl font-bold text-foreground animate-count-up">
      {displayValue}
    </div>
  );
};

const Hero = () => {
  const [heroStats, setHeroStats] = useState<HeroStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_stats')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setHeroStats(data || []);
    } catch (error) {
      console.error('Error fetching hero stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? Icon : Camera;
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Professional Photography" 
          className="w-full h-full object-cover scale-105 animate-[float_20s_ease-in-out_infinite]" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/98 via-background/90 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Fotografer Profesional Jogja</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Abadikan Momen{" "}
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                  Berharga Anda
                </span>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Layanan fotografi profesional untuk wedding, portrait, dan dokumentasi acara spesial. 
              Hasil berkualitas tinggi dengan harga terjangkau mulai dari{" "}
              <span className="text-primary font-semibold">Rp 250.000</span>
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Button variant="hero" size="lg" className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  <Camera className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Konsultasi Gratis
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              <Button variant="premium" size="lg" className="group" asChild>
                <a href="https://athadiary.my.id" target="_blank" rel="noopener noreferrer">
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Lihat Portfolio
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="text-center p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50">
                    <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-muted animate-pulse" />
                    <div className="h-6 w-16 mx-auto mb-1 rounded bg-muted animate-pulse" />
                    <div className="h-4 w-20 mx-auto rounded bg-muted animate-pulse" />
                  </div>
                ))
              ) : (
                heroStats.map((stat, index) => {
                  const Icon = getIcon(stat.icon_name);
                  return (
                    <div 
                      key={stat.id} 
                      className="text-center group p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
                      style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                    >
                      <div className="flex justify-center mb-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                          <Icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                        </div>
                      </div>
                      <AnimatedCounter value={stat.value} label={stat.label} />
                      <div className="text-xs lg:text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Content - Floating Photo Gallery */}
          <div className="hidden lg:block relative h-[600px] animate-fade-in" style={{ animationDelay: '0.5s' }}>
            {/* Main Photo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-background animate-float z-20">
              <img 
                src={heroImage} 
                alt="Featured Work" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            </div>
            
            {/* Secondary Photos */}
            <div className="absolute top-8 left-8 w-48 h-64 rounded-2xl overflow-hidden shadow-xl border-2 border-background animate-float z-10" style={{ animationDelay: '1s' }}>
              <img 
                src={heroImage} 
                alt="Work Sample" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            
            <div className="absolute bottom-8 right-8 w-44 h-56 rounded-2xl overflow-hidden shadow-xl border-2 border-background animate-float z-10" style={{ animationDelay: '2s' }}>
              <img 
                src={heroImage} 
                alt="Work Sample" 
                className="w-full h-full object-cover opacity-80"
              />
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 right-1/4 w-20 h-20 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
            <div className="absolute bottom-1/4 left-0 w-16 h-16 rounded-full bg-accent/20 blur-xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
            
            {/* Badge */}
            <div className="absolute bottom-1/3 right-0 bg-card/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-border/50 animate-float z-30" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Camera className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Hasil Profesional</p>
                  <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
