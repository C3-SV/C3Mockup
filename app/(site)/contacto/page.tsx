import type { Metadata } from "next";
import { contactPaths } from "@/lib/content";
import { createPageMetadata } from "@/lib/metadata";
import { ContactCTA } from "@/components/site/ContactCTA";
import { Container } from "@/components/site/Container";
import { PageHero } from "@/components/site/PageHero";
import { SectionWrapper } from "@/components/site/SectionWrapper";

export const metadata: Metadata = createPageMetadata({
  title: "Contacto C3",
  description:
    "Rutas de contacto institucional para comunidad, universidades, empresas, sponsors y prensa alrededor de C3.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Una página de contacto pensada para distintos tipos de relación con C3."
        description="En lugar de fingir un formulario definitivo, la página organiza caminos claros para comunidad, instituciones, empresas y prensa, con estados visibles cuando algo sigue en actualización."
      />

      <SectionWrapper className="pb-20">
        <Container>
          <ContactCTA paths={contactPaths} />
        </Container>
      </SectionWrapper>
    </>
  );
}
