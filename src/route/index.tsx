import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { DefaultLayout } from "@/components/layout/DefaultLayout";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Login = lazy(() => import("@/pages/auth/login"));
const Signup = lazy(() => import("@/pages/auth/signup"));
const Reset = lazy(() => import("@/pages/auth/reset"));

const Profile = lazy(() => import("@/pages/Profile"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Assets = lazy(() => import("@/pages/assets"));
const AssetDetails = lazy(() => import("@/pages/assets/[id]"));
const CreateAssetFromPO = lazy(() => import("@/pages/assets/create-from-po"));
const GRNList = lazy(() => import("@/pages/grn"));
const GRNCreate = lazy(() => import("@/pages/grn/GRNCreate"));
const GRNDetail = lazy(() => import("@/pages/grn/GRNDetail"));
const Maintenance = lazy(() => import("@/pages/maintenance"));
const PurchaseOrders = lazy(() => import("@/pages/purchase-orders"));
const PurchaseOrderDetail = lazy(() => import("@/pages/purchase-orders/[id]"));
const Requests = lazy(() => import("@/pages/requests"));
const RequestDetail = lazy(() => import("@/pages/requests/[id]"));
const RequestApprovals = lazy(() => import("@/pages/requests/approvals"));
const RequestDelivery = lazy(() => import("@/pages/requests/delivery"));
const AdminCompany = lazy(() => import("@/pages/admin/company"));
const AdminDepartments = lazy(() => import("@/pages/admin/departments"));
const AdminIntegrations = lazy(() => import("@/pages/admin/integrations"));
const AdminLocations = lazy(() => import("@/pages/admin/locations"));
const AdminRoles = lazy(() => import("@/pages/admin/roles"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminWorkflow = lazy(() => import("@/pages/admin/workflow"));
const AdminAuditLogs = lazy(() => import("@/pages/admin/audit-logs"));
const ItemMasterPage = lazy(() => import("@/pages/admin/item-master"));
const Vendors = lazy(() => import("@/pages/vendors"));
const Reports = lazy(() => import("@/pages/reports"));
const FinanceSetup = lazy(() => import("@/pages/finance"));
const DepreciationSchedule = lazy(() => import("@/pages/finance/DepreciationSchedule"));
const DepreciationSetup = lazy(() => import("@/pages/finance/DepreciationSetup"));
const ERPIntegration = lazy(() => import("@/pages/finance/ERPIntegration"));
const ImpairmentRevaluation = lazy(() => import("@/pages/finance/ImpairmentRevaluation"));

import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import GuestGuard from "./GuestRoute";

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh] text-sm text-muted-foreground">
    Loading...
  </div>
);

const withSuspense = (node: React.ReactNode) => (
  <Suspense fallback={<PageFallback />}>{node}</Suspense>
);

export const Router = createBrowserRouter([
  {
    element: (
      <TooltipProvider>
        <ProtectedRoute>
          <DefaultLayout>
            <Outlet />
          </DefaultLayout>
        </ProtectedRoute>
      </TooltipProvider>
    ),
    children: [
      { path: "/", element: withSuspense(<Dashboard />) },
      { path: "/dashboard", element: withSuspense(<Dashboard />) },
      { path: "/profile", element: withSuspense(<Profile />) },
      { path: "/assets", element: withSuspense(<Assets />) },
      { path: "/assets/:id", element: withSuspense(<AssetDetails />) },
      { path: "/assets/request", element: withSuspense(<Requests />) },
      { path: "/assets/create-from-po", element: withSuspense(<CreateAssetFromPO />) },
      { path: "/assets/disposal", element: withSuspense(<Assets />) },
      { path: "/assets/capitalisation", element: withSuspense(<Assets />) },
      { path: "/grn", element: withSuspense(<GRNList />) },
      { path: "/grn/create", element: withSuspense(<GRNCreate />) },
      { path: "/grn/:id", element: withSuspense(<GRNDetail />) },
      { path: "/maintenance", element: withSuspense(<Maintenance />) },
      { path: "/purchase-orders", element: withSuspense(<PurchaseOrders />) },
      { path: "/purchase-orders/:id", element: withSuspense(<PurchaseOrderDetail />) },
      { path: "/requests", element: withSuspense(<Requests />) },
      { path: "/requests/:id", element: withSuspense(<RequestDetail />) },
      { path: "/requests/approvals", element: withSuspense(<RequestApprovals />) },
      { path: "/requests/delivery", element: withSuspense(<RequestDelivery />) },
      { path: "/admin/company", element: withSuspense(<AdminCompany />) },
      { path: "/admin/departments", element: withSuspense(<AdminDepartments />) },
      { path: "/admin/integrations", element: withSuspense(<AdminIntegrations />) },
      { path: "/admin/locations", element: withSuspense(<AdminLocations />) },
      { path: "/admin/item-master", element: withSuspense(<ItemMasterPage />) },
      { path: "/admin/roles", element: withSuspense(<AdminRoles />) },
      { path: "/admin/users", element: withSuspense(<AdminUsers />) },
      { path: "/admin/workflow", element: withSuspense(<AdminWorkflow />) },
      { path: "/admin/audit-logs", element: withSuspense(<AdminAuditLogs />) },
      { path: "/vendors", element: withSuspense(<Vendors />) },
      { path: "/reports", element: withSuspense(<Reports />) },
      { path: "/finance", element: withSuspense(<FinanceSetup />) },
      { path: "/finance/depreciation-schedule", element: withSuspense(<DepreciationSchedule />) },
      { path: "/finance/depreciation-setup", element: withSuspense(<DepreciationSetup />) },
      { path: "/finance/erp-integration", element: withSuspense(<ERPIntegration />) },
      { path: "/finance/impairment-revaluation", element: withSuspense(<ImpairmentRevaluation />) },
      { path: "/admin/finance", element: withSuspense(<FinanceSetup />) },
      { path: "/admin/finance/depreciation-setup", element: withSuspense(<DepreciationSetup />) },
      { path: "/admin/finance/depreciation-schedule", element: withSuspense(<DepreciationSchedule />) },
      { path: "/admin/finance/impairment-revaluation", element: withSuspense(<ImpairmentRevaluation />) },
      { path: "/admin/finance/erp-integration", element: withSuspense(<ERPIntegration />) },
    ],
    errorElement: withSuspense(<NotFound />),
  },
  {
    element: (
      <GuestGuard>
        <Outlet />
      </GuestGuard>
    ),
    children: [
      { path: "login", element: withSuspense(<Login />) },
      { path: "signup", element: withSuspense(<Signup />) },
      { path: "reset", element: withSuspense(<Reset />) },
    ],
  },
]);
