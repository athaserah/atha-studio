import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, User, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { OptimizedImage } from "@/components/OptimizedImage";

const blogPosts = [
  {
    id: 1,
    title: "10 Tips Memilih Fotografer Wedding yang Tepat",
    slug: "tips-memilih-fotografer-wedding",
    excerpt: "Panduan lengkap memilih fotografer pernikahan yang sesuai dengan budget dan style Anda",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800",
    category: "Tips & Tricks",
    author: "Atha Studio",
    date: "15 November 2024",
    readTime: "5 menit"
  },
  {
    id: 2,
    title: "Tren Fotografi Pre-Wedding 2024",
    slug: "tren-fotografi-prewedding-2024",
    excerpt: "Inspirasi konsep foto pre-wedding yang sedang trending di tahun 2024",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800",
    category: "Trend",
    author: "Atha Studio",
    date: "10 November 2024",
    readTime: "4 menit"
  },
  {
    id: 3,
    title: "Persiapan Foto Wisuda yang Perfect",
    slug: "persiapan-foto-wisuda-perfect",
    excerpt: "Checklist lengkap dan tips agar foto wisuda Anda maksimal dan memorable",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    category: "Tutorial",
    author: "Atha Studio",
    date: "5 November 2024",
    readTime: "6 menit"
  },
  {
    id: 4,
    title: "Lighting Techniques untuk Portrait Photography",
    slug: "lighting-techniques-portrait",
    excerpt: "Teknik pencahayaan dasar yang wajib dikuasai untuk hasil portrait yang stunning",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800",
    category: "Tutorial",
    author: "Atha Studio",
    date: "1 November 2024",
    readTime: "8 menit"
  },
  {
    id: 5,
    title: "Destinasi Pre-Wedding Terbaik di Yogyakarta",
    slug: "destinasi-prewedding-jogja",
    excerpt: "Rekomendasi lokasi foto pre-wedding paling instagramable di Jogja dan sekitarnya",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
    category: "Lokasi",
    author: "Atha Studio",
    date: "28 Oktober 2024",
    readTime: "5 menit"
  },
  {
    id: 6,
    title: "Behind The Scenes: Product Photography",
    slug: "bts-product-photography",
    excerpt: "Intip proses di balik layar sesi foto produk profesional untuk e-commerce",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
    category: "Behind The Scenes",
    author: "Atha Studio",
    date: "25 Oktober 2024",
    readTime: "7 menit"
  }
];

const categories = ["Semua", "Tips & Tricks", "Tutorial", "Trend", "Lokasi", "Behind The Scenes"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Semua" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Blog Fotografi - Tips & Tutorial | Atha Studio"
        description="Baca artikel, tips, dan tutorial seputar fotografi dari Atha Studio. Wedding, portrait, product photography dan banyak lagi."
        keywords="blog fotografi, tips fotografi, tutorial foto, artikel fotografi jogja"
      />
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container-responsive">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Blog{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Fotografi
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tips, tutorial, dan inspirasi seputar dunia fotografi
            </p>
          </div>

          {/* Search & Filter */}
          <div className="mb-12 slide-up">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <article className="h-full bg-card rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300">
                  <OptimizedImage
                    src={post.image}
                    alt={post.title}
                    className="h-48"
                    aspectRatio="16/9"
                  />
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-semibold mb-2">Artikel tidak ditemukan</h3>
              <p className="text-muted-foreground">
                Coba sesuaikan kata kunci pencarian atau pilih kategori lain
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
