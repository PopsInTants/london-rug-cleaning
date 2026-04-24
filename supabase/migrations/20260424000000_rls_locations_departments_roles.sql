-- Enable RLS on tables added after the initial migration.

ALTER TABLE locations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles       ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- locations, departments, roles — owned via created_by
-- ========================================================================

DO $$
DECLARE
  t text;
  tables text[] := ARRAY['locations', 'departments', 'roles'];
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
