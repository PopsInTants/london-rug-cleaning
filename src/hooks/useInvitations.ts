import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

const invitationSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Role is required"),
  department: z.string().min(1, "Department is required"),
});

export function useInvitations() {
  const getInvitationsByEmail = async (email: string) => {
    const { data, error } = await supabase
      .from("invitations")
      .select("id, email, role, department, status")
      .eq("email", email)
      .eq("status", "pending")
      .maybeSingle();

    return { data, error };
  };

  const createInvitation = async (email: string, role: string, department: string) => {
    const result = invitationSchema.safeParse({ email, role, department });
    if (!result.success) {
      const message = result.error.errors[0]?.message ?? "Invalid invitation data";
      return { data: null, error: { message, code: "VALIDATION_ERROR" } };
    }

    const { data, error } = await supabase
      .from("invitations")
      .insert({ email: result.data.email, role: result.data.role, department: result.data.department, status: "pending" })
      .select("id, email, role, department, status")
      .single();

    return { data, error };
  };

  return { createInvitation, getInvitationsByEmail };
}
