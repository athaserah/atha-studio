import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Testimonials from "@/components/Testimonials";
import NewsletterSignup from "@/components/NewsletterSignup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Testimonials />
      <div className="container mx-auto px-4 py-16">
        <NewsletterSignup source="homepage" />
      </div>
    </div>
  );
};

export default Index;
