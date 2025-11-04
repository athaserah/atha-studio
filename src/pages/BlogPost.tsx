import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Clock, Share2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import { Link, useParams } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";

// Mock data - in production, fetch from API/database
const blogPost = {
  title: "10 Tips Memilih Fotografer Wedding yang Tepat",
  slug: "tips-memilih-fotografer-wedding",
  excerpt: "Panduan lengkap memilih fotografer pernikahan yang sesuai dengan budget dan style Anda",
  image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
  category: "Tips & Tricks",
  author: "Atha Studio",
  date: "15 November 2024",
  readTime: "5 menit",
  content: `
    <p>Pernikahan adalah momen sekali seumur hidup yang ingin diabadikan dengan sempurna. Memilih fotografer wedding yang tepat adalah salah satu keputusan penting dalam persiapan pernikahan Anda.</p>

    <h2>1. Tentukan Budget Anda</h2>
    <p>Sebelum mencari fotografer, tentukan dulu budget yang Anda miliki. Biaya fotografer wedding biasanya berkisar dari 3 juta hingga puluhan juta rupiah, tergantung pengalaman dan paket yang ditawarkan.</p>

    <h2>2. Lihat Portfolio Fotografer</h2>
    <p>Portfolio adalah cerminan dari style dan kualitas kerja fotografer. Pastikan Anda melihat minimal 3-5 full wedding album, bukan hanya best shots mereka. Ini akan memberikan gambaran konsistensi kualitas mereka.</p>

    <h2>3. Cek Style Fotografi</h2>
    <p>Setiap fotografer punya style unik. Ada yang lebih ke candid natural, ada yang lebih formal dan posed, atau kombinasi keduanya. Pilih style yang sesuai dengan kepribadian Anda sebagai pasangan.</p>

    <h2>4. Perhatikan Personality Match</h2>
    <p>Fotografer akan mengikuti Anda sepanjang hari pernikahan. Pastikan Anda nyaman dengan personality mereka. Schedule meeting atau video call untuk mengenal lebih dekat.</p>

    <h2>5. Tanyakan Tentang Backup Equipment</h2>
    <p>Fotografer profesional selalu punya backup kamera, lensa, dan memory card. Ini penting untuk antisipasi jika ada equipment failure di hari H.</p>

    <h2>6. Diskusikan Deliverables</h2>
    <p>Pastikan Anda clear tentang berapa jumlah foto edited yang akan diterima, timeline delivery, dan format file (digital atau album fisik).</p>

    <h2>7. Review Kontrak dengan Teliti</h2>
    <p>Baca kontrak dengan seksama. Perhatikan detail tentang hak cipta foto, durasi liputan, overtime charges, dan refund policy jika ada pembatalan.</p>

    <h2>8. Cek Ketersediaan Tanggal</h2>
    <p>Fotografer populer biasanya fully booked 6-12 bulan sebelumnya, terutama di peak season (Juni-September). Book sesegera mungkin setelah tanggal wedding confirmed.</p>

    <h2>9. Tanyakan Tentang Tim</h2>
    <p>Apakah fotografer akan datang sendiri atau dengan tim? Berapa jumlah fotografer dan videografer yang akan hadir? Ini penting untuk coverage yang maksimal.</p>

    <h2>10. Request Engagement Shoot</h2>
    <p>Beberapa paket wedding include sesi engagement atau pre-wedding shoot. Ini adalah kesempatan bagus untuk kenal lebih dekat dengan fotografer dan lebih nyaman di depan kamera saat hari H.</p>

    <h2>Kesimpulan</h2>
    <p>Memilih fotografer wedding bukan hanya soal harga dan portfolio, tapi juga chemistry dan trust. Take your time untuk riset, compare, dan jangan ragu untuk bertanya detail. Remember, foto pernikahan Anda akan menjadi kenangan yang dilihat berulang kali sepanjang hidup!</p>

    <p><strong>Butuh konsultasi lebih lanjut?</strong> Tim Atha Studio siap membantu Anda merencanakan fotografi pernikahan impian. Hubungi kami untuk diskusi gratis!</p>
  `
};

const BlogPost = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${blogPost.title} | Atha Studio Blog`}
        description={blogPost.excerpt}
        keywords="tips fotografi wedding, memilih fotografer pernikahan, fotografer wedding jogja"
      />
      <Navbar />
      
      <article className="pt-24 pb-16">
        <div className="container-responsive max-w-4xl">
          {/* Back Button */}
          <Link to="/blog">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali ke Blog
            </Button>
          </Link>

          {/* Header */}
          <div className="mb-8 fade-in">
            <Badge variant="secondary" className="mb-4">{blogPost.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              {blogPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{blogPost.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{blogPost.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{blogPost.readTime}</span>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <OptimizedImage
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full rounded-xl mb-12 shadow-lg"
            aspectRatio="16/9"
            priority
          />

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />

          {/* CTA Section */}
          <div className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Siap Booking Fotografer?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Konsultasi gratis dengan tim Atha Studio untuk merencanakan fotografi pernikahan impian Anda
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg">
                    Konsultasi Gratis
                  </Button>
                </Link>
                <Link to="/gallery">
                  <Button size="lg" variant="outline">
                    Lihat Portfolio
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
