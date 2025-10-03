import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pricingPackages = [
  {
    name: "Paket Basic",
    price: "500K - 1JT",
    description: "Cocok untuk foto wisuda, family photo, atau event kecil",
    features: [
      "Durasi 1-2 jam",
      "1 fotografer profesional",
      "50-100 foto edited",
      "Hasil dalam 3-5 hari kerja",
      "Free konsultasi",
      "Online gallery"
    ],
    popular: false,
    services: ["Wisuda", "Family Photo", "Event Kecil"]
  },
  {
    name: "Paket Premium",
    price: "1.5JT - 3JT",
    description: "Untuk prewedding, birthday party, atau event bisnis",
    features: [
      "Durasi 3-4 jam",
      "2 fotografer profesional",
      "150-250 foto edited",
      "Video cinematic 1-2 menit",
      "Hasil dalam 7-10 hari kerja",
      "Free konsultasi & mood board",
      "Online gallery + USB",
      "1x revisi minor"
    ],
    popular: true,
    services: ["Prewedding", "Birthday", "Corporate Event"]
  },
  {
    name: "Paket Wedding",
    price: "3JT - 8JT",
    description: "Dokumentasi lengkap hari spesial Anda",
    features: [
      "Full day coverage",
      "3-4 fotografer & videografer",
      "400+ foto edited",
      "Video cinematic 5-10 menit",
      "Same day edit",
      "Hasil dalam 14 hari kerja",
      "Album foto premium (opsional)",
      "Free prewedding session",
      "Unlimited revisi",
      "Drone shot (tergantung lokasi)"
    ],
    popular: false,
    services: ["Wedding", "Engagement", "Akad & Resepsi"]
  },
  {
    name: "Website UMKM",
    price: "2JT - 5JT",
    description: "Website profesional untuk bisnis Anda",
    features: [
      "Desain custom & responsive",
      "Domain & hosting 1 tahun",
      "5-10 halaman",
      "SEO optimization",
      "Google Maps integration",
      "WhatsApp integration",
      "Admin panel",
      "Free maintenance 3 bulan",
      "Free konsultasi branding"
    ],
    popular: false,
    services: ["Landing Page", "Company Profile", "E-Commerce"]
  }
];

const addOns = [
  "Foto cetak ukuran besar (mulai dari 100K)",
  "Album foto premium (mulai dari 500K)",
  "Video extended cut (300K/menit tambahan)",
  "Makeup artist (mulai dari 500K)",
  "Dekorasi tambahan (custom)",
  "Drone coverage (500K - 1JT)"
];

const faqs = [
  {
    q: "Bagaimana cara booking?",
    a: "Hubungi kami via WhatsApp atau form kontak. Setelah diskusi kebutuhan, kami akan kirim invoice dan setelah DP 30% dibayar, jadwal Anda terkonfirmasi."
  },
  {
    q: "Berapa lama hasil foto jadi?",
    a: "Tergantung paket: Basic (3-5 hari), Premium (7-10 hari), Wedding (14 hari). Untuk urgent bisa request fast editing dengan biaya tambahan."
  },
  {
    q: "Apakah bisa request revisi?",
    a: "Ya! Paket Basic: konsultasi sebelum sesi. Paket Premium: 1x revisi minor. Paket Wedding: unlimited revisi untuk memastikan Anda 100% puas."
  },
  {
    q: "Apakah ada biaya transportasi?",
    a: "Untuk wilayah Yogyakarta gratis. Luar kota akan ada biaya transport yang akan diinformasikan saat booking."
  },
  {
    q: "Bagaimana sistem pembayaran?",
    a: "DP 30% untuk booking konfirmasi, pelunasan sebelum/saat hari H. Terima transfer bank, e-wallet, atau cash."
  },
  {
    q: "File mentah bisa didapat?",
    a: "File mentah tidak kami berikan. Kami deliver hasil edited terbaik. Semua file edited Anda terima dalam resolusi tinggi untuk cetak."
  }
];

const Pricing = () => {
  const handleWhatsAppClick = (packageName: string) => {
    const message = encodeURIComponent(
      `Halo, saya tertarik dengan ${packageName}. Bisa info lebih lanjut?`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Paket & Harga
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Pilih paket yang sesuai dengan kebutuhan Anda. Harga bisa disesuaikan dengan budget dan permintaan khusus.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-semibold">Promo Bulan Ini: Diskon 15% untuk booking sebelum akhir bulan!</span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPackages.map((pkg) => (
            <Card 
              key={pkg.name} 
              className={`relative ${pkg.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Paling Populer
                  </span>
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{pkg.price}</span>
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-6 pt-4 border-t">
                  <p className="text-xs text-muted-foreground mb-2">Cocok untuk:</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.services.map((service, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                  onClick={() => handleWhatsAppClick(pkg.name)}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Tanya via WhatsApp
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Add-ons */}
        <section className="mb-16 bg-muted/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Tambahan (Add-ons)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {addOns.map((addon, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{addon}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Pertanyaan Sering Ditanya</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA */}
        <section className="text-center bg-primary/5 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Masih Bingung Pilih Paket?</h2>
          <p className="text-muted-foreground mb-6">
            Konsultasi gratis dengan kami untuk menentukan paket terbaik sesuai kebutuhan dan budget Anda
          </p>
          <Button size="lg" onClick={() => handleWhatsAppClick("Konsultasi Gratis")}>
            <MessageCircle className="w-5 h-5 mr-2" />
            Konsultasi Gratis Sekarang
          </Button>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
