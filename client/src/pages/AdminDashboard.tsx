import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogOut } from "lucide-react";
import AdminClinicSettings from "@/components/admin/AdminClinicSettings";
import AdminHomeEditor from "@/components/admin/AdminHomeEditor";
import AdminAboutEditor from "@/components/admin/AdminAboutEditor";
import AdminServicesEditor from "@/components/admin/AdminServicesEditor";
import AdminGalleryEditor from "@/components/admin/AdminGalleryEditor";
import AdminFaqEditor from "@/components/admin/AdminFaqEditor";
import AdminWhyChooseUsEditor from "@/components/admin/AdminWhyChooseUsEditor";
import AdminBookingEditor from "@/components/admin/AdminBookingEditor";
import AdminSeoEditor from "@/components/admin/AdminSeoEditor";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("clinic");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You need admin privileges to access this page.</p>
          <Button onClick={() => setLocation("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.name || "Admin"}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 mb-8">
            <TabsTrigger value="clinic">Clinic</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="why">Why Us</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="clinic" className="space-y-4">
            <AdminClinicSettings />
          </TabsContent>

          <TabsContent value="home" className="space-y-4">
            <AdminHomeEditor />
          </TabsContent>

          <TabsContent value="about" className="space-y-4">
            <AdminAboutEditor />
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <AdminServicesEditor />
          </TabsContent>

          <TabsContent value="gallery" className="space-y-4">
            <AdminGalleryEditor />
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            <AdminFaqEditor />
          </TabsContent>

          <TabsContent value="why" className="space-y-4">
            <AdminWhyChooseUsEditor />
          </TabsContent>

          <TabsContent value="booking" className="space-y-4">
            <AdminBookingEditor />
          </TabsContent>

          <TabsContent value="seo" className="space-y-4">
            <AdminSeoEditor />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
