import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, GraduationCap, MessageCircle, Star, Camera, Users } from "lucide-react";
import NewsletterSignup from "@/components/NewsletterSignup";
import { toast } from "sonner";

const PaketWisuda = () => {
  const whatsappNumber = "6282241590417";

  const handleBooking = (packageName: string) => {
    const message = `Halo! Saya tertarik dengan ${packageName}. Bisa kasih info lebih lanjut?`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Membuka WhatsApp...');
  };

  const packages = [
    {
      name: "Paket Solo",
      price: "150.000",
      description: "Perfect untuk foto wisuda personal",
      features: [
        "Durasi 30 menit",
        "1 lokasi (kampus)",
        "15 foto edited",
        "Resolusi Full HD",
        "File digital via Google Drive",
        "1x revisi minor"
      ],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      name: "Paket Keluarga",
      price: "300.000",
      originalPrice: "400.000",
      popular: true,
      description: "Foto bersama keluarga di hari spesial",
      features: [
        "Durasi 1 jam",
        "2 lokasi (kampus + outdoor)",
        "30 foto edited",
        "Resolusi 4K",
        "File digital + USB",
        "2x revisi",
        "Foto keluarga & solo"
      ],
      gradient: "from-purple-500 to-pink-500"
    },
    {
      name: "Paket Rombongan",
      price: "800.000",
      originalPrice: "1.200.000",
      description: "Untuk 5-10 orang, lebih hemat!",
      features: [
        "Durasi 2 jam",
        "3 lokasi pilihan",
        "50+ foto edited (semua orang dapat)",
        "Resolusi 4K",
        "File digital + USB untuk semua",
        "Unlimited revisi",
        "Foto solo, group, & candid",
        "Behind the scenes"
      ],
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const locations = [
    "Kampus (Gedung utama, perpustakaan, etc)",
    "Taman kampus",
    "Spot ikonik Yogyakarta (Tugu, Malioboro)",
    "Studio indoor (request)"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">
            Paket Foto Wisuda
            <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Musim Wisuda 2025
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Abadikan momen kebanggaan Anda dengan foto wisuda yang kece dan memorable! 
            Harga spesial untuk mahasiswa.
          </p>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold">Early Bird: Booking sekarang dapat diskon 20%!</span>
          </div>
        </div>

        {/* Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {packages.map((pkg) => (
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
                <CardDescription>{pkg.description}</CardDescription>
                <div className="space-y-1">
                  {pkg.originalPrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm line-through text-muted-foreground">
                        Rp {pkg.originalPrice}
                      </span>
                      <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                        PROMO
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-4xl font-bold text-primary">Rp {pkg.price}</span>
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
                  onClick={() => handleBooking(pkg.name)}
                >
                  <MessageCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Booking Sekarang
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Locations */}
        <section className="mb-16 bg-accent/5 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Pilihan Lokasi Foto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {locations.map((location, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-background p-4 rounded-lg">
                <Camera className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
                <span className="font-medium">{location}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground mt-6">
            *Lokasi bisa request sesuai keinginan, diskusi langsung via WhatsApp
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Kenapa Pilih Kami?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Berpengalaman</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sudah dokumentasi 500+ wisudawan dari berbagai kampus di Yogyakarta
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Camera className="h-10 w-10 text-accent mb-2" />
                <CardTitle>Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Hasil foto jadi dalam 2-3 hari, cocok untuk yang buru-buru pulang kampung
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Star className="h-10 w-10 text-destructive mb-2 fill-current" />
                <CardTitle>Harga Mahasiswa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Harga spesial ramah kantong mahasiswa dengan kualitas profesional
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Newsletter */}
        <div className="max-w-2xl mx-auto mb-16">
          <NewsletterSignup source="paket-wisuda" />
        </div>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-lg p-8">
          <h2 className="text-3xl font-bold mb-4">Booking Sekarang!</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Slot terbatas untuk setiap periode wisuda. Chat sekarang untuk reservasi jadwal Anda!
          </p>
          <Button size="lg" onClick={() => handleBooking("Paket Wisuda")}>
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat via WhatsApp
          </Button>
        </section>
      </main>
    </div>
  );
};

export default PaketWisuda;
