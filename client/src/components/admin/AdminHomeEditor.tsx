import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminHomeEditor() {
  const { data: content, isLoading } = trpc.homePage.get.useQuery();
  const updateMutation = trpc.homePage.update.useMutation();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (content) {
      setFormData(content);
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Home page updated successfully!");
    } catch (error) {
      toast.error("Failed to update home page");
    }
  };

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>Edit the home page hero section</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Badge</label>
            <Input
              value={formData.badge || ""}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g., Welcome to our clinic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Main Heading</label>
            <Input
              value={formData.heading || ""}
              onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              placeholder="e.g., Healthy Smiles Start Here"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Background Image URL</label>
            <Input
              value={formData.backgroundImageUrl || ""}
              onChange={(e) => setFormData({ ...formData, backgroundImageUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Background Video URL</label>
            <Input
              value={formData.backgroundVideoUrl || ""}
              onChange={(e) => setFormData({ ...formData, backgroundVideoUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Background Media Type</label>
            <select
              value={formData.backgroundMediaType || "image"}
              onChange={(e) => setFormData({ ...formData, backgroundMediaType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={updateMutation.isPending} size="lg">
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
