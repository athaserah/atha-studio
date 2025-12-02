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
    <section className="py-section bg-secondary/20">
      <div className="container-responsive max-w-4xl">
        <div className="text-center mb-12 fade-in">
          <Badge variant="outline" className="mb-4">
            <HelpCircle className="h-3 w-3 mr-1" />
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Pertanyaan{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Umum
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Jawaban untuk pertanyaan yang sering ditanyakan seputar layanan fotografi kami
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-background border rounded-lg px-6 slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <AccordionTrigger className="text-left hover:no-underline">
                <span className="font-semibold">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
