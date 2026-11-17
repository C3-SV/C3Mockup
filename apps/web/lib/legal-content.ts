export type LegalDocumentId = "privacidad" | "terminos" | "codigo-de-conducta";

export type LegalDocumentSection = {
  id: string;
  title: string;
  paragraphs: string[];
  items?: string[];
};

export type LegalDocumentData = {
  id: LegalDocumentId;
  title: string;
  version: string;
  reviewedAt: string;
  introduction?: string;
  sections: LegalDocumentSection[];
  references?: Array<{ label: string; href: string }>;
};

/** Versión 0.2 de los textos legales base, fechada el 14 de noviembre de 2026. */
export const legalDocuments: Record<LegalDocumentId, LegalDocumentData> = {
  privacidad: {
    id: "privacidad",
    title: "Privacidad",
    version: "0.2",
    reviewedAt: "2026-11-14",
    introduction:
      "En Competitive Coding Club (C3) respetamos la privacidad de quienes visitan nuestro sitio y se comunican con nosotros. Esta política explica qué información recibimos, cómo la utilizamos y qué opciones tienes respecto a tus datos personales.",
    sections: [
      {
        id: "alcance",
        title: "Alcance de esta política",
        paragraphs: [
          "Esta política aplica al sitio institucional de C3, disponible en c3.com.sv, y a sus páginas informativas.",
          "Los subdominios, plataformas y formularios de inscripción a eventos pueden tener avisos de privacidad adicionales, según los datos y servicios utilizados en cada actividad.",
        ],
      },
      {
        id: "informacion",
        title: "Información que nos proporcionas",
        paragraphs: ["Cuando utilizas el formulario de contacto, recibimos:"],
        items: [
          "Nombre.",
          "Correo electrónico.",
          "Tipo de consulta.",
          "Mensaje.",
          "Organización, cuando decides indicarla.",
        ],
      },
      {
        id: "formulario",
        title: "Campo técnico y datos sensibles",
        paragraphs: [
          "El formulario también utiliza un campo técnico para ayudar a prevenir envíos automatizados.",
          "No solicitamos información personal sensible mediante el formulario. Te recomendamos evitar compartir datos que no sean necesarios para atender tu consulta.",
        ],
      },
      {
        id: "navegacion",
        title: "Información de navegación",
        paragraphs: [
          "Al visitar el sitio, los servicios de alojamiento y analítica pueden procesar información técnica, como las páginas visitadas, fecha y hora, origen aproximado de la visita, navegador, dispositivo y sistema operativo.",
        ],
      },
      {
        id: "finalidades",
        title: "Para qué utilizamos la información",
        paragraphs: ["Utilizamos la información para:"],
        items: [
          "Recibir, gestionar y responder consultas.",
          "Dar seguimiento a las comunicaciones que nos envías.",
          "Conocer el funcionamiento y uso general del sitio.",
          "Mejorar nuestros contenidos y la experiencia de navegación.",
        ],
      },
      {
        id: "no-promocional",
        title: "Qué no hacemos con tus datos",
        paragraphs: [
          "No utilizamos el formulario de contacto para suscribirte automáticamente a comunicaciones promocionales, ni vendemos tus datos personales.",
        ],
      },
      {
        id: "consultas",
        title: "Cómo gestionamos las consultas",
        paragraphs: [
          "El formulario utiliza Brevo para enviar las consultas al correo de C3, desde donde los miembros autorizados del equipo de liderazgo pueden atenderlas.",
          "El formulario no guarda los mensajes en una base de datos propia del sitio. Sin embargo, estos pueden permanecer almacenados en los sistemas de correo y en los servicios utilizados para su envío.",
          "Como regla general, no compartimos el contenido de las consultas con patrocinadores, aliados u otras organizaciones externas. La información puede ser tratada por los proveedores técnicos que permiten prestar estos servicios, o comunicarse cuando exista una obligación legal aplicable.",
        ],
      },
      {
        id: "analitica",
        title: "Analítica y cookies",
        paragraphs: [
          "Utilizamos Vercel Web Analytics y Google Analytics para conocer el uso general del sitio y orientar mejoras.",
          "Vercel Web Analytics permite obtener estadísticas de navegación sin utilizar cookies de seguimiento.",
          "Google Analytics puede utilizar cookies propias, como `_ga`, e identificadores técnicos para distinguir visitas y sesiones, según su configuración. Puedes administrar o bloquear las cookies desde las opciones de tu navegador.",
          "Estos servicios pueden procesar información técnica de navegación de acuerdo con sus políticas y la configuración utilizada.",
        ],
      },
      {
        id: "servicios-externos",
        title: "Servicios externos",
        paragraphs: [
          "Para el funcionamiento del sitio utilizamos servicios de terceros, entre ellos:",
        ],
        items: [
          "Vercel: alojamiento del sitio y analítica web.",
          "Brevo: envío de mensajes del formulario de contacto.",
          "Google Analytics: estadísticas de navegación.",
          "Firebase: consulta de información del catálogo público de eventos.",
          "Cloudinary: distribución de determinadas imágenes.",
        ],
      },
      {
        id: "enlaces-externos",
        title: "Proveedores y enlaces a otros servicios",
        paragraphs: [
          "Estos proveedores pueden procesar información técnica necesaria para prestar sus servicios, conforme a sus condiciones y políticas aplicables.",
          "El sitio también puede incluir enlaces a WhatsApp, redes sociales, páginas de eventos y sitios de otras organizaciones. Al ingresar a esos servicios, se aplican sus propias políticas de privacidad.",
        ],
      },
      {
        id: "conservacion",
        title: "Conservación de información",
        paragraphs: [
          "Los mensajes recibidos pueden permanecer en los buzones de correo de C3 después de haber sido atendidos, especialmente cuando existe una comunicación o seguimiento relacionado.",
          "También pueden existir registros o copias gestionados por los proveedores técnicos, conforme a sus condiciones y configuraciones.",
          "Puedes solicitar la revisión o eliminación de información personal relacionada con tus comunicaciones con C3 mediante el canal indicado a continuación. Estas solicitudes se atenderán de acuerdo con la normativa aplicable.",
        ],
      },
      {
        id: "derechos",
        title: "Tus derechos y cómo contactarnos",
        paragraphs: [
          "Puedes solicitar información sobre tus datos personales, pedir su corrección o eliminación, o ejercer otros derechos reconocidos por la legislación aplicable, incluida la revocación del consentimiento cuando corresponda.",
          "Para hacerlo, escríbenos a competitivecodingclub.sv@gmail.com. Indica el motivo de tu solicitud y la información necesaria para identificar los datos a los que se refiere. Para proteger tu privacidad, puede ser necesario verificar tu identidad antes de proporcionar o modificar información personal.",
          "Este correo es también nuestro canal para consultas sobre esta política.",
        ],
      },
      {
        id: "menores",
        title: "Personas menores de edad",
        paragraphs: [
          "C3 desarrolla actividades en las que pueden participar estudiantes menores de edad.",
          "La participación y la información de menores se gestionan con especial cuidado, involucrando a sus padres o responsables legales según las condiciones de cada actividad.",
          "Para el uso de fotografías y videos identificables de menores en nuestras actividades, solicitamos autorización escrita de sus padres o responsables legales.",
          "Los espacios de comunidad de C3 no están destinados a la incorporación independiente de menores sin la intervención de sus responsables.",
        ],
      },
      {
        id: "actualizaciones",
        title: "Actualizaciones",
        paragraphs: [
          "Podemos actualizar esta política para reflejar cambios en el sitio, nuestros servicios o las disposiciones aplicables.",
          "La versión vigente y su fecha de actualización estarán disponibles en esta página. Última actualización: 14 de noviembre de 2026.",
        ],
      },
    ],
  },
  terminos: {
    id: "terminos",
    title: "Términos de uso del sitio",
    version: "0.2",
    reviewedAt: "2026-11-14",
    introduction:
      "Bienvenido al sitio de Competitive Coding Club (C3). Estos términos establecen las condiciones generales para navegar y utilizar nuestro sitio institucional.",
    sections: [
      {
        id: "alcance",
        title: "Sobre el sitio y su alcance",
        paragraphs: [
          "Este sitio tiene como propósito presentar a C3, sus iniciativas, actividades, proyectos y canales de contacto.",
          "El sitio institucional es principalmente informativo. No requiere crear una cuenta de usuario ni procesa pagos directamente.",
          "Estos términos aplican al sitio c3.com.sv y, como condiciones generales de navegación, a sus subdominios. Las plataformas, convocatorias y actividades específicas pueden establecer términos o reglas adicionales.",
        ],
      },
      {
        id: "uso-responsable",
        title: "Uso responsable",
        paragraphs: [
          "Al utilizar el sitio, esperamos que lo hagas de manera respetuosa y legítima. No está permitido:",
        ],
        items: [
          "Intentar acceder sin autorización a sistemas, cuentas o información.",
          "Realizar acciones que comprometan la seguridad o funcionamiento del sitio.",
          "Introducir código malicioso o utilizar el sitio para actividades fraudulentas.",
          "Suplantar la identidad de otras personas u organizaciones.",
          "Compartir contenido que vulnere derechos de terceros o la legislación aplicable.",
        ],
      },
      {
        id: "formularios",
        title: "Uso de formularios",
        paragraphs: [
          "Los formularios deben utilizarse para comunicaciones relacionadas con sus propósitos y no para mensajes automatizados no solicitados o contenido perjudicial.",
        ],
      },
      {
        id: "informacion-actividades",
        title: "Información y actividades",
        paragraphs: [
          "Publicamos información sobre programas, competencias, eventos, proyectos y oportunidades relacionadas con C3.",
          "Procuramos que los contenidos sean claros y actualizados. Sin embargo, las fechas, requisitos, ubicaciones y otros detalles pueden modificarse.",
          "Para participar en una actividad, deberán consultarse su convocatoria vigente, sus requisitos y las reglas establecidas por la organización responsable.",
          "La información general del sitio no sustituye las condiciones particulares de cada actividad.",
        ],
      },
      {
        id: "propiedad-intelectual",
        title: "Contenido y propiedad intelectual",
        paragraphs: [
          "El sitio contiene textos, elementos gráficos, fotografías, logotipos, diseños y otros materiales desarrollados por C3, sus integrantes o colaboradores, así como materiales de terceros utilizados con la autorización correspondiente.",
          "La publicación de estos contenidos no implica una autorización general para reproducirlos, modificarlos, comercializarlos o distribuirlos.",
          "Las marcas, nombres, imágenes y demás materiales pertenecen a sus respectivos titulares. Para solicitar autorización de uso de materiales de C3, puedes comunicarte mediante nuestro correo de contacto.",
        ],
      },
      {
        id: "terceros",
        title: "Enlaces y servicios de terceros",
        paragraphs: [
          "El sitio puede incluir enlaces hacia redes sociales, comunidades, plataformas de inscripción, servicios externos y páginas de organizaciones aliadas.",
          "Estos servicios son administrados por sus respectivos responsables y pueden tener términos y políticas de privacidad propios.",
          "C3 no controla de manera general el funcionamiento o contenido de los sitios externos.",
        ],
      },
      {
        id: "privacidad-convivencia",
        title: "Privacidad y convivencia",
        paragraphs: [
          "El tratamiento de información personal relacionado con el sitio se explica en nuestra Política de privacidad.",
          "La participación en actividades y espacios vinculados a C3 también se encuentra sujeta a nuestro Código de conducta, así como a las reglas específicas que correspondan.",
        ],
      },
      {
        id: "cambios-contacto",
        title: "Cambios y contacto",
        paragraphs: [
          "C3 puede actualizar los contenidos y funcionalidades del sitio, así como estos términos, para reflejar cambios en sus actividades o funcionamiento.",
          "La versión vigente estará disponible en esta página.",
          "Para consultas relacionadas con el sitio o sus contenidos, puedes escribirnos a competitivecodingclub.sv@gmail.com. Última actualización: 14 de noviembre de 2026.",
        ],
      },
    ],
  },
  "codigo-de-conducta": {
    id: "codigo-de-conducta",
    title: "Convivencia en actividades y espacios de C3",
    version: "0.2",
    reviewedAt: "2026-11-14",
    introduction:
      "En Competitive Coding Club (C3) creemos que una comunidad técnica sólida se construye con respeto, colaboración y responsabilidad. Este código establece las pautas básicas de convivencia que esperamos de todas las personas que participan en nuestros espacios y actividades.",
    sections: [
      {
        id: "a-quienes-aplica",
        title: "A quiénes aplica",
        paragraphs: [
          "Este código aplica a integrantes de C3, participantes, organizadores, voluntarios, mentores, invitados y demás personas involucradas en nuestras actividades.",
          "Incluye actividades presenciales, eventos virtuales, reuniones y espacios de comunidad administrados por C3.",
          "Las actividades organizadas junto con otras instituciones pueden contar con reglas adicionales establecidas por sus responsables.",
        ],
      },
      {
        id: "trato-respetuoso",
        title: "Respeto y trato adecuado",
        paragraphs: [
          "Esperamos que todas las personas mantengan un trato respetuoso, profesional y constructivo, independientemente de su experiencia, trayectoria, edad, identidad u otras características personales.",
          "No se permiten conductas como:",
        ],
        items: [
          "Acoso, intimidación, amenazas o agresiones.",
          "Discriminación, humillación o comentarios degradantes.",
          "Hostigamiento persistente o comportamientos que afecten deliberadamente la participación de otras personas.",
          "Difusión no autorizada de información privada.",
          "Conductas que comprometan la seguridad o integridad de los demás.",
        ],
      },
      {
        id: "criticas-tecnicas",
        title: "Diferencias y críticas técnicas",
        paragraphs: [
          "Las diferencias de opinión, críticas técnicas y discusiones son parte del aprendizaje. Deben desarrollarse con respeto y sin ataques personales.",
        ],
      },
      {
        id: "colaboracion",
        title: "Colaboración y participación responsable",
        paragraphs: ["Esperamos que quienes participan en C3:"],
        items: [
          "Respeten las reglas y objetivos de cada actividad.",
          "Sigan las indicaciones de los equipos organizadores relacionadas con la seguridad y el desarrollo de los eventos.",
          "Actúen con honestidad e integridad en competencias y proyectos.",
          "Respeten el trabajo, las ideas y las contribuciones de otras personas.",
          "Utilicen responsablemente los espacios, equipos y recursos disponibles.",
        ],
      },
      {
        id: "reglas-actividades",
        title: "Reglas de cada actividad",
        paragraphs: [
          "Las competencias, hackathons y otras actividades pueden establecer reglas técnicas y de participación adicionales.",
        ],
      },
      {
        id: "privacidad-contenidos",
        title: "Privacidad, fotografías y contenidos",
        paragraphs: [
          "Respeta la privacidad de otras personas. No compartas datos personales, credenciales, conversaciones privadas o materiales confidenciales sin autorización.",
          "En actividades de C3 pueden realizarse fotografías y grabaciones para documentación y comunicación institucional.",
          "El uso de imágenes debe respetar las autorizaciones y condiciones correspondientes, especialmente cuando involucre a personas menores de edad.",
          "Si apareces en una publicación de C3 y deseas solicitar su revisión o retiro, puedes comunicarte con nuestro equipo.",
        ],
      },
      {
        id: "comunicar-situacion",
        title: "Cómo comunicar una situación",
        paragraphs: [
          "Si presencias o experimentas una situación contraria a este código, puedes informarla al equipo organizador de la actividad o escribir a competitivecodingclub.sv@gmail.com.",
          "Para facilitar su revisión, indica la actividad o espacio relacionado y una descripción de lo ocurrido. Comparte únicamente la información necesaria y evita divulgar detalles personales en espacios públicos.",
          "Los reportes deberán tratarse con discreción y respeto hacia las personas involucradas, sin prometer anonimato absoluto. No se permiten represalias contra quienes comuniquen de buena fe una situación relacionada con estas normas.",
        ],
      },
      {
        id: "medidas",
        title: "Incumplimientos y medidas",
        paragraphs: [
          "Las situaciones reportadas se evaluarán considerando su naturaleza, gravedad, contexto y las reglas aplicables a cada actividad.",
          "Según corresponda, podrán adoptarse medidas como advertencias, restricciones de participación o retiro de una actividad, conforme a las condiciones establecidas por sus responsables.",
          "Las situaciones que puedan constituir infracciones legales deberán tratarse conforme a la normativa aplicable y, cuando corresponda, ante las autoridades competentes.",
        ],
      },
      {
        id: "alcance-actualizaciones",
        title: "Alcance y actualizaciones",
        paragraphs: [
          "Este código constituye una base general de convivencia para C3.",
          "Cada evento, programa o espacio podrá establecer reglas adicionales de participación, seguridad o comportamiento, compatibles con estas pautas generales.",
          "C3 podrá actualizar este código para reflejar nuevas necesidades de sus actividades y comunidad. Última actualización: 14 de noviembre de 2026.",
        ],
      },
    ],
  },
};

export function getLegalDocument(id: LegalDocumentId): LegalDocumentData {
  return legalDocuments[id];
}
