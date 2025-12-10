import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Heart, Download, Share2, X, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePhotos } from "@/hooks/usePhotos";
import { OptimizedImage } from "@/components/OptimizedImage";

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
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

  // Get aspect ratio based on category
  const getAspectRatio = (category: string | null) => {
    switch (category) {
      case 'portrait':
      case 'wedding':
        return 'aspect-[3/4]';
      case 'landscape':
        return 'aspect-[4/3]';
      case 'product':
        return 'aspect-square';
      default:
        return 'aspect-[4/5]';
    }
  };

  const openLightbox = (index: number) => {
    setCurrentPhotoIndex(index);
    setLightboxOpen(true);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentPhotoIndex((prev) => (prev === 0 ? filteredPhotos.length - 1 : prev - 1));
    } else {
      setCurrentPhotoIndex((prev) => (prev === filteredPhotos.length - 1 ? 0 : prev + 1));
    }
  };

  const currentPhoto = filteredPhotos[currentPhotoIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-6 pt-6 sm:pt-8 animate-fade-in">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3">
              Portfolio
              <span className="text-primary"> Fotografi</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Jelajahi koleksi foto profesional dari berbagai kategori
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-5 max-w-md mx-auto">
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
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters - Horizontal Scroll with Gradient Indicators */}
          <div className="mb-6 relative">
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none sm:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none sm:hidden" />
            <div className="overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
              <div className="flex gap-2 sm:flex-wrap sm:justify-center min-w-max sm:min-w-0">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedFilter(category.value)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap min-h-[44px]
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
          </div>

          {/* Loading State - Grid Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`${i % 3 === 0 ? 'aspect-[3/4]' : i % 3 === 1 ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}>
                  <Skeleton className="w-full h-full rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          )}

          {/* Gallery Grid - Mobile First */}
          {!isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {filteredPhotos.map((photo, index) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className={`cursor-pointer group relative overflow-hidden rounded-xl bg-card
                    transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1
                    ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                    ${getAspectRatio(photo.category)}`}
                  style={{ 
                    transitionDelay: `${Math.min(index * 50, 400)}ms`,
                  }}
                >
                  <OptimizedImage
                    src={photo.image_url}
                    alt={photo.title}
                    className="absolute inset-0 w-full h-full"
                    objectFit="cover"
                  />
                  
                  {/* Category Badge - Always visible on mobile */}
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="text-[10px] sm:text-xs bg-black/50 text-white border-0 backdrop-blur-sm px-2 py-0.5">
                      {photo.category || 'Photo'}
                    </Badge>
                  </div>

                  {/* Like Count - Always visible */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <Heart className="h-3 w-3 text-white fill-white" />
                    <span className="text-[10px] sm:text-xs text-white font-medium">{photo.likes_count}</span>
                  </div>
                  
                  {/* Hover/Touch Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent 
                    opacity-0 group-hover:opacity-100 sm:group-hover:opacity-100 
                    transition-all duration-300 rounded-xl flex flex-col justify-end p-3 sm:p-4">
                    
                    {/* Title */}
                    <h3 className="font-semibold text-white text-sm sm:text-base mb-1 line-clamp-1">{photo.title}</h3>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(photo.tags || []).slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] text-white/70">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Quick Actions - Touch Friendly */}
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(photo.id);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors min-h-[40px]"
                      >
                        <Heart className="h-4 w-4 text-white" />
                        <span className="text-xs text-white hidden sm:inline">Like</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(photo.id, photo.title);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors min-h-[40px]"
                      >
                        <Share2 className="h-4 w-4 text-white" />
                        <span className="text-xs text-white hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Mobile Touch Indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden opacity-50">
                    <div className="w-8 h-1 bg-white/50 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile Lightbox Dialog */}
          <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
            <DialogContent className="max-w-full w-full h-full max-h-screen p-0 bg-black/95 border-0 sm:max-w-5xl sm:h-auto sm:max-h-[90vh]">
              {currentPhoto && (
                <div className="relative h-full flex flex-col">
                  {/* Header */}
                  <div className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                    <h3 className="text-white font-semibold text-sm sm:text-lg truncate pr-4 max-w-[70%]">
                      {currentPhoto.title}
                    </h3>
                    <button
                      onClick={() => setLightboxOpen(false)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  {/* Navigation Arrows - Desktop */}
                  <button
                    onClick={() => navigateLightbox('prev')}
                    className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={() => navigateLightbox('next')}
                    className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>

                  {/* Image Container */}
                  <div 
                    className="flex-1 flex items-center justify-center p-4 pt-16 pb-32 sm:pb-16"
                    onClick={(e) => {
                      // Handle swipe on mobile
                      const target = e.target as HTMLElement;
                      if (target.tagName !== 'BUTTON') {
                        const rect = target.getBoundingClientRect();
                        const clickX = e.clientX - rect.left;
                        if (clickX < rect.width / 3) {
                          navigateLightbox('prev');
                        } else if (clickX > (rect.width * 2) / 3) {
                          navigateLightbox('next');
                        }
                      }
                    }}
                  >
                    <img
                      src={currentPhoto.image_url}
                      alt={currentPhoto.title}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>

                  {/* Mobile Navigation Indicators */}
                  <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-1 sm:hidden">
                    {filteredPhotos.slice(Math.max(0, currentPhotoIndex - 3), Math.min(filteredPhotos.length, currentPhotoIndex + 4)).map((_, i) => {
                      const actualIndex = Math.max(0, currentPhotoIndex - 3) + i;
                      return (
                        <div 
                          key={actualIndex}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            actualIndex === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/40'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                    {/* Photo Info */}
                    {currentPhoto.description && (
                      <p className="text-white/70 text-xs sm:text-sm mb-3 line-clamp-2 sm:line-clamp-none">
                        {currentPhoto.description}
                      </p>
                    )}
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(currentPhoto.tags || []).map((tag) => (
                        <Badge key={tag} className="bg-white/10 text-white border-0 text-[10px] sm:text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/80">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {currentPhoto.likes_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {currentPhoto.downloads_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {currentPhoto.shares_count}
                        </span>
                      </div>

                      {/* Action Buttons - Touch Friendly */}
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 min-h-[44px] min-w-[44px] p-2 sm:px-3"
                          onClick={() => handleLike(currentPhoto.id)}
                        >
                          <Heart className="h-5 w-5 sm:mr-1.5" />
                          <span className="hidden sm:inline">Like</span>
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 min-h-[44px] min-w-[44px] p-2 sm:px-3"
                          onClick={() => handleDownload(currentPhoto.id, currentPhoto.image_url, currentPhoto.title)}
                        >
                          <Download className="h-5 w-5 sm:mr-1.5" />
                          <span className="hidden sm:inline">Save</span>
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20 min-h-[44px] min-w-[44px] p-2 sm:px-3"
                          onClick={() => handleShare(currentPhoto.id, currentPhoto.title)}
                        >
                          <Share2 className="h-5 w-5 sm:mr-1.5" />
                          <span className="hidden sm:inline">Share</span>
                        </Button>
                      </div>
                    </div>

                    {/* Photo Counter */}
                    <div className="mt-3 text-center text-white/50 text-xs">
                      {currentPhotoIndex + 1} / {filteredPhotos.length}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* No Results */}
          {!isLoading && filteredPhotos.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="text-5xl sm:text-6xl mb-4">📷</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Foto tidak ditemukan</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Coba sesuaikan kata kunci atau filter kategori
              </p>
              <Button 
                variant="outline" 
                size="sm"
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
