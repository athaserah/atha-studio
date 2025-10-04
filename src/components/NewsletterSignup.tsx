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
          source,
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
      console.error("Newsletter signup error:", error);
      toast.error("Gagal subscribe. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Dapatkan Promo Spesial!</CardTitle>
        <CardDescription className="text-base">
          Subscribe untuk dapat update promo, tips fotografi, dan penawaran eksklusif langsung di email Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Nama (opsional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
          />
          <Input
            type="email"
            placeholder="Email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : "Subscribe Sekarang"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Kami tidak akan spam. Unsubscribe kapan saja.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;
