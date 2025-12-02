import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, Clock, DollarSign } from "lucide-react";

const benefits = [
  {
    icon: Camera,
    title: "Peralatan Profesional",
    description: "Menggunakan kamera dan lensa berkualitas tinggi untuk hasil foto yang tajam dan detail",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Tim Berpengalaman",
    description: "Fotografer profesional dengan pengalaman lebih dari 5 tahun di berbagai jenis acara",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    icon: Clock,
    title: "Pengiriman Tepat Waktu",
    description: "Komitmen untuk mengirimkan hasil foto sesuai dengan timeline yang telah disepakati",
    gradient: "from-orange-500 to-red-500"
  },
  {
    icon: DollarSign,
    title: "Harga Terjangkau",
    description: "Paket fotografi berkualitas dengan harga yang kompetitif, mulai dari Rp 250.000",
    gradient: "from-green-500 to-emerald-500"
  }
];

export const WhyChooseUs = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 fade-in">
          <Badge variant="outline" className="mb-4">
            <Camera className="h-3 w-3 mr-1" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={benefit.title}
                className="relative overflow-hidden group hover:shadow-glow transition-all duration-300 hover:-translate-y-2 slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <CardContent className="p-6 relative">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
