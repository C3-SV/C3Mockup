import type { ContactPath } from "@/lib/content";
import { CTAButton } from "@/components/site/CTAButton";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type ContactCTAProps = {
  paths: ContactPath[];
};

export function ContactCTA({ paths }: ContactCTAProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {paths.map((path) => (
        <Card key={path.title} className="h-full">
          <CardHeader className="gap-4">
            <Badge variant={path.status === "Disponible" ? "teal" : "default"} className="w-fit">
              {path.status}
            </Badge>
            <CardTitle className="text-xl">{path.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-sm leading-7 text-white/72">{path.detail}</p>
            <CTAButton href={path.href} external={path.external} variant="secondary">
              {path.cta}
            </CTAButton>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
