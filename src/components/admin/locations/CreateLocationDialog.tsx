import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LocationForm } from "./LocationForm";
import { companyService } from "@/services/company";
import { toast } from "sonner";

interface CreateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateLocationDialog({ open, onOpenChange }: CreateLocationDialogProps) {
  const handleSubmit = async (values: unknown) => {
    try {
      await companyService.postLocation(values);
      toast.success("Location created successfully");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to create location");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Create a new location or branch for your organization
          </DialogDescription>
        </DialogHeader>
        <LocationForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
