import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { lineVisuals } from "@/lib/content";
import type { CommunityHighlight } from "@/lib/home";

type MovingRecapCardsProps = {
  items: CommunityHighlight[];
};

export default function MovingRecapCards({ items }: MovingRecapCardsProps) {
  const cards = items.map((item) => {
    const visual = lineVisuals[item.line];

    return {
      title: item.title,
      description: item.description,
      line: visual.name,
      status: item.status,
      schedule: item.schedule,
      href: item.href,
      external: item.external,
      cta: item.cta,
    };
  });

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0E1930] p-4 shadow-[0_18px_48px_rgba(2,8,22,0.2)] md:p-5">
      <InfiniteMovingCards items={cards} direction="left" speed="slow" pauseOnHover className="py-2" />
    </div>
  );
}
