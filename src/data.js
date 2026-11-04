// Síntesis didáctica de los dos documentos entregados en la Unidad II.
// Las conexiones con decisiones de gestión son interpretación académica, no citas legales.
export const metadata = {
  title: 'Administración de la Educación Superior en Panamá',
  subtitle: 'Fundamentos legales, principios, fines y gestión universitaria',
  activity: 'Actividad Individual N.º 2 · Unidad Didáctica II',
  author: 'Daniel García',
  sources: [
    'Ley Orgánica de Educación y sus Reformas (material de la asignatura).',
    'Fundamentos Legales, Principios y Fines de la Educación Superior en Panamá (material de la asignatura).'
  ],
  note: 'Síntesis de materiales docentes; las relaciones con la gestión son una interpretación académica.'
};

export const sections = [
  {
    id: 'legal', order: '01', title: 'Fundamentos legales',
    marker: '§', color: '#3566c9', pale: '#eaf1ff', ink: '#163a84',
    description: 'Las normas establecen los derechos, responsabilidades y reglas del sistema de educación superior.',
    items: [
      {
        id: 'constitucion', title: 'Constitución Política',
        short: 'Arts. 91, 92, 93 y 96',
        detail: 'La Constitución Política de Panamá constituye la base del derecho a la educación y de las responsabilidades públicas vinculadas a su organización. El material de la unidad identifica especialmente los artículos 91, 92, 93 y 96.',
        relation: 'Orienta las garantías y compromisos que la universidad debe respetar.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 1'
      },
      {
        id: 'ley47', title: 'Ley Orgánica de Educación',
        short: 'Ley 47/1946 · Ley 34/1995',
        detail: 'La Ley 47 de 1946 estructura la educación panameña. El material presenta sus modificaciones por la Ley 34 de 1995 y también menciona reformas posteriores mediante las leyes 50 de 2002 y 60 de 2003.',
        relation: 'Ofrece el marco general para organizar, planificar y supervisar la educación.',
        source: 'Ley Orgánica de Educación y sus Reformas, p. 2'
      },
      {
        id: 'regimen', title: 'Régimen universitario',
        short: 'Art. 6: leyes especiales',
        detail: 'El documento sobre la Ley Orgánica recuerda que la educación universitaria se rige por leyes especiales, en el marco de la coordinación y supervisión educativa mencionada en el material.',
        relation: 'Vincula el régimen general educativo con la organización propia de cada institución.',
        source: 'Ley Orgánica de Educación y sus Reformas, p. 3'
      },
      {
        id: 'articulos', title: 'Tercer nivel de enseñanza',
        short: 'Arts. 59 a 62',
        detail: 'El artículo 59 aborda formación profesional, investigación y cultura; el 60 sitúa la oferta de educación superior y la relaciona con las necesidades del país; el 61 destaca la calidad de la docencia, la investigación y la extensión; el 62 se refiere a recursos y facilidades del Estado.',
        relation: 'Fundamenta la oferta académica, la calidad y la asignación de recursos.',
        source: 'Ley Orgánica de Educación y sus Reformas, pp. 4–5'
      },
      {
        id: 'privadas', title: 'Universidades particulares',
        short: 'Decreto Ley 16 de 1963',
        detail: 'El material señala que el artículo 1 del Decreto Ley 16 de 11 de julio de 1963 reconoce la posibilidad de crear y hacer funcionar universidades privadas, sujetas a la normativa aplicable.',
        relation: 'Relaciona la creación y funcionamiento institucional con exigencias legales.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 1'
      },
      {
        id: 'complementarias', title: 'Normas complementarias',
        short: 'Decretos y resueltos citados',
        detail: 'El documento enumera el Decreto 161 de 1996, el Decreto 50 de 1999, el Resuelto 1139 de 1999 y el Resuelto 1141 de 1998 (vinculado a modificaciones del Decreto Ejecutivo 203 de 1996). Se citan conforme al material, sin atribuirles aquí funciones no explicadas en él.',
        relation: 'Recuerda que la gestión debe consultar las disposiciones específicas aplicables.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 1'
      }
    ]
  },
  {
    id: 'principios', order: '02', title: 'Principios educativos',
    marker: '✧', color: '#138879', pale: '#ddf8f2', ink: '#08645a',
    description: 'Son criterios que orientan cómo enseñar, investigar, actuar y tomar decisiones universitarias.',
    items: [
      {
        id: 'formacion', title: 'Formación especializada',
        short: 'Profesionales para el país',
        detail: 'La educación superior busca formar profesionales especializados capaces de responder a necesidades reales del desarrollo nacional, integrando conocimiento y cultura.',
        relation: 'Exige programas pertinentes y perfiles de egreso vinculados al contexto.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 1'
      },
      {
        id: 'excelencia', title: 'Excelencia académica',
        short: 'Docencia de alta calidad',
        detail: 'Se propone mantener niveles elevados de docencia y una cultura general amplia, junto con la investigación, extensión y servicios profesionales.',
        relation: 'Se concreta en formación docente, evaluación y mejora continua.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 1'
      },
      {
        id: 'investigacion', title: 'Investigación y cultura',
        short: 'Crear y difundir saberes',
        detail: 'La investigación y la difusión de la cultura nacional y universal forman parte de la misión universitaria descrita en los materiales.',
        relation: 'Impulsa proyectos, producción académica y extensión universitaria.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 1'
      },
      {
        id: 'autonomia', title: 'Autonomía universitaria',
        short: 'Criterio y función crítica',
        detail: 'La autonomía se presenta como capacidad institucional para desarrollar una función crítica, observar problemas sociales y proponer soluciones con responsabilidad.',
        relation: 'Requiere tomar decisiones académicas justificadas y transparentes.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 2'
      },
      {
        id: 'etica', title: 'Ética y transparencia',
        short: 'Rigor y responsabilidad',
        detail: 'El material relaciona la autonomía y la función crítica con el trabajo ético, transparente y científicamente riguroso.',
        relation: 'Debe reflejarse en normas internas, rendición de cuentas y evaluación.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 2'
      },
    ]
  },
  {
    id: 'fines', order: '03', title: 'Fines de la educación',
    marker: '◎', color: '#d78b23', pale: '#fff2d9', ink: '#8a5714',
    description: 'Expresan los resultados humanos y sociales que la educación superior procura alcanzar.',
    items: [
      {
        id: 'derechos', title: 'Derechos y equidad',
        short: 'Justicia social y respeto',
        detail: 'La educación superior debe promover derechos humanos, equidad y justicia social, fomentando una convivencia más respetuosa e inclusiva.',
        relation: 'Orienta la atención estudiantil y las políticas de igualdad de oportunidades.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 2'
      },
      {
        id: 'pensamiento', title: 'Pensamiento crítico',
        short: 'Reflexión y emprendimiento',
        detail: 'Entre los fines se menciona formar personas capaces de analizar problemas, cuestionar ideas y desarrollar iniciativas emprendedoras.',
        relation: 'Invita a diseñar experiencias de aprendizaje activas y contextualizadas.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 2'
      },
      {
        id: 'cultura', title: 'Identidad y cultura',
        short: 'Difusión y creación cultural',
        detail: 'La universidad contribuye a difundir los aspectos culturales y a crear nuevas expresiones de cultura, reconociendo la identidad nacional.',
        relation: 'Favorece programas de extensión y contenidos pertinentes al entorno.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 2'
      },
      {
        id: 'sostenible', title: 'Desarrollo sostenible',
        short: 'Ambiente y progreso social',
        detail: 'La educación superior debe promover la protección ambiental, el progreso social y el desarrollo sostenible.',
        relation: 'Se traduce en proyectos institucionales y currículos comprometidos con el futuro.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 2'
      },
      {
        id: 'innovacion', title: 'Innovación tecnológica',
        short: 'Apoyo al sector productivo',
        detail: 'El documento plantea estimular a los sectores público y privado en sus procesos de actualización e innovación tecnológica.',
        relation: 'Impulsa la actualización curricular y la vinculación con el entorno laboral.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 2'
      },
      {
        id: 'conocimiento', title: 'Conocimiento para servir',
        short: 'Generación y transferencia',
        detail: 'Se busca generar conocimiento, transferirlo críticamente a la sociedad y contribuir al desarrollo del país mediante profesionales con conciencia social.',
        relation: 'Integra investigación, enseñanza, extensión y servicio a la comunidad.',
        source: 'Fundamentos Legales, Principios y Fines..., p. 2'
      },
      {
        id: 'compromiso', title: 'Compromiso social',
        short: 'Impacto en la comunidad',
        detail: 'La universidad analiza tendencias sociales, culturales, económicas y políticas para anticipar necesidades y aportar alternativas de solución.',
        relation: 'Conecta la planificación universitaria con los desafíos de Panamá.',
        source: 'Fundamentos Legales, Principios y Fines..., pp. 1–2'
      }
    ]
  },
  {
    id: 'gestion', order: '04', title: 'Administración universitaria',
    marker: '⌘', color: '#8b5bc0', pale: '#f2eafe', ink: '#603790',
    description: 'Es la puesta en práctica de las normas, principios y fines mediante decisiones y procesos institucionales.',
    items: [
      {
        id: 'planificacion', title: 'Planificación académica',
        short: 'Objetivos y oferta formativa',
        detail: 'La gestión organiza prioridades, programas, recursos y metas, considerando las necesidades socioeconómicas, culturales, científicas y profesionales mencionadas en el artículo 60 del material.',
        relation: 'Convierte el marco legal y la misión institucional en acciones concretas.',
        source: 'Interpretación de gestión; Ley Orgánica..., p. 4'
      },
      {
        id: 'curriculo', title: 'Actualización curricular',
        short: 'Pertinencia y articulación',
        detail: 'La presentación sobre la Ley Orgánica cita el artículo 246, que relaciona los planes de educación superior con la articulación entre niveles y el equilibrio entre formación general y especializada.',
        relation: 'Permite ajustar programas a necesidades sociales y tecnológicas.',
        source: 'Interpretación de gestión; Ley Orgánica..., p. 7'
      },
      {
        id: 'calidad', title: 'Evaluación de la calidad',
        short: 'Seguimiento y mejora',
        detail: 'Los materiales destacan la calidad de la docencia y la evaluación de las funciones de la educación superior como responsabilidad permanente.',
        relation: 'Se expresa en indicadores, revisión de resultados y mejora continua.',
        source: 'Interpretación de gestión; Fundamentos..., p. 2'
      },
      {
        id: 'recursos', title: 'Gestión de recursos',
        short: 'Talento, tecnología y medios',
        detail: 'La administración necesita coordinar personal, infraestructura, tecnología y presupuesto. El artículo 62 destaca las facilidades técnicas y recursos para impulsar la educación superior.',
        relation: 'Hace posible ejecutar los planes con eficiencia y responsabilidad.',
        source: 'Interpretación de gestión; Ley Orgánica..., p. 5'
      },
      {
        id: 'academica', title: 'Docencia e investigación',
        short: 'Enseñar, investigar, extender',
        detail: 'La universidad articula enseñanza de calidad, generación de conocimiento y extensión científica, técnica y cultural, de acuerdo con los objetivos citados en el artículo 61.',
        relation: 'Une el trabajo del profesorado con los fines educativos y sociales.',
        source: 'Interpretación de gestión; Ley Orgánica..., p. 4'
      },
      {
        id: 'gobernanza', title: 'Gobernanza responsable',
        short: 'Ética, autonomía y control',
        detail: 'Las autoridades universitarias deben organizar decisiones, comunicar resultados y mantener mecanismos de seguimiento coherentes con los principios de autonomía, transparencia y rigor.',
        relation: 'Da coherencia entre misión, decisiones administrativas y bienestar social.',
        source: 'Interpretación de gestión; Fundamentos..., p. 2'
      }
    ]
  }
];

export const byId = Object.fromEntries(
  sections.flatMap(section =>
    section.items.map(item => [item.id, { ...item, sectionId: section.id, sectionTitle: section.title }])
  )
);
