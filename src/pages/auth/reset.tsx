import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout } from "@/route/AuthLayout";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AUTH_ERRORS } from "@/config/constants";

const Reset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setIsLoading(false);

    toast({
      title: "Check your email",
      description: AUTH_ERRORS.RESET_SENT,
    });
  };

  return (
    <AuthLayout title="Reset your password" subtitle="We'll email you a reset link">
      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <Button type="submit" className="w-full h-12 text-md font-medium" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2" />
              Sending...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Mail className="h-5 w-5 mr-2" />
              Send reset link
            </div>
          )}
        </Button>

        <Button variant="outline" className="w-full h-12" type="button" onClick={() => navigate("/login")}>
          Back to login
        </Button>
      </motion.form>
    </AuthLayout>
  );
};

export default Reset;
