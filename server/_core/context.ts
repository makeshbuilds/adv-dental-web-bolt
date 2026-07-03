import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";

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

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

async function getUserFromSupabase(authHeader: string | undefined): Promise<User | null> {
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7);

  const supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: { user: authUser }, error } = await supabase.auth.getUser(token);

  if (error || !authUser) {
    return null;
  }

  // Query our users table for the user with this auth id
  const serviceClient = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { data: dbUser, error: dbError } = await serviceClient
    .from("users")
    .select("*")
    .eq("user_id", authUser.id)
    .maybeSingle();

  if (dbError) {
    console.error("[Context] Error fetching user:", dbError);
  }

  if (dbUser) {
    return {
      id: dbUser.id,
      openId: dbUser.open_id,
      userId: dbUser.user_id,
      name: dbUser.name,
      email: dbUser.email,
      loginMethod: dbUser.login_method,
      role: dbUser.role,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
      lastSignedIn: dbUser.last_signed_in,
    };
  }

  return {
    id: 0,
    openId: authUser.id,
    userId: authUser.id,
    name: authUser.email?.split("@")[0] ?? null,
    email: authUser.email ?? null,
    loginMethod: "email",
    role: "user",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSignedIn: new Date().toISOString(),
  };
}

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    const authHeader = opts.req.headers.authorization;
    user = await getUserFromSupabase(authHeader);
  } catch (error) {
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
