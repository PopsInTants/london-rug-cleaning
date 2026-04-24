import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationForm } from "./LocationForm";
import { companyService } from "@/services/company";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EditLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reload: boolean;
  onReload: (reload: boolean) => void;
  selectedId: unknown;
}

export function EditLocationDialog({ open, onOpenChange, onReload, reload, selectedId }: EditLocationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState(null);

  const handleSubmit = async (values: unknown, id: unknown) => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      toast.error("You must be signed in to edit a location");
      return;
    }

    setIsLoading(true);
    try {
      await companyService.putSingleLocation(values, id);
      toast.success("Location updated successfully");
      onReload(true);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to update location");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedId) return;
    companyService.getSingleLocation(selectedId)
      .then(setLocationData)
      .catch(() => toast.error("Failed to load location data"));
  }, [selectedId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Location</DialogTitle>
          <DialogDescription>
            Edit location or branch for your organization
          </DialogDescription>
        </DialogHeader>
        <LocationForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          loading={isLoading}
          locationData={locationData}
          id={selectedId}
        />
      </DialogContent>
    </Dialog>
  );
}
