import type { ReactNode } from "react";
import { Container } from "@/components/site/Container";
import { GradientBackground } from "@/components/site/GradientBackground";
import { SectionWrapper } from "@/components/site/SectionWrapper";
import { CTAButton } from "@/components/site/CTAButton";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type PageHeroAction = {
  href: string;
  label: string;
  external?: boolean;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: PageHeroAction[];
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, description, actions, aside }: PageHeroProps) {
  return (
    <SectionWrapper className="pt-10 md:pt-14">
      <Container>
        <GradientBackground>
          <div
            className={cn(
              "grid gap-10 px-6 py-10 md:px-10 md:py-14",
              aside ? "lg:grid-cols-[1.2fr_0.8fr]" : "max-w-4xl",
            )}
          >
            <div className="space-y-6">
              <Badge variant="light" className="w-fit">
                {eyebrow}
              </Badge>
              <div className="space-y-4">
                <h1 className="text-balance text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                  {title}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-white/72 md:text-lg">{description}</p>
              </div>
              {actions?.length ? (
                <div className="flex flex-wrap gap-3">
                  {actions.map((action, index) => (
                    <CTAButton
                      key={`${action.href}-${action.label}`}
                      href={action.href}
                      external={action.external}
                      variant={index === 0 ? "default" : "secondary"}
                    >
                      {action.label}
                    </CTAButton>
                  ))}
                </div>
              ) : null}
            </div>
            {aside ? <div className="flex items-stretch">{aside}</div> : null}
          </div>
        </GradientBackground>
      </Container>
    </SectionWrapper>
  );
}
