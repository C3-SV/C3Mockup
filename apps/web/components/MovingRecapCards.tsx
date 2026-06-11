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
      quote: item.description,
      name: item.title,
      title: `${visual.name} · ${item.status}${item.schedule ? ` · ${item.schedule}` : ""}`,
      href: item.href,
      external: item.external,
      cta: item.cta,
    };
  });

  return (
    <div className="rounded-[2rem] border border-white/10 bg-[#0E1930] p-3">
      <InfiniteMovingCards items={cards} direction="left" speed="slow" pauseOnHover className="py-2" />
    </div>
  );
}
