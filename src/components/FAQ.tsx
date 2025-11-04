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
    question: "Berapa lama proses editing foto setelah sesi pemotretan?",
    answer: "Proses editing biasanya memakan waktu 7-14 hari kerja tergantung paket yang dipilih. Untuk paket premium, kami menyediakan express editing 3-5 hari kerja dengan tambahan biaya."
  },
  {
    question: "Apakah bisa request tema atau style foto tertentu?",
    answer: "Tentu saja! Kami sangat terbuka dengan permintaan khusus. Anda bisa share referensi foto atau mood board yang diinginkan saat konsultasi awal. Tim kami akan berusaha mewujudkan visi Anda."
  },
  {
    question: "Berapa jumlah foto yang akan diterima?",
    answer: "Jumlah foto tergantung paket yang dipilih. Paket Basic (50-75 foto edited), Paket Standard (100-150 foto edited), Paket Premium (200-300 foto edited + all raw files). Semua dalam resolusi tinggi."
  },
  {
    question: "Apakah ada biaya tambahan untuk lokasi di luar kota?",
    answer: "Untuk lokasi dalam radius 10km dari Yogyakarta tidak ada biaya tambahan. Untuk lokasi lebih jauh, akan dikenakan biaya transportasi dan akomodasi yang akan kami diskusikan terlebih dahulu."
  },
  {
    question: "Bagaimana sistem pembayaran dan booking?",
    answer: "Pembayaran dilakukan dengan sistem DP 30% untuk booking tanggal, dan pelunasan 70% maksimal H-3 sebelum acara. Kami menerima transfer bank (BCA, Mandiri, BRI) dan e-wallet (GoPay, OVO, Dana)."
  },
  {
    question: "Apakah fotografer bisa datang untuk site survey lokasi?",
    answer: "Ya, untuk paket Premium kami menyediakan layanan site survey gratis. Untuk paket lainnya, site survey bisa dilakukan dengan tambahan biaya atau via video call untuk diskusi lokasi."
  },
  {
    question: "Bagaimana jika cuaca buruk di hari pemotretan outdoor?",
    answer: "Kami akan monitor prakiraan cuaca H-3 dan H-1. Jika kondisi tidak memungkinkan, kami akan tawarkan reschedule tanpa biaya tambahan atau alternatif indoor venue jika tersedia."
  },
  {
    question: "Apakah hasil foto bisa digunakan untuk komersial?",
    answer: "Untuk penggunaan personal tidak ada batasan. Jika ingin digunakan untuk keperluan komersial (iklan, publikasi media, dll), mohon diskusikan terlebih dahulu karena ada tambahan biaya untuk commercial rights."
  },
  {
    question: "Berapa lama foto akan disimpan oleh fotografer?",
    answer: "Kami menyimpan all files (edited + raw) selama 1 tahun setelah pengiriman. Setelah itu, kami sarankan untuk menyimpan backup sendiri. Jika butuh reprint setelah 1 tahun, bisa request dengan biaya admin."
  },
  {
    question: "Apakah bisa menambah jam pemotretan di hari H?",
    answer: "Bisa, dengan syarat tim kami tidak ada jadwal di jam berikutnya. Biaya overtime adalah 200rb/jam untuk 1 fotografer. Mohon konfirmasi minimal 1 jam sebelum waktu berakhir agar kami bisa adjust schedule."
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
