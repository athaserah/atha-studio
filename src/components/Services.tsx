import { Button } from "@/components/ui/button";
import { Camera, Check, MessageCircle, Crown, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Services = () => {
  const whatsappNumber = "6282241590417";
  
  const handleBooking = (serviceName: string, packageName: string, event?: React.MouseEvent) => {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (typeof window !== 'undefined') {
        import('@/utils/analytics').then(({ trackWhatsAppClick }) => {
          trackWhatsAppClick(serviceName, packageName, 'services_section');
        });
      }

      const message = `Halo! Saya tertarik dengan layanan ${serviceName} - Paket ${packageName}. Mohon informasi lebih lanjut mengenai paket ini.`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = whatsappUrl;
      } else {
        toast.success('Membuka WhatsApp...', {
          description: 'Anda akan diarahkan ke WhatsApp'
        });
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast.error('Gagal membuka WhatsApp', {
        description: 'Silakan coba lagi atau hubungi langsung ke 082241590417'
      });
    }
  };

  const photographyPackages = [
    {
      name: "Basic",
      price: "250.000",
      description: "Ideal untuk konten media sosial dan portfolio pribadi",
      features: [
        "Durasi sesi 1 jam",
        "1 lokasi pilihan",
        "20 foto edited",
        "Resolusi Full HD",
        "File digital via Google Drive",
        "Revisi minor 1x"
      ],
      popular: true,
      icon: Camera
    },
    {
      name: "Standard",
      price: "500.000",
      description: "Cocok untuk acara kecil dan dokumentasi spesial",
      features: [
        "Durasi sesi 2 jam",
        "2 lokasi pilihan",
        "50 foto edited",
        "Resolusi 4K",
        "File digital + USB branded",
        "Revisi 2x",
        "Bonus 10 foto filter vintage"
      ],
      popular: false,
      icon: Crown
    },
    {
      name: "Premium",
      price: "1.000.000",
      description: "Paket lengkap untuk acara besar dan produksi profesional",
      features: [
        "Durasi sesi full day (8 jam)",
        "Unlimited lokasi",
        "100+ foto edited",
        "Resolusi 6K RAW",
        "File digital + USB + Photobook",
        "Unlimited revisi",
        "Behind the scenes video",
        "2 photographer + assistant"
      ],
      popular: false,
      icon: Sparkles
    }
  ];

  return (
    <section className="py-section bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 badge-premium">
            <Camera className="h-3 w-3 mr-1" />
            Paket Layanan
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            Paket Fotografi{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Profesional
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Paket fotografi berkualitas tinggi untuk berbagai kebutuhan. 
            Dari sesi personal hingga dokumentasi acara besar, kami siap membantu.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          {photographyPackages.map((pkg, index) => {
            const Icon = pkg.icon;
            return (
              <Card 
                key={pkg.name}
                className={`relative overflow-hidden transition-all duration-500 card-3d group ${
                  pkg.popular 
                    ? 'border-2 border-primary shadow-glow scale-105 lg:scale-110 z-10' 
                    : 'border-border/50 hover:border-primary/30'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-0 left-0 right-0">
                    <div className="badge-popular text-center py-2">
                      <Crown className="h-4 w-4 inline mr-1" />
                      TERPOPULER
                    </div>
                  </div>
                )}
                
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                </div>
                
                <CardHeader className={`relative ${pkg.popular ? 'pt-12' : ''}`}>
                  {/* Icon */}
                  <div className={`icon-container w-16 h-16 mb-4 ${pkg.popular ? 'bg-primary text-primary-foreground' : ''}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  
                  <CardTitle className="text-2xl text-foreground">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                  
                  {/* Price */}
                  <div className="mt-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm text-muted-foreground">Rp</span>
                      <span className={`text-4xl lg:text-5xl font-bold ${pkg.popular ? 'text-primary' : 'text-foreground'}`}>
                        {pkg.price}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">per sesi</p>
                  </div>
                </CardHeader>
                
                <CardContent className="relative">
                  <ul className="space-y-4">
                    {pkg.features.map((feature, i) => (
                      <li key={feature} className="flex items-start gap-3 group/item">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300 ${
                          pkg.popular 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground'
                        }`}>
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="relative pt-6">
                  <Button 
                    className={`w-full group/btn h-12 text-base ${
                      pkg.popular 
                        ? 'bg-gradient-to-r from-primary to-accent hover:opacity-90' 
                        : ''
                    }`}
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={(e) => handleBooking("Photography", pkg.name, e)}
                  >
                    <MessageCircle className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform" />
                    Pesan Sekarang
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
            <CardContent className="relative p-8 lg:p-12 text-center">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Butuh Paket Custom?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Hubungi kami via WhatsApp untuk konsultasi gratis. Tim kami siap membantu Anda memilih paket yang sesuai dengan kebutuhan.
              </p>
              <Button 
                size="lg"
                className="group h-14 px-8 text-lg"
                onClick={(e) => handleBooking("Konsultasi", "Custom", e)}
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Konsultasi Gratis
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;
