# Dental Clinic CMS - Complete Documentation

## Project Overview

This is a **fully dynamic, CMS-driven dental clinic website** built with React, Express, tRPC, and MySQL. Every piece of content—from page headings to background videos—is managed through a secure admin panel. **Nothing is hardcoded; all content lives in the database.**

## Key Features

### 1. Public-Facing Pages
- **Home** – Hero section with background video/image, services overview, CTA buttons
- **About** – Doctor bio, qualifications, experience, clinic description
- **Services** – Grid of service cards with links to detailed service pages
- **Service Detail** – Full service page with detailed description and booking CTA
- **Gallery** – Image grid with lightbox modal for full-screen viewing
- **FAQ** – Accordion-style Q&A with smooth animations
- **Why Choose Us** – Feature cards with icons and descriptions
- **Booking** – Dynamic form builder that renders fields from the database

### 2. Secure Admin Panel
- **Role-Based Access Control** – Admin-only access with authentication
- **Tabbed Dashboard** – Easy navigation between content sections
- **CMS Editors** – Edit all page sections without touching code
- **Real-Time Updates** – Changes immediately reflect on public pages

### 3. Admin Sections

| Section | Capabilities |
|---------|--------------|
| **Clinic Settings** | Doctor name, qualifications, experience, address, phone, email, social media links, booking notification email |
| **Home Page** | Hero badge, heading, background image/video |
| **About Page** | Badge, heading, description, doctor image, background media |
| **Services** | Add/edit/delete services with title, slug, descriptions, images, sort order |
| **Gallery** | Add/edit/delete gallery items with images and descriptions |
| **FAQ** | Manage FAQ questions and answers |
| **Why Choose Us** | Edit page content and manage feature cards with icons |
| **Booking** | Edit welcome message and dynamically manage form fields |
| **SEO Settings** | Per-page meta tags, descriptions, keywords, Open Graph data |

### 4. Booking System
- **Dynamic Form Builder** – Admins add/edit/delete form fields without code
- **Field Types** – Text, email, number, date, textarea, dropdown, radio, checkbox
- **Validation** – Frontend and backend validation
- **Email Notifications** – Submissions sent to configured email with all form data
- **Submission Tracking** – View all booking submissions in admin panel

### 5. SEO Architecture
- **Editable Meta Tags** – Per-page title, description, keywords
- **Open Graph** – Social media sharing optimization
- **Schema Markup** – LocalBusiness, Dentist, FAQ, Breadcrumb
- **Sitemap.xml** – Auto-generated for search engines
- **Robots.txt** – Auto-generated for crawler instructions
- **Canonical URLs** – Prevent duplicate content issues

### 6. Security Features
- **Input Validation** – All forms validated on frontend and backend
- **XSS Protection** – Content sanitization
- **SQL Injection Prevention** – Parameterized queries via Drizzle ORM
- **CSRF Protection** – Token-based protection
- **Rate Limiting** – Prevent abuse on forms and APIs
- **Secure File Uploads** – MIME type validation, file size limits
- **Hashed Passwords** – bcrypt for secure password storage

### 7. Cloud Storage
- **S3-Compatible Storage** – All media served from cloud, not local disk
- **Presigned URLs** – Secure, temporary access to media files
- **Image Optimization** – Lazy loading and responsive images
- **Video Support** – Background videos and media files

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Tailwind CSS 4 + shadcn/ui |
| **Backend** | Express 4 + tRPC 11 |
| **Database** | MySQL with Drizzle ORM |
| **Authentication** | Manus OAuth + JWT |
| **Storage** | S3-compatible cloud storage |
| **Email** | Manus built-in notification API |
| **Validation** | Zod schemas |

## Database Schema

### Core Tables
- **users** – Admin authentication and role management
- **clinicSettings** – Clinic info, doctor details, contact info, social links
- **homePageContent** – Hero section content
- **aboutPageContent** – About page content
- **services** – Service catalog with descriptions and images
- **gallery** – Gallery items with images and metadata
- **faqItems** – FAQ questions and answers
- **whyChooseUsContent** – Why Choose Us page content
- **whyChooseUsFeatures** – Feature cards for Why Choose Us section
- **bookingPageContent** – Booking page welcome message
- **bookingFormFields** – Dynamic form field definitions
- **bookingSubmissions** – Submitted booking form data
- **seoSettings** – Per-page SEO metadata

## Getting Started

### Prerequisites
- Node.js 22+
- pnpm package manager
- MySQL database (provided by Manus)
- S3-compatible storage (provided by Manus)

### Installation
```bash
cd dental-clinic-cms
pnpm install
pnpm dev
```

### Database Setup
The database schema is automatically created on first run. To apply migrations:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Environment Variables
All required environment variables are automatically injected by Manus:
- `DATABASE_URL` – MySQL connection string
- `JWT_SECRET` – Session signing secret
- `VITE_APP_ID` – OAuth application ID
- `OAUTH_SERVER_URL` – OAuth backend URL
- `BUILT_IN_FORGE_API_URL` – Manus API endpoint
- `BUILT_IN_FORGE_API_KEY` – Manus API key

## Admin Panel Access

### Login
1. Navigate to `/admin/login`
2. Enter admin credentials (initially set up via database)
3. Access the admin dashboard at `/admin/dashboard`

### Managing Content
1. Click on any tab (Clinic, Home, About, Services, etc.)
2. Edit content in the forms
3. Click "Save Changes" to update
4. Changes are immediately reflected on public pages

### Booking Form Builder
1. Go to Booking tab in admin
2. Add form fields with different types
3. Set required/optional status
4. Reorder fields by sort order
5. Booking form automatically updates on public site

## API Routes (tRPC)

### Public Routes
- `trpc.homePage.get` – Get home page content
- `trpc.aboutPage.get` – Get about page content
- `trpc.services.list` – Get all services
- `trpc.services.getBySlug` – Get single service
- `trpc.gallery.list` – Get gallery items
- `trpc.faq.list` – Get FAQ items
- `trpc.whyChooseUs.pageContent.get` – Get Why Choose Us content
- `trpc.whyChooseUs.features.list` – Get features
- `trpc.bookingPage.get` – Get booking page content
- `trpc.bookingForm.fields.list` – Get form fields
- `trpc.bookingForm.submit` – Submit booking form

### Admin Routes (Protected)
- `trpc.clinicSettings.get/update` – Manage clinic info
- `trpc.homePage.update` – Edit home page
- `trpc.aboutPage.update` – Edit about page
- `trpc.services.create/update/delete` – Manage services
- `trpc.gallery.create/update/delete` – Manage gallery
- `trpc.faq.create/update/delete` – Manage FAQ
- `trpc.whyChooseUs.features.create/delete` – Manage features
- `trpc.bookingForm.fields.create/delete` – Manage form fields
- `trpc.seo.getBySlug/update` – Manage SEO settings

## File Structure

```
client/
  src/
    pages/              # Public pages and admin dashboard
    components/
      admin/            # Admin CMS editors
      ui/               # shadcn/ui components
    lib/trpc.ts         # tRPC client setup
    App.tsx             # Routes and layout

server/
  db.ts                 # Database query helpers
  routers.ts            # tRPC procedure definitions
  _core/                # Framework infrastructure

drizzle/
  schema.ts             # Database table definitions
  migrations/           # Generated SQL migrations

shared/
  const.ts              # Shared constants
  types.ts              # Shared types
```

## Deployment

### Publishing
1. Create a checkpoint: Click "Save Checkpoint" in the Management UI
2. Publish: Click "Publish" button (appears after checkpoint)
3. Your site is live at `{project-name}.manus.space`

### Custom Domain
1. Go to Settings → Domains
2. Purchase or connect existing domain
3. Update DNS records as instructed
4. Your site is accessible at your custom domain

## Maintenance & Updates

### Adding New Content Sections
1. Add database table in `drizzle/schema.ts`
2. Run `pnpm drizzle-kit generate` to create migration
3. Apply migration via `webdev_execute_sql`
4. Add query helpers in `server/db.ts`
5. Add tRPC procedures in `server/routers.ts`
6. Create frontend page in `client/src/pages/`
7. Create admin editor in `client/src/components/admin/`

### Updating Existing Content
- Use the admin panel – no code changes needed
- All changes are immediately live

### Monitoring
- Check dev server logs in `.manus-logs/devserver.log`
- Monitor browser console for client-side errors
- Review booking submissions in admin panel

## Security Best Practices

1. **Change Default Admin Password** – Update in database after first login
2. **Enable HTTPS** – Automatically enabled on Manus hosting
3. **Regular Backups** – Database is automatically backed up
4. **Monitor Submissions** – Review booking submissions regularly
5. **Update Dependencies** – Run `pnpm update` periodically
6. **Validate Uploads** – File upload validation is built-in

## Troubleshooting

### Admin Panel Not Loading
- Clear browser cache
- Check browser console for errors
- Verify admin user role in database

### Booking Emails Not Sending
- Verify notification email is set in Clinic Settings
- Check email is valid
- Review `.manus-logs/` for error messages

### Images Not Displaying
- Verify image URL is correct
- Check S3 storage is configured
- Ensure image file exists and is accessible

### Database Connection Issues
- Verify `DATABASE_URL` environment variable
- Check MySQL server is running
- Review `.manus-logs/devserver.log` for connection errors

## Support & Documentation

- **Manus Docs** – https://docs.manus.im
- **React Documentation** – https://react.dev
- **tRPC Documentation** – https://trpc.io
- **Tailwind CSS** – https://tailwindcss.com
- **shadcn/ui** – https://ui.shadcn.com

## Future Enhancements

- [ ] Advanced analytics dashboard
- [ ] Email template customization
- [ ] Multi-language support
- [ ] Appointment scheduling integration
- [ ] Patient portal
- [ ] Review/testimonial management
- [ ] Blog/news section
- [ ] SMS notifications
- [ ] WhatsApp integration
- [ ] Payment processing (Stripe)

## License

This project is built with Manus and is proprietary to your dental clinic.

---

**Last Updated:** June 2026  
**Version:** 1.0.0  
**Status:** Production Ready
