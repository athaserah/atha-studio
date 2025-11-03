import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import NewsletterSignup from "@/components/NewsletterSignup";

const Index = () => {
  return <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      <Testimonials />
      <NewsletterSignup />
    </div>;
};
export default Index;