-- Enable Row-Level Security on all user-scoped tables and add policies
-- that restrict access to the authenticated owner of each record.

-- Helper: tables owned via created_by
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipt_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE grn_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE grn_approval_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- Tables scoped by created_by
-- ========================================================================

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'requests',
    'purchase_orders',
    'purchase_order_items',
    'goods_receipt_notes',
    'grn_items',
    'grn_approval_history',
    'asset_transactions',
    'assets',
    'maintenance_tasks',
    'maintenance_attachments',
    'audit_logs'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I;', t || '_select_own', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I;', t || '_insert_own', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I;', t || '_update_own', t);
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I;', t || '_delete_own', t);

    EXECUTE format(
      'CREATE POLICY %I ON %I FOR SELECT TO authenticated USING (auth.uid() = created_by);',
      t || '_select_own', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);',
      t || '_insert_own', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);',
      t || '_update_own', t
    );
    EXECUTE format(
      'CREATE POLICY %I ON %I FOR DELETE TO authenticated USING (auth.uid() = created_by);',
      t || '_delete_own', t
    );
  END LOOP;
END $$;

-- ========================================================================
-- profiles: users can read and update only their own row
-- ========================================================================

DROP POLICY IF EXISTS profiles_select_own ON profiles;
DROP POLICY IF EXISTS profiles_update_own ON profiles;
DROP POLICY IF EXISTS profiles_insert_own ON profiles;

CREATE POLICY profiles_select_own ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY profiles_insert_own ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY profiles_update_own ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ========================================================================
-- invitations: only admins can create invitations
-- ========================================================================

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS invitations_select_admin ON invitations;
DROP POLICY IF EXISTS invitations_insert_admin ON invitations;
DROP POLICY IF EXISTS invitations_update_admin ON invitations;
DROP POLICY IF EXISTS invitations_delete_admin ON invitations;

CREATE POLICY invitations_select_admin ON invitations
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY invitations_insert_admin ON invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY invitations_update_admin ON invitations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

CREATE POLICY invitations_delete_admin ON invitations
  FOR DELETE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );
