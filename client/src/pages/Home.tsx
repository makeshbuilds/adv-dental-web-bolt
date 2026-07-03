import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: homeContent, isLoading } = trpc.homePage.get.useQuery();
  const { data: clinicSettings } = trpc.clinicSettings.get.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          {/* Clinic Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <div className="text-5xl">🦷</div>
            </div>
          </div>
          {homeContent?.badge && (
            <div className="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full">
              <p className="text-sm font-semibold">{homeContent.badge}</p>
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {homeContent?.heading || "Healthy Smiles Start Here"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Professional dental care for the whole family
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/booking")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Book an Appointment
          </Button>
        </div>
      </section>

      {/* Services Overview Section */}
      {homeContent?.h2Sections && homeContent.h2Sections.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Our Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homeContent.h2Sections.map((section) => (
                <div
                  key={section.id}
                  onClick={() => setLocation(`/${section.slug}`)}
                  className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <h3 className="text-2xl font-semibold mb-3">{section.title}</h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready for a Healthier Smile?</h2>
          <p className="text-xl mb-8 text-white/90">
            Schedule your appointment today and experience world-class dental care.
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/booking")}
            variant="secondary"
          >
            Get Started
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}
