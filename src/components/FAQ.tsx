import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Bagaimana cara booking dan sistem pembayaran?",
    answer: "Hubungi kami via WhatsApp atau form kontak untuk konsultasi. Setelah diskusi kebutuhan, kami akan kirim invoice. Pembayaran DP 30% untuk booking tanggal, pelunasan 70% maksimal H-3 sebelum acara. Kami menerima transfer bank dan e-wallet."
  },
  {
    question: "Berapa lama proses editing dan pengiriman hasil foto?",
    answer: "Waktu editing tergantung paket: Basic (3-5 hari), Standard (7 hari), Premium (14 hari). Untuk kebutuhan urgent, tersedia layanan express editing dengan biaya tambahan."
  },
  {
    question: "Berapa jumlah foto yang akan diterima?",
    answer: "Jumlah foto sesuai paket yang dipilih. Semua foto diberikan dalam resolusi tinggi dan sudah melalui proses editing profesional. Detail jumlah foto ada di setiap paket layanan."
  },
  {
    question: "Apakah ada biaya tambahan untuk lokasi di luar kota?",
    answer: "Untuk wilayah Yogyakarta tidak ada biaya tambahan. Untuk lokasi luar kota, akan ada biaya transportasi dan akomodasi yang akan kami informasikan saat konsultasi."
  },
  {
    question: "Apakah bisa request style atau tema foto tertentu?",
    answer: "Tentu! Kami terbuka dengan permintaan khusus. Anda dapat berbagi referensi foto atau mood board yang diinginkan saat konsultasi. Tim kami akan mewujudkan visi Anda dengan hasil terbaik."
  }
];

export const FAQ = () => {
  return (
    <section className="py-section bg-gradient-to-b from-secondary/20 via-background to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      <div className="container-responsive max-w-4xl relative">
        <div className="text-center mb-16 fade-in">
          <Badge variant="outline" className="mb-6 badge-premium">
            <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
            FAQ
          </Badge>
          <h2 className="heading-section font-display mb-6">
            Pertanyaan{" "}
            <span className="gradient-text">
              Umum
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Jawaban untuk pertanyaan yang sering ditanyakan seputar layanan fotografi kami
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="accordion-premium data-[state=open]:shadow-soft slide-up"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <AccordionTrigger className="text-left hover:no-underline py-6 group">
                <span className="font-semibold text-base sm:text-lg pr-4 group-hover:text-primary transition-colors duration-300">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-6 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
