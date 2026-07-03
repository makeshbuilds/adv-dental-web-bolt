import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function ServiceDetail() {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/services/:slug");
  const { data: service, isLoading } = trpc.services.getBySlug.useQuery(params?.slug || "", {
    enabled: !!params?.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <Button onClick={() => setLocation("/services")}>Back to Services</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        {service.imageUrl ? (
          <img
            src={service.imageUrl}
            alt={service.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold">{service.title}</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-12">
          <h2 className="text-4xl font-bold mb-6">{service.title}</h2>
          
          {service.shortDescription && (
            <p className="text-xl text-gray-600 mb-8">{service.shortDescription}</p>
          )}

          {service.detailedDescription && (
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-gray-700 whitespace-pre-wrap">
                {service.detailedDescription}
              </div>
            </div>
          )}

          <div className="mt-12 pt-8 border-t">
            <Button
              size="lg"
              onClick={() => setLocation("/booking")}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Schedule an Appointment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
