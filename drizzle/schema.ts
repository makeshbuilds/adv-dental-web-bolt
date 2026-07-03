import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
  longtext,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Global clinic settings and configuration
 */
export const clinicSettings = mysqlTable("clinic_settings", {
  id: int("id").autoincrement().primaryKey(),
  clinicName: varchar("clinic_name", { length: 255 }).notNull(),
  doctorName: varchar("doctor_name", { length: 255 }).notNull(),
  doctorQualification: text("doctor_qualification"),
  doctorExperience: varchar("doctor_experience", { length: 100 }),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  instagram: varchar("instagram", { length: 255 }),
  facebook: varchar("facebook", { length: 255 }),
  googleBusiness: varchar("google_business", { length: 255 }),
  youtube: varchar("youtube", { length: 255 }),
  linkedin: varchar("linkedin", { length: 255 }),
  bookingNotificationEmail: varchar("booking_notification_email", { length: 320 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClinicSettings = typeof clinicSettings.$inferSelect;
export type InsertClinicSettings = typeof clinicSettings.$inferInsert;

/**
 * SEO settings per page
 */
export const seoSettings = mysqlTable("seo_settings", {
  id: int("id").autoincrement().primaryKey(),
  pageSlug: varchar("page_slug", { length: 100 }).notNull().unique(),
  pageTitle: varchar("page_title", { length: 255 }).notNull(),
  metaDescription: varchar("meta_description", { length: 320 }),
  metaKeywords: varchar("meta_keywords", { length: 500 }),
  ogTitle: varchar("og_title", { length: 255 }),
  ogDescription: varchar("og_description", { length: 320 }),
  ogImage: varchar("og_image", { length: 500 }),
  twitterTitle: varchar("twitter_title", { length: 255 }),
  twitterDescription: varchar("twitter_description", { length: 320 }),
  twitterImage: varchar("twitter_image", { length: 500 }),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  schemaMarkup: longtext("schema_markup"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SeoSettings = typeof seoSettings.$inferSelect;
export type InsertSeoSettings = typeof seoSettings.$inferInsert;

/**
 * Home page content
 */
export const homePageContent = mysqlTable("home_page_content", {
  id: int("id").autoincrement().primaryKey(),
  badge: varchar("badge", { length: 255 }),
  heading: varchar("heading", { length: 255 }),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }),
  backgroundVideoUrl: varchar("background_video_url", { length: 500 }),
  backgroundMediaType: mysqlEnum("background_media_type", ["image", "video"]).default("image"),
  // H2 sections (navigation cards) - stored as JSON
  h2Sections: json("h2_sections").$type<Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    sortOrder: number;
  }>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type HomePageContent = typeof homePageContent.$inferSelect;
export type InsertHomePageContent = typeof homePageContent.$inferInsert;

/**
 * About page content
 */
export const aboutPageContent = mysqlTable("about_page_content", {
  id: int("id").autoincrement().primaryKey(),
  badge: varchar("badge", { length: 255 }),
  heading: varchar("heading", { length: 255 }),
  description: longtext("description"),
  doctorImageUrl: varchar("doctor_image_url", { length: 500 }),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }),
  backgroundVideoUrl: varchar("background_video_url", { length: 500 }),
  backgroundMediaType: mysqlEnum("background_media_type", ["image", "video"]).default("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AboutPageContent = typeof aboutPageContent.$inferSelect;
export type InsertAboutPageContent = typeof aboutPageContent.$inferInsert;

/**
 * Services
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  shortDescription: varchar("short_description", { length: 500 }),
  detailedDescription: longtext("detailed_description"),
  imageUrl: varchar("image_url", { length: 500 }),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Services page content (badge, heading)
 */
export const servicesPageContent = mysqlTable("services_page_content", {
  id: int("id").autoincrement().primaryKey(),
  badge: varchar("badge", { length: 255 }),
  heading: varchar("heading", { length: 255 }),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }),
  backgroundVideoUrl: varchar("background_video_url", { length: 500 }),
  backgroundMediaType: mysqlEnum("background_media_type", ["image", "video"]).default("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServicesPageContent = typeof servicesPageContent.$inferSelect;
export type InsertServicesPageContent = typeof servicesPageContent.$inferInsert;

/**
 * Gallery items
 */
export const galleryItems = mysqlTable("gallery_items", {
  id: int("id").autoincrement().primaryKey(),
  heading: varchar("heading", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryItem = typeof galleryItems.$inferSelect;
export type InsertGalleryItem = typeof galleryItems.$inferInsert;

/**
 * Gallery page content (badge, heading)
 */
export const galleryPageContent = mysqlTable("gallery_page_content", {
  id: int("id").autoincrement().primaryKey(),
  badge: varchar("badge", { length: 255 }),
  heading: varchar("heading", { length: 255 }),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }),
  backgroundVideoUrl: varchar("background_video_url", { length: 500 }),
  backgroundMediaType: mysqlEnum("background_media_type", ["image", "video"]).default("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GalleryPageContent = typeof galleryPageContent.$inferSelect;
export type InsertGalleryPageContent = typeof galleryPageContent.$inferInsert;

/**
 * FAQ items
 */
export const faqItems = mysqlTable("faq_items", {
  id: int("id").autoincrement().primaryKey(),
  question: varchar("question", { length: 500 }).notNull(),
  answer: longtext("answer").notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FaqItem = typeof faqItems.$inferSelect;
export type InsertFaqItem = typeof faqItems.$inferInsert;

/**
 * FAQ page content (badge, heading, background)
 */
export const faqPageContent = mysqlTable("faq_page_content", {
  id: int("id").autoincrement().primaryKey(),
  badge: varchar("badge", { length: 255 }),
  heading: varchar("heading", { length: 255 }),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }),
  backgroundVideoUrl: varchar("background_video_url", { length: 500 }),
  backgroundMediaType: mysqlEnum("background_media_type", ["image", "video"]).default("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FaqPageContent = typeof faqPageContent.$inferSelect;
export type InsertFaqPageContent = typeof faqPageContent.$inferInsert;

/**
 * Why Choose Us page content
 */
export const whyChooseUsPageContent = mysqlTable("why_choose_us_page_content", {
  id: int("id").autoincrement().primaryKey(),
  badge: varchar("badge", { length: 255 }),
  heading: varchar("heading", { length: 255 }),
  description: longtext("description"),
  featureImageUrl: varchar("feature_image_url", { length: 500 }),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }),
  backgroundVideoUrl: varchar("background_video_url", { length: 500 }),
  backgroundMediaType: mysqlEnum("background_media_type", ["image", "video"]).default("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WhyChooseUsPageContent = typeof whyChooseUsPageContent.$inferSelect;
export type InsertWhyChooseUsPageContent = typeof whyChooseUsPageContent.$inferInsert;

/**
 * Why Choose Us feature cards
 */
export const whyChooseUsFeatures = mysqlTable("why_choose_us_features", {
  id: int("id").autoincrement().primaryKey(),
  heading: varchar("heading", { length: 255 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WhyChooseUsFeature = typeof whyChooseUsFeatures.$inferSelect;
export type InsertWhyChooseUsFeature = typeof whyChooseUsFeatures.$inferInsert;

/**
 * Booking page content
 */
export const bookingPageContent = mysqlTable("booking_page_content", {
  id: int("id").autoincrement().primaryKey(),
  welcomeMessage: text("welcome_message"),
  backgroundImageUrl: varchar("background_image_url", { length: 500 }),
  backgroundVideoUrl: varchar("background_video_url", { length: 500 }),
  backgroundMediaType: mysqlEnum("background_media_type", ["image", "video"]).default("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookingPageContent = typeof bookingPageContent.$inferSelect;
export type InsertBookingPageContent = typeof bookingPageContent.$inferInsert;

/**
 * Dynamic booking form fields
 */
export const bookingFormFields = mysqlTable("booking_form_fields", {
  id: int("id").autoincrement().primaryKey(),
  fieldName: varchar("field_name", { length: 255 }).notNull(),
  fieldType: mysqlEnum("field_type", [
    "text",
    "number",
    "email",
    "date",
    "textarea",
    "dropdown",
    "radio",
    "checkbox",
  ]).notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  placeholder: varchar("placeholder", { length: 255 }),
  isRequired: boolean("is_required").default(false),
  sortOrder: int("sort_order").default(0),
  // For dropdown, radio, checkbox: JSON array of options
  options: json("options").$type<Array<{ label: string; value: string }>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BookingFormField = typeof bookingFormFields.$inferSelect;
export type InsertBookingFormField = typeof bookingFormFields.$inferInsert;

/**
 * Booking submissions
 */
export const bookingSubmissions = mysqlTable("booking_submissions", {
  id: int("id").autoincrement().primaryKey(),
  // Store all form data as JSON
  formData: json("form_data").$type<Record<string, unknown>>().notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  emailSent: boolean("email_sent").default(false),
  emailError: text("email_error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BookingSubmission = typeof bookingSubmissions.$inferSelect;
export type InsertBookingSubmission = typeof bookingSubmissions.$inferInsert;
