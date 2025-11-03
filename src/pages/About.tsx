import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Award, Users, Clock, Star, Heart, Palette, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Achievement {
  id: string;
  icon_name: string;
  value: string;
  label: string;
  sort_order: number;
}

interface Skill {
  id: string;
  skill_name: string;
  percentage: number;
  sort_order: number;
}

interface Service {
  id: string;
  title: string;
  description: string;
  specialties: string[];
  sort_order: number;
}

interface Content {
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
}

const About = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [heroContent, setHeroContent] = useState<Content | null>(null);
  const [ctaContent, setCtaContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [achievementsRes, skillsRes, servicesRes, contentRes] = await Promise.all([
        supabase.from('about_achievements').select('*').order('sort_order'),
        supabase.from('about_skills').select('*').order('sort_order'),
        supabase.from('about_services').select('*').order('sort_order'),
        supabase.from('about_content').select('*')
      ]);

      if (achievementsRes.data) setAchievements(achievementsRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (servicesRes.data) setServices(servicesRes.data);
      if (contentRes.data) {
        setHeroContent(contentRes.data.find(c => c.section_key === 'hero') || null);
        setCtaContent(contentRes.data.find(c => c.section_key === 'cta') || null);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = (message: string) => {
    const phoneNumber = "6282241590417";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    toast.success("Redirecting ke WhatsApp...");
    window.open(whatsappUrl, '_blank');
  };

  const iconMap: { [key: string]: any } = {
    Award, Users, Camera, Clock, Star, Heart, Palette, Zap
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 lg:mb-20">
          <div className="fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6">
              {heroContent?.title || 'Tentang'}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}Atha Studio
              </span>
            </h1>
            {heroContent?.subtitle && (
              <p className="text-xl font-semibold text-primary mb-4">{heroContent.subtitle}</p>
            )}
            <p className="text-lg lg:text-xl text-muted-foreground mb-6 lg:mb-8 leading-relaxed text-left">
              {heroContent?.description || 'Memuat konten...'}
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <Heart className="h-5 w-5 text-primary" />
                <span>Passionate dalam menangkap emosi autentik</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="h-5 w-5 text-primary" />
                <span>Komitmen memberikan kualitas terbaik</span>
              </div>
              <div className="flex items-center space-x-3">
                <Zap className="h-5 w-5 text-primary" />
                <span>Menggunakan teknologi fotografi modern</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => handleWhatsApp("Halo! Saya ingin booking sesi foto.")}
              >
                <Camera className="h-5 w-5" />
                Booking Sekarang
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => handleWhatsApp("Halo! Saya ingin melihat portfolio lengkap.")}
              >
                Lihat Portfolio
              </Button>
            </div>
          </div>

          <div className="slide-up">
            <div className="relative overflow-hidden lg:overflow-visible rounded-2xl">
              <img
                src="https://res.cloudinary.com/dfjvcvbsn/image/upload/v1754012379/514418398_1243307167528963_507092194719317945_n_kndack.jpg"
                alt="Photographer Portrait"
                className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute bottom-4 right-4 lg:-bottom-6 lg:-right-6 bg-primary text-primary-foreground p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16 lg:mb-20 fade-in">
          {achievements.map((achievement, index) => {
            const Icon = iconMap[achievement.icon_name] || Camera;
            return (
              <Card key={achievement.id} className="text-center hover:shadow-glow transition-all duration-300 hover:scale-105">
                <CardContent className="p-6">
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-foreground mb-2">{achievement.value}</div>
                  <div className="text-muted-foreground">{achievement.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Skills */}
        <div className="mb-16 lg:mb-20 slide-up">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12">
            Skill & Keahlian
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <div key={skill.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{skill.skill_name}</span>
                  <span className="text-primary font-semibold">{skill.percentage}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${skill.percentage}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="fade-in">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 lg:mb-12">
            Layanan Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = Camera; // Default icon untuk services
              return (
                <Card 
                  key={service.id} 
                  className="group hover:shadow-glow transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">{service.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {service.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="group-hover:bg-primary/10">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        {ctaContent && (
          <div className="text-center mt-16 lg:mt-20 p-6 lg:p-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              {ctaContent.title || 'Siap Memulai Proyek Fotografi?'}
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-6 lg:mb-8 max-w-2xl mx-auto">
              {ctaContent.description || 'Mari berkolaborasi untuk mengabadikan momen spesial Anda!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => handleWhatsApp("Halo! Saya ingin booking sesi foto.")}
              >
                <Camera className="h-5 w-5" />
                {ctaContent.button_text || 'Booking Sesi Foto'}
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default About;