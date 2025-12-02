import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewsletterSignupProps {
  source?: string;
}

const NewsletterSignup = ({ source = "homepage" }: NewsletterSignupProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error("Email tidak valid");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({
          email: email.trim().toLowerCase(),
          name: name.trim() || null,
          source
        });

      if (error) {
        if (error.code === "23505") {
          toast.error("Email sudah terdaftar!");
        } else {
          throw error;
        }
        return;
      }

      toast.success("Berhasil subscribe! 🎉", {
        description: "Anda akan mendapat update promo dan tips fotografi terbaru"
      });
      
      setEmail("");
      setName("");
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Newsletter signup error:", error);
      }
      toast.error("Gagal subscribe. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl lg:text-3xl">
              Subscribe Newsletter
            </CardTitle>
            <CardDescription className="text-base">
              Dapatkan update terbaru tentang promo menarik, tips fotografi, dan inspirasi kreatif langsung ke email Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Nama (opsional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="bg-background"
                />
                <Input
                  type="email"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="bg-background"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full group"
                disabled={isLoading}
              >
                <Mail className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                {isLoading ? "Memproses..." : "Subscribe Sekarang"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Dengan subscribe, Anda setuju menerima email dari kami. Anda dapat unsubscribe kapan saja.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NewsletterSignup;
