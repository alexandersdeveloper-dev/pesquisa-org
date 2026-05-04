-- ============================================================
-- 002_seed.sql — Migrar dados hardcoded para o banco
-- Aplicar APÓS 001_schema.sql
-- ============================================================

-- Campanha inicial
INSERT INTO campaigns (title, starts_at, ends_at, active) VALUES
  ('Ciclo 2026', '2026-01-01', '2026-12-31', true);

-- Campos de Perfil do Respondente
INSERT INTO profile_fields (label, type, required, sort_order) VALUES
  ('Área / Serviço utilizado',  'select',   true, 1),
  ('Frequência de uso',         'select',   true, 2),
  ('Faixa etária',              'select',   true, 3),
  ('Você se considera',         'select',   true, 4);

-- Opções: Área
INSERT INTO profile_field_options (field_id, label, sort_order)
SELECT id, unnest(ARRAY[
  'Secretaria de Finanças',
  'Secretaria de Saúde',
  'Secretaria de Educação',
  'Secretaria de Obras e Infraestrutura',
  'Secretaria de Meio Ambiente',
  'Secretaria de Assistência Social',
  'Secretaria de Cultura e Turismo',
  'Setor de Tributos e Taxas',
  'Outro serviço / setor'
]), generate_series(1, 9)
FROM profile_fields WHERE label = 'Área / Serviço utilizado';

-- Opções: Frequência
INSERT INTO profile_field_options (field_id, label, sort_order)
SELECT id, unnest(ARRAY[
  'Primeira vez',
  'Raramente (1–2x ao ano)',
  'Às vezes (3–6x ao ano)',
  'Frequentemente (mensalmente)',
  'Muito frequentemente (semanalmente)'
]), generate_series(1, 5)
FROM profile_fields WHERE label = 'Frequência de uso';

-- Opções: Faixa etária
INSERT INTO profile_field_options (field_id, label, sort_order)
SELECT id, unnest(ARRAY[
  'Até 18 anos',
  '18–25 anos',
  '26–35 anos',
  '36–50 anos',
  '51 anos ou mais'
]), generate_series(1, 5)
FROM profile_fields WHERE label = 'Faixa etária';

-- Opções: Relação
INSERT INTO profile_field_options (field_id, label, sort_order)
SELECT id, unnest(ARRAY[
  'Cidadão',
  'Servidor público',
  'Prestador de serviço',
  'Empresário / Comerciante'
]), generate_series(1, 4)
FROM profile_fields WHERE label = 'Você se considera';

-- Seções
INSERT INTO survey_sections (label, sort_order) VALUES
  ('Atendimento',               1),
  ('Serviços',                  2),
  ('Gestão municipal',          3),
  ('Sua opinião',               4);

-- Perguntas — Atendimento
INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'likert',
  'O atendimento prestado pelos servidores foi cordial e respeitoso.',
  'Considere sua experiência mais recente com a Prefeitura.',
  true, 1
FROM survey_sections WHERE label = 'Atendimento';

INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'likert',
  'O tempo de espera para ser atendido foi adequado.',
  '',
  true, 2
FROM survey_sections WHERE label = 'Atendimento';

INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'likert',
  'Fui bem informado sobre os serviços disponíveis e os procedimentos necessários.',
  '',
  true, 3
FROM survey_sections WHERE label = 'Atendimento';

-- Perguntas — Serviços
INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'likert',
  'Os serviços oferecidos pela Prefeitura atendem às minhas necessidades.',
  '',
  true, 1
FROM survey_sections WHERE label = 'Serviços';

INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'likert',
  'As instalações físicas da Prefeitura são adequadas e acessíveis.',
  '',
  true, 2
FROM survey_sections WHERE label = 'Serviços';

-- Perguntas — Gestão municipal
INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'likert',
  'A comunicação da Prefeitura com os cidadãos é clara e transparente.',
  '',
  true, 1
FROM survey_sections WHERE label = 'Gestão municipal';

INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'likert',
  'Confio na capacidade da gestão municipal de resolver os problemas da cidade.',
  '',
  true, 2
FROM survey_sections WHERE label = 'Gestão municipal';

INSERT INTO survey_questions (section_id, type, text, sub, max_selections, required, sort_order)
SELECT id, 'multi',
  'Quais áreas você considera prioritárias para a Prefeitura investir?',
  'Selecione até três opções.',
  3, true, 3
FROM survey_sections WHERE label = 'Gestão municipal';

-- Opções: pergunta multi (q8)
INSERT INTO question_options (question_id, label, sort_order)
SELECT id, unnest(ARRAY[
  'Saúde e UBS',
  'Educação e escolas',
  'Infraestrutura e vias públicas',
  'Saneamento e água',
  'Segurança pública',
  'Transporte e mobilidade',
  'Cultura e lazer',
  'Meio ambiente'
]), generate_series(1, 8)
FROM survey_questions WHERE text = 'Quais áreas você considera prioritárias para a Prefeitura investir?';

-- Perguntas — Sua opinião
INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'text',
  'O que você gostaria que mudasse nos serviços da Prefeitura?',
  'Comentário opcional. Sua resposta é anônima.',
  false, 1
FROM survey_sections WHERE label = 'Sua opinião';

INSERT INTO survey_questions (section_id, type, text, sub, required, sort_order)
SELECT id, 'text',
  'O que está funcionando bem e merece ser preservado?',
  'Comentário opcional.',
  false, 2
FROM survey_sections WHERE label = 'Sua opinião';
