import { Badge } from "@/components/ui/badge";
import { Play, Video } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const videos = [
  {
    id: 1,
    title: "Wedding Highlight - Sarah & John",
    thumbnail: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "3:45"
  },
  {
    id: 2,
    title: "Corporate Event Documentation",
    thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "2:30"
  },
  {
    id: 3,
    title: "Behind The Scenes - Product Shoot",
    thumbnail: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    duration: "4:12"
  }
];

export const VideoPortfolio = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <section className="py-section">
      <div className="container-responsive">
        <div className="text-center mb-12 fade-in">
          <Badge variant="outline" className="mb-4">
            <Video className="h-3 w-3 mr-1" />
            Video Portfolio
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Cerita dalam{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gerakan
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lihat momen berharga yang kami abadikan dalam video cinematik
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <Dialog key={video.id}>
              <DialogTrigger asChild>
                <div
                  className="group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedVideo(video.videoUrl)}
                >
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-300">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-8 w-8 text-primary ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/70 text-white">
                        {video.duration}
                      </Badge>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-semibold">{video.title}</h3>
                    </div>
                  </div>
                </div>
              </DialogTrigger>

              <DialogContent className="max-w-4xl w-full p-0 bg-black border-none">
                <div className="relative pt-[56.25%]">
                  <iframe
                    src={selectedVideo || video.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allowFullScreen
                    title={video.title}
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </section>
  );
};
