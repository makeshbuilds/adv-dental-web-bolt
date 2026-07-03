import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

// Helper to ensure admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ CLINIC SETTINGS ============
  clinicSettings: router({
    get: publicProcedure.query(async () => {
      return await db.getClinicSettings();
    }),
    update: adminProcedure.input(z.object({
      clinicName: z.string().nullable().optional(),
      doctorName: z.string().nullable().optional(),
      doctorQualification: z.string().nullable().optional(),
      doctorExperience: z.string().nullable().optional(),
      address: z.string().nullable().optional(),
      phone: z.string().nullable().optional(),
      email: z.string().nullable().optional(),
      whatsapp: z.string().nullable().optional(),
      instagram: z.string().nullable().optional(),
      facebook: z.string().nullable().optional(),
      googleBusiness: z.string().nullable().optional(),
      youtube: z.string().nullable().optional(),
      linkedin: z.string().nullable().optional(),
      bookingNotificationEmail: z.string().nullable().optional(),
    })).mutation(async ({ input }) => {
      const cleanedInput = Object.fromEntries(
        Object.entries(input).filter(([_, v]) => v !== null && v !== undefined)
      );
      return await db.updateClinicSettings(cleanedInput as any);
    }),
  }),

  // ============ HOME PAGE ============
  homePage: router({
    get: publicProcedure.query(async () => {
      return await db.getHomePageContent();
    }),
    update: adminProcedure.input(z.object({
      badge: z.string().optional(),
      heading: z.string().optional(),
      backgroundImageUrl: z.string().optional(),
      backgroundVideoUrl: z.string().optional(),
      backgroundMediaType: z.enum(['image', 'video']).optional(),
      h2Sections: z.array(z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        sortOrder: z.number(),
      })).optional(),
    })).mutation(async ({ input }) => {
      return await db.updateHomePageContent(input);
    }),
  }),

  // ============ ABOUT PAGE ============
  aboutPage: router({
    get: publicProcedure.query(async () => {
      return await db.getAboutPageContent();
    }),
    update: adminProcedure.input(z.object({
      badge: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      doctorImageUrl: z.string().optional(),
      backgroundImageUrl: z.string().optional(),
      backgroundVideoUrl: z.string().optional(),
      backgroundMediaType: z.enum(['image', 'video']).optional(),
    })).mutation(async ({ input }) => {
      return await db.updateAboutPageContent(input);
    }),
  }),

  // ============ SERVICES ============
  services: router({
    list: publicProcedure.query(async () => {
      return await db.getAllServices();
    }),
    getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
      return await db.getServiceBySlug(input);
    }),
    pageContent: router({
      get: publicProcedure.query(async () => {
        return await db.getServicesPageContent();
      }),
      update: adminProcedure.input(z.object({
        badge: z.string().optional(),
        heading: z.string().optional(),
        backgroundImageUrl: z.string().optional(),
        backgroundVideoUrl: z.string().optional(),
        backgroundMediaType: z.enum(['image', 'video']).optional(),
      })).mutation(async ({ input }) => {
        return await db.updateServicesPageContent(input);
      }),
    }),
    create: adminProcedure.input(z.object({
      title: z.string(),
      slug: z.string(),
      shortDescription: z.string().optional(),
      detailedDescription: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().default(0),
    })).mutation(async ({ input }) => {
      return await db.createService(input as any);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      shortDescription: z.string().optional(),
      detailedDescription: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateService(id, data);
    }),
    delete: adminProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.deleteService(input);
      return { success: true };
    }),
  }),

  // ============ GALLERY ============
  gallery: router({
    list: publicProcedure.query(async () => {
      return await db.getAllGalleryItems();
    }),
    pageContent: router({
      get: publicProcedure.query(async () => {
        return await db.getGalleryPageContent();
      }),
      update: adminProcedure.input(z.object({
        badge: z.string().optional(),
        heading: z.string().optional(),
        backgroundImageUrl: z.string().optional(),
        backgroundVideoUrl: z.string().optional(),
        backgroundMediaType: z.enum(['image', 'video']).optional(),
      })).mutation(async ({ input }) => {
        return await db.updateGalleryPageContent(input);
      }),
    }),
    create: adminProcedure.input(z.object({
      heading: z.string(),
      description: z.string().optional(),
      imageUrl: z.string(),
      sortOrder: z.number().default(0),
    })).mutation(async ({ input }) => {
      return await db.createGalleryItem(input as any);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      heading: z.string().optional(),
      description: z.string().optional(),
      imageUrl: z.string().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateGalleryItem(id, data);
    }),
    delete: adminProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.deleteGalleryItem(input);
      return { success: true };
    }),
  }),

  // ============ FAQ ============
  faq: router({
    list: publicProcedure.query(async () => {
      return await db.getAllFaqItems();
    }),
    pageContent: router({
      get: publicProcedure.query(async () => {
        return await db.getFaqPageContent();
      }),
      update: adminProcedure.input(z.object({
        badge: z.string().optional(),
        heading: z.string().optional(),
        backgroundImageUrl: z.string().optional(),
        backgroundVideoUrl: z.string().optional(),
        backgroundMediaType: z.enum(['image', 'video']).optional(),
      })).mutation(async ({ input }) => {
        return await db.updateFaqPageContent(input);
      }),
    }),
    create: adminProcedure.input(z.object({
      question: z.string(),
      answer: z.string(),
      sortOrder: z.number().default(0),
    })).mutation(async ({ input }) => {
      return await db.createFaqItem(input);
    }),
    update: adminProcedure.input(z.object({
      id: z.number(),
      question: z.string().optional(),
      answer: z.string().optional(),
      sortOrder: z.number().optional(),
    })).mutation(async ({ input }) => {
      const { id, ...data } = input;
      return await db.updateFaqItem(id, data);
    }),
    delete: adminProcedure.input(z.number()).mutation(async ({ input }) => {
      await db.deleteFaqItem(input);
      return { success: true };
    }),
  }),

  // ============ WHY CHOOSE US ============
  whyChooseUs: router({
    pageContent: router({
      get: publicProcedure.query(async () => {
        return await db.getWhyChooseUsPageContent();
      }),
      update: adminProcedure.input(z.object({
        badge: z.string().optional(),
        heading: z.string().optional(),
        description: z.string().optional(),
        featureImageUrl: z.string().optional(),
        backgroundImageUrl: z.string().optional(),
        backgroundVideoUrl: z.string().optional(),
        backgroundMediaType: z.enum(['image', 'video']).optional(),
      })).mutation(async ({ input }) => {
        return await db.updateWhyChooseUsPageContent(input);
      }),
    }),
    features: router({
      list: publicProcedure.query(async () => {
        return await db.getAllWhyChooseUsFeatures();
      }),
      create: adminProcedure.input(z.object({
        heading: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().default(0),
      })).mutation(async ({ input }) => {
        return await db.createWhyChooseUsFeature(input as any);
      }),
      update: adminProcedure.input(z.object({
        id: z.number(),
        heading: z.string().optional(),
        description: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().optional(),
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateWhyChooseUsFeature(id, data);
      }),
      delete: adminProcedure.input(z.number()).mutation(async ({ input }) => {
        await db.deleteWhyChooseUsFeature(input);
        return { success: true };
      }),
    }),
  }),

  // ============ BOOKING PAGE ============
  bookingPage: router({
    get: publicProcedure.query(async () => {
      return await db.getBookingPageContent();
    }),
    update: adminProcedure.input(z.object({
      welcomeMessage: z.string().optional(),
      backgroundImageUrl: z.string().optional(),
      backgroundVideoUrl: z.string().optional(),
      backgroundMediaType: z.enum(['image', 'video']).optional(),
    })).mutation(async ({ input }) => {
      return await db.updateBookingPageContent(input);
    }),
  }),

  // ============ BOOKING FORM FIELDS ============
  bookingForm: router({
    fields: router({
      list: publicProcedure.query(async () => {
        return await db.getAllBookingFormFields();
      }),
      create: adminProcedure.input(z.object({
        fieldName: z.string(),
        fieldType: z.enum(['text', 'number', 'email', 'date', 'textarea', 'dropdown', 'radio', 'checkbox']),
        label: z.string(),
        placeholder: z.string().optional(),
        isRequired: z.boolean().default(false),
        sortOrder: z.number().default(0),
        options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
      })).mutation(async ({ input }) => {
        return await db.createBookingFormField(input as any);
      }),
      update: adminProcedure.input(z.object({
        id: z.number(),
        fieldName: z.string().optional(),
        fieldType: z.enum(['text', 'number', 'email', 'date', 'textarea', 'dropdown', 'radio', 'checkbox']).optional(),
        label: z.string().optional(),
        placeholder: z.string().optional(),
        isRequired: z.boolean().optional(),
        sortOrder: z.number().optional(),
        options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
      })).mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateBookingFormField(id, data);
      }),
      delete: adminProcedure.input(z.number()).mutation(async ({ input }) => {
        await db.deleteBookingFormField(input);
        return { success: true };
      }),
    }),
    submit: publicProcedure.input(z.any()).mutation(async ({ input }) => {
      // Create booking submission
      const submission = await db.createBookingSubmission({
        formData: input as Record<string, unknown>,
        submittedAt: new Date(),
        emailSent: false,
        emailError: null,
      } as any);
      
      // TODO: Send email notification
      // This will be implemented in Phase 5
      
      return { success: true, submissionId: submission.id };
    }),
  }),

  // ============ SEO SETTINGS ============
  seo: router({
    getBySlug: publicProcedure.input(z.string()).query(async ({ input }) => {
      return await db.getSeoSettingsBySlug(input);
    }),
    update: adminProcedure.input(z.object({
      pageSlug: z.string(),
      pageTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.string().optional(),
      ogTitle: z.string().optional(),
      ogDescription: z.string().optional(),
      ogImage: z.string().optional(),
      twitterTitle: z.string().optional(),
      twitterDescription: z.string().optional(),
      twitterImage: z.string().optional(),
      canonicalUrl: z.string().optional(),
      schemaMarkup: z.string().optional(),
    })).mutation(async ({ input }) => {
      const { pageSlug, ...data } = input;
      return await db.upsertSeoSettings(pageSlug, data);
    }),
  }),
});

export type AppRouter = typeof appRouter;
