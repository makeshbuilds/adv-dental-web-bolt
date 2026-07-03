import { trpc } from "@/lib/trpc";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  const { data: settings } = trpc.clinicSettings.get.useQuery();

  if (!settings) return null;

  return (
    <footer className="bg-gray-900 text-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Clinic Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">{settings.clinicName || "Dental Clinic"}</h3>
            <div className="space-y-3">
              {settings.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">{settings.address}</p>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <a href={`tel:${settings.phone}`} className="text-sm hover:text-blue-400">
                    {settings.phone}
                  </a>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-sm hover:text-blue-400">
                    {settings.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Doctor Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Doctor</h3>
            <div className="space-y-2">
              <p className="text-sm font-semibold">{settings.doctorName || "Dr. [Name]"}</p>
              {settings.doctorQualification && (
                <p className="text-sm text-gray-300">{settings.doctorQualification}</p>
              )}
              {settings.doctorExperience && (
                <p className="text-sm text-gray-300">{settings.doctorExperience} years experience</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Follow Us</h3>
            <div className="flex gap-4">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {settings.linkedin && (
                <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-red-500">
                  <Youtube className="w-6 h-6" />
                </a>
              )}
              {settings.whatsapp && (
                <a href={settings.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.255.949c-1.238.503-2.335 1.236-3.356 2.258-1.688 1.694-2.684 3.957-2.684 6.378 0 1.141.214 2.268.636 3.355l-1.068 3.897 3.988-1.045a9.884 9.884 0 003.784.717h.005c5.396 0 9.791-4.396 9.791-9.791 0-2.622-.636-5.073-1.846-7.256-1.211-2.182-2.948-3.919-5.100-5.130-2.151-1.211-4.603-1.847-7.256-1.847z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {settings.clinicName || "Dental Clinic"}. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0 text-sm">
              <a href="/" className="text-gray-400 hover:text-white">Home</a>
              <a href="/about" className="text-gray-400 hover:text-white">About</a>
              <a href="/services" className="text-gray-400 hover:text-white">Services</a>
              <a href="/booking" className="text-gray-400 hover:text-white">Booking</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
