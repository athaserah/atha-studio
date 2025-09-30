import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  tags: string[] | null;
  likes_count: number;
  downloads_count: number;
  shares_count: number;
  is_featured: boolean | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export const usePhotos = () => {
  const queryClient = useQueryClient();

  const { data: photos = [], isLoading, error } = useQuery({
    queryKey: ["photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("photos")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Photo[];
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("photos-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "photos",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["photos"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleLike = async (photoId: string) => {
    try {
      const { error } = await supabase.rpc("increment_photo_stat", {
        photo_id: photoId,
        stat_type: "likes",
      });

      if (error) throw error;

      toast({
        title: "Liked!",
        description: "Foto berhasil di-like",
      });
      
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal like foto",
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (photoId: string, imageUrl: string, title: string) => {
    try {
      // Increment download count
      const { error } = await supabase.rpc("increment_photo_stat", {
        photo_id: photoId,
        stat_type: "downloads",
      });

      if (error) throw error;

      // Download image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Downloaded!",
        description: "Foto berhasil didownload",
      });
      
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Gagal download foto",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (photoId: string, title: string) => {
    try {
      // Increment share count
      const { error } = await supabase.rpc("increment_photo_stat", {
        photo_id: photoId,
        stat_type: "shares",
      });

      if (error) throw error;

      // Share via Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Link foto berhasil disalin ke clipboard",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["photos"] });
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast({
          title: "Error",
          description: error.message || "Gagal share foto",
          variant: "destructive",
        });
      }
    }
  };

  return {
    photos,
    isLoading,
    error,
    handleLike,
    handleDownload,
    handleShare,
  };
};
