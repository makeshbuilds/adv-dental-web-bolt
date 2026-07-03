import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";

export default function About() {
  const { data: aboutContent, isLoading } = trpc.aboutPage.get.useQuery();
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
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold">{aboutContent?.heading || "About Us"}</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {aboutContent?.badge && (
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
              {aboutContent.badge}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            {aboutContent?.doctorImageUrl && (
              <img
                src={aboutContent.doctorImageUrl}
                alt="Doctor"
                className="rounded-lg shadow-lg w-full h-96 object-cover"
              />
            )}
            <div>
              <h2 className="text-3xl font-bold mb-4">{clinicSettings?.doctorName}</h2>
              <p className="text-lg text-gray-600 mb-4">{clinicSettings?.doctorQualification}</p>
              <p className="text-gray-600 mb-4">{clinicSettings?.doctorExperience} Years of Experience</p>
              {aboutContent?.description && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{aboutContent.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
