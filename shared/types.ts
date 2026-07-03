export type User = {
  id: number;
  openId: string;
  userId?: string;
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastSignedIn: string;
};

export type ClinicSettings = {
  id: number;
  clinicName: string;
  doctorName: string;
  doctorQualification: string | null;
  doctorExperience: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  googleBusiness: string | null;
  youtube: string | null;
  linkedin: string | null;
  bookingNotificationEmail: string;
  createdAt: string;
  updatedAt: string;
};

export type SeoSettings = {
  id: number;
  pageSlug: string;
  pageTitle: string;
  metaDescription: string | null;
  metaKeywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  canonicalUrl: string | null;
  schemaMarkup: string | null;
  createdAt: string;
  updatedAt: string;
};

export type HomePageContent = {
  id: number;
  badge: string | null;
  heading: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  backgroundMediaType: string | null;
  h2Sections: Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    sortOrder: number;
  }> | null;
  createdAt: string;
  updatedAt: string;
};

export type AboutPageContent = {
  id: number;
  badge: string | null;
  heading: string | null;
  description: string | null;
  doctorImageUrl: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  backgroundMediaType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Service = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  detailedDescription: string | null;
  imageUrl: string | null;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ServicesPageContent = {
  id: number;
  badge: string | null;
  heading: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  backgroundMediaType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GalleryItem = {
  id: number;
  heading: string;
  description: string | null;
  imageUrl: string;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export type GalleryPageContent = {
  id: number;
  badge: string | null;
  heading: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  backgroundMediaType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export type FaqPageContent = {
  id: number;
  badge: string | null;
  heading: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  backgroundMediaType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WhyChooseUsPageContent = {
  id: number;
  badge: string | null;
  heading: string | null;
  description: string | null;
  featureImageUrl: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  backgroundMediaType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WhyChooseUsFeature = {
  id: number;
  heading: string;
  description: string | null;
  icon: string | null;
  sortOrder: number | null;
  createdAt: string;
  updatedAt: string;
};

export type BookingPageContent = {
  id: number;
  welcomeMessage: string | null;
  backgroundImageUrl: string | null;
  backgroundVideoUrl: string | null;
  backgroundMediaType: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BookingFormField = {
  id: number;
  fieldName: string;
  fieldType: string;
  label: string;
  placeholder: string | null;
  isRequired: boolean | null;
  sortOrder: number | null;
  options: Array<{ label: string; value: string }> | null;
  createdAt: string;
  updatedAt: string;
};

export type BookingSubmission = {
  id: number;
  formData: Record<string, unknown>;
  submittedAt: string;
  emailSent: boolean | null;
  emailError: string | null;
  createdAt: string;
};

export type InsertUser = Partial<User>;
export type InsertClinicSettings = Partial<Omit<ClinicSettings, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertSeoSettings = Partial<Omit<SeoSettings, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertHomePageContent = Partial<Omit<HomePageContent, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertAboutPageContent = Partial<Omit<AboutPageContent, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertService = Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertServicesPageContent = Partial<Omit<ServicesPageContent, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertGalleryItem = Partial<Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertGalleryPageContent = Partial<Omit<GalleryPageContent, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertFaqItem = Partial<Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertFaqPageContent = Partial<Omit<FaqPageContent, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertWhyChooseUsPageContent = Partial<Omit<WhyChooseUsPageContent, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertWhyChooseUsFeature = Partial<Omit<WhyChooseUsFeature, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertBookingPageContent = Partial<Omit<BookingPageContent, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertBookingFormField = Partial<Omit<BookingFormField, 'id' | 'createdAt' | 'updatedAt'>>;
export type InsertBookingSubmission = Partial<Omit<BookingSubmission, 'id' | 'createdAt'>>;

export type Database = {
  public: {
    Tables: {
      users: { Row: User; Insert: InsertUser };
      clinic_settings: { Row: ClinicSettings; Insert: InsertClinicSettings };
      seo_settings: { Row: SeoSettings; Insert: InsertSeoSettings };
      home_page_content: { Row: HomePageContent; Insert: InsertHomePageContent };
      about_page_content: { Row: AboutPageContent; Insert: InsertAboutPageContent };
      services: { Row: Service; Insert: InsertService };
      services_page_content: { Row: ServicesPageContent; Insert: InsertServicesPageContent };
      gallery_items: { Row: GalleryItem; Insert: InsertGalleryItem };
      gallery_page_content: { Row: GalleryPageContent; Insert: InsertGalleryPageContent };
      faq_items: { Row: FaqItem; Insert: InsertFaqItem };
      faq_page_content: { Row: FaqPageContent; Insert: InsertFaqPageContent };
      why_choose_us_page_content: { Row: WhyChooseUsPageContent; Insert: InsertWhyChooseUsPageContent };
      why_choose_us_features: { Row: WhyChooseUsFeature; Insert: InsertWhyChooseUsFeature };
      booking_page_content: { Row: BookingPageContent; Insert: InsertBookingPageContent };
      booking_form_fields: { Row: BookingFormField; Insert: InsertBookingFormField };
      booking_submissions: { Row: BookingSubmission; Insert: InsertBookingSubmission };
    };
  };
};

export * from "./_core/errors";
