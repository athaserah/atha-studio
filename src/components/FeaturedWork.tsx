import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { OptimizedImage } from "./OptimizedImage";

const featuredProjects = [
  {
    id: 1,
    title: "Wedding Intimate Citra & Budi",
    category: "Wedding",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    description: "Pernikahan intimate di villa Ubud dengan 50 tamu undangan",
    tags: ["Wedding", "Outdoor", "Intimate"]
  },
  {
    id: 2,
    title: "Corporate Event Bank Mandiri",
    category: "Corporate",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
    description: "Dokumentasi acara launching produk baru di Jakarta Convention Center",
    tags: ["Corporate", "Event", "Professional"]
  },
  {
    id: 3,
    title: "Product Photography E-Commerce",
    category: "Product",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    description: "Sesi foto produk fashion untuk online store",
    tags: ["Product", "Commercial", "E-Commerce"]
  }
];

export const FeaturedWork = () => {
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

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <div
              key={project.id}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-xl mb-4 shadow-lg hover:shadow-2xl transition-all duration-500">
                <OptimizedImage
                  src={project.image}
                  alt={project.title}
                  className="h-80"
                  aspectRatio="4/5"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Badge variant="secondary" className="mb-2 bg-white/20 text-white">
                      {project.category}
                    </Badge>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-sm text-white/90 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-white/30 text-white">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

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
