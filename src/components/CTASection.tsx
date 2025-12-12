import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Phone, Clock, Shield, Sparkles, Heart } from "lucide-react";
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

  const handleBooking = () => {
    try {
      const message = "Halo! Saya ingin booking sesi foto. Mohon informasi ketersediaan jadwal.";
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error('Gagal membuka WhatsApp');
    }
  };

  return (
    <section className="py-section relative overflow-hidden cta-cinematic">
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[60px]" />
      </div>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 relative">
        <Card className="relative overflow-hidden border border-primary/20 shadow-premium animate-fade-in rounded-4xl">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-card to-accent/5" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_hsl(var(--primary)/0.08),transparent_60%)]" />
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/8 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/8 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3" />
          
          <CardContent className="relative p-10 lg:p-20 text-center">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-10 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow animate-pulse-glow">
              <Heart className="h-12 w-12 text-primary-foreground" />
            </div>

            {/* Emotional Headline */}
            <h2 className="heading-section font-display mb-8">
              <span className="block text-foreground">Waktunya Mengabadikan</span>
              <span className="gradient-text">Momen Tanpa Penyesalan</span>
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Hubungi kami sekarang untuk konsultasi gratis dan wujudkan sesi foto impian Anda bersama tim profesional kami.
            </p>
            
            {/* CTA Buttons - Dual Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg" 
                className="group h-16 px-10 text-lg btn-glow bg-gradient-to-r from-primary to-accent hover:opacity-95"
                onClick={handleBooking}
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Booking Sekarang
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="h-16 px-10 text-lg group border-border/50 hover:border-primary/50 hover:bg-primary/5"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Konsultasi Gratis
              </Button>
            </div>
            
            {/* Trust Indicators - Premium */}
            <div className="pt-10 border-t border-border/30">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
                {[
                  { icon: Clock, title: "Respon Cepat", desc: "Balasan dalam 5 menit" },
                  { icon: MessageCircle, title: "Konsultasi Gratis", desc: "Tanpa biaya apapun" },
                  { icon: Shield, title: "Harga Transparan", desc: "Tidak ada biaya tersembunyi" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="group">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                        <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                      </div>
                      <p className="font-semibold text-foreground mb-1.5">{item.title}</p>
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
