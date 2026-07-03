import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Trash2, Plus } from "lucide-react";

export default function AdminServicesEditor() {
  const { data: pageContent, isLoading: contentLoading } = trpc.services.pageContent.get.useQuery();
  const { data: services, isLoading: servicesLoading } = trpc.services.list.useQuery();
  const updatePageMutation = trpc.services.pageContent.update.useMutation();
  const createMutation = trpc.services.create.useMutation();
  const updateMutation = trpc.services.update.useMutation();
  const deleteMutation = trpc.services.delete.useMutation();
  
  const [pageFormData, setPageFormData] = useState<any>({});
  const [newService, setNewService] = useState({ title: "", slug: "", shortDescription: "", detailedDescription: "", imageUrl: "", sortOrder: 0 });

  useEffect(() => {
    if (pageContent) setPageFormData(pageContent);
  }, [pageContent]);

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePageMutation.mutateAsync(pageFormData);
      toast.success("Services page updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(newService as any);
      setNewService({ title: "", slug: "", shortDescription: "", detailedDescription: "", imageUrl: "", sortOrder: 0 });
      toast.success("Service created!");
    } catch (error) {
      toast.error("Failed to create service");
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Service deleted!");
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  if (contentLoading || servicesLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpdatePage} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Services Page</CardTitle>
            <CardDescription>Edit services page header</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Badge</label>
              <Input value={pageFormData.badge || ""} onChange={(e) => setPageFormData({ ...pageFormData, badge: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heading</label>
              <Input value={pageFormData.heading || ""} onChange={(e) => setPageFormData({ ...pageFormData, heading: e.target.value })} />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" disabled={updatePageMutation.isPending} size="lg">
          {updatePageMutation.isPending ? "Saving..." : "Save Page"}
        </Button>
      </form>

      <form onSubmit={handleCreateService} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Title" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} required />
            <Input placeholder="Slug" value={newService.slug} onChange={(e) => setNewService({ ...newService, slug: e.target.value })} required />
            <Textarea placeholder="Short Description" value={newService.shortDescription} onChange={(e) => setNewService({ ...newService, shortDescription: e.target.value })} />
            <Textarea placeholder="Detailed Description" value={newService.detailedDescription} onChange={(e) => setNewService({ ...newService, detailedDescription: e.target.value })} />
            <Input placeholder="Image URL" value={newService.imageUrl} onChange={(e) => setNewService({ ...newService, imageUrl: e.target.value })} />
            <Button type="submit" disabled={createMutation.isPending} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Service
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Services</h3>
        {services && services.map((service) => (
          <Card key={service.id}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{service.title}</h4>
                <p className="text-sm text-gray-600">{service.shortDescription}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
