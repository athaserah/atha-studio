import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Camera, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Pricing = () => {
  const whatsappNumber = "6282241590417";
  
  const handleBooking = (serviceName: string, packageName: string, event?: React.MouseEvent) => {
    try {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Photography Services */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-8 lg:mb-12 fade-in">
            <div className="flex justify-center mb-4">
              <Camera className="h-10 w-10 lg:h-12 lg:w-12 text-primary" />
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-4">
              Layanan Fotografi
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Profesional
              </span>
            </h1>
            <p className="text-base lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Abadikan momen spesial Anda dengan hasil foto berkualitas tinggi. 
              Dari sesi foto personal hingga dokumentasi acara besar, kami memberikan layanan terbaik untuk kebutuhan Anda.
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
                    TERPOPULER
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
        <div className="mb-16 lg:mb-24 text-center">
          <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl lg:text-3xl">
                Butuh Konsultasi?
              </CardTitle>
              <CardDescription className="text-base lg:text-lg">
                Hubungi kami via WhatsApp untuk konsultasi gratis. Tim kami siap membantu Anda memilih paket yang sesuai dengan kebutuhan.
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
                Konsultasi via WhatsApp
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Pertanyaan Sering Ditanya</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                Bagaimana cara booking?
              </AccordionTrigger>
              <AccordionContent>
                Hubungi kami via WhatsApp atau form kontak. Setelah diskusi kebutuhan, kami akan kirim invoice dan setelah DP 30% dibayar, jadwal Anda terkonfirmasi.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Berapa lama hasil foto jadi?
              </AccordionTrigger>
              <AccordionContent>
                Basic (3-5 hari), Standard (7 hari), Premium (14 hari). Untuk urgent bisa request fast delivery dengan biaya tambahan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Apakah bisa request revisi?
              </AccordionTrigger>
              <AccordionContent>
                Ya! Basic: 1x revisi minor, Standard: 2x revisi, Premium: unlimited revisi.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                Apakah ada biaya transportasi?
              </AccordionTrigger>
              <AccordionContent>
                Untuk wilayah Yogyakarta gratis. Luar kota ada biaya transport yang akan diinformasikan saat booking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">
                Bagaimana sistem pembayaran?
              </AccordionTrigger>
              <AccordionContent>
                DP 30% untuk booking konfirmasi, pelunasan sebelum/saat hari H. Terima transfer bank, e-wallet, atau cash.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">
                File mentah bisa didapat?
              </AccordionTrigger>
              <AccordionContent>
                File mentah tidak kami berikan. Semua file edited Anda terima dalam resolusi tinggi untuk cetak.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-left">
                Apakah ada garansi?
              </AccordionTrigger>
              <AccordionContent>
                Garansi kepuasan 100%. Jika hasil tidak memuaskan, kami akan re-shoot gratis (terms & conditions apply).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-left">
                Apakah bisa custom paket sesuai budget?
              </AccordionTrigger>
              <AccordionContent>
                Tentu! Harga yang tertera adalah range standard. Kami dapat mendiskusikan dan menyesuaikan paket dengan budget dan kebutuhan Anda. Hubungi kami langsung via WhatsApp untuk konsultasi gratis.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
