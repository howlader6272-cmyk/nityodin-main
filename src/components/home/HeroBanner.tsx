import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useAdminData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Banner {
  id: string;
  title_bn: string;
  subtitle_bn?: string;
  image_url: string;
  link_url?: string;
  focus_x?: number | null;
  focus_y?: number | null;
  zoom?: number | null;
  cta_text?: string | null;
}

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { data: siteConfig } = useSiteConfig();

  const { data: heroImages } = useQuery({
    queryKey: ["hero-images-active"],
    queryFn: async () => {
      console.log("Fetching active hero images for home...");
      const { data, error } = await supabase
        .from("hero_images")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false }); // Show newest first to match admin
      if (error) throw error;
      return data as {
        id: string;
        image_path: string;
        focus_x: number | null;
        focus_y: number | null;
        zoom: number | null;
        cta_text: string | null;
        cta_link: string | null;
        title_bn: string | null;
        subtitle_bn: string | null;
      }[] | null;
    },
    staleTime: 0, // Ensure we always get fresh data
    refetchOnWindowFocus: true,
  });

  const { data: heroBanners } = useQuery({
    queryKey: ["hero-banners-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .eq("position", "hero")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as any[] | null;
    },
  });

  const banners: Banner[] = useMemo(() => {
    const title = siteConfig?.hero_title || "";
    const subtitle = siteConfig?.hero_subtitle || "";
    const link = siteConfig?.cta_link || "";
    const globalCtaText = siteConfig?.cta_text || "এখনই কিনুন";

    const fromHeroImages: Banner[] =
      heroImages?.map((img) => {
        const { data } = supabase.storage.from("site-assets").getPublicUrl(img.image_path);
        return {
          id: img.id,
          title_bn: img.title_bn || title,
          subtitle_bn: img.subtitle_bn || subtitle,
          image_url: data.publicUrl,
          link_url: img.cta_link || link,
          focus_x: img.focus_x,
          focus_y: img.focus_y,
          zoom: img.zoom,
          cta_text: img.cta_text || globalCtaText,
        };
      }) ?? [];

    const fromHeroBanners: Banner[] =
      heroBanners?.map((b: any) => ({
        id: b.id,
        title_bn: b.title_bn || b.title || title,
        subtitle_bn: b.subtitle_bn || b.subtitle || subtitle,
        image_url: b.image_url,
        link_url: b.link_url || link,
        focus_x: b.focus_x ?? 50,
        focus_y: b.focus_y ?? 50,
        zoom: b.zoom ?? 1,
        cta_text: b.cta_text || globalCtaText,
      })) ?? [];

    const combined = [...fromHeroImages, ...fromHeroBanners];

    console.log("Combined banners for display:", combined);

    if (combined.length > 0) {
      return combined;
    }

    if (!siteConfig || !siteConfig.hero_image_url) {
      return [];
    }

    return [
      {
        id: "site-config",
        title_bn: title,
        subtitle_bn: subtitle,
        image_url: siteConfig.hero_image_url,
        link_url: link,
        cta_text: globalCtaText,
      },
    ];
  }, [heroImages, heroBanners, siteConfig]);

  const hasMultipleSlides = banners.length > 1;

  useEffect(() => {
    if (!hasMultipleSlides) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, hasMultipleSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[260px] sm:h-[360px] md:h-[480px] lg:h-[560px]">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0">
              <img
                src={banner.image_url}
                alt={banner.title_bn}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `${banner.focus_x ?? 50}% ${banner.focus_y ?? 50}%`,
                  transform: `scale(${banner.zoom ?? 1})`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
            </div>

            <div className="container relative h-full flex items-center">
              <div className="max-w-lg text-primary-foreground space-y-4 animate-fade-in">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  {banner.title_bn}
                </h2>
                {banner.subtitle_bn && (
                  <p className="text-lg sm:text-xl opacity-90">
                    {banner.subtitle_bn}
                  </p>
                )}
                {banner.link_url && (
                  <Link to={banner.link_url}>
                    <Button size="lg" className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground shadow-hover">
                      {banner.cta_text || siteConfig?.cta_text || "এখনই কিনুন"}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {hasMultipleSlides && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-md"
              aria-label="আগের ব্যানার"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-md"
              aria-label="পরের ব্যানার"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {hasMultipleSlides && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-accent w-8"
                    : "bg-card/60 hover:bg-card"
                }`}
                aria-label={`ব্যানার ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
