import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Trash2, Plus } from "lucide-react";

export default function AdminWhyChooseUsEditor() {
  const { data: pageContent, isLoading: contentLoading } = trpc.whyChooseUs.pageContent.get.useQuery();
  const { data: features, isLoading: featuresLoading } = trpc.whyChooseUs.features.list.useQuery();
  const updatePageMutation = trpc.whyChooseUs.pageContent.update.useMutation();
  const createMutation = trpc.whyChooseUs.features.create.useMutation();
  const deleteMutation = trpc.whyChooseUs.features.delete.useMutation();
  
  const [pageFormData, setPageFormData] = useState<any>({});
  const [newFeature, setNewFeature] = useState({ heading: "", description: "", icon: "", sortOrder: 0 });

  useEffect(() => {
    if (pageContent) setPageFormData(pageContent);
  }, [pageContent]);

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePageMutation.mutateAsync(pageFormData);
      toast.success("Why Choose Us page updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(newFeature as any);
      setNewFeature({ heading: "", description: "", icon: "", sortOrder: 0 });
      toast.success("Feature created!");
    } catch (error) {
      toast.error("Failed to create feature");
    }
  };

  const handleDeleteFeature = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Feature deleted!");
    } catch (error) {
      toast.error("Failed to delete feature");
    }
  };

  if (contentLoading || featuresLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpdatePage} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={pageFormData.badge || ""} onChange={(e) => setPageFormData({ ...pageFormData, badge: e.target.value })} placeholder="Badge" />
            <Input value={pageFormData.heading || ""} onChange={(e) => setPageFormData({ ...pageFormData, heading: e.target.value })} placeholder="Heading" />
            <Textarea value={pageFormData.description || ""} onChange={(e) => setPageFormData({ ...pageFormData, description: e.target.value })} placeholder="Description" />
          </CardContent>
        </Card>
        <Button type="submit" disabled={updatePageMutation.isPending} size="lg">Save Page</Button>
      </form>

      <form onSubmit={handleCreateFeature} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Feature</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Heading" value={newFeature.heading} onChange={(e) => setNewFeature({ ...newFeature, heading: e.target.value })} required />
            <Textarea placeholder="Description" value={newFeature.description} onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })} />
            <Input placeholder="Icon (emoji)" value={newFeature.icon} onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })} />
            <Button type="submit" disabled={createMutation.isPending} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Feature
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Features</h3>
        {features && features.map((feature) => (
          <Card key={feature.id}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {feature.icon && <span className="text-2xl">{feature.icon}</span>}
                  <h4 className="font-semibold">{feature.heading}</h4>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteFeature(feature.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
