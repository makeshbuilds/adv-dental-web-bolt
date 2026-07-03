import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminAboutEditor() {
  const { data: content, isLoading } = trpc.aboutPage.get.useQuery();
  const updateMutation = trpc.aboutPage.update.useMutation();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (content) setFormData(content);
  }, [content]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      toast.success("About page updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About Page</CardTitle>
          <CardDescription>Edit about page content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Badge</label>
            <Input value={formData.badge || ""} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Heading</label>
            <Input value={formData.heading || ""} onChange={(e) => setFormData({ ...formData, heading: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Doctor Image URL</label>
            <Input value={formData.doctorImageUrl || ""} onChange={(e) => setFormData({ ...formData, doctorImageUrl: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Background Image URL</label>
            <Input value={formData.backgroundImageUrl || ""} onChange={(e) => setFormData({ ...formData, backgroundImageUrl: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Background Video URL</label>
            <Input value={formData.backgroundVideoUrl || ""} onChange={(e) => setFormData({ ...formData, backgroundVideoUrl: e.target.value })} />
          </div>
        </CardContent>
      </Card>
      <Button type="submit" disabled={updateMutation.isPending} size="lg">
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
