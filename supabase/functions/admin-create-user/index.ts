import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminSecret = Deno.env.get("ADMIN_CREATE_SECRET") || "";
    const providedSecret = req.headers.get("x-admin-secret") || "";
    if (!adminSecret || providedSecret !== adminSecret) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const email: string | undefined = body?.email;
    const password: string | undefined = body?.password;
    const fullName: string | undefined = body?.fullName;
    const phone: string | undefined = body?.phone;
    const makeAdmin: boolean = body?.makeAdmin !== false;

    if (!email) {
      return new Response(JSON.stringify({ error: "email_required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const pwd = password ?? crypto.randomUUID().replace(/-/g, "");

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: pwd,
      email_confirm: true,
      user_metadata: { full_name: fullName ?? null, phone: phone ?? null },
    });

    if (error || !data?.user) {
      return new Response(JSON.stringify({ error: error?.message ?? "create_failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = data.user.id;

    await supabase
      .from("profiles")
      .upsert({ user_id: userId, full_name: fullName ?? null, phone: phone ?? null, email }, { onConflict: "user_id" });

    if (makeAdmin) {
      await supabase
        .from("user_roles")
        .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    }

    return new Response(
      JSON.stringify({ success: true, user_id: userId, email, password: pwd, admin: makeAdmin }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "internal_error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
