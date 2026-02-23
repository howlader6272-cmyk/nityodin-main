import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HeroImage {
  id: string;
  image_path: string;
  is_active: boolean | null;
  focus_x?: number | null;
  focus_y?: number | null;
  zoom?: number | null;
  cta_text?: string | null;
  cta_link?: string | null;
}

const AdminHeroImages = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);
  const [cropPreview, setCropPreview] = useState<string | null>(null);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const [focusX, setFocusX] = useState(50);
  const [focusY, setFocusY] = useState(50);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [zoom, setZoom] = useState(1);
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");

  const { data: images, isLoading } = useQuery({
    queryKey: ["hero-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_images")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as HeroImage[];
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("hero_images")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-images"] });
    },
    onError: () => toast.error("স্ট্যাটাস আপডেট করা যায়নি"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (image: HeroImage) => {
      const path = image.image_path;
      const { error: storageError } = await supabase.storage
        .from("site-assets")
        .remove([path]);
      if (storageError) throw storageError;

      const { error } = await supabase
        .from("hero_images")
        .delete()
        .eq("id", image.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero-images"] });
      toast.success("ছবি ডিলিট হয়েছে");
    },
    onError: () => toast.error("ছবি ডিলিট করা যায়নি"),
  });

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("শুধুমাত্র ছবি আপলোড করা যাবে");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ছবির সাইজ ৫MB এর বেশি হতে পারবে না");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setCropPreview(previewUrl);
    setCropFile(file);
    setFocusX(50);
    setFocusY(50);
    setZoom(1);
    setCtaText("");
    setCtaLink("");
    setEditingImage(null);
    setCropOpen(true);
    event.target.value = "";
  };

  const handleConfirmCrop = async () => {
    if (!cropFile && !editingImage) return;

    setUploading(true);

    try {
      if (cropFile) {
        const ext = cropFile.name.split(".").pop();
        const fileName = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("site-assets")
          .upload(fileName, cropFile);
        if (uploadError) throw uploadError;

        const { data, error } = await supabase
          .from("hero_images")
          .insert({
            image_path: fileName,
            is_active: true,
            focus_x: focusX,
            focus_y: focusY,
            zoom,
            cta_text: ctaText || null,
            cta_link: ctaLink || null,
          })
          .select("*")
          .single();
        if (error) throw error;

        queryClient.setQueryData(
          { queryKey: ["hero-images"] },
          (prev: HeroImage[] | undefined) => [data as HeroImage, ...(prev ?? [])],
        );

        toast.success("হিরো ছবি আপলোড হয়েছে");
      } else if (editingImage) {
        const { error } = await supabase
          .from("hero_images")
          .update({
            focus_x: focusX,
            focus_y: focusY,
            zoom,
            cta_text: ctaText || null,
            cta_link: ctaLink || null,
          })
          .eq("id", editingImage.id);
        if (error) throw error;

        queryClient.setQueryData(
          { queryKey: ["hero-images"] },
          (prev: HeroImage[] | undefined) =>
            (prev ?? []).map((img) =>
              img.id === editingImage.id ? { ...img, focus_x: focusX, focus_y: focusY, zoom } : img,
            ),
        );

        toast.success("হিরো ছবির crop আপডেট হয়েছে");
      }
      setCropOpen(false);
      if (cropPreview) {
        URL.revokeObjectURL(cropPreview);
      }
      setCropPreview(null);
      setCropFile(null);
      setEditingImage(null);
      setZoom(1);
      setCtaText("");
      setCtaLink("");
    } catch (error) {
      console.error(error);
      toast.error("ছবি আপলোড করা যায়নি");
    } finally {
      setUploading(false);
    }
  };

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from("site-assets").getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hero Images</h1>
          <p className="text-muted-foreground">
            হোমপেজ হিরো সেকশনের জন্য সব ছবি এখানে ম্যানেজ করুন।
          </p>
        </div>
        <div>
          <Dialog open={cropOpen} onOpenChange={setCropOpen}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Hero Image Crop / Position</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {cropPreview && (
                  <div className="w-full aspect-[16/9] rounded-lg border overflow-hidden bg-muted">
                    <img
                      src={cropPreview}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: `${focusX}% ${focusY}%`,
                        transform: `scale(${zoom})`,
                      }}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Horizontally image kothay focus thakবে</p>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[focusX]}
                    onValueChange={([value]) => setFocusX(value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Vertically image kothay focus thakবে</p>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[focusY]}
                    onValueChange={([value]) => setFocusY(value)}
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Zoom</p>
                  <Slider
                    min={1}
                    max={2}
                    step={0.01}
                    value={[zoom]}
                    onValueChange={([value]) => setZoom(value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Text (optional)</Label>
                  <Input value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link (optional)</Label>
                  <Input
                    value={ctaLink}
                    onChange={(e) => setCtaLink(e.target.value)}
                    placeholder="https://"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCropOpen(false);
                    if (cropPreview) {
                      URL.revokeObjectURL(cropPreview);
                    }
                    setCropPreview(null);
                    setCropFile(null);
                    setEditingImage(null);
                    setZoom(1);
                    setCtaText("");
                    setCtaLink("");
                  }}
                >
                  বাতিল
                </Button>
                <Button type="button" onClick={handleConfirmCrop} disabled={uploading}>
                  {uploading ? "আপলোড হচ্ছে..." : "Crop করে আপলোড করুন"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <input
            id="hero-image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
          <Button
            type="button"
            className="gap-2"
            disabled={uploading}
            onClick={() =>
              (document.getElementById("hero-image-upload") as HTMLInputElement | null)?.click()
            }
          >
            <Upload className="h-4 w-4" />
            {uploading ? "আপলোড হচ্ছে..." : "Upload Image"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>লোড হচ্ছে...</p>
          ) : !images || images.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              এখনো কোনো হিরো ছবি যোগ করা হয়নি।
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative rounded-lg border overflow-hidden"
                >
                      <button
                        type="button"
                        className="block w-full h-32 relative group"
                        onClick={() => {
                          const url = getPublicUrl(image.image_path);
                          setCropPreview(url);
                          setCropFile(null);
                          setFocusX(image.focus_x ?? 50);
                          setFocusY(image.focus_y ?? 50);
                          setZoom(image.zoom ?? 1);
                          setCtaText(image.cta_text ?? "");
                          setCtaLink(image.cta_link ?? "");
                          setEditingImage(image);
                          setCropOpen(true);
                        }}
                      >
                        <img
                          src={getPublicUrl(image.image_path)}
                          alt="Hero"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          style={{
                            objectPosition: `${image.focus_x ?? 50}% ${image.focus_y ?? 50}%`,
                          }}
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-white transition-opacity">
                          Crop / Position edit করুন
                        </div>
                      </button>
                  <div className="flex items-center justify-between px-2 py-2 border-t bg-background/80">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!!image.is_active}
                        onCheckedChange={(v) =>
                          toggleMutation.mutate({ id: image.id, is_active: v })
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {image.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteMutation.mutate(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHeroImages;
