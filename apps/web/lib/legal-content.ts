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

/** Base informativa pública 0.1, autorizada por el responsable el 2026-11-14. */
export const legalDocuments: Record<LegalDocumentId, LegalDocumentData> = {
  privacidad: {
    id: "privacidad",
    title: "Privacidad",
    version: "0.1",
    reviewedAt: "2026-11-14",
    introduction:
      "Esta versión explica, de forma inicial, qué información usa este sitio y para qué. C3 sigue confirmando quién atenderá solicitudes, los ajustes de sus proveedores y cuánto tiempo se conserva la información. No es asesoría legal ni una declaración de cumplimiento.",
    sections: [
      {
        id: "informacion",
        title: "Qué información recibimos",
        paragraphs: [
          "Si nos escribes desde el formulario, recibimos tu nombre, correo electrónico, tipo de consulta y mensaje. Puedes indicar una organización si aplica. El formulario incluye además un campo técnico antispam.",
          "Usamos el formulario para recibir y responder consultas. No lo usamos para suscribirte a una lista comercial. Evita incluir información sensible que no sea necesaria ni datos personales de otras personas sin su autorización.",
        ],
      },
      {
        id: "uso-y-envio",
        title: "Cómo usamos y enviamos tu consulta",
        paragraphs: [
          "El formulario envía tu consulta mediante Brevo al correo general de C3. Tu correo se usa como dirección de respuesta. El código del sitio no guarda el envío en una base de datos propia, pero puede quedar una copia en el buzón y en los sistemas de correo.",
          "Quién puede acceder a esos sistemas, cómo se gestionan copias y por cuánto tiempo se conservan los mensajes depende de ajustes que C3 todavía está verificando. No se ha confirmado un plazo de conservación.",
        ],
      },
      {
        id: "analitica",
        title: "Analítica del sitio",
        paragraphs: [
          "Usamos Vercel Web Analytics para conocer qué páginas se visitan y orientar mejoras del sitio. Vercel explica que su analítica puede procesar datos técnicos como la página visitada, hora, referencia, ubicación aproximada y tipo de dispositivo, navegador y sistema operativo. Vercel indica que Web Analytics no usa cookies.",
          "La configuración de la cuenta de C3 y los datos que puedan aparecer en URLs todavía se están revisando. Evita incluir información personal en la dirección de una página.",
        ],
      },
      {
        id: "terceros",
        title: "Servicios y enlaces de terceros",
        paragraphs: [
          "El sitio usa Vercel para alojarse y para analítica, Brevo para enviar consultas, Firebase para consultar el catálogo público de eventos y Cloudinary para algunas imágenes. Cada proveedor puede procesar datos técnicos según sus propios términos y su configuración. C3 aún está verificando los ajustes de sus cuentas.",
          "El sitio también enlaza a una comunidad de WhatsApp. Si abres ese enlace o usas redes sociales, sitios de eventos u otros enlaces externos, el servicio correspondiente recibe la información técnica habitual de tu visita y aplica sus propias políticas de privacidad.",
        ],
      },
      {
        id: "conservacion-y-consultas",
        title: "Conservación y consultas",
        paragraphs: [
          "El tiempo que se mantienen los mensajes, registros y copias aún no está confirmado. C3 también está definiendo quién atenderá consultas relacionadas con datos personales y el procedimiento correspondiente; por ello, esta versión no establece plazos de respuesta ni de eliminación.",
          "Para una consulta general puedes escribir a competitivecodingclub.sv@gmail.com. Mientras se define el proceso de privacidad, no incluyas datos sensibles en ese mensaje.",
        ],
      },
      {
        id: "menores",
        title: "Personas menores de edad",
        paragraphs: [
          "C3 trabaja con talento joven. La orientación para atender solicitudes relacionadas con personas menores de edad está en revisión. Si eres menor, no envíes información sensible por el formulario.",
        ],
      },
      {
        id: "actualizaciones",
        title: "Actualizaciones de este aviso",
        paragraphs: [
          "Esta es la versión 0.1, revisada el 14 de noviembre de 2026. Actualizaremos la información cuando se confirmen los detalles operativos pendientes.",
        ],
      },
    ],
    references: [
      {
        label: "Ley para la Protección de Datos Personales (Decreto 144)",
        href: "https://www.asamblea.gob.sv/leyes-y-decretos/view/6054",
      },
      {
        label: "Reformas a la Ley para la Protección de Datos Personales (Decreto 659, 2026)",
        href: "https://www.asamblea.gob.sv/leyes-y-decretos/view/7022",
      },
      {
        label: "Privacidad de Vercel Web Analytics",
        href: "https://vercel.com/docs/analytics/privacy-policy",
      },
      {
        label: "Términos y DPA de Brevo",
        href: "https://www.brevo.com/legal/termsofuse/",
      },
      {
        label: "Política de privacidad de WhatsApp",
        href: "https://www.whatsapp.com/legal/privacy-policy",
      },
    ],
  },
  terminos: {
    id: "terminos",
    title: "Términos de uso del sitio",
    version: "0.1",
    reviewedAt: "2026-11-14",
    introduction:
      "Esta versión resume pautas básicas para usar el sitio institucional de C3. No cubre inscripciones, pagos ni condiciones particulares de eventos; esos detalles deben consultarse en cada convocatoria.",
    sections: [
      {
        id: "alcance",
        title: "Alcance del sitio",
        paragraphs: [
          "Este sitio presenta a C3, sus líneas, actividades y canales de contacto. El sitio institucional no ofrece cuentas de usuario ni procesa pagos propios.",
          "Una actividad puede tener requisitos, fechas o condiciones específicas. Revisa la convocatoria y las reglas de la organización responsable antes de participar.",
        ],
      },
      {
        id: "uso-respetuoso",
        title: "Uso responsable",
        paragraphs: [
          "Al navegar o comunicarte con C3, no intentes afectar el funcionamiento del sitio, acceder sin autorización a sistemas o información, enviar código dañino, suplantar a otra persona ni compartir material que infrinja derechos de terceros.",
          "Si escribes a C3, usa el formulario de contacto y evita enviar información sensible que no sea necesaria para tu consulta.",
        ],
      },
      {
        id: "contenido-y-enlaces",
        title: "Contenido y enlaces",
        paragraphs: [
          "La información del sitio ayuda a conocer C3 y sus actividades. Los detalles de cada evento pueden cambiar; consulta su convocatoria vigente para confirmar fechas, requisitos y condiciones.",
          "Los enlaces externos llevan a sitios administrados por otras organizaciones, que tienen sus propios contenidos, condiciones y políticas de privacidad.",
        ],
      },
      {
        id: "materiales",
        title: "Textos, marcas e imágenes",
        paragraphs: [
          "El sitio muestra textos, marcas, fotografías y otros materiales de C3 o de terceros. Antes de copiar, modificar o redistribuir un material, confirma quién tiene sus derechos y solicita autorización cuando corresponda.",
        ],
      },
      {
        id: "version-base",
        title: "Alcance de esta versión",
        paragraphs: [
          "Esta versión 0.1 se limita al sitio institucional informativo. No establece reglas para una plataforma futura, pagos, inscripciones ni eventos organizados por terceros. Los detalles legales adicionales siguen en revisión.",
          "Revisada el 14 de noviembre de 2026. Para consultas generales puedes escribir a competitivecodingclub.sv@gmail.com.",
        ],
      },
    ],
  },
  "codigo-de-conducta": {
    id: "codigo-de-conducta",
    title: "Convivencia en actividades y espacios de C3",
    version: "0.1",
    reviewedAt: "2026-11-14",
    introduction:
      "Estas pautas expresan expectativas básicas de respeto. El alcance, el equipo responsable y el procedimiento para atender reportes todavía están en definición.",
    sections: [
      {
        id: "trato-respetuoso",
        title: "Trato respetuoso",
        paragraphs: [
          "Esperamos que participantes, organizadores, mentores y aliados se traten con respeto. No se aceptan conductas que busquen intimidar, discriminar, acosar, amenazar o humillar a otra persona.",
          "Respeta las reglas de cada actividad y las indicaciones de quienes la organizan.",
        ],
      },
      {
        id: "privacidad-y-materiales",
        title: "Privacidad y materiales",
        paragraphs: [
          "No compartas datos personales, credenciales ni conversaciones privadas de otra persona sin autorización. Antes de tomar, grabar o publicar imágenes identificables, sigue las reglas del espacio y confirma que tienes permiso.",
        ],
      },
      {
        id: "reportes",
        title: "Si quieres informar una situación",
        paragraphs: [
          "Puedes iniciar una consulta por el correo general de C3: competitivecodingclub.sv@gmail.com. Indica a qué actividad se refiere y comparte solo la información necesaria. Evita publicar detalles sensibles en redes o espacios abiertos.",
          "C3 está definiendo quién atenderá estos mensajes y cómo se revisarán. Esta versión no garantiza anonimato, atención permanente, un plazo de respuesta ni un resultado específico.",
        ],
      },
      {
        id: "alcance-y-reglas",
        title: "Alcance y reglas de cada actividad",
        paragraphs: [
          "Estas pautas son una base general para actividades y espacios vinculados a C3. El alcance para actividades con terceros está pendiente de confirmación; una convocatoria puede incluir reglas adicionales de su organización responsable.",
          "Versión 0.1, revisada el 14 de noviembre de 2026.",
        ],
      },
    ],
  },
};

export function getLegalDocument(id: LegalDocumentId): LegalDocumentData {
  return legalDocuments[id];
}
