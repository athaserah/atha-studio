import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Heart, Download, Share2, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePhotos } from "@/hooks/usePhotos";
import { OptimizedImage } from "@/components/OptimizedImage";

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const { photos, isLoading, handleLike, handleDownload, handleShare } = usePhotos();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const categories = [
    { value: "all", label: "Semua" },
    { value: "portrait", label: "Portrait" },
    { value: "landscape", label: "Landscape" },
    { value: "wedding", label: "Wedding" },
    { value: "architecture", label: "Arsitektur" },
    { value: "product", label: "Produk" },
    { value: "street", label: "Street" },
  ];

  const filteredPhotos = photos.filter((photo) => {
    const matchesCategory = selectedFilter === "all" || photo.category === selectedFilter;
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (photo.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 pt-8 animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Portfolio
              <span className="text-primary"> Fotografi</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Jelajahi koleksi foto profesional dari berbagai kategori
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari foto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters - Horizontal Scroll on Mobile */}
          <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex gap-2 sm:flex-wrap sm:justify-center min-w-max sm:min-w-0">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedFilter(category.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
                    ${selectedFilter === category.value 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="break-inside-avoid">
                  <Skeleton className={`w-full rounded-xl ${i % 3 === 0 ? 'h-80' : i % 3 === 1 ? 'h-64' : 'h-72'}`} />
                </div>
              ))}
            </div>
          )}

          {/* Masonry Gallery Grid */}
          {!isLoading && (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {filteredPhotos.map((photo, index) => (
                <Dialog key={photo.id}>
                  <DialogTrigger asChild>
                    <div 
                      className={`break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl bg-card
                        transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1
                        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                      style={{ 
                        transitionDelay: `${Math.min(index * 100, 800)}ms`,
                      }}
                    >
                      <OptimizedImage
                        src={photo.image_url}
                        alt={photo.title}
                        className={`w-full rounded-xl ${
                          index % 5 === 0 ? 'h-80' : 
                          index % 5 === 1 ? 'h-64' : 
                          index % 5 === 2 ? 'h-72' : 
                          index % 5 === 3 ? 'h-56' : 'h-80'
                        }`}
                        aspectRatio="auto"
                        objectFit="cover"
                      />
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                        opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl flex flex-col justify-end p-4">
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(photo.tags || []).slice(0, 2).map((tag) => (
                            <Badge key={tag} className="text-xs bg-white/20 text-white border-0 backdrop-blur-sm">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        {/* Title & Stats */}
                        <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">{photo.title}</h3>
                        <div className="flex items-center gap-3 text-white/80 text-sm">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5" /> {photo.likes_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3.5 w-3.5" /> {photo.downloads_count}
                          </span>
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(photo.id);
                            }}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                          >
                            <Heart className="h-4 w-4 text-white" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(photo.id, photo.title);
                            }}
                            className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                          >
                            <Share2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  {/* Lightbox Dialog */}
                  <DialogContent className="max-w-5xl w-full p-0 bg-black/95 border-border/20">
                    <div className="relative">
                      <img
                        src={photo.image_url}
                        alt={photo.title}
                        className="w-full max-h-[85vh] object-contain"
                      />
                      
                      {/* Photo Info Bottom Bar */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                          <div className="text-white">
                            <h3 className="text-xl sm:text-2xl font-bold mb-2">{photo.title}</h3>
                            {photo.description && (
                              <p className="text-white/70 text-sm mb-3 max-w-lg">{photo.description}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {(photo.tags || []).map((tag) => (
                                <Badge key={tag} className="bg-white/20 text-white border-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-white/80">
                              <span className="flex items-center gap-1.5">
                                <Heart className="h-4 w-4" /> {photo.likes_count}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Download className="h-4 w-4" /> {photo.downloads_count}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Share2 className="h-4 w-4" /> {photo.shares_count}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="border-white/30 text-white hover:bg-white/20"
                              onClick={() => handleLike(photo.id)}
                            >
                              <Heart className="h-4 w-4 mr-2" /> Like
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="border-white/30 text-white hover:bg-white/20"
                              onClick={() => handleDownload(photo.id, photo.image_url, photo.title)}
                            >
                              <Download className="h-4 w-4 mr-2" /> Download
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="border-white/30 text-white hover:bg-white/20"
                              onClick={() => handleShare(photo.id, photo.title)}
                            >
                              <Share2 className="h-4 w-4 mr-2" /> Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredPhotos.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold mb-2">Foto tidak ditemukan</h3>
              <p className="text-muted-foreground text-sm">
                Coba sesuaikan kata kunci atau filter kategori
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("all");
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;