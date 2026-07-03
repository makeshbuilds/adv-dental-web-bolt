import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminClinicSettings() {
  const { data: settings, isLoading } = trpc.clinicSettings.get.useQuery();
  const updateMutation = trpc.clinicSettings.update.useMutation();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const utils = trpc.useUtils();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync(formData);
      await utils.clinicSettings.get.invalidate();
      toast.success("Clinic settings updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update clinic settings");
    }
  };

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clinic Information</CardTitle>
          <CardDescription>Manage your clinic's basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Clinic Name</label>
            <Input
              value={formData.clinicName || ""}
              onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Textarea
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doctor Information</CardTitle>
          <CardDescription>Manage doctor profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Doctor Name</label>
            <Input
              value={formData.doctorName || ""}
              onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Qualification</label>
            <Input
              value={formData.doctorQualification || ""}
              onChange={(e) => setFormData({ ...formData, doctorQualification: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience (Years)</label>
            <Input
              value={formData.doctorExperience || ""}
              onChange={(e) => setFormData({ ...formData, doctorExperience: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Links</CardTitle>
          <CardDescription>Add your social media profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp</label>
            <Input
              value={formData.whatsapp || ""}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="https://wa.me/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <Input
              value={formData.instagram || ""}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook</label>
            <Input
              value={formData.facebook || ""}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Google Business</label>
            <Input
              value={formData.googleBusiness || ""}
              onChange={(e) => setFormData({ ...formData, googleBusiness: e.target.value })}
              placeholder="https://google.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">YouTube</label>
            <Input
              value={formData.youtube || ""}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <Input
              value={formData.linkedin || ""}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              placeholder="https://linkedin.com/..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booking Notifications</CardTitle>
          <CardDescription>Where to send booking form submissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Notification Email</label>
            <Input
              type="email"
              value={formData.bookingNotificationEmail || ""}
              onChange={(e) => setFormData({ ...formData, bookingNotificationEmail: e.target.value })}
              placeholder="admin@clinic.com"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={updateMutation.isPending} size="lg">
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
