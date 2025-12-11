import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, Clock, DollarSign, Award, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
const benefits = [{
  icon: Camera,
  title: "Peralatan Profesional",
  description: "Menggunakan kamera dan lensa berkualitas tinggi untuk hasil foto yang tajam dan detail",
  gradient: "from-blue-500/20 to-cyan-500/20"
}, {
  icon: Users,
  title: "Tim Berpengalaman",
  description: "Fotografer profesional dengan pengalaman lebih dari 1 tahun di berbagai jenis acara",
  gradient: "from-purple-500/20 to-pink-500/20"
}, {
  icon: Clock,
  title: "Pengiriman Tepat Waktu",
  description: "Komitmen untuk mengirimkan hasil foto sesuai dengan timeline yang telah disepakati",
  gradient: "from-green-500/20 to-emerald-500/20"
}, {
  icon: DollarSign,
  title: "Harga Terjangkau",
  description: "Paket fotografi berkualitas dengan harga yang kompetitif, mulai dari Rp 250.000",
  gradient: "from-amber-500/20 to-yellow-500/20"
}];

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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        // Extract number from value
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
    }, {
      threshold: 0.3
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);
  return <div ref={ref} className="text-3xl lg:text-4xl font-bold text-foreground">
      {displayValue}
    </div>;
};
export const WhyChooseUs = () => {
  return <section className="py-section bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{
        animationDelay: '2s'
      }} />
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
          return <Card key={benefit.title} className="card-premium gradient-border group h-full relative overflow-hidden" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`} />
                
                <CardContent className="p-6 lg:p-8 relative h-full flex flex-col">
                  {/* Icon with bounce animation on hover */}
                  <div className="mb-6 relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="h-7 w-7 text-primary group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                    </div>
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
              </Card>;
        })}
        </div>

        {/* Trust Stats with Counter Animation */}
        <div className="mt-20 animate-fade-in" style={{
        animationDelay: '0.5s'
      }}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[{
            value: "100+",
            label: "Klien Puas",
            icon: Heart
          }, {
            value: "500+",
            label: "Foto Diambil",
            icon: Camera
          }, {
            value: "1+",
            label: "Tahun Pengalaman",
            icon: Award
          }, {
            value: "100%",
            label: "Komitmen Kualitas",
            icon: Users
          }].map((stat, index) => {
            const Icon = stat.icon;
            return;
          })}
          </div>
        </div>
      </div>
    </section>;
};