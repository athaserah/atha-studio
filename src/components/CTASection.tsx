import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Phone } from "lucide-react";
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
    <section className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="relative overflow-hidden border-2 border-primary/20">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
          
          <CardContent className="relative p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">
              Siap Diabadikan?
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Hubungi kami sekarang untuk konsultasi gratis dan wujudkan sesi foto impian Anda bersama tim profesional kami.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="group"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Konsultasi via WhatsApp
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                asChild
              >
                <a href="tel:+6282241590417">
                  <Phone className="h-5 w-5 mr-2" />
                  Hubungi Kami
                </a>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-foreground mb-1">Respon Cepat</p>
                  <p>Balasan dalam 5 menit</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Konsultasi Gratis</p>
                  <p>Tanpa biaya apapun</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Harga Transparan</p>
                  <p>Tidak ada biaya tersembunyi</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
