import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, Clock, DollarSign, Award, Heart } from "lucide-react";

const benefits = [
  {
    icon: Camera,
    title: "Peralatan Profesional",
    description: "Menggunakan kamera dan lensa berkualitas tinggi untuk hasil foto yang tajam dan detail",
    gradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: Users,
    title: "Tim Berpengalaman",
    description: "Fotografer profesional dengan pengalaman lebih dari 1 tahun di berbagai jenis acara",
    gradient: "from-purple-500/20 to-pink-500/20"
  },
  {
    icon: Clock,
    title: "Pengiriman Tepat Waktu",
    description: "Komitmen untuk mengirimkan hasil foto sesuai dengan timeline yang telah disepakati",
    gradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    icon: DollarSign,
    title: "Harga Terjangkau",
    description: "Paket fotografi berkualitas dengan harga yang kompetitif, mulai dari Rp 250.000",
    gradient: "from-amber-500/20 to-yellow-500/20"
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-section bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 badge-premium">
            <Award className="h-3 w-3 mr-1" />
            Keunggulan Kami
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Mengapa Memilih{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Atha Studio?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Komitmen kami adalah memberikan layanan fotografi terbaik dengan hasil yang memuaskan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 stagger-children">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={benefit.title}
                className="card-premium group h-full"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                
                <CardContent className="p-6 lg:p-8 relative h-full flex flex-col">
                  {/* Icon */}
                  <div className="icon-container mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon className="h-7 w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                    {benefit.description}
                  </p>

                  {/* Hover Arrow */}
                  <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="text-sm font-medium">Pelajari lebih lanjut</span>
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Stats */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { value: "100+", label: "Klien Puas", icon: Heart },
              { value: "500+", label: "Foto Diambil", icon: Camera },
              { value: "1+", label: "Tahun Pengalaman", icon: Award },
              { value: "100%", label: "Komitmen Kualitas", icon: Users },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={stat.label}
                  className="text-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:shadow-glow transition-all duration-300 group"
                >
                  <Icon className="h-6 w-6 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
