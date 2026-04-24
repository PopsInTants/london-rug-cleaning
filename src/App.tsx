import { lazy, Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/providers/AuthContext";

const queryClient = new QueryClient();

const RouterLoader = lazy(async () => {
  const mod = await import("./route");
  const Component = () => <RouterProvider router={mod.Router} />;
  return { default: Component };
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen text-sm text-muted-foreground">
              Loading...
            </div>
          }
        >
          <RouterLoader />
        </Suspense>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
