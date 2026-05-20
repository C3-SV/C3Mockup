import type { Metric } from "@/lib/content";
import { Card, CardContent } from "@/components/ui/Card";

type ImpactStatsProps = {
  metrics: Metric[];
};

export function ImpactStats({ metrics }: ImpactStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="h-full">
          <CardContent className="space-y-3 p-6">
            <p className="text-4xl font-extrabold text-white md:text-5xl">{metric.value}</p>
            <h3 className="text-base font-semibold text-white">{metric.label}</h3>
            <p className="text-sm leading-6 text-white/65">{metric.note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
