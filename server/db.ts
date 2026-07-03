import { eq, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  clinicSettings,
  homePageContent,
  aboutPageContent,
  servicesPageContent,
  services,
  galleryPageContent,
  galleryItems,
  faqPageContent,
  faqItems,
  whyChooseUsPageContent,
  whyChooseUsFeatures,
  bookingPageContent,
  bookingFormFields,
  bookingSubmissions,
  seoSettings,
  ClinicSettings,
  HomePageContent,
  AboutPageContent,
  Service,
  GalleryItem,
  FaqItem,
  WhyChooseUsFeature,
  BookingFormField,
  BookingSubmission,
  SeoSettings,
  ServicesPageContent,
  GalleryPageContent,
  FaqPageContent,
  WhyChooseUsPageContent,
  BookingPageContent,
} from "../drizzle/schema";
import { ENV } from './_core/env';
import type { InsertHomePageContent, InsertAboutPageContent, InsertServicesPageContent, InsertGalleryPageContent, InsertFaqPageContent, InsertWhyChooseUsPageContent, InsertBookingPageContent } from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ CLINIC SETTINGS ============

export async function getClinicSettings(): Promise<ClinicSettings | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(clinicSettings).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateClinicSettings(data: Partial<Omit<ClinicSettings, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ClinicSettings> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getClinicSettings();
  
  if (!existing) {
    // Create new settings
    await db.insert(clinicSettings).values({
      clinicName: data.clinicName || "Dental Clinic",
      doctorName: data.doctorName || "Dr. Name",
      bookingNotificationEmail: data.bookingNotificationEmail || "admin@clinic.com",
      ...data,
    } as any);
    
    return (await getClinicSettings())!;
  } else {
    // Update existing
    await db.update(clinicSettings).set(data as any).where(eq(clinicSettings.id, existing.id));
    return (await getClinicSettings())!;
  }
}

// ============ HOME PAGE ============

export async function getHomePageContent(): Promise<HomePageContent | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(homePageContent).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateHomePageContent(data: Partial<InsertHomePageContent>): Promise<HomePageContent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getHomePageContent();
  
  if (!existing) {
    await db.insert(homePageContent).values(data as any);
    return (await getHomePageContent())!;
  } else {
    await db.update(homePageContent).set(data).where(eq(homePageContent.id, existing.id));
    return (await getHomePageContent())!;
  }
}

// ============ ABOUT PAGE ============

export async function getAboutPageContent(): Promise<AboutPageContent | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(aboutPageContent).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateAboutPageContent(data: Partial<InsertAboutPageContent>): Promise<AboutPageContent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getAboutPageContent();
  
  if (!existing) {
    await db.insert(aboutPageContent).values(data as any);
    return (await getAboutPageContent())!;
  } else {
    await db.update(aboutPageContent).set(data).where(eq(aboutPageContent.id, existing.id));
    return (await getAboutPageContent())!;
  }
}

// ============ SERVICES ============

export async function getServicesPageContent(): Promise<ServicesPageContent | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(servicesPageContent).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateServicesPageContent(data: Partial<InsertServicesPageContent>): Promise<ServicesPageContent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getServicesPageContent();
  
  if (!existing) {
    await db.insert(servicesPageContent).values(data as any);
    return (await getServicesPageContent())!;
  } else {
    await db.update(servicesPageContent).set(data).where(eq(servicesPageContent.id, existing.id));
    return (await getServicesPageContent())!;
  }
}

export async function getAllServices(): Promise<Service[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(services).orderBy(asc(services.sortOrder), desc(services.createdAt));
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(services).values(data as any);
  return (await getServiceBySlug(data.slug))!;
}

export async function updateService(id: number, data: Partial<Service>): Promise<Service> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(services).set(data).where(eq(services.id, id));
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0]!;
}

export async function deleteService(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(services).where(eq(services.id, id));
}

// ============ GALLERY ============

export async function getGalleryPageContent(): Promise<GalleryPageContent | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(galleryPageContent).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateGalleryPageContent(data: Partial<InsertGalleryPageContent>): Promise<GalleryPageContent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getGalleryPageContent();
  
  if (!existing) {
    await db.insert(galleryPageContent).values(data as any);
    return (await getGalleryPageContent())!;
  } else {
    await db.update(galleryPageContent).set(data).where(eq(galleryPageContent.id, existing.id));
    return (await getGalleryPageContent())!;
  }
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(galleryItems).orderBy(asc(galleryItems.sortOrder), desc(galleryItems.createdAt));
}

export async function createGalleryItem(data: Omit<GalleryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GalleryItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(galleryItems).values(data as any);
  const id = (result as any).insertId;
  return (await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1))[0]!;
}

export async function updateGalleryItem(id: number, data: Partial<GalleryItem>): Promise<GalleryItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(galleryItems).set(data).where(eq(galleryItems.id, id));
  return (await db.select().from(galleryItems).where(eq(galleryItems.id, id)).limit(1))[0]!;
}

export async function deleteGalleryItem(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(galleryItems).where(eq(galleryItems.id, id));
}

// ============ FAQ ============

export async function getFaqPageContent(): Promise<FaqPageContent | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(faqPageContent).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateFaqPageContent(data: Partial<InsertFaqPageContent>): Promise<FaqPageContent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getFaqPageContent();
  
  if (!existing) {
    await db.insert(faqPageContent).values(data as any);
    return (await getFaqPageContent())!;
  } else {
    await db.update(faqPageContent).set(data).where(eq(faqPageContent.id, existing.id));
    return (await getFaqPageContent())!;
  }
}

export async function getAllFaqItems(): Promise<FaqItem[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(faqItems).orderBy(asc(faqItems.sortOrder), desc(faqItems.createdAt));
}

export async function createFaqItem(data: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FaqItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(faqItems).values(data as any);
  const id = (result as any).insertId;
  return (await db.select().from(faqItems).where(eq(faqItems.id, id)).limit(1))[0]!;
}

export async function updateFaqItem(id: number, data: Partial<FaqItem>): Promise<FaqItem> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(faqItems).set(data).where(eq(faqItems.id, id));
  return (await db.select().from(faqItems).where(eq(faqItems.id, id)).limit(1))[0]!;
}

export async function deleteFaqItem(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(faqItems).where(eq(faqItems.id, id));
}

// ============ WHY CHOOSE US ============

export async function getWhyChooseUsPageContent(): Promise<WhyChooseUsPageContent | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(whyChooseUsPageContent).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateWhyChooseUsPageContent(data: Partial<InsertWhyChooseUsPageContent>): Promise<WhyChooseUsPageContent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getWhyChooseUsPageContent();
  
  if (!existing) {
    await db.insert(whyChooseUsPageContent).values(data as any);
    return (await getWhyChooseUsPageContent())!;
  } else {
    await db.update(whyChooseUsPageContent).set(data).where(eq(whyChooseUsPageContent.id, existing.id));
    return (await getWhyChooseUsPageContent())!;
  }
}

export async function getAllWhyChooseUsFeatures(): Promise<WhyChooseUsFeature[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(whyChooseUsFeatures).orderBy(asc(whyChooseUsFeatures.sortOrder), desc(whyChooseUsFeatures.createdAt));
}

export async function createWhyChooseUsFeature(data: Omit<WhyChooseUsFeature, 'id' | 'createdAt' | 'updatedAt'>): Promise<WhyChooseUsFeature> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(whyChooseUsFeatures).values(data as any);
  const id = (result as any).insertId;
  return (await db.select().from(whyChooseUsFeatures).where(eq(whyChooseUsFeatures.id, id)).limit(1))[0]!;
}

export async function updateWhyChooseUsFeature(id: number, data: Partial<WhyChooseUsFeature>): Promise<WhyChooseUsFeature> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(whyChooseUsFeatures).set(data).where(eq(whyChooseUsFeatures.id, id));
  return (await db.select().from(whyChooseUsFeatures).where(eq(whyChooseUsFeatures.id, id)).limit(1))[0]!;
}

export async function deleteWhyChooseUsFeature(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(whyChooseUsFeatures).where(eq(whyChooseUsFeatures.id, id));
}

// ============ BOOKING PAGE ============

export async function getBookingPageContent(): Promise<BookingPageContent | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(bookingPageContent).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateBookingPageContent(data: Partial<InsertBookingPageContent>): Promise<BookingPageContent> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getBookingPageContent();
  
  if (!existing) {
    await db.insert(bookingPageContent).values(data as any);
    return (await getBookingPageContent())!;
  } else {
    await db.update(bookingPageContent).set(data).where(eq(bookingPageContent.id, existing.id));
    return (await getBookingPageContent())!;
  }
}

// ============ BOOKING FORM FIELDS ============

export async function getAllBookingFormFields(): Promise<BookingFormField[]> {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(bookingFormFields).orderBy(asc(bookingFormFields.sortOrder), desc(bookingFormFields.createdAt));
}

export async function createBookingFormField(data: Omit<BookingFormField, 'id' | 'createdAt' | 'updatedAt'>): Promise<BookingFormField> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(bookingFormFields).values(data as any);
  const id = (result as any).insertId;
  return (await db.select().from(bookingFormFields).where(eq(bookingFormFields.id, id)).limit(1))[0]!;
}

export async function updateBookingFormField(id: number, data: Partial<BookingFormField>): Promise<BookingFormField> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(bookingFormFields).set(data).where(eq(bookingFormFields.id, id));
  return (await db.select().from(bookingFormFields).where(eq(bookingFormFields.id, id)).limit(1))[0]!;
}

export async function deleteBookingFormField(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(bookingFormFields).where(eq(bookingFormFields.id, id));
}

// ============ BOOKING SUBMISSIONS ============

export async function createBookingSubmission(data: Partial<Omit<BookingSubmission, 'id'>>): Promise<BookingSubmission> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(bookingSubmissions).values(data as any);
  const id = (result as any).insertId;
  return (await db.select().from(bookingSubmissions).where(eq(bookingSubmissions.id, id)).limit(1))[0]!;
}

export async function updateBookingSubmission(id: number, data: Partial<BookingSubmission>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(bookingSubmissions).set(data).where(eq(bookingSubmissions.id, id));
}

// ============ SEO SETTINGS ============

export async function getSeoSettingsBySlug(slug: string): Promise<SeoSettings | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(seoSettings).where(eq(seoSettings.pageSlug, slug)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function upsertSeoSettings(slug: string, data: Partial<SeoSettings>): Promise<SeoSettings> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getSeoSettingsBySlug(slug);
  
  if (!existing) {
    await db.insert(seoSettings).values({
      pageSlug: slug,
      pageTitle: data.pageTitle || "Dental Clinic",
      ...data,
    } as any);
    return (await getSeoSettingsBySlug(slug))!;
  } else {
    await db.update(seoSettings).set(data).where(eq(seoSettings.pageSlug, slug));
    return (await getSeoSettingsBySlug(slug))!;
  }
}
