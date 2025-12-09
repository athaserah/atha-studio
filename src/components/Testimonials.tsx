import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const { data: testimonials, isLoading } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_featured", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  if (isLoading) {
    return (
      <section className="py-section bg-gradient-to-b from-secondary/30 via-background to-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 badge-premium">
              <Star className="h-3 w-3 mr-1 fill-primary" />
              Testimoni Klien
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Kata{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Klien Kami
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer h-80 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-section bg-gradient-to-b from-secondary/30 via-background to-background overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-4 badge-premium">
            <Star className="h-3 w-3 mr-1 fill-primary" />
            Testimoni Klien
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Kata{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Klien Kami
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kepuasan klien adalah prioritas utama kami. Simak pengalaman mereka bekerja sama dengan Atha Studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 stagger-children">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="testimonial-card group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors duration-300">
                <Quote className="h-12 w-12" />
              </div>

              <CardContent className="p-6 lg:p-8 relative">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 transition-all duration-300 ${
                        i < testimonial.rating
                          ? "fill-primary text-primary"
                          : "text-muted/30"
                      }`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-foreground/90 leading-relaxed mb-6 text-base lg:text-lg italic">
                  "{testimonial.review_text}"
                </p>

                {/* Client Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  {testimonial.client_photo_url ? (
                    <div className="relative">
                      <img
                        src={testimonial.client_photo_url}
                        alt={testimonial.client_name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300"
                      />
                      <div className="absolute inset-0 rounded-full ring-animation opacity-0 group-hover:opacity-100" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
                      <span className="text-xl font-bold text-primary">
                        {testimonial.client_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {testimonial.client_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.client_role}
                    </p>
                  </div>
                </div>

                {/* Service Badge */}
                <div className="mt-4">
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.service_type}
                  </Badge>
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
