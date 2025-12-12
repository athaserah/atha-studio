import { Link } from "react-router-dom";
import { Camera, Mail, Phone, MapPin, Instagram, Facebook, Youtube, Heart, ArrowUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import athaStudioLogo from "@/assets/atha-studio-logo.png";
import { useState } from "react";
import { toast } from "sonner";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Terima kasih telah berlangganan!', {
        description: 'Anda akan menerima update terbaru dari kami.'
      });
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-secondary/30 to-secondary/50 border-t border-border/40">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      {/* Watermark Logo Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-20 -right-20 opacity-[0.03]">
          <img src={athaStudioLogo} alt="" className="w-[400px] h-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <Link to="/" className="inline-block group">
              <img 
                src={athaStudioLogo} 
                alt="Atha Studio Logo" 
                className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Layanan fotografi profesional untuk mengabadikan setiap momen berharga Anda dengan sentuhan artistik.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              {[
                { href: "https://instagram.com/athadiary21/", icon: Instagram, label: "Instagram" },
                { href: "https://web.facebook.com/AthaDiary21/?locale=id_ID", icon: Facebook, label: "Facebook" },
                { href: "https://www.youtube.com/@Atha21-w5i", icon: Youtube, label: "YouTube" },
              ].map((social) => (
                <a 
                  key={social.label}
                  href={social.href}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl bg-card border border-border/40 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-500 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-8 text-foreground font-display">Navigasi</h3>
            <ul className="space-y-4">
              {[
                { to: "/", label: "Beranda" },
                { to: "/gallery", label: "Portfolio" },
                { to: "/pricing", label: "Layanan" },
                { to: "/about", label: "Tentang" },
                { to: "/contact", label: "Kontak" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm inline-flex items-center group"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-primary mr-0 group-hover:mr-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-8 text-foreground font-display">Layanan</h3>
            <ul className="space-y-4">
              {[
                "Wedding Photography",
                "Portrait Photography",
                "Event Documentation",
                "Product Photography",
              ].map((service) => (
                <li key={service} className="text-muted-foreground text-sm flex items-center gap-3 group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                    <Camera className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="font-semibold text-lg mb-8 text-foreground font-display">Kontak</h3>
            <ul className="space-y-4 mb-8">
              {[
                { icon: Phone, content: "+62 822-4159-0417", href: "tel:+6282241590417" },
                { icon: Mail, content: "athadiary21@gmail.com", href: "mailto:athadiary21@gmail.com" },
                { icon: MapPin, content: "Yogyakarta, Indonesia" },
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                    <item.icon className="h-4 w-4 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  {item.href ? (
                    <a href={item.href} className="hover:text-primary transition-colors pt-2">
                      {item.content}
                    </a>
                  ) : (
                    <span className="pt-2">{item.content}</span>
                  )}
                </li>
              ))}
            </ul>

            {/* Mini Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <p className="text-sm text-muted-foreground">Dapatkan update terbaru:</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 text-sm bg-card border-border/40 focus:border-primary/50"
                  required
                />
                <Button type="submit" size="icon" className="h-11 w-11 flex-shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border/40">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground text-center md:text-left flex items-center gap-1.5">
              © {currentYear} Atha Studio — Since 2020. Made with 
              <Heart className="h-4 w-4 text-primary fill-primary" /> 
              in Jogja
            </p>
            
            <div className="flex items-center gap-8">
              <div className="flex gap-8 text-sm text-muted-foreground">
                <Link to="/privacy" className="hover:text-primary transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-primary transition-colors duration-300">
                  Terms of Service
                </Link>
              </div>
              
              {/* Scroll to Top */}
              <Button
                variant="outline"
                size="icon"
                onClick={scrollToTop}
                className="w-11 h-11 rounded-xl border-border/40 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
