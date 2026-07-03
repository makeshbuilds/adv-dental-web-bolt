import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Trash2, Plus } from "lucide-react";

export default function AdminFaqEditor() {
  const { data: pageContent, isLoading: contentLoading } = trpc.faq.pageContent.get.useQuery();
  const { data: items, isLoading: itemsLoading } = trpc.faq.list.useQuery();
  const updatePageMutation = trpc.faq.pageContent.update.useMutation();
  const createMutation = trpc.faq.create.useMutation();
  const deleteMutation = trpc.faq.delete.useMutation();
  
  const [pageFormData, setPageFormData] = useState<any>({});
  const [newItem, setNewItem] = useState({ question: "", answer: "", sortOrder: 0 });

  useEffect(() => {
    if (pageContent) setPageFormData(pageContent);
  }, [pageContent]);

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePageMutation.mutateAsync(pageFormData);
      toast.success("FAQ page updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync(newItem as any);
      setNewItem({ question: "", answer: "", sortOrder: 0 });
      toast.success("FAQ item created!");
    } catch (error) {
      toast.error("Failed to create item");
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("FAQ item deleted!");
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
            <CardTitle>FAQ Page</CardTitle>
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
            <CardTitle>Add FAQ Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Question" value={newItem.question} onChange={(e) => setNewItem({ ...newItem, question: e.target.value })} required />
            <Textarea placeholder="Answer" value={newItem.answer} onChange={(e) => setNewItem({ ...newItem, answer: e.target.value })} required />
            <Button type="submit" disabled={createMutation.isPending} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add FAQ
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">FAQ Items</h3>
        {items && items.map((item) => (
          <Card key={item.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{item.question}</h4>
                  <p className="text-sm text-gray-600">{item.answer}</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
