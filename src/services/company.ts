import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

const locationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  code: z.string().min(2, "Code must be at least 2 characters"),
  type: z.string().min(1, "Type is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

const locationIdSchema = z.string().uuid("Invalid location ID");

const companyInfoSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters"),
  legalName: z.string().min(2, "Legal name must be at least 2 characters"),
  taxId: z.string().min(2, "Tax ID is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

export type LocationInput = z.infer<typeof locationSchema>;
export type CompanyInfoInput = z.infer<typeof companyInfoSchema>;

export const companyService = {
  async postLocation(data: unknown) {
    const parsed = locationSchema.parse(data);
    const { data: { user } } = await supabase.auth.getUser();
    const { data: result, error } = await supabase
      .from("locations")
      .insert({ ...parsed, created_by: user?.id })
      .select("id, name, code, type, country, city, address, status")
      .single();
    if (error) throw new Error(error.message);
    return result;
  },

  async getLocation() {
    const { data, error } = await supabase
      .from("locations")
      .select("id, name, code, type, country, city, address, status")
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data;
  },

  async getSingleLocation(id: unknown) {
    const validId = locationIdSchema.parse(id);
    const { data, error } = await supabase
      .from("locations")
      .select("id, name, code, type, country, city, address, status")
      .eq("id", validId)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async putSingleLocation(data: unknown, id: unknown) {
    const parsed = locationSchema.parse(data);
    const validId = locationIdSchema.parse(id);
    const { data: result, error } = await supabase
      .from("locations")
      .update(parsed)
      .eq("id", validId)
      .select("id, name, code, type, country, city, address, status")
      .single();
    if (error) throw new Error(error.message);
    return result;
  },

  async updateCompanyInfo(data: unknown) {
    const parsed = companyInfoSchema.parse(data);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const payload = {
      name: parsed.name,
      legal_name: parsed.legalName,
      tax_id: parsed.taxId,
      email: parsed.email,
      phone: parsed.phone,
      website: parsed.website || null,
      address: parsed.address,
    };

    const { data: result, error } = await supabase
      .from("companies")
      .upsert({ ...payload, updated_by: user.id })
      .select("id, name, legal_name, tax_id, email, phone, website, address")
      .single();
    if (error) throw new Error(error.message);
    return result;
  },
};
