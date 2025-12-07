import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Camera, Loader2 } from "lucide-react";
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
    <section className="py-section bg-secondary/20">
      <div className="container-responsive">
        <div className="text-center mb-12 fade-in">
          <Badge variant="outline" className="mb-4">
            <Camera className="h-3 w-3 mr-1" />
            Portfolio Unggulan
          </Badge>
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
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : featuredPhotos && featuredPhotos.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredPhotos.map((photo, index) => (
              <div
                key={photo.id}
                className="group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg hover:shadow-2xl transition-all duration-500">
                  <OptimizedImage
                    src={photo.image_url}
                    alt={photo.title}
                    className="h-80"
                    aspectRatio="4/5"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {photo.category && (
                        <Badge variant="secondary" className="mb-2 bg-white/20 text-white">
                          {photo.category}
                        </Badge>
                      )}
                      <h3 className="text-xl font-bold mb-2">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-sm text-white/90 mb-3">{photo.description}</p>
                      )}
                      {photo.tags && photo.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {photo.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-white/30 text-white">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>Belum ada foto unggulan. Tandai foto sebagai "Featured" di Admin Panel.</p>
          </div>
        )}

        <div className="text-center">
          <Link to="/gallery">
            <Button size="lg" className="group">
              Lihat Semua Portfolio
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
