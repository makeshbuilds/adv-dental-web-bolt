import type { Express, Request, Response } from "express";
import { ENV } from "./env";

export function registerStorageProxy(app: Express) {
  app.get("/api/storage/upload-url", async (req: Request, res: Response) => {
    const { bucket, path: filePath } = req.query;

    if (!bucket || !filePath) {
      res.status(400).json({ error: "bucket and path are required" });
      return;
    }

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { data, error } = await supabase.storage
        .from(bucket as string)
        .createSignedUploadUrl(filePath as string);

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(data);
    } catch (err) {
      console.error("[Storage] Upload URL failed:", err);
      res.status(500).json({ error: "Storage error" });
    }
  });

  app.get("/api/storage/download-url", async (req: Request, res: Response) => {
    const { bucket, path: filePath, expiresIn } = req.query;

    if (!bucket || !filePath) {
      res.status(400).json({ error: "bucket and path are required" });
      return;
    }

    try {
      const { createClient } = await import("@supabase/supabase-js");
      const supabase = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { data, error } = await supabase.storage
        .from(bucket as string)
        .createSignedUrl(filePath as string, parseInt(expiresIn as string) || 3600);

      if (error) {
        res.status(500).json({ error: error.message });
        return;
      }

      res.json(data);
    } catch (err) {
      console.error("[Storage] Download URL failed:", err);
      res.status(500).json({ error: "Storage error" });
    }
  });
}
