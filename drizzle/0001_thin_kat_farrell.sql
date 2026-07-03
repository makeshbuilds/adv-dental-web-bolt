CREATE TABLE `about_page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badge` varchar(255),
	`heading` varchar(255),
	`description` longtext,
	`doctor_image_url` varchar(500),
	`background_image_url` varchar(500),
	`background_video_url` varchar(500),
	`background_media_type` enum('image','video') DEFAULT 'image',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `about_page_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_form_fields` (
	`id` int AUTO_INCREMENT NOT NULL,
	`field_name` varchar(255) NOT NULL,
	`field_type` enum('text','number','email','date','textarea','dropdown','radio','checkbox') NOT NULL,
	`label` varchar(255) NOT NULL,
	`placeholder` varchar(255),
	`is_required` boolean DEFAULT false,
	`sort_order` int DEFAULT 0,
	`options` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booking_form_fields_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`welcome_message` text,
	`background_image_url` varchar(500),
	`background_video_url` varchar(500),
	`background_media_type` enum('image','video') DEFAULT 'image',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `booking_page_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`form_data` json NOT NULL,
	`submitted_at` timestamp NOT NULL DEFAULT (now()),
	`email_sent` boolean DEFAULT false,
	`email_error` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `booking_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clinic_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clinic_name` varchar(255) NOT NULL,
	`doctor_name` varchar(255) NOT NULL,
	`doctor_qualification` text,
	`doctor_experience` varchar(100),
	`address` text,
	`phone` varchar(20),
	`email` varchar(320),
	`whatsapp` varchar(20),
	`instagram` varchar(255),
	`facebook` varchar(255),
	`google_business` varchar(255),
	`youtube` varchar(255),
	`linkedin` varchar(255),
	`booking_notification_email` varchar(320) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clinic_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faq_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` varchar(500) NOT NULL,
	`answer` longtext NOT NULL,
	`sort_order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faq_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faq_page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badge` varchar(255),
	`heading` varchar(255),
	`background_image_url` varchar(500),
	`background_video_url` varchar(500),
	`background_media_type` enum('image','video') DEFAULT 'image',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faq_page_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`heading` varchar(255) NOT NULL,
	`description` text,
	`image_url` varchar(500) NOT NULL,
	`sort_order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `gallery_page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badge` varchar(255),
	`heading` varchar(255),
	`background_image_url` varchar(500),
	`background_video_url` varchar(500),
	`background_media_type` enum('image','video') DEFAULT 'image',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `gallery_page_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `home_page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badge` varchar(255),
	`heading` varchar(255),
	`background_image_url` varchar(500),
	`background_video_url` varchar(500),
	`background_media_type` enum('image','video') DEFAULT 'image',
	`h2_sections` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `home_page_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seo_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page_slug` varchar(100) NOT NULL,
	`page_title` varchar(255) NOT NULL,
	`meta_description` varchar(320),
	`meta_keywords` varchar(500),
	`og_title` varchar(255),
	`og_description` varchar(320),
	`og_image` varchar(500),
	`twitter_title` varchar(255),
	`twitter_description` varchar(320),
	`twitter_image` varchar(500),
	`canonical_url` varchar(500),
	`schema_markup` longtext,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `seo_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `seo_settings_page_slug_unique` UNIQUE(`page_slug`)
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`short_description` varchar(500),
	`detailed_description` longtext,
	`image_url` varchar(500),
	`sort_order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_id` PRIMARY KEY(`id`),
	CONSTRAINT `services_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `services_page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badge` varchar(255),
	`heading` varchar(255),
	`background_image_url` varchar(500),
	`background_video_url` varchar(500),
	`background_media_type` enum('image','video') DEFAULT 'image',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `services_page_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `why_choose_us_features` (
	`id` int AUTO_INCREMENT NOT NULL,
	`heading` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(100),
	`sort_order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `why_choose_us_features_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `why_choose_us_page_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`badge` varchar(255),
	`heading` varchar(255),
	`description` longtext,
	`feature_image_url` varchar(500),
	`background_image_url` varchar(500),
	`background_video_url` varchar(500),
	`background_media_type` enum('image','video') DEFAULT 'image',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `why_choose_us_page_content_id` PRIMARY KEY(`id`)
);
