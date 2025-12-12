import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  if (isLoading) {
    return (
      <section className="py-section bg-gradient-to-b from-secondary/20 via-background to-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 badge-premium">
              <Star className="h-3.5 w-3.5 mr-1.5 fill-primary" />
              Testimoni Klien
            </Badge>
            <h2 className="heading-section font-display mb-6">
              Kata{" "}
              <span className="gradient-text">Klien Kami</span>
            </h2>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer h-[360px] min-w-[360px] rounded-3xl" />
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
    <section className="py-section bg-gradient-to-b from-secondary/20 via-background to-background overflow-hidden relative">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 relative">
        <div className="text-center mb-16 animate-fade-in">
          <Badge variant="outline" className="mb-6 badge-premium">
            <Star className="h-3.5 w-3.5 mr-1.5 fill-primary" />
            Testimoni Klien
          </Badge>
          <h2 className="heading-section font-display mb-6">
            Kata{" "}
            <span className="gradient-text">Klien Kami</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Kepuasan klien adalah prioritas utama kami. Simak pengalaman mereka bekerja sama dengan Atha Studio.
          </p>
        </div>

        {/* Horizontal Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full border-border/50 bg-background/90 backdrop-blur-sm shadow-soft hover:border-primary/50 transition-all duration-300 ${!canScrollLeft ? 'opacity-0 pointer-events-none' : ''}`}
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full border-border/50 bg-background/90 backdrop-blur-sm shadow-soft hover:border-primary/50 transition-all duration-300 ${!canScrollRight ? 'opacity-0 pointer-events-none' : ''}`}
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Cards Container */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="testimonial-card group relative overflow-hidden min-w-[340px] sm:min-w-[380px] snap-start flex-shrink-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 text-primary/10 group-hover:text-primary/20 transition-colors duration-500">
                  <Quote className="h-14 w-14" />
                </div>

                <CardContent className="p-8 lg:p-10 relative">
                  {/* Rating Stars */}
                  <div className="flex gap-1.5 mb-8">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 transition-all duration-300 ${
                          i < testimonial.rating
                            ? "fill-primary text-primary"
                            : "text-muted/30"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-foreground/90 leading-relaxed mb-8 text-base lg:text-lg italic line-clamp-3">
                    "{testimonial.review_text}"
                  </p>

                  {/* Client Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-border/40">
                    {testimonial.client_photo_url ? (
                      <div className="relative">
                        <img
                          src={testimonial.client_photo_url}
                          alt={testimonial.client_name}
                          className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-500"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-500">
                        <span className="text-xl font-bold text-primary font-display">
                          {testimonial.client_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-500">
                        {testimonial.client_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.client_role}
                      </p>
                    </div>
                  </div>

                  {/* Service Badge */}
                  <div className="mt-6">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {testimonial.service_type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
