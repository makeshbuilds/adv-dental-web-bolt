import type { Express, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import * as db from "../db";
import { ENV } from "./env";

export function registerOAuthRoutes(app: Express) {
  app.post("/api/auth/signup", async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const supabase = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        res.status(400).json({ error: error.message });
        return;
      }

      if (data.user) {
        await db.upsertUser({
          openId: data.user.id,
          userId: data.user.id,
          name: name || null,
          email: data.user.email || null,
          loginMethod: "email",
        });
      }

      res.json({
        user: data.user,
        session: data.session,
      });
    } catch (error) {
      console.error("[Auth] Signup failed", error);
      res.status(500).json({ error: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const supabase = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        res.status(401).json({ error: error.message });
        return;
      }

      if (data.user) {
        await db.upsertUser({
          openId: data.user.id,
          userId: data.user.id,
          name: data.user.user_metadata?.name || null,
          email: data.user.email || null,
          loginMethod: "email",
        });
      }

      res.json({
        user: data.user,
        session: data.session,
      });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const supabase = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      await supabase.auth.admin.signOut(token);
    }

    res.json({ success: true });
  });

  app.post("/api/auth/set-admin", async (req: Request, res: Response) => {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: "User ID is required" });
      return;
    }

    try {
      await sdk.setAdminRole(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("[Auth] Set admin failed", error);
      res.status(500).json({ error: "Failed to set admin role" });
    }
  });
}

import { sdk } from "./sdk";
