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

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Testimoni Klien
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-glow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {testimonial.client_photo_url ? (
                    <img 
                      src={testimonial.client_photo_url} 
                      alt={testimonial.client_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">
                        {testimonial.client_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{testimonial.client_name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.client_role}</p>
                  </div>
                </div>
                
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating 
                          ? 'fill-primary text-primary' 
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                
                <p className="text-muted-foreground leading-relaxed mb-3">
                  "{testimonial.review_text}"
                </p>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-primary/10 rounded-full text-xs">
                    {testimonial.service_type}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;