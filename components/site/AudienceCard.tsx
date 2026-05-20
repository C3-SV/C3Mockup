import type { Audience } from "@/lib/content";
import { CTAButton } from "@/components/site/CTAButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type AudienceCardProps = {
  audience: Audience;
};

export function AudienceCard({ audience }: AudienceCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-c3-teal">{audience.name}</p>
        <CardTitle className="text-[1.45rem]">{audience.message}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-7 text-white/72">{audience.benefit}</p>
        <CTAButton href={audience.href} variant="secondary">
          {audience.cta}
        </CTAButton>
      </CardContent>
    </Card>
  );
}
