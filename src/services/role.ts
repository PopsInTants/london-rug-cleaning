import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
});

export type RoleInput = z.infer<typeof roleSchema>;

export const roleService = {
  async createRole(data: unknown) {
    const parsed = roleSchema.parse(data);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data: result, error } = await supabase
      .from("roles")
      .insert({ ...parsed, created_by: user.id })
      .select("id, name, description")
      .single();
    if (error) throw new Error(error.message);
    return result;
  },
};
