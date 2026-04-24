import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/providers/AuthContext";
import { Router } from "./route";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={Router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
