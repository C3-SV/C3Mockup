import type { Partner } from "@/lib/content";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

type PartnerGridProps = {
  partners: Partner[];
};

export function PartnerGrid({ partners }: PartnerGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {partners.map((partner) => (
        <Card key={partner.name} className="h-full">
          <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
            <Badge variant="light" className="w-fit">
              {partner.category}
            </Badge>
            <p className="text-xl font-semibold text-white">{partner.name}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
