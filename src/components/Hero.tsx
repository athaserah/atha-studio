import { Button } from "@/components/ui/button";
import { Camera, Star, Award, Users, Image, User, Mail, Settings, Grid3X3 } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-photography.jpg";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import * as LucideIcons from "lucide-react";

interface HeroStat {
  id: string;
  icon_name: string;
  value: string;
  label: string;
  sort_order: number;
}

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
  const menuItems = [{
    href: "/gallery",
    label: "Galeri Kece",
    icon: Image,
    description: "Liat karya foto terbaik gue",
    color: "from-purple-500 to-pink-500"
  }, {
    href: "/about",
    label: "Tentang Gue",
    icon: User,
    description: "Kenalan sama fotografer kece ini",
    color: "from-blue-500 to-cyan-500"
  }, {
    href: "/contact",
    label: "Hit Me Up",
    icon: Mail,
    description: "Booking fotoan atau tanya-tanya",
    color: "from-green-500 to-emerald-500"
  }, {
    href: "/auth",
    label: "Masuk/Daftar",
    icon: Settings,
    description: "Login atau bikin akun baru",
    color: "from-orange-500 to-red-500"
  }];
  return <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img src={heroImage} alt="Professional Photography" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/95" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left fade-in">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-4 lg:mb-6">
                Abadikan Momen
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Kece Lu!
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 lg:mb-8 max-w-2xl mx-auto lg:mx-0">
                Jasa foto profesional yang bikin lu auto jadi sultan konten! 
                Dari portrait kece sampai website yang bikin branding lu naik level.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start mb-8 lg:mb-12">
                <Button variant="hero" size="lg" className="group w-full sm:w-auto">
                  <Camera className="h-5 w-5 group-hover:rotate-12 transition-transform duration-300 mr-2" />
                  Gas Booking Fotoan!
                </Button>
                <Button variant="premium" size="lg" className="w-full sm:w-auto" asChild>
                  <Link to="/gallery">
                    Liat Karya Gue
                  </Link>
                </Button>
              </div>

              {/* Stats - Mobile Optimized */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {loading ? (
                  <div className="col-span-2 lg:col-span-4 text-center text-muted-foreground">Loading...</div>
                ) : (
                  heroStats.map((stat, index) => {
                    const Icon = getIcon(stat.icon_name);
                    return <div key={stat.id} className="text-center group hover:scale-105 transition-transform duration-300 p-3 lg:p-0" style={{
                      animationDelay: `${index * 0.1}s`
                    }}>
                      <div className="flex justify-center mb-2">
                        <Icon className="h-6 w-6 lg:h-8 lg:w-8 text-primary group-hover:text-accent transition-colors duration-300" />
                      </div>
                      <div className="text-xl lg:text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
                    </div>;
                  })
                )}
              </div>
            </div>

            {/* Right Content - Services Preview (Hidden on mobile, shown on desktop) */}
            <div className="hidden lg:block slide-up">
              
            </div>
          </div>
        </div>

        {/* Floating elements - Responsive */}
        <div className="hidden sm:block absolute top-20 left-10 w-4 h-4 bg-primary rounded-full opacity-60 animate-pulse" />
        <div className="hidden sm:block absolute bottom-32 right-16 w-6 h-6 bg-accent rounded-full opacity-40 animate-pulse" style={{
        animationDelay: '1s'
      }} />
        <div className="hidden lg:block absolute top-1/2 right-20 w-3 h-3 bg-primary rounded-full opacity-50 animate-pulse" style={{
        animationDelay: '2s'
      }} />
      </section>

      {/* Menu Home Section - Mobile First */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex justify-center mb-4">
              <Grid3X3 className="h-8 w-8 lg:h-12 lg:w-12 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Jelajahi Semua Menu
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Website Kece Gue!
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Pilih menu yang lu mau, semua udah gue siapin buat experience terbaik!
            </p>
          </div>

          {/* Menu Grid - Mobile First Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {menuItems.map((item, index) => {
            const Icon = item.icon;
            return <Link key={item.href} to={item.href} className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:scale-105 hover:shadow-glow" style={{
              animationDelay: `${index * 0.1}s`
            }}>
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative p-6 lg:p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg lg:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          {item.label}
                        </h3>
                      </div>
                    </div>
                    
                    <p className="text-sm lg:text-base text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {item.description}
                    </p>
                    
                    {/* Hover Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary">→</span>
                      </div>
                    </div>
                  </div>
                </Link>;
          })}
          </div>

          {/* Mobile Services Preview - Only shown on mobile */}
          
        </div>
      </section>
    </>;
};
export default Hero;