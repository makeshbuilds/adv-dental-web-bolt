import PageLayout from "@/components/PageLayout";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

export default function WhyChooseUs() {
  const { data: pageContent, isLoading: contentLoading } = trpc.whyChooseUs.pageContent.get.useQuery();
  const { data: features, isLoading: featuresLoading } = trpc.whyChooseUs.features.list.useQuery();

  if (contentLoading || featuresLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

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
            alt="Why Choose Us Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold">{pageContent?.heading || "Why Choose Us"}</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {pageContent?.badge && (
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
              {pageContent.badge}
            </div>
          )}

          {pageContent?.featureImageUrl && (
            <img
              src={pageContent.featureImageUrl}
              alt="Feature"
              className="w-full h-96 object-cover rounded-lg mb-12"
            />
          )}

          {pageContent?.description && (
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-gray-700 text-lg whitespace-pre-wrap">{pageContent.description}</p>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features && features.map((feature) => (
              <div key={feature.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                {feature.icon && (
                  <div className="text-4xl mb-4">{feature.icon}</div>
                )}
                <h3 className="text-2xl font-bold mb-3">{feature.heading}</h3>
                {feature.description && (
                  <p className="text-gray-600">{feature.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
