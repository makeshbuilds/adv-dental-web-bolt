import { createClient } from "@supabase/supabase-js";
import type { Database } from "../shared/types";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn("[Database] Missing Supabase environment variables");
}

// Server-side Supabase client with service role key (bypasses RLS for admin operations)
export const supabase = supabaseUrl && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

// ============ USERS ============

export async function upsertUser(user: { openId: string; name?: string | null; email?: string | null; loginMethod?: string | null; userId?: string }): Promise<void> {
  if (!supabase) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const { error } = await supabase
      .from("users")
      .upsert({
        open_id: user.openId,
        user_id: user.userId || null,
        name: user.name || null,
        email: user.email || null,
        login_method: user.loginMethod || null,
        last_signed_in: new Date().toISOString(),
      }, { onConflict: "open_id" });

    if (error) throw error;
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  if (!supabase) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("open_id", openId)
    .maybeSingle();

  if (error) {
    console.error("[Database] Failed to get user:", error);
    return undefined;
  }

  return data ? mapUser(data) : undefined;
}

export async function getUserByUserId(userId: string) {
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return undefined;
  return mapUser(data);
}

function mapUser(row: Record<string, unknown>) {
  return {
    id: row.id,
    openId: row.open_id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    loginMethod: row.login_method,
    role: row.role,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastSignedIn: row.last_signed_in,
  };
}

// ============ CLINIC SETTINGS ============

export async function getClinicSettings() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("clinic_settings")
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("[Database] Failed to get clinic settings:", error);
    return null;
  }

  return data ? mapClinicSettings(data) : null;
}

export async function updateClinicSettings(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getClinicSettings();

  if (!existing) {
    const { error } = await supabase.from("clinic_settings").insert({
      clinic_name: data.clinicName || "Dental Clinic",
      doctor_name: data.doctorName || "Dr. Name",
      booking_notification_email: data.bookingNotificationEmail || "admin@clinic.com",
      ...mapToSnakeCase(data),
    });

    if (error) throw error;
    return await getClinicSettings();
  } else {
    const { error } = await supabase
      .from("clinic_settings")
      .update(mapToSnakeCase(data))
      .eq("id", existing.id);

    if (error) throw error;
    return await getClinicSettings();
  }
}

function mapClinicSettings(row: Record<string, unknown>) {
  return {
    id: row.id,
    clinicName: row.clinic_name,
    doctorName: row.doctor_name,
    doctorQualification: row.doctor_qualification,
    doctorExperience: row.doctor_experience,
    address: row.address,
    phone: row.phone,
    email: row.email,
    whatsapp: row.whatsapp,
    instagram: row.instagram,
    facebook: row.facebook,
    googleBusiness: row.google_business,
    youtube: row.youtube,
    linkedin: row.linkedin,
    bookingNotificationEmail: row.booking_notification_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ HOME PAGE ============

export async function getHomePageContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("home_page_content")
    .select("*")
    .maybeSingle();

  if (error) return null;
  return data ? mapHomePageContent(data) : null;
}

export async function updateHomePageContent(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getHomePageContent();

  if (!existing) {
    const { error } = await supabase.from("home_page_content").insert(mapToSnakeCase(data));
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("home_page_content")
      .update(mapToSnakeCase(data))
      .eq("id", existing.id);
    if (error) throw error;
  }

  return await getHomePageContent();
}

function mapHomePageContent(row: Record<string, unknown>) {
  return {
    id: row.id,
    badge: row.badge,
    heading: row.heading,
    backgroundImageUrl: row.background_image_url,
    backgroundVideoUrl: row.background_video_url,
    backgroundMediaType: row.background_media_type,
    h2Sections: row.h2_sections,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ ABOUT PAGE ============

export async function getAboutPageContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("about_page_content")
    .select("*")
    .maybeSingle();

  if (error) return null;
  return data ? mapAboutPageContent(data) : null;
}

export async function updateAboutPageContent(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getAboutPageContent();

  if (!existing) {
    const { error } = await supabase.from("about_page_content").insert(mapToSnakeCase(data));
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("about_page_content")
      .update(mapToSnakeCase(data))
      .eq("id", existing.id);
    if (error) throw error;
  }

  return await getAboutPageContent();
}

function mapAboutPageContent(row: Record<string, unknown>) {
  return {
    id: row.id,
    badge: row.badge,
    heading: row.heading,
    description: row.description,
    doctorImageUrl: row.doctor_image_url,
    backgroundImageUrl: row.background_image_url,
    backgroundVideoUrl: row.background_video_url,
    backgroundMediaType: row.background_media_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ SERVICES ============

export async function getServicesPageContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("services_page_content")
    .select("*")
    .maybeSingle();

  if (error) return null;
  return data ? mapServicesPageContent(data) : null;
}

export async function updateServicesPageContent(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getServicesPageContent();

  if (!existing) {
    const { error } = await supabase.from("services_page_content").insert(mapToSnakeCase(data));
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("services_page_content")
      .update(mapToSnakeCase(data))
      .eq("id", existing.id);
    if (error) throw error;
  }

  return await getServicesPageContent();
}

function mapServicesPageContent(row: Record<string, unknown>) {
  return {
    id: row.id,
    badge: row.badge,
    heading: row.heading,
    backgroundImageUrl: row.background_image_url,
    backgroundVideoUrl: row.background_video_url,
    backgroundMediaType: row.background_media_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllServices() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return [];
  return data.map(mapService);
}

export async function getServiceBySlug(slug: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return mapService(data);
}

export async function createService(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { error } = await supabase.from("services").insert(mapToSnakeCase(data));
  if (error) throw error;

  return await getServiceBySlug(data.slug as string);
}

export async function updateService(id: number, data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { error } = await supabase
    .from("services")
    .update(mapToSnakeCase(data))
    .eq("id", id);

  if (error) throw error;

  const { data: updated, error: fetchError } = await supabase
    .from("services")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;
  return mapService(updated);
}

export async function deleteService(id: number) {
  if (!supabase) throw new Error("Database not available");

  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
}

function mapService(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    detailedDescription: row.detailed_description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ GALLERY ============

export async function getGalleryPageContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("gallery_page_content")
    .select("*")
    .maybeSingle();

  if (error) return null;
  return data ? mapGalleryPageContent(data) : null;
}

export async function updateGalleryPageContent(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getGalleryPageContent();

  if (!existing) {
    const { error } = await supabase.from("gallery_page_content").insert(mapToSnakeCase(data));
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("gallery_page_content")
      .update(mapToSnakeCase(data))
      .eq("id", existing.id);
    if (error) throw error;
  }

  return await getGalleryPageContent();
}

function mapGalleryPageContent(row: Record<string, unknown>) {
  return {
    id: row.id,
    badge: row.badge,
    heading: row.heading,
    backgroundImageUrl: row.background_image_url,
    backgroundVideoUrl: row.background_video_url,
    backgroundMediaType: row.background_media_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllGalleryItems() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return [];
  return data.map(mapGalleryItem);
}

export async function createGalleryItem(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: inserted, error } = await supabase
    .from("gallery_items")
    .insert(mapToSnakeCase(data))
    .select()
    .single();

  if (error) throw error;
  return mapGalleryItem(inserted);
}

export async function updateGalleryItem(id: number, data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: updated, error } = await supabase
    .from("gallery_items")
    .update(mapToSnakeCase(data))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapGalleryItem(updated);
}

export async function deleteGalleryItem(id: number) {
  if (!supabase) throw new Error("Database not available");

  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) throw error;
}

function mapGalleryItem(row: Record<string, unknown>) {
  return {
    id: row.id,
    heading: row.heading,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ FAQ ============

export async function getFaqPageContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("faq_page_content")
    .select("*")
    .maybeSingle();

  if (error) return null;
  return data ? mapFaqPageContent(data) : null;
}

export async function updateFaqPageContent(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getFaqPageContent();

  if (!existing) {
    const { error } = await supabase.from("faq_page_content").insert(mapToSnakeCase(data));
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("faq_page_content")
      .update(mapToSnakeCase(data))
      .eq("id", existing.id);
    if (error) throw error;
  }

  return await getFaqPageContent();
}

function mapFaqPageContent(row: Record<string, unknown>) {
  return {
    id: row.id,
    badge: row.badge,
    heading: row.heading,
    backgroundImageUrl: row.background_image_url,
    backgroundVideoUrl: row.background_video_url,
    backgroundMediaType: row.background_media_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllFaqItems() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("faq_items")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return [];
  return data.map(mapFaqItem);
}

export async function createFaqItem(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: inserted, error } = await supabase
    .from("faq_items")
    .insert(mapToSnakeCase(data))
    .select()
    .single();

  if (error) throw error;
  return mapFaqItem(inserted);
}

export async function updateFaqItem(id: number, data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: updated, error } = await supabase
    .from("faq_items")
    .update(mapToSnakeCase(data))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapFaqItem(updated);
}

export async function deleteFaqItem(id: number) {
  if (!supabase) throw new Error("Database not available");

  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw error;
}

function mapFaqItem(row: Record<string, unknown>) {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ WHY CHOOSE US ============

export async function getWhyChooseUsPageContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("why_choose_us_page_content")
    .select("*")
    .maybeSingle();

  if (error) return null;
  return data ? mapWhyChooseUsPageContent(data) : null;
}

export async function updateWhyChooseUsPageContent(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getWhyChooseUsPageContent();

  if (!existing) {
    const { error } = await supabase.from("why_choose_us_page_content").insert(mapToSnakeCase(data));
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("why_choose_us_page_content")
      .update(mapToSnakeCase(data))
      .eq("id", existing.id);
    if (error) throw error;
  }

  return await getWhyChooseUsPageContent();
}

function mapWhyChooseUsPageContent(row: Record<string, unknown>) {
  return {
    id: row.id,
    badge: row.badge,
    heading: row.heading,
    description: row.description,
    featureImageUrl: row.feature_image_url,
    backgroundImageUrl: row.background_image_url,
    backgroundVideoUrl: row.background_video_url,
    backgroundMediaType: row.background_media_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAllWhyChooseUsFeatures() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("why_choose_us_features")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return [];
  return data.map(mapWhyChooseUsFeature);
}

export async function createWhyChooseUsFeature(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: inserted, error } = await supabase
    .from("why_choose_us_features")
    .insert(mapToSnakeCase(data))
    .select()
    .single();

  if (error) throw error;
  return mapWhyChooseUsFeature(inserted);
}

export async function updateWhyChooseUsFeature(id: number, data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: updated, error } = await supabase
    .from("why_choose_us_features")
    .update(mapToSnakeCase(data))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapWhyChooseUsFeature(updated);
}

export async function deleteWhyChooseUsFeature(id: number) {
  if (!supabase) throw new Error("Database not available");

  const { error } = await supabase.from("why_choose_us_features").delete().eq("id", id);
  if (error) throw error;
}

function mapWhyChooseUsFeature(row: Record<string, unknown>) {
  return {
    id: row.id,
    heading: row.heading,
    description: row.description,
    icon: row.icon,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ BOOKING PAGE ============

export async function getBookingPageContent() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("booking_page_content")
    .select("*")
    .maybeSingle();

  if (error) return null;
  return data ? mapBookingPageContent(data) : null;
}

export async function updateBookingPageContent(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getBookingPageContent();

  if (!existing) {
    const { error } = await supabase.from("booking_page_content").insert(mapToSnakeCase(data));
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("booking_page_content")
      .update(mapToSnakeCase(data))
      .eq("id", existing.id);
    if (error) throw error;
  }

  return await getBookingPageContent();
}

function mapBookingPageContent(row: Record<string, unknown>) {
  return {
    id: row.id,
    welcomeMessage: row.welcome_message,
    backgroundImageUrl: row.background_image_url,
    backgroundVideoUrl: row.background_video_url,
    backgroundMediaType: row.background_media_type,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ BOOKING FORM FIELDS ============

export async function getAllBookingFormFields() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("booking_form_fields")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return [];
  return data.map(mapBookingFormField);
}

export async function createBookingFormField(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: inserted, error } = await supabase
    .from("booking_form_fields")
    .insert(mapToSnakeCase(data))
    .select()
    .single();

  if (error) throw error;
  return mapBookingFormField(inserted);
}

export async function updateBookingFormField(id: number, data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: updated, error } = await supabase
    .from("booking_form_fields")
    .update(mapToSnakeCase(data))
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapBookingFormField(updated);
}

export async function deleteBookingFormField(id: number) {
  if (!supabase) throw new Error("Database not available");

  const { error } = await supabase.from("booking_form_fields").delete().eq("id", id);
  if (error) throw error;
}

function mapBookingFormField(row: Record<string, unknown>) {
  return {
    id: row.id,
    fieldName: row.field_name,
    fieldType: row.field_type,
    label: row.label,
    placeholder: row.placeholder,
    isRequired: row.is_required,
    sortOrder: row.sort_order,
    options: row.options,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ BOOKING SUBMISSIONS ============

export async function createBookingSubmission(data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const { data: inserted, error } = await supabase
    .from("booking_submissions")
    .insert({
      form_data: data.formData,
      email_sent: data.emailSent ?? false,
      email_error: data.emailError || null,
    })
    .select()
    .single();

  if (error) throw error;
  return mapBookingSubmission(inserted);
}

export async function updateBookingSubmission(id: number, data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const updateData: Record<string, unknown> = {};
  if (data.emailSent !== undefined) updateData.email_sent = data.emailSent;
  if (data.emailError !== undefined) updateData.email_error = data.emailError;

  const { error } = await supabase
    .from("booking_submissions")
    .update(updateData)
    .eq("id", id);

  if (error) throw error;
}

function mapBookingSubmission(row: Record<string, unknown>) {
  return {
    id: row.id,
    formData: row.form_data,
    submittedAt: row.submitted_at,
    emailSent: row.email_sent,
    emailError: row.email_error,
    createdAt: row.created_at,
  };
}

// ============ SEO SETTINGS ============

export async function getSeoSettingsBySlug(slug: string) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("seo_settings")
    .select("*")
    .eq("page_slug", slug)
    .maybeSingle();

  if (error) return null;
  return data ? mapSeoSettings(data) : null;
}

export async function upsertSeoSettings(slug: string, data: Record<string, unknown>) {
  if (!supabase) throw new Error("Database not available");

  const existing = await getSeoSettingsBySlug(slug);

  const rowData = {
    page_slug: slug,
    page_title: data.pageTitle || "Dental Clinic",
    ...mapToSnakeCase(data),
  };

  if (!existing) {
    const { error } = await supabase.from("seo_settings").insert(rowData);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("seo_settings")
      .update(rowData)
      .eq("page_slug", slug);
    if (error) throw error;
  }

  return await getSeoSettingsBySlug(slug);
}

function mapSeoSettings(row: Record<string, unknown>) {
  return {
    id: row.id,
    pageSlug: row.page_slug,
    pageTitle: row.page_title,
    metaDescription: row.meta_description,
    metaKeywords: row.meta_keywords,
    ogTitle: row.og_title,
    ogDescription: row.og_description,
    ogImage: row.og_image,
    twitterTitle: row.twitter_title,
    twitterDescription: row.twitter_description,
    twitterImage: row.twitter_image,
    canonicalUrl: row.canonical_url,
    schemaMarkup: row.schema_markup,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============ HELPER ============

function mapToSnakeCase(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[snakeKey] = value;
  }

  return result;
}
