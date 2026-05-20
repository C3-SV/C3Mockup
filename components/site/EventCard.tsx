import { CalendarDays, MapPin } from "lucide-react";
import { CTAButton } from "@/components/site/CTAButton";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { EventItem } from "@/lib/content";

type EventCardProps = {
  event: EventItem;
};

export function EventCard({ event }: EventCardProps) {
  const variant =
    event.statusTone === "teal" ? "teal" : event.statusTone === "purple" ? "purple" : "blue";

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Badge variant={variant}>{event.line}</Badge>
          <Badge variant="default">{event.status}</Badge>
        </div>
        <CardTitle className="text-2xl">{event.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3 text-sm text-white/70">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-c3-teal" />
            <span>{event.dateLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-c3-teal" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="text-sm leading-7 text-white/74">{event.description}</p>
        <CTAButton href={event.href} external={event.external} variant="secondary">
          {event.cta}
        </CTAButton>
      </CardContent>
    </Card>
  );
}
