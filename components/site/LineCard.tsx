import Image from "next/image";
import { CTAButton } from "@/components/site/CTAButton";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { LineDefinition } from "@/lib/content";

type LineCardProps = {
  line: LineDefinition;
};

export function LineCard({ line }: LineCardProps) {
  const variant = line.key === "crea" ? "teal" : line.key === "conecta" ? "purple" : "blue";

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-r ${line.accent}`} />
      <CardHeader className="relative gap-5">
        <div className="flex items-start justify-between gap-4">
          <Badge variant={variant}>{line.label}</Badge>
          <div className="rounded-2xl border border-white/10 bg-white/6 p-3">
            <Image src={line.logo} alt={`Logo de ${line.name}`} width={56} height={56} className="h-12 w-12 object-contain" />
          </div>
        </div>
        <div className="space-y-3">
          <CardTitle className="text-2xl">{line.name}</CardTitle>
          <p className="text-base leading-8 text-white/78">{line.description}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm leading-7 text-white/68">{line.detail}</p>
        <div className="rounded-[1.25rem] border border-white/10 bg-black/12 p-4 text-sm text-white/62">
          {line.visual}
        </div>
        <CTAButton href={line.href} variant="secondary">
          {line.cta}
        </CTAButton>
      </CardContent>
    </Card>
  );
}
