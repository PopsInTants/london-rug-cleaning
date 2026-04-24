// Role IDs must match the user_role enum in the database: "ADMIN" | "FINANCE" | "EMPLOYEE"
export const roles = [
  { id: "ADMIN", name: "Admin" },
  { id: "FINANCE", name: "Finance" },
  { id: "EMPLOYEE", name: "Employee" },
];

export const departments = [
  { id: "it", name: "IT" },
  { id: "finance", name: "Finance" },
  { id: "procurement", name: "Procurement" },
  { id: "operations", name: "Operations" },
  { id: "hr", name: "Human Resources" },
];
