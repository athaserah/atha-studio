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
const NewsletterSignup = ({
  source = "homepage"
}: NewsletterSignupProps) => {
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
      const {
        error
      } = await supabase.from("newsletter_subscribers").insert({
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
      console.error("Newsletter signup error:", error);
      toast.error("Gagal subscribe. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      
      
    </Card>;
};
export default NewsletterSignup;