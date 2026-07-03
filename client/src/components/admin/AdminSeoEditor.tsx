import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminSeoEditor() {
  const [pageSlug, setPageSlug] = useState("home");
  const { data: seoSettings, isLoading } = trpc.seo.getBySlug.useQuery(pageSlug);
  const updateMutation = trpc.seo.update.useMutation();
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ pageSlug, ...formData });
      toast.success("SEO settings updated!");
    } catch (error) {
      toast.error("Failed to update SEO settings");
    }
  };

  if (isLoading) return <Loader2 className="animate-spin" />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Page</CardTitle>
        </CardHeader>
        <CardContent>
          <select value={pageSlug} onChange={(e) => setPageSlug(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="home">Home</option>
            <option value="about">About</option>
            <option value="services">Services</option>
            <option value="gallery">Gallery</option>
            <option value="faq">FAQ</option>
            <option value="why-choose-us">Why Choose Us</option>
            <option value="booking">Booking</option>
          </select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Meta Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Page Title</label>
            <Input value={formData.pageTitle || ""} onChange={(e) => setFormData({ ...formData, pageTitle: e.target.value })} placeholder="Page title for browser tab" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <Textarea value={formData.metaDescription || ""} onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })} placeholder="Brief description for search results" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Keywords</label>
            <Input value={formData.metaKeywords || ""} onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })} placeholder="Comma-separated keywords" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Graph (Social Media)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={formData.ogTitle || ""} onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })} placeholder="OG Title" />
          <Textarea value={formData.ogDescription || ""} onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })} placeholder="OG Description" />
          <Input value={formData.ogImage || ""} onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })} placeholder="OG Image URL" />
        </CardContent>
      </Card>

      <Button type="submit" disabled={updateMutation.isPending} size="lg">
        {updateMutation.isPending ? "Saving..." : "Save SEO Settings"}
      </Button>
    </form>
  );
}
