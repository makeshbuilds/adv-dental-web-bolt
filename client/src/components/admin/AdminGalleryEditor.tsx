import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Trash2, Plus } from "lucide-react";

export default function AdminGalleryEditor() {
  const { data: pageContent, isLoading: contentLoading } = trpc.gallery.pageContent.get.useQuery();
  const { data: items, isLoading: itemsLoading } = trpc.gallery.list.useQuery();
  const updatePageMutation = trpc.gallery.pageContent.update.useMutation();
  const createMutation = trpc.gallery.create.useMutation();
  const deleteMutation = trpc.gallery.delete.useMutation();
  
  const [pageFormData, setPageFormData] = useState<any>({});
  const [newItem, setNewItem] = useState({ heading: "", description: "", imageUrl: "", sortOrder: 0 });

  useEffect(() => {
    if (pageContent) setPageFormData(pageContent);
  }, [pageContent]);

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePageMutation.mutateAsync(pageFormData);
      toast.success("Gallery page updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(newItem as any);
      setNewItem({ heading: "", description: "", imageUrl: "", sortOrder: 0 });
      toast.success("Gallery item created!");
    } catch (error) {
      toast.error("Failed to create item");
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Gallery item deleted!");
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  if (contentLoading || itemsLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpdatePage} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gallery Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input value={pageFormData.badge || ""} onChange={(e) => setPageFormData({ ...pageFormData, badge: e.target.value })} placeholder="Badge" />
            <Input value={pageFormData.heading || ""} onChange={(e) => setPageFormData({ ...pageFormData, heading: e.target.value })} placeholder="Heading" />
          </CardContent>
        </Card>
        <Button type="submit" disabled={updatePageMutation.isPending} size="lg">Save Page</Button>
      </form>

      <form onSubmit={handleCreateItem} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Gallery Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Heading" value={newItem.heading} onChange={(e) => setNewItem({ ...newItem, heading: e.target.value })} required />
            <Textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
            <Input placeholder="Image URL" value={newItem.imageUrl} onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })} required />
            <Button type="submit" disabled={createMutation.isPending} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Gallery Items</h3>
        {items && items.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div className="flex gap-4">
                {item.imageUrl && <img src={item.imageUrl} alt={item.heading} className="w-16 h-16 object-cover rounded" />}
                <div>
                  <h4 className="font-semibold">{item.heading}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
