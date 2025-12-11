import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Heart, Download, Share2, X, ChevronLeft, ChevronRight, Filter, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { usePhotos } from "@/hooks/usePhotos";
import { OptimizedImage } from "@/components/OptimizedImage";

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { photos, isLoading, handleLike, handleDownload, handleShare } = usePhotos();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (filterMenuOpen && !target.closest('.filter-menu') && !target.closest('.filter-button')) {
        setFilterMenuOpen(false);
      }
    };
    
    if (filterMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [filterMenuOpen]);

  const categories = [
    { value: "all", label: "Semua", icon: "🎨" },
    { value: "portrait", label: "Portrait", icon: "👤" },
    { value: "landscape", label: "Landscape", icon: "🏞️" },
    { value: "wedding", label: "Wedding", icon: "💒" },
    { value: "architecture", label: "Arsitektur", icon: "🏛️" },
    { value: "product", label: "Produk", icon: "📦" },
    { value: "street", label: "Street", icon: "🏙️" },
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

  const handleFilterSelect = (value: string) => {
    setSelectedFilter(value);
    setFilterMenuOpen(false);
  };

  const currentPhoto = filteredPhotos[currentPhotoIndex];
  const activeCategory = categories.find(cat => cat.value === selectedFilter);

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

          {/* Search Bar & Filter Button */}
          <div className="mb-5 max-w-md mx-auto">
            <div className="flex gap-2">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari foto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                className="filter-button flex-shrink-0 flex items-center gap-2 px-4 py-3 bg-card border border-border rounded-full hover:border-primary/50 transition-all text-sm font-medium"
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                {selectedFilter !== "all" && (
                  <span className="flex h-2 w-2 rounded-full bg-primary" />
                )}
              </button>
            </div>

            {/* Active Filter Badge */}
            {selectedFilter !== "all" && (
              <div className="mt-3 flex items-center justify-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {activeCategory?.icon} {activeCategory?.label}
                </Badge>
                <button
                  onClick={() => setSelectedFilter("all")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Search Results Count */}
            {(searchTerm || selectedFilter !== "all") && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                Ditemukan {filteredPhotos.length} foto
              </p>
            )}
          </div>

          {/* Hamburger Filter Menu - Slide from Right */}
          <div 
            className={`fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-out filter-menu ${
              filterMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h3 className="font-semibold text-lg">Filter Kategori</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Pilih kategori foto</p>
              </div>
              <button
                onClick={() => setFilterMenuOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => handleFilterSelect(category.value)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      selectedFilter === category.value
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-card hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.label}</span>
                    </div>
                    {selectedFilter === category.value && (
                      <Check className="h-5 w-5" />
                    )}
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              {selectedFilter !== "all" && (
                <button
                  onClick={() => handleFilterSelect("all")}
                  className="w-full mt-4 py-3 px-4 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Backdrop Overlay */}
          {filterMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
              onClick={() => setFilterMenuOpen(false)}
            />
          )}

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

          {/* Empty State */}
          {!isLoading && filteredPhotos.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">Tidak ada foto ditemukan</h3>
              <p className="text-muted-foreground mb-4">
                Coba kata kunci lain atau ubah filter kategori
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedFilter("all");
                }}
                variant="outline"
              >
                Reset Pencarian
              </Button>
            </div>
          )}

          {/* Gallery Grid - Mobile First */}
          {!isLoading && filteredPhotos.length > 0 && (
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
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </button>
                  </div>

                  {/* Main Image */}
                  <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <OptimizedImage
                        src={currentPhoto.image_url}
                        alt={currentPhoto.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={() => navigateLightbox('prev')}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all z-20"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </button>
                  <button
                    onClick={() => navigateLightbox('next')}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full transition-all z-20"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </button>

                  {/* Footer Actions */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-3 sm:p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center justify-between gap-2">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 flex-1">
                        {(currentPhoto.tags || []).slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs bg-white/10 text-white border-0">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleLike(currentPhoto.id)}
                          className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm min-h-[40px]"
                        >
                          <Heart className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">{currentPhoto.likes_count}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(currentPhoto.id, currentPhoto.image_url)}
                          className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm min-h-[40px]"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleShare(currentPhoto.id, currentPhoto.title)}
                          className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm min-h-[40px]"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Image Counter */}
                    <div className="text-center mt-2">
                      <span className="text-xs text-white/70">
                        {currentPhotoIndex + 1} / {filteredPhotos.length}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gallery;
