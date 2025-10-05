import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
interface Testimonial {
  id: string;
  client_name: string;
  client_role: string;
  client_photo_url: string | null;
  rating: number;
  review_text: string;
  service_type: string;
  is_featured: boolean;
}
const Testimonials = () => {
  const {
    data: testimonials,
    isLoading
  } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("testimonials").select("*").eq("is_featured", true).order("display_order", {
        ascending: true
      });
      if (error) throw error;
      return data as Testimonial[];
    }
  });
  if (isLoading) {
    return <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Kata Mereka
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <Card key={i} className="animate-pulse">
                <CardContent className="p-6 h-64 bg-muted/50" />
              </Card>)}
          </div>
        </div>
      </section>;
  }
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  return;
};
export default Testimonials;