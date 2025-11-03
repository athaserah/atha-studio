import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ClientLogos from "@/components/ClientLogos";
import Testimonials from "@/components/Testimonials";
import NewsletterSignup from "@/components/NewsletterSignup";
import SEOHead, { photographyBusinessSchema } from "@/components/SEOHead";
import { trackPageView } from "@/utils/analytics";

const Index = () => {
  useEffect(() => {
    trackPageView('home', 'Beranda - Atha Studio');
  }, []);

  return (
    <>
      <SEOHead 
        title="Atha Studio - Jasa Fotografi Profesional Yogyakarta | Wedding & Portrait"
        description="Jasa fotografi profesional di Yogyakarta. Spesialis wedding, portrait, wisuda & acara. Harga mulai 250rb. Konsultasi gratis. Hubungi 082241590417."
        keywords="fotografi jogja, jasa foto yogyakarta, fotografer wedding jogja, foto wisuda jogja, jasa fotografi murah, fotografer profesional yogyakarta"
        schema={photographyBusinessSchema}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <Hero />
        <ClientLogos />
        <Services />
        <Testimonials />
        <NewsletterSignup />
      </div>
    </>
  );
};
export default Index;