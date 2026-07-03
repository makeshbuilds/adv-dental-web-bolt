import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function Booking() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: pageContent, isLoading: contentLoading } = trpc.bookingPage.get.useQuery();
  const { data: formFields, isLoading: fieldsLoading } = trpc.bookingForm.fields.list.useQuery();
  const submitMutation = trpc.bookingForm.submit.useMutation();

  if (contentLoading || fieldsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitMutation.mutateAsync(formData);
      toast.success("Booking submitted successfully! We'll contact you soon.");
      setFormData({});
    } catch (error) {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.fieldName] || "";

    switch (field.fieldType) {
      case "text":
        return (
          <Input
            key={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
            required={field.isRequired}
          />
        );
      case "number":
        return (
          <Input
            key={field.id}
            type="number"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
            required={field.isRequired}
          />
        );
      case "email":
        return (
          <Input
            key={field.id}
            type="email"
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
            required={field.isRequired}
          />
        );
      case "date":
        return (
          <Input
            key={field.id}
            type="date"
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
            required={field.isRequired}
          />
        );
      case "textarea":
        return (
          <Textarea
            key={field.id}
            placeholder={field.placeholder}
            value={value}
            onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
            required={field.isRequired}
          />
        );
      case "dropdown":
        return (
          <Select
            key={field.id}
            value={value}
            onValueChange={(val) => setFormData({ ...formData, [field.fieldName]: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt: any) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case "radio":
        return (
          <div key={field.id} className="space-y-2">
            {field.options?.map((opt: any) => (
              <label key={opt.value} className="flex items-center">
                <input
                  type="radio"
                  name={field.fieldName}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => setFormData({ ...formData, [field.fieldName]: e.target.value })}
                  className="mr-2"
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              id={field.fieldName}
              checked={value === true}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, [field.fieldName]: checked })
              }
            />
            <label htmlFor={field.fieldName}>{field.label}</label>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        {pageContent?.backgroundMediaType === 'video' && pageContent?.backgroundVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
            src={pageContent.backgroundVideoUrl}
          />
        ) : pageContent?.backgroundImageUrl ? (
          <img
            src={pageContent.backgroundImageUrl}
            alt="Booking Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold">Book an Appointment</h1>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-12">
          {pageContent?.welcomeMessage && (
            <p className="text-lg text-gray-600 mb-8">{pageContent.welcomeMessage}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields && formFields.map((field) => (
              <div key={field.id}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.isRequired && <span className="text-red-500">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              size="lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Booking"}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}
