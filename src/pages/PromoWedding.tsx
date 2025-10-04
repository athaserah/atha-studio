import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Heart, MessageCircle, Camera, Video, Gift } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { toast } from "sonner";

const PromoWedding = () => {
  const whatsappNumber = "6282241590417";

  const handleBooking = () => {
    const message = "Halo! Saya tertarik dengan Paket Wedding Promo. Bisa kasih info lebih lanjut?";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Membuka WhatsApp...');
  };

  const packages = [
    {
      name: "Paket Akad Nikah",
      originalPrice: "2.500.000",
      promoPrice: "1.999.000",
      savings: "500K",
      features: [
        "Durasi 4 jam",
        "2 fotografer profesional",
        "200+ foto edited",
        "Video cinematic 3-5 menit",
        "Hasil dalam 7 hari kerja",
        "Online gallery + USB",
        "Free makeup consultation"
      ],
      gradient: "from-pink-500 to-rose-500"
    },
    {
      name: "Paket Resepsi",
      originalPrice: "4.500.000",
      promoPrice: "3.499.000",
      savings: "1JT",
      popular: true,
      features: [
        "Durasi 6 jam",
        "3 fotografer + videografer",
        "400+ foto edited",
        "Video cinematic 8-10 menit",
        "Same day edit",
        "Hasil dalam 10 hari kerja",
        "Album foto 20x30cm (20 halaman)",
        "Online gallery + USB",
        "Drone coverage"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Paket Full Wedding",
      originalPrice: "7.000.000",
      promoPrice: "5.499.000",
      savings: "1.5JT",
      features: [
        "Full day coverage (Akad + Resepsi)",
        "4 fotografer + 2 videografer",
        "600+ foto edited",
        "Video cinematic 15-20 menit",
        "Same day edit",
        "Behind the scenes",
        "Hasil dalam 14 hari kerja",
        "Album foto premium (30 halaman)",
        "Free prewedding session",
        "Drone coverage",
        "Unlimited revisi"
      ],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const bonuses = [
    "Free konsultasi vendor (makeup, dekorasi, catering)",
    "Free posing guide & mood board",
    "Foto cetak 10x15cm (50 lembar)",
    "E-invitation design template",
    "Timeline & checklist pernikahan"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-primary fill-current animate-pulse" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Promo Wedding
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Hemat Hingga 1.5 Juta!
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Dokumentasikan hari paling spesial dalam hidup Anda dengan hasil profesional dan harga promo terbaik!
          </p>
          <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-6 py-3 rounded-full">
            <Gift className="w-5 h-5" />
            <span className="font-bold">Promo terbatas! Hanya untuk 10 pasangan pertama bulan ini</span>
          </div>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {packages.map((pkg, index) => (
            <Card 
              key={pkg.name}
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-glow ${
                pkg.popular ? 'border-primary border-2' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold z-10">
                  PALING LAKU
                </div>
              )}
              
              <div className={`h-2 bg-gradient-to-r ${pkg.gradient}`} />
              
              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm line-through text-muted-foreground">Rp {pkg.originalPrice}</span>
                    <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                      Hemat {pkg.savings}
                    </span>
                  </div>
                  <div>
                    <span className="text-4xl font-bold text-primary">Rp {pkg.promoPrice}</span>
                  </div>
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
                  onClick={handleBooking}
                >
                  <MessageCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Booking Sekarang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Bonuses */}
        <section className="mb-16 bg-primary/5 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            Bonus Spesial
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {bonuses.map((bonus, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-background p-4 rounded-lg">
                <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <span className="font-medium">{bonus}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Why Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Kenapa Pilih Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Camera className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Tim Berpengalaman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Fotografer & videografer profesional dengan pengalaman 100+ wedding
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Video className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Kualitas Terjamin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Peralatan profesional & teknik editing terbaik untuk hasil maksimal
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-destructive mb-2" />
                <CardTitle>100% Kepuasan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Garansi unlimited revisi hingga Anda benar-benar puas
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Newsletter */}
        <div className="max-w-2xl mx-auto mb-16">
          <NewsletterSignup source="promo-wedding" />
        </div>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Jangan Lewatkan Promo Ini!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Slot terbatas! Hubungi kami sekarang untuk booking dan konsultasi gratis
          </p>
          <Button size="lg" onClick={handleBooking}>
            <MessageCircle className="w-5 h-5 mr-2" />
            Booking via WhatsApp
          </Button>
        </section>
      </main>
    </div>
  );
};

export default PromoWedding;
