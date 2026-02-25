import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import CategorySlider from "@/components/home/CategorySlider";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromotionalBanners from "@/components/home/PromotionalBanners";
import AllProducts from "@/components/home/AllProducts";
import CustomerReviews from "@/components/home/CustomerReviews";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Benefits from "@/components/home/Benefits";
import MoneyBackGuarantee from "@/components/home/MoneyBackGuarantee";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/hooks/useAdminData";

const Index = () => {
  const { data: siteConfig } = useSiteConfig();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!siteConfig?.popup_enabled) return;
    const dismissed = localStorage.getItem("promo_popup_dismissed");
    if (dismissed !== "true") {
      setOpen(true);
    }
  }, [siteConfig]);

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem("promo_popup_dismissed", "true");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={0} />
      
      <main className="flex-1">
        <HeroBanner />
        <CategorySlider />
        <FeaturedProducts />
        <PromotionalBanners />
        <AllProducts />
        <CustomerReviews />
        <WhyChooseUs />
        <Benefits />
        <MoneyBackGuarantee />
      </main>

      <Footer />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>বিশেষ অফার</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {siteConfig?.popup_image_url && (
              <img
                src={siteConfig.popup_image_url}
                alt="Promo"
                className="w-full rounded-md"
              />
            )}
            {siteConfig?.popup_text && (
              <p className="text-sm text-muted-foreground">{siteConfig.popup_text}</p>
            )}
            <div className="flex justify-end">
              <Button onClick={handleClose}>ঠিক আছে</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Index;
