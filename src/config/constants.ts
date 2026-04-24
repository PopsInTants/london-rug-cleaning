export const APP_NAME = "London Rug Cleaning";

// Safe, neutral messages for auth failure paths.
// Never pass raw Supabase error.message or error.code to the UI — use these instead.
export const AUTH_ERRORS = {
  LOGIN_FAILED:   "Invalid email or password.",
  SIGNUP_FAILED:  "Unable to create account. Please try a different email or log in.",
  RESET_SENT:     "If an account exists for this email, a reset link has been sent.",
  PASSWORDS_NO_MATCH: "Please make sure your passwords match.",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

// Placeholder identities used only in demo/seed contexts.
// Replace with real auth.uid() calls before going to production.
export const DEMO_CURRENT_USER_ID = "00000000-0000-0000-0000-000000000001";
export const DEMO_OTHER_USER_ID   = "00000000-0000-0000-0000-000000000002";
