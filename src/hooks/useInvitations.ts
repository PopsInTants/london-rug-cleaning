import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase
      .from("invitations")
      .insert({ email, role, department, status: "pending" })
      .select("id, email, role, department, status")
      .single();

    return { data, error };
  };

  return { createInvitation, getInvitationsByEmail };
}
