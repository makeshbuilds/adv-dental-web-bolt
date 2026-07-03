import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";

export type SessionPayload = {
  openId: string;
  userId: string;
  email: string | null;
};

class AuthSDK {
  private get serviceClient() {
    return createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async verifyToken(token: string): Promise<{ userId: string; email: string | null } | null> {
    const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email ?? null,
    };
  }

  async getOrCreateUser(authUserId: string, email: string | null, name?: string | null) {
    const client = this.serviceClient;

    const { data: existing, error: fetchError } = await client
      .from("users")
      .select("*")
      .eq("user_id", authUserId)
      .maybeSingle();

    if (fetchError) {
      console.error("[SDK] Error fetching user:", fetchError);
    }

    if (existing) {
      await client
        .from("users")
        .update({ last_signed_in: new Date().toISOString() })
        .eq("id", existing.id);

      return existing;
    }

    const { data: newUser, error: createError } = await client
      .from("users")
      .insert({
        user_id: authUserId,
        open_id: authUserId,
        email,
        name,
        login_method: "email",
        role: "user",
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    return newUser;
  }

  async setAdminRole(userId: string) {
    const client = this.serviceClient;

    const { error } = await client
      .from("users")
      .update({ role: "admin" })
      .eq("user_id", userId);

    if (error) throw error;
  }
}

export const sdk = new AuthSDK();
