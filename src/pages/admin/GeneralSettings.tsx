import { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Save,
  Plus,
  Trash2,
  Info,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import ImageUpload from "@/components/admin/ImageUpload";
import { useSiteConfig, useUpdateSiteConfig } from "@/hooks/useAdminData";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface HelpLabelProps {
  id?: string;
  label: string;
  help: string;
}

const HelpLabel = ({ id, label, help }: HelpLabelProps) => (
  <div className="flex items-center justify-between gap-2">
    <Label htmlFor={id}>{label}</Label>
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground"
        >
          <Info className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">
        {help}
      </TooltipContent>
    </Tooltip>
  </div>
);

const AdminGeneralSettings = () => {
  const { data: siteConfig, isLoading } = useSiteConfig();
  const updateSiteConfig = useUpdateSiteConfig();
  const [form, setForm] = useState({
    logo_url: "",
    favicon_url: "",
    og_image_url: "",
    site_title: "",
    site_description: "",
    meta_keywords: "",
    hero_title: "",
    hero_subtitle: "",
    hero_image_url: "",
    cta_text: "",
    cta_link: "",
    primary_color: "",
    is_dark_mode: false as boolean | undefined,
    meta_pixel_id: "",
    google_analytics_id: "",
    custom_scripts: "",
    custom_head_scripts: "",
    phone_number: "",
    whatsapp_number: "",
    facebook_link: "",
    announcement_text: "",
    countdown_end: "",
    popup_enabled: false as boolean | undefined,
    popup_image_url: "",
    popup_text: "",
    show_testimonials: true as boolean | undefined,
    show_promo_bar: true as boolean | undefined,
    show_faq_link: true as boolean | undefined,
    footer_copyright: "",
  });
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    if (!siteConfig) return;
    setForm({
      logo_url: siteConfig.logo_url || "",
      favicon_url: siteConfig.favicon_url || "",
      og_image_url: siteConfig.og_image_url || "",
      site_title: siteConfig.site_title || "",
      site_description: siteConfig.site_description || "",
      meta_keywords: siteConfig.meta_keywords || "",
      hero_title: siteConfig.hero_title || "",
      hero_subtitle: siteConfig.hero_subtitle || "",
      hero_image_url: siteConfig.hero_image_url || "",
      cta_text: siteConfig.cta_text || "",
      cta_link: siteConfig.cta_link || "",
      primary_color: siteConfig.primary_color || "",
      is_dark_mode: siteConfig.is_dark_mode ?? false,
      meta_pixel_id: siteConfig.meta_pixel_id || "",
      google_analytics_id: siteConfig.google_analytics_id || "",
      custom_scripts: siteConfig.custom_scripts || "",
      custom_head_scripts: siteConfig.custom_head_scripts || "",
      phone_number: siteConfig.phone_number || "",
      whatsapp_number: siteConfig.whatsapp_number || "",
      facebook_link: siteConfig.facebook_link || "",
      announcement_text: siteConfig.announcement_text || "",
      countdown_end: siteConfig.countdown_end
        ? new Date(siteConfig.countdown_end).toISOString()
        : "",
      popup_enabled: siteConfig.popup_enabled ?? false,
      popup_image_url: siteConfig.popup_image_url || "",
      popup_text: siteConfig.popup_text || "",
      show_testimonials: siteConfig.show_testimonials ?? true,
      show_promo_bar: siteConfig.show_promo_bar ?? true,
      show_faq_link: siteConfig.show_faq_link ?? true,
      footer_copyright: siteConfig.footer_copyright || "",
    });
    setTestimonials((siteConfig.testimonial_json as any[]) || []);
  }, [siteConfig]);

  const countdownDate = useMemo(
    () => (form.countdown_end ? new Date(form.countdown_end) : undefined),
    [form.countdown_end],
  );

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: "",
        photo_url: "",
        rating: 5,
        text: "",
      },
    ]);
  };

  const handleUpdateTestimonial = (index: number, field: string, value: any) => {
    setTestimonials((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSave = async () => {
    await updateSiteConfig.mutateAsync({
      id: siteConfig?.id,
      ...form,
      countdown_end: form.countdown_end || null,
      testimonial_json: testimonials,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[280px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-foreground">General Settings</h1>
        <p className="text-muted-foreground">Manage site-wide branding and content</p>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <div className="overflow-x-auto -mx-1 px-1">
          <TabsList className="flex w-max gap-2 sm:w-full sm:grid sm:grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="branding" className="whitespace-nowrap">
              Branding & SEO
            </TabsTrigger>
            <TabsTrigger value="design" className="whitespace-nowrap">
              Design
            </TabsTrigger>
            <TabsTrigger value="hero" className="whitespace-nowrap">
              Hero & Promo
            </TabsTrigger>
            <TabsTrigger value="tracking" className="whitespace-nowrap">
              Tracking & Scripts
            </TabsTrigger>
            <TabsTrigger value="contact" className="whitespace-nowrap">
              Contact & Footer
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="whitespace-nowrap">
              Testimonials
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="branding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding & OG Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <ImageUpload
                    value={form.logo_url}
                    onChange={(value) => setForm({ ...form, logo_url: value })}
                    folder="branding"
                    bucket="site-assets"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <ImageUpload
                    value={form.favicon_url}
                    onChange={(value) => setForm({ ...form, favicon_url: value })}
                    folder="branding"
                    bucket="site-assets"
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Image</Label>
                  <ImageUpload
                    value={form.og_image_url}
                    onChange={(value) => setForm({ ...form, og_image_url: value })}
                    folder="seo"
                    bucket="site-assets"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Site Identity & SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input
                    id="site-title"
                    value={form.site_title}
                    onChange={(e) => setForm({ ...form, site_title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea
                    id="site-description"
                    value={form.site_description}
                    onChange={(e) => setForm({ ...form, site_description: e.target.value })}
                    rows={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-keywords">Meta Keywords</Label>
                  <Input
                    id="meta-keywords"
                    value={form.meta_keywords}
                    onChange={(e) => setForm({ ...form, meta_keywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="design">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <Input
                    type="color"
                    value={form.primary_color || "#86b049"}
                    onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    বাটন ও হাইলাইট কালার পরিবর্তনের জন্য একটি রং নির্বাচন করুন
                  </p>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Dark Mode Default</Label>
                    <p className="text-sm text-muted-foreground">ডিফল্ট থিম ডার্ক হিসেবে সেট করুন</p>
                  </div>
                  <Switch
                    checked={!!form.is_dark_mode}
                    onCheckedChange={(v) => setForm({ ...form, is_dark_mode: v })}
                  />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Homepage Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Show Testimonials</Label>
                    <p className="text-sm text-muted-foreground">
                      হোমপেজে গ্রাহক রিভিউ সেকশন দেখাবেন কি না নির্বাচন করুন।
                    </p>
                  </div>
                  <Switch
                    checked={!!form.show_testimonials}
                    onCheckedChange={(v) => setForm({ ...form, show_testimonials: v })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Show Promo Bar</Label>
                    <p className="text-sm text-muted-foreground">
                      উপরের অফার স্ক্রল বারটি চালু বা বন্ধ করুন।
                    </p>
                  </div>
                  <Switch
                    checked={!!form.show_promo_bar}
                    onCheckedChange={(v) => setForm({ ...form, show_promo_bar: v })}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Show FAQ Link</Label>
                    <p className="text-sm text-muted-foreground">
                      ফুটারের দ্রুত লিংকে FAQ দেখাবেন কি না নির্বাচন করুন।
                    </p>
                  </div>
                  <Switch
                    checked={!!form.show_faq_link}
                    onCheckedChange={(v) => setForm({ ...form, show_faq_link: v })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="hero">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title">Headline</Label>
                  <Input
                    id="hero-title"
                    value={form.hero_title}
                    onChange={(e) => setForm({ ...form, hero_title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle">Sub-headline</Label>
                  <Textarea
                    id="hero-subtitle"
                    value={form.hero_subtitle}
                    onChange={(e) => setForm({ ...form, hero_subtitle: e.target.value })}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hero Media & CTA</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hero image is now managed via Hero Images gallery page */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-text">CTA Text</Label>
                    <Input
                      id="cta-text"
                      value={form.cta_text}
                      onChange={(e) => setForm({ ...form, cta_text: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-link">CTA Link</Label>
                    <Input
                      id="cta-link"
                      value={form.cta_link}
                      onChange={(e) => setForm({ ...form, cta_link: e.target.value })}
                      placeholder="https://"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="marketing">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Promo & Popup Manager</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="announcement">Announcement</Label>
                  <Textarea
                    id="announcement"
                    value={form.announcement_text}
                    onChange={(e) => setForm({ ...form, announcement_text: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Countdown End</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        {countdownDate ? format(countdownDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={countdownDate}
                        onSelect={(date) =>
                          setForm({ ...form, countdown_end: date ? date.toISOString() : "" })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label className="text-base">Enable Promo Popup</Label>
                    <p className="text-sm text-muted-foreground">সাইটে ঢোকার সাথে পপ-আপ দেখান</p>
                  </div>
                  <Switch
                    checked={!!form.popup_enabled}
                    onCheckedChange={(v) => setForm({ ...form, popup_enabled: v })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Popup Image</Label>
                  <ImageUpload
                    value={form.popup_image_url}
                    onChange={(value) => setForm({ ...form, popup_image_url: value })}
                    folder="promo"
                    bucket="site-assets"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="popup-text">Popup Text</Label>
                  <Textarea
                    id="popup-text"
                    value={form.popup_text}
                    onChange={(e) => setForm({ ...form, popup_text: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tracking IDs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-pixel">Meta Pixel ID</Label>
                  <Input
                    id="meta-pixel"
                    value={form.meta_pixel_id}
                    onChange={(e) => setForm({ ...form, meta_pixel_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ga-id">Google Analytics ID</Label>
                  <Input
                    id="ga-id"
                    value={form.google_analytics_id}
                    onChange={(e) => setForm({ ...form, google_analytics_id: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Header / Footer Scripts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  value={form.custom_head_scripts}
                  onChange={(e) => setForm({ ...form, custom_head_scripts: e.target.value })}
                  rows={8}
                  placeholder="<script>...</script>"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone_number}
                    onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={form.whatsapp_number}
                    onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook Link</Label>
                  <Input
                    id="facebook"
                    value={form.facebook_link}
                    onChange={(e) => setForm({ ...form, facebook_link: e.target.value })}
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Footer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input
                  id="copyright"
                  value={form.footer_copyright}
                  onChange={(e) => setForm({ ...form, footer_copyright: e.target.value })}
                  placeholder={`© ${new Date().getFullYear()} ${form.site_title}`}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Testimonials</h2>
              <Button type="button" onClick={handleAddTestimonial} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Testimonial
              </Button>
            </div>
            <div className="space-y-4">
              {testimonials.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  এখনো কোনো টেস্টিমোনিয়াল যোগ করা হয়নি।
                </p>
              )}
              {testimonials.map((item, index) => (
                <Card key={item.id || index}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">
                      Testimonial {index + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveTestimonial(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={item.name || ""}
                        onChange={(e) => handleUpdateTestimonial(index, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Rating (1-5)</Label>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        value={item.rating ?? 5}
                        onChange={(e) =>
                          handleUpdateTestimonial(
                            index,
                            "rating",
                            Math.min(5, Math.max(1, Number(e.target.value) || 1)),
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Photo</Label>
                      <ImageUpload
                        value={item.photo_url || ""}
                        onChange={(value) => handleUpdateTestimonial(index, "photo_url", value)}
                        folder="testimonials"
                        bucket="site-assets"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Review Text</Label>
                      <Textarea
                        rows={4}
                        value={item.text || ""}
                        onChange={(e) => handleUpdateTestimonial(index, "text", e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button className="gap-2" onClick={handleSave} disabled={updateSiteConfig.isPending}>
          <Save className="h-4 w-4" />
          {updateSiteConfig.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  );
};

export default AdminGeneralSettings;
