import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

const departmentSchema = z.object({
  name: z.string().min(2, "Department name must be at least 2 characters"),
  description: z.string().optional(),
  managerId: z.string().optional(),
});

export type DepartmentInput = z.infer<typeof departmentSchema>;

export const departmentService = {
  async createDepartment(data: unknown) {
    const parsed = departmentSchema.parse(data);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    const { data: result, error } = await supabase
      .from("departments")
      .insert({ ...parsed, created_by: user.id })
      .select("id, name, description, managerId")
      .single();
    if (error) throw new Error(error.message);
    return result;
  },

  async getDepartments() {
    const { data, error } = await supabase
      .from("departments")
      .select("id, name, description")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },
};
