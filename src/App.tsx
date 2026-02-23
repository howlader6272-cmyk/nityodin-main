import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import { Analytics } from "@vercel/analytics/react";

// Pages
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderTracking from "./pages/OrderTracking";
import PaymentSuccess from "./pages/PaymentSuccess";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import ReturnPolicy from "./pages/ReturnPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Admin
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import AdminCategories from "./pages/admin/Categories";
import AdminCustomers from "./pages/admin/Customers";
import AdminCoupons from "./pages/admin/Coupons";
import AdminDeliveryZones from "./pages/admin/DeliveryZones";
import AdminBanners from "./pages/admin/Banners";
import AdminHeroImages from "./pages/admin/HeroImages";
import AdminSettings from "./pages/admin/Settings";
import AdminGeneralSettings from "./pages/admin/GeneralSettings";
import AdminChat from "./pages/admin/Chat";
import AdminIncompleteOrders from "./pages/admin/IncompleteOrders";
import AdminRecoveryAnalytics from "./pages/admin/RecoveryAnalytics";
import AdminContent from "./pages/admin/Content";
import AdminPayments from "./pages/admin/Payments";
import AdminPaymentGateways from "./pages/admin/PaymentGateways";
import AdminNewProduct from "./pages/admin/NewProduct";
import LiveChatWidget from "./components/chat/LiveChatWidget";
import { useSiteConfig } from "@/hooks/useAdminData";

const queryClient = new QueryClient();

const SiteConfigHead = () => {
  const { data: siteConfig } = useSiteConfig();

  useEffect(() => {
    if (!siteConfig) return;

    if (siteConfig.site_title) {
      document.title = siteConfig.site_title;
    }

    if (siteConfig.site_description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", siteConfig.site_description);
    }

    if (siteConfig.meta_keywords) {
      let meta = document.querySelector('meta[name="keywords"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "keywords");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", siteConfig.meta_keywords);
    }

    if (siteConfig.og_image_url) {
      let og = document.querySelector('meta[property="og:image"]');
      if (!og) {
        og = document.createElement("meta");
        og.setAttribute("property", "og:image");
        document.head.appendChild(og);
      }
      og.setAttribute("content", siteConfig.og_image_url);
    }

    if (siteConfig.favicon_url) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "icon");
        document.head.appendChild(link);
      }
      link.setAttribute("href", siteConfig.favicon_url);
    }
  }, [siteConfig]);

  useEffect(() => {
    const metaPixelId = siteConfig?.meta_pixel_id;
    const gaId = siteConfig?.google_analytics_id;
    const customScripts = siteConfig?.custom_head_scripts ?? siteConfig?.custom_scripts;

    const existingPixel = document.getElementById("site-meta-pixel");
    if (existingPixel) existingPixel.remove();
    const existingGtag = document.getElementById("site-ga");
    if (existingGtag) existingGtag.remove();
    const existingGtagInline = document.getElementById("site-ga-inline");
    if (existingGtagInline) existingGtagInline.remove();
    const existingCustom = document.getElementById("site-custom-scripts");
    if (existingCustom) existingCustom.remove();

    if (metaPixelId) {
      const script = document.createElement("script");
      script.id = "site-meta-pixel";
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${metaPixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }

    if (gaId) {
      const script = document.createElement("script");
      script.id = "site-ga";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      const inline = document.createElement("script");
      inline.id = "site-ga-inline";
      inline.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(inline);
    }

    if (customScripts) {
      const container = document.createElement("div");
      container.id = "site-custom-scripts";
      container.innerHTML = customScripts;
      document.head.appendChild(container);
    }
  }, [siteConfig]);

  useEffect(() => {
    // Apply theme settings
    if (!siteConfig) return;
    const root = document.documentElement;

    // Primary color: accept hex like #RRGGBB; convert to H S L string
    const toHslString = (hex: string): string | null => {
      const matched = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!matched) return null;
      const r = parseInt(matched[1], 16) / 255;
      const g = parseInt(matched[2], 16) / 255;
      const b = parseInt(matched[3], 16) / 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };

    if (siteConfig.primary_color) {
      const hsl = toHslString(siteConfig.primary_color);
      if (hsl) {
        root.style.setProperty("--primary", hsl);
        root.style.setProperty("--ring", hsl);
      }
    }

    // Dark mode default
    if (siteConfig.is_dark_mode === true) {
      root.classList.add("dark");
    } else if (siteConfig.is_dark_mode === false) {
      root.classList.remove("dark");
    }
  }, [siteConfig]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <SiteConfigHead />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:slug" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/account" element={<Account />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/auth" element={<Auth />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="categories" element={<AdminCategories />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="coupons" element={<AdminCoupons />} />
                <Route path="delivery-zones" element={<AdminDeliveryZones />} />
                <Route path="banners" element={<AdminBanners />} />
          <Route path="hero-images" element={<AdminHeroImages />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="general-settings" element={<AdminGeneralSettings />} />
                <Route path="chat" element={<AdminChat />} />
                <Route path="incomplete-orders" element={<AdminIncompleteOrders />} />
                <Route path="recovery-analytics" element={<AdminRecoveryAnalytics />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="payment-gateways" element={<AdminPaymentGateways />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="products/new" element={<AdminNewProduct />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
            <LiveChatWidget />
            <Analytics />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
