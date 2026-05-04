-- ============================================================
-- 001_schema.sql
-- Aplicar no SQL Editor do Supabase Dashboard
-- ============================================================

-- CAMPANHAS / CICLOS
CREATE TABLE campaigns (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  starts_at   date,
  ends_at     date,
  active      boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Apenas 1 campanha ativa por vez
CREATE UNIQUE INDEX campaigns_single_active ON campaigns (active) WHERE active = true;

-- CAMPOS DE PERFIL DO RESPONDENTE
CREATE TABLE profile_fields (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label       text NOT NULL,
  type        text NOT NULL CHECK (type IN ('select', 'input', 'textarea')),
  required    boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE profile_field_options (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id    uuid NOT NULL REFERENCES profile_fields(id) ON DELETE CASCADE,
  label       text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0
);

-- SEÇÕES
CREATE TABLE survey_sections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label       text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  active      boolean NOT NULL DEFAULT true
);

-- PERGUNTAS
CREATE TABLE survey_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id      uuid REFERENCES survey_sections(id) ON DELETE SET NULL,
  type            text NOT NULL CHECK (type IN ('likert', 'multi', 'text')),
  text            text NOT NULL,
  sub             text,
  max_selections  integer,
  required        boolean NOT NULL DEFAULT true,
  sort_order      integer NOT NULL DEFAULT 0,
  active          boolean NOT NULL DEFAULT true
);

CREATE TABLE question_options (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  label       text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0
);

-- RESPOSTAS (anonimizadas — sem PII no modo anônimo)
CREATE TABLE responses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid REFERENCES campaigns(id),
  modo         text NOT NULL CHECK (modo IN ('identificado', 'anonimo')),
  protocol     text NOT NULL,
  profile      jsonb,          -- dados de perfil não-identificáveis
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE response_answers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid NOT NULL REFERENCES responses(id) ON DELETE CASCADE,
  question_id uuid REFERENCES survey_questions(id) ON DELETE SET NULL,
  value       jsonb           -- number | string | string[]
);

-- LOG DE AUDITORIA
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid REFERENCES auth.users(id),
  action      text NOT NULL CHECK (action IN ('create', 'update', 'delete')),
  table_name  text NOT NULL,
  record_id   uuid,
  diff        jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- RLS — Row Level Security
-- ============================================================

-- profile_fields: leitura pública (ativos), CRUD admin
ALTER TABLE profile_fields ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select_active" ON profile_fields
  FOR SELECT USING (active = true);
CREATE POLICY "admin_all" ON profile_fields
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- profile_field_options: leitura pública via field ativo, CRUD admin
ALTER TABLE profile_field_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select" ON profile_field_options
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profile_fields pf WHERE pf.id = field_id AND pf.active = true)
  );
CREATE POLICY "admin_all" ON profile_field_options
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- survey_sections: leitura pública (ativos), CRUD admin
ALTER TABLE survey_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select_active" ON survey_sections
  FOR SELECT USING (active = true);
CREATE POLICY "admin_all" ON survey_sections
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- survey_questions: leitura pública (ativos), CRUD admin
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select_active" ON survey_questions
  FOR SELECT USING (active = true);
CREATE POLICY "admin_all" ON survey_questions
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- question_options: leitura pública via question ativa, CRUD admin
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select" ON question_options
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM survey_questions sq WHERE sq.id = question_id AND sq.active = true)
  );
CREATE POLICY "admin_all" ON question_options
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- campaigns: leitura pública, CRUD admin
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_select" ON campaigns FOR SELECT USING (true);
CREATE POLICY "admin_all" ON campaigns
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- responses: inserção pública, leitura/gestão admin
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert" ON responses FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_select" ON responses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete" ON responses FOR DELETE USING (auth.role() = 'authenticated');

-- response_answers: inserção pública, leitura/gestão admin
ALTER TABLE response_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_insert" ON response_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_select" ON response_answers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "admin_delete" ON response_answers FOR DELETE USING (auth.role() = 'authenticated');

-- audit_log: somente admin
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_all" ON audit_log
  FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
