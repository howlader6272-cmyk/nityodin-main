import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";

interface HeroImage {
  id: string;
  image_path: string;
  is_active: boolean | null;
}

const AdminHeroImages = () => {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

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

    setUploading(true);

    try {
      const ext = file.name.split(".").pop();
      const fileName = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { error } = await supabase
        .from("hero_images")
        .insert({ image_path: fileName, is_active: true });
      if (error) throw error;

      toast.success("হিরো ছবি আপলোড হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["hero-images"] });
    } catch (error) {
      console.error(error);
      toast.error("ছবি আপলোড করা যায়নি");
    } finally {
      setUploading(false);
      event.target.value = "";
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
                  <img
                    src={getPublicUrl(image.image_path)}
                    alt="Hero"
                    className="w-full h-32 object-cover"
                  />
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
