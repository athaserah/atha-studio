import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Phone, Clock, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const CTASection = () => {
  const whatsappNumber = "6282241590417";
  
  const handleWhatsApp = () => {
    try {
      const message = "Halo! Saya ingin konsultasi mengenai layanan fotografi.";
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

  return (
    <section className="py-section relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Card className="relative overflow-hidden border-2 border-primary/30 shadow-glow animate-fade-in">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary)/0.1),transparent_50%)]" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <CardContent className="relative p-8 lg:p-16 text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-pulse-glow">
              <Sparkles className="h-10 w-10 text-primary-foreground" />
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Siap Diabadikan?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Hubungi kami sekarang untuk konsultasi gratis dan wujudkan sesi foto impian Anda bersama tim profesional kami.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="group h-14 px-8 text-lg relative overflow-hidden"
                onClick={handleWhatsApp}
              >
                <span className="relative z-10 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Konsultasi via WhatsApp
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-14 px-8 text-lg group"
                asChild
              >
                <a href="tel:+6282241590417">
                  <Phone className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Hubungi Kami
                </a>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="pt-8 border-t border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  { icon: Clock, title: "Respon Cepat", desc: "Balasan dalam 5 menit" },
                  { icon: MessageCircle, title: "Konsultasi Gratis", desc: "Tanpa biaya apapun" },
                  { icon: Shield, title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="group">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                        <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <p className="font-semibold text-foreground mb-1">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
