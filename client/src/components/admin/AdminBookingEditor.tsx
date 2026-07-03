import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Trash2, Plus } from "lucide-react";

export default function AdminBookingEditor() {
  const { data: pageContent, isLoading: contentLoading } = trpc.bookingPage.get.useQuery();
  const { data: fields, isLoading: fieldsLoading } = trpc.bookingForm.fields.list.useQuery();
  const updatePageMutation = trpc.bookingPage.update.useMutation();
  const createFieldMutation = trpc.bookingForm.fields.create.useMutation();
  const deleteFieldMutation = trpc.bookingForm.fields.delete.useMutation();
  
  const [pageFormData, setPageFormData] = useState<any>({});
  const [newField, setNewField] = useState({ fieldName: "", fieldType: "text", label: "", placeholder: "", isRequired: false, sortOrder: 0 });

  useEffect(() => {
    if (pageContent) setPageFormData(pageContent);
  }, [pageContent]);

  const handleUpdatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePageMutation.mutateAsync(pageFormData);
      toast.success("Booking page updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const handleCreateField = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createFieldMutation.mutateAsync(newField as any);
      setNewField({ fieldName: "", fieldType: "text", label: "", placeholder: "", isRequired: false, sortOrder: 0 });
      toast.success("Form field created!");
    } catch (error) {
      toast.error("Failed to create field");
    }
  };

  const handleDeleteField = async (id: number) => {
    try {
      await deleteFieldMutation.mutateAsync(id);
      toast.success("Form field deleted!");
    } catch (error) {
      toast.error("Failed to delete field");
    }
  };

  if (contentLoading || fieldsLoading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-6">
      <form onSubmit={handleUpdatePage} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Booking Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea value={pageFormData.welcomeMessage || ""} onChange={(e) => setPageFormData({ ...pageFormData, welcomeMessage: e.target.value })} placeholder="Welcome message" />
          </CardContent>
        </Card>
        <Button type="submit" disabled={updatePageMutation.isPending} size="lg">Save Page</Button>
      </form>

      <form onSubmit={handleCreateField} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Form Field</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Field Name" value={newField.fieldName} onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })} required />
            <Input placeholder="Label" value={newField.label} onChange={(e) => setNewField({ ...newField, label: e.target.value })} required />
            <select value={newField.fieldType} onChange={(e) => setNewField({ ...newField, fieldType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="date">Date</option>
              <option value="textarea">Textarea</option>
            </select>
            <Input placeholder="Placeholder" value={newField.placeholder} onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })} />
            <label className="flex items-center">
              <input type="checkbox" checked={newField.isRequired} onChange={(e) => setNewField({ ...newField, isRequired: e.target.checked })} className="mr-2" />
              Required
            </label>
            <Button type="submit" disabled={createFieldMutation.isPending} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Field
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Form Fields</h3>
        {fields && fields.map((field) => (
          <Card key={field.id}>
            <CardContent className="pt-6 flex items-center justify-between">
              <div>
                <h4 className="font-semibold">{field.label}</h4>
                <p className="text-sm text-gray-600">{field.fieldType} {field.isRequired && "- Required"}</p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteField(field.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
