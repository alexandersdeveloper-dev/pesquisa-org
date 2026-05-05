export const SECTIONS = [
  {
    id: 'atendimento',
    label: 'Atendimento',
    questions: [
      {
        id: 'q1',
        type: 'likert',
        text: 'O atendimento prestado pelos servidores foi cordial e respeitoso.',
        sub: 'Considere sua experiência mais recente com a Prefeitura.',
      },
      {
        id: 'q2',
        type: 'likert',
        text: 'O tempo de espera para ser atendido foi adequado.',
        sub: '',
      },
      {
        id: 'q3',
        type: 'likert',
        text: 'Fui bem informado sobre os serviços disponíveis e os procedimentos necessários.',
        sub: '',
      },
    ],
  },
  {
    id: 'servicos',
    label: 'Serviços',
    questions: [
      {
        id: 'q4',
        type: 'likert',
        text: 'Os serviços oferecidos pela Prefeitura atendem às minhas necessidades.',
        sub: '',
      },
      {
        id: 'q5',
        type: 'likert',
        text: 'As instalações físicas da Prefeitura são adequadas e acessíveis.',
        sub: '',
      },
    ],
  },
  {
    id: 'gestao',
    label: 'Gestão municipal',
    questions: [
      {
        id: 'q6',
        type: 'likert',
        text: 'A comunicação da Prefeitura com os cidadãos é clara e transparente.',
        sub: '',
      },
      {
        id: 'q7',
        type: 'likert',
        text: 'Confio na capacidade da gestão municipal de resolver os problemas da cidade.',
        sub: '',
      },
      {
        id: 'q8',
        type: 'multi',
        text: 'Quais áreas você considera prioritárias para a Prefeitura investir?',
        sub: 'Selecione até três opções.',
        max: 3,
        options: [
          'Saúde e UBS',
          'Educação e escolas',
          'Infraestrutura e vias públicas',
          'Saneamento e água',
          'Segurança pública',
          'Transporte e mobilidade',
          'Cultura e lazer',
          'Meio ambiente',
        ],
      },
    ],
  },
  {
    id: 'opiniao',
    label: 'Sua opinião',
    questions: [
      {
        id: 'q9',
        type: 'text',
        text: 'O que você gostaria que mudasse nos serviços da Prefeitura?',
        sub: 'Comentário opcional. Sua resposta é anônima.',
      },
      {
        id: 'q10',
        type: 'text',
        text: 'O que está funcionando bem e merece ser preservado?',
        sub: 'Comentário opcional.',
      },
    ],
  },
]

export const LIKERT = [
  { v: 1, lbl: 'Péssimo'   },
  { v: 2, lbl: 'Ruim'      },
  { v: 3, lbl: 'Neutro'    },
  { v: 4, lbl: 'Bom'       },
  { v: 5, lbl: 'Excelente' },
]

export const AREAS = [
  'Secretaria de Finanças',
  'Secretaria de Saúde',
  'Secretaria de Educação',
  'Secretaria de Obras e Infraestrutura',
  'Secretaria de Meio Ambiente',
  'Secretaria de Assistência Social',
  'Secretaria de Cultura e Turismo',
  'Setor de Tributos e Taxas',
  'Outro serviço / setor',
]

export const FREQUENCIAS = [
  'Primeira vez',
  'Raramente (1–2x ao ano)',
  'Às vezes (3–6x ao ano)',
  'Frequentemente (mensalmente)',
  'Muito frequentemente (semanalmente)',
]

export const FAIXAS_ETARIAS = [
  'Até 18 anos',
  '18–25 anos',
  '26–35 anos',
  '36–50 anos',
  '51 anos ou mais',
]

export const RELACOES = [
  'Cidadão',
  'Servidor público',
  'Prestador de serviço',
  'Empresário / Comerciante',
]
