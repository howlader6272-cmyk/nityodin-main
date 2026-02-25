import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface BannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: any;
}

export const BannerDialog = ({ open, onOpenChange, banner }: BannerDialogProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    title_bn: "",
    subtitle: "",
    subtitle_bn: "",
    image_url: "",
    link_url: "",
    position: "hero",
    sort_order: "0",
    is_active: true,
    focus_x: 50,
    focus_y: 50,
    zoom: 1,
  });

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title || "",
        title_bn: banner.title_bn || "",
        subtitle: banner.subtitle || "",
        subtitle_bn: banner.subtitle_bn || "",
        image_url: banner.image_url || "",
        link_url: banner.link_url || "",
        position: banner.position || "hero",
        sort_order: banner.sort_order?.toString() || "0",
        is_active: banner.is_active ?? true,
        focus_x: banner.focus_x ?? 50,
        focus_y: banner.focus_y ?? 50,
        zoom: banner.zoom ?? 1,
      });
    } else {
      setForm({
        title: "",
        title_bn: "",
        subtitle: "",
        subtitle_bn: "",
        image_url: "",
        link_url: "",
        position: "hero",
        sort_order: "0",
        is_active: true,
      });
    }
  }, [banner, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      title: form.title || null,
      title_bn: form.title_bn || null,
      subtitle: form.subtitle || null,
      subtitle_bn: form.subtitle_bn || null,
      image_url: form.image_url,
      link_url: form.link_url || null,
      position: form.position,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
      focus_x: form.focus_x,
      focus_y: form.focus_y,
      zoom: form.zoom,
    };

    try {
      if (banner) {
        const { error } = await supabase.from("banners").update(data).eq("id", banner.id);
        if (error) throw error;
        toast.success("ব্যানার আপডেট হয়েছে");
      } else {
        const { error } = await supabase.from("banners").insert(data);
        if (error) throw error;
        toast.success("ব্যানার যোগ হয়েছে");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      onOpenChange(false);
    } catch (error) {
      toast.error("কিছু সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{banner ? "ব্যানার এডিট করুন" : "নতুন ব্যানার"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>টাইটেল (English)</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>টাইটেল (বাংলা)</Label>
              <Input
                value={form.title_bn}
                onChange={(e) => setForm({ ...form, title_bn: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>সাবটাইটেল (English)</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>সাবটাইটেল (বাংলা)</Label>
              <Input
                value={form.subtitle_bn}
                onChange={(e) => setForm({ ...form, subtitle_bn: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>ছবির URL *</Label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>লিংক URL</Label>
            <Input
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>পজিশন</Label>
              <Select value={form.position} onValueChange={(v) => setForm({ ...form, position: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hero">হিরো ব্যানার</SelectItem>
                  <SelectItem value="promo">প্রমো ব্যানার</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>সর্ট অর্ডার</Label>
              <Input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              />
            </div>
          </div>
          {form.position === "hero" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Horizontal position</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[form.focus_x]}
                  onValueChange={([value]) => setForm({ ...form, focus_x: value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Vertical position</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[form.focus_y]}
                  onValueChange={([value]) => setForm({ ...form, focus_y: value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Zoom</Label>
                <Slider
                  min={1}
                  max={2}
                  step={0.01}
                  value={[form.zoom]}
                  onValueChange={([value]) => setForm({ ...form, zoom: value })}
                />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
            <Label>সক্রিয়</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              বাতিল
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
