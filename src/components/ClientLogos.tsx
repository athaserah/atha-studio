import { Card } from "@/components/ui/card";
import { Award, Users, Camera, Sparkles } from "lucide-react";

const ClientLogos = () => {
  const trustBadges = [
    {
      icon: Camera,
      value: "500+",
      label: "Klien Puas",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Award,
      value: "5+",
      label: "Tahun Pengalaman",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      value: "1000+",
      label: "Foto Dihasilkan",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      value: "100%",
      label: "Kepuasan Terjamin",
      color: "from-orange-500 to-red-500"
    }
  ];

  const testimonialHighlights = [
    {
      quote: "Hasil foto sangat memuaskan dan profesional",
      author: "Wedding Client"
    },
    {
      quote: "Pelayanan cepat dan ramah, hasil melebihi ekspektasi",
      author: "Corporate Event"
    },
    {
      quote: "Fotografer terbaik untuk acara wisuda!",
      author: "Graduation Package"
    }
  ];

  return (
    <section className="py-12 lg:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="text-center mb-8 lg:mb-12">
          <p className="text-sm font-medium text-muted-foreground mb-2">DIPERCAYA OLEH RATUSAN KLIEN</p>
          <h2 className="text-2xl lg:text-3xl font-bold">
            Komitmen Kami untuk
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Kualitas</span>
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <Card 
                key={index}
                className="p-6 text-center hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${badge.color} mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2">{badge.value}</div>
                <div className="text-sm text-muted-foreground">{badge.label}</div>
              </Card>
            );
          })}
        </div>

        {/* Quick Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonialHighlights.map((testimonial, index) => (
            <Card key={index} className="p-4 bg-card/50 backdrop-blur-sm">
              <p className="text-sm italic mb-2">"{testimonial.quote}"</p>
              <p className="text-xs text-muted-foreground">— {testimonial.author}</p>
            </Card>
          ))}
        </div>

        {/* Professional Guarantee Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
            <Award className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Garansi Kepuasan 100% atau Uang Kembali</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
