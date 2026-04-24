import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (loading) return;
    if (!session) {
      setVerifying(false);
      setVerified(false);
      return;
    }
    setVerifying(true);
    supabase.auth.getUser().then(({ data, error }) => {
      if (cancelled) return;
      setVerified(!!data.user && !error);
      setVerifying(false);
    });
    return () => {
      cancelled = true;
    };
  }, [session, loading]);

  if (loading || verifying) return null;

  if (!verified) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
