import { trpc } from "@/lib/trpc";
import { Loader2, ChevronDown } from "lucide-react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";

export default function FAQ() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { data: faqContent, isLoading: contentLoading } = trpc.faq.pageContent.get.useQuery();
  const { data: items, isLoading: itemsLoading } = trpc.faq.list.useQuery();

  if (contentLoading || itemsLoading) {
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
        {faqContent?.backgroundMediaType === 'video' && faqContent?.backgroundVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-full object-cover"
            src={faqContent.backgroundVideoUrl}
          />
        ) : faqContent?.backgroundImageUrl ? (
          <img
            src={faqContent.backgroundImageUrl}
            alt="FAQ Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50" />
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold">{faqContent?.heading || "Frequently Asked Questions"}</h1>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          {faqContent?.badge && (
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
              {faqContent.badge}
            </div>
          )}

          <div className="space-y-4">
            {items && items.map((item) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-left">{item.question}</h3>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedId === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedId === item.id && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
