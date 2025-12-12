import { Button } from "@/components/ui/button";
import { Camera, Calendar, Sparkles } from "lucide-react";
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
const AnimatedCounter = ({
  value,
  label
}: {
  value: string;
  label: string;
}) => {
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const numMatch = value.match(/(\d+)/);
          if (numMatch) {
            const target = parseInt(numMatch[1]);
            const suffix = value.replace(/\d+/, '');
            let current = 0;
            const increment = target / 40;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                setDisplayValue(value);
                clearInterval(timer);
              } else {
                setDisplayValue(Math.floor(current) + suffix);
              }
            }, 40);
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
    <div ref={ref} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground animate-count-up font-display">
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

  const handleWhatsApp = () => {
    const message = "Halo! Saya ingin menjadwalkan sesi foto.";
    const whatsappUrl = `https://wa.me/6282241590417?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Cinematic Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Professional Photography" 
          className="w-full h-full object-cover scale-110 animate-[float_25s_ease-in-out_infinite]" 
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      </div>

      {/* Animated Background Elements - Subtle */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary tracking-wide">Fotografer Profesional Jogja</span>
            </div>
            
            {/* Cinematic Headline */}
            <h1 className="heading-hero font-display mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              <span className="block text-foreground">Mengabadikan</span>
              <span className="block text-foreground">Momen Berharga</span>
              <span className="block mt-3">
                <span className="gradient-text">
                  Tanpa Penyesalan
                </span>
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: '0.25s' }}>
              Layanan fotografi profesional untuk wedding, portrait, dan dokumentasi acara spesial Anda. 
              Hasil berkualitas tinggi mulai dari{" "}
              <span className="text-primary font-semibold">Rp 250.000</span>
            </p>
            
            {/* CTA Buttons - Premium */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-14 animate-fade-in" style={{ animationDelay: '0.35s' }}>
              <Button 
                size="lg" 
                className="group h-14 px-8 text-base btn-glow bg-gradient-to-r from-primary to-accent hover:opacity-95"
                onClick={handleWhatsApp}
              >
                <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Jadwalkan Sesi Anda
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="group h-14 px-8 text-base border-border/50 hover:border-primary/50 hover:bg-primary/5" 
                asChild
              >
                <a href="https://athadiary.my.id" target="_blank" rel="noopener noreferrer">
                  <Camera className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Lihat Portfolio
                </a>
              </Button>
            </div>

            {/* Stats - Premium Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.45s' }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="stat-card">
                      <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-muted/50 animate-pulse" />
                      <div className="h-7 w-16 mx-auto mb-2 rounded bg-muted/50 animate-pulse" />
                      <div className="h-4 w-20 mx-auto rounded bg-muted/50 animate-pulse" />
                    </div>
                  ))
                : heroStats.map((stat, index) => {
                    const Icon = getIcon(stat.icon_name);
                    return (
                      <div
                        key={stat.id}
                        className="stat-card group"
                        style={{ animationDelay: `${0.55 + index * 0.1}s` }}
                      >
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                            <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                          </div>
                        </div>
                        <AnimatedCounter value={stat.value} label={stat.label} />
                        <div className="text-xs sm:text-sm text-muted-foreground mt-2">{stat.label}</div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Premium */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-7 h-12 rounded-full border-2 border-primary/40 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-primary/60 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
