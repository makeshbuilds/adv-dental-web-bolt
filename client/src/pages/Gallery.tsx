import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { data: galleryContent, isLoading: contentLoading } = trpc.gallery.pageContent.get.useQuery();
  const { data: items, isLoading: itemsLoading } = trpc.gallery.list.useQuery();

  if (contentLoading || itemsLoading) {
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
          <h1 className="text-5xl font-bold">{galleryContent?.heading || "Gallery"}</h1>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {galleryContent?.badge && (
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
              {galleryContent.badge}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items && items.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.imageUrl)}
                className="cursor-pointer group relative overflow-hidden rounded-lg"
              >
                <img
                  src={item.imageUrl}
                  alt={item.heading}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-end">
                  <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-bold text-lg">{item.heading}</h3>
                    {item.description && (
                      <p className="text-sm text-gray-200">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Lightbox"
              className="w-full h-auto rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
