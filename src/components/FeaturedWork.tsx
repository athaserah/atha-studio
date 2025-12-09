import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Camera, Loader2, Sparkles, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { OptimizedImage } from "./OptimizedImage";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

interface FeaturedPhoto {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  tags: string[] | null;
}

export const FeaturedWork = () => {
  const { data: featuredPhotos, isLoading, refetch } = useQuery({
    queryKey: ['featured-photos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('id, title, description, image_url, category, tags')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(3);
      
      if (error) throw error;
      return data as FeaturedPhoto[];
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('featured-photos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photos'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  return (
    <section className="py-section bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container-responsive relative">
        <div className="text-center mb-16 animate-fade-in">
          {/* Real-time Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge variant="outline" className="badge-premium">
              <Camera className="h-3 w-3 mr-1" />
              Portfolio Unggulan
            </Badge>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              Real-time
            </Badge>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Karya{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Terpilih
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Setiap proyek adalah cerita unik. Lihat bagaimana kami mengabadikan momen berharga klien kami.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton-shimmer h-96 rounded-2xl" />
            ))}
          </div>
        ) : featuredPhotos && featuredPhotos.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 stagger-children">
            {featuredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="group cursor-pointer card-3d"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-card hover:shadow-glow transition-all duration-500">
                  <OptimizedImage
                    src={photo.image_url}
                    alt={photo.title}
                    className="h-96"
                    aspectRatio="4/5"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      {photo.category && (
                        <Badge variant="secondary" className="mb-3 bg-background/20 text-background backdrop-blur-sm border-0">
                          {photo.category}
                        </Badge>
                      )}
                      <h3 className="text-xl lg:text-2xl font-bold text-background mb-2">
                        {photo.title}
                      </h3>
                      {photo.description && (
                        <p className="text-sm text-background/80 mb-4 line-clamp-2">
                          {photo.description}
                        </p>
                      )}
                      {photo.tags && photo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {photo.tags.slice(0, 3).map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="text-xs border-background/30 text-background bg-background/10 backdrop-blur-sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center">
              <Camera className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              Belum ada foto unggulan.
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Tandai foto sebagai "Featured" di Admin Panel.
            </p>
          </div>
        )}

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Link to="/gallery">
            <Button size="lg" className="group relative overflow-hidden">
              <span className="relative z-10 flex items-center">
                Lihat Semua Portfolio
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
