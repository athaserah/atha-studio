import { Button } from "@/components/ui/button";
import { Camera, Check, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const Services = () => {
  const whatsappNumber = "6282241590417";
  
  const handleBooking = (serviceName: string, packageName: string, event?: React.MouseEvent) => {
    try {
      // Prevent default behavior and event bubbling
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const message = `Halo! Saya tertarik dengan jasa ${serviceName} - Paket ${packageName}. Bisa kasih info lebih lanjut?`;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      
      console.log('Opening WhatsApp URL:', whatsappUrl);
      
      // Try to open in new window
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Fallback if popup blocked
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        console.log('Popup blocked, using fallback method');
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
      description: "Perfect untuk konten media sosial dan portfolio pribadi",
      features: [
        "Durasi sesi 1 jam",
        "1 lokasi pilihan",
        "20 foto edited",
        "Resolusi Full HD",
        "File digital via Google Drive",
        "Revisi minor 1x"
      ],
      gradient: "from-blue-500 to-cyan-500",
      popular: false
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
      gradient: "from-purple-500 to-pink-500",
      popular: true
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
      gradient: "from-orange-500 to-red-500",
      popular: false
    }
  ];

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Photography Services */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-8 lg:mb-12 fade-in">
            <div className="flex justify-center mb-4">
              <Camera className="h-10 w-10 lg:h-12 lg:w-12 text-primary" />
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Jasa Photography
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Profesional & Kece!
              </span>
            </h2>
            <p className="text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Abadikan momen spesial lu dengan hasil foto yang bikin semua orang ngiri! 
              Dari sesi foto personal sampai dokumentasi acara besar, semua dikerjain dengan maksimal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {photographyPackages.map((pkg, index) => (
              <Card 
                key={pkg.name}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-glow ${
                  pkg.popular ? 'border-primary border-2' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    PALING LAKU
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${pkg.gradient}`} />
                
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Rp {pkg.price}</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full group"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={(e) => handleBooking("Photography", pkg.name, e)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Pesan via WhatsApp
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 lg:mt-24 text-center">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl lg:text-3xl">
                Masih Bingung Pilih Paket?
              </CardTitle>
              <CardDescription className="text-base lg:text-lg">
                Langsung aja chat gue di WhatsApp, kita diskusi paket mana yang paling cocok buat kebutuhan lu!
              </CardDescription>
            </CardHeader>
            <CardFooter className="justify-center">
              <Button 
                size="lg"
                variant="default"
                className="group"
                onClick={(e) => handleBooking("Konsultasi", "General", e)}
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Chat di WhatsApp Sekarang!
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Services;
