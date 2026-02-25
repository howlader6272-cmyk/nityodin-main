import { useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useAdminData";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  product_name?: string;
  avatar?: string;
}

const CustomerReviews = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: siteConfig } = useSiteConfig();

  const reviews: Review[] = useMemo(() => {
    const raw = siteConfig?.testimonial_json as any[] | null | undefined;
    if (raw && Array.isArray(raw) && raw.length > 0) {
      return raw.map((item, index) => ({
        id: item.id || String(index),
        customer_name: item.name || "",
        rating: Number(item.rating || 0),
        comment: item.text || "",
        product_name: item.product_name,
        avatar: item.photo_url,
      })).filter((r) => r.customer_name && r.comment);
    }
    return [];
  }, [siteConfig]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (siteConfig && siteConfig.show_testimonials === false) {
    return null;
  }

  if (reviews.length === 0) {
    return null;
  }
  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              গ্রাহকদের মতামত
            </h2>
            <p className="text-muted-foreground mt-1">
              আমাদের সম্মানিত গ্রাহকদের অভিজ্ঞতা
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-80 bg-card rounded-xl p-6 border border-border shadow-card"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-primary/20 mb-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted"
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-foreground leading-relaxed mb-4 line-clamp-3">
                "{review.comment}"
              </p>

              {/* Product */}
              {review.product_name && (
                <p className="text-sm text-primary font-medium mb-4">
                  {review.product_name}
                </p>
              )}

              {/* Customer */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">
                    {review.customer_name.charAt(0)}
                  </span>
                </div>
                <span className="font-medium text-foreground">
                  {review.customer_name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;
