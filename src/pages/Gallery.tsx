import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Heart, Download, Share2, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { usePhotos } from "@/hooks/usePhotos";

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { photos, isLoading, handleLike, handleDownload, handleShare } = usePhotos();

  const categories = [
    { value: "all", label: "Semua Foto" },
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
      <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Galeri
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Fotografi
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Jelajahi koleksi foto profesional kami dari berbagai kategori. 
            Setiap gambar bercerita dan diabadikan dengan penuh perhatian terhadap detail.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 slide-up">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari foto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedFilter === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(category.value)}
                  className="transition-all duration-300"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading foto...</span>
          </div>
        )}

        {/* Gallery Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
            <Dialog key={photo.id}>
              <DialogTrigger asChild>
                <div 
                  className="gallery-item cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-wrap gap-1">
                        {(photo.tags || []).slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs bg-white/20 text-white">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="icon" 
                          variant="glass" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(photo.id);
                          }}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="glass" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(photo.id, photo.title);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-white">
                      <h3 className="font-semibold text-lg mb-1">{photo.title}</h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <Heart className="h-4 w-4" />
                        <span>{photo.likes_count} likes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
                <div className="relative">
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    className="w-full max-h-[80vh] object-contain rounded-lg"
                  />
                  
                  {/* Photo Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                    <div className="flex justify-between items-end">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold mb-2">{photo.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {(photo.tags || []).map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-white/20 text-white">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{photo.likes_count} likes</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{photo.downloads_count} downloads</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Share2 className="h-4 w-4" />
                            <span>{photo.shares_count} shares</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="glass" 
                          size="sm"
                          onClick={() => handleDownload(photo.id, photo.image_url, photo.title)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          variant="glass" 
                          size="sm"
                          onClick={() => handleShare(photo.id, photo.title)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
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
            <h3 className="text-2xl font-semibold mb-2">Foto tidak ditemukan</h3>
            <p className="text-muted-foreground">
              Coba sesuaikan kata kunci pencarian atau filter kategori Anda
            </p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;