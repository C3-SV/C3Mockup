import type { TimelineItem } from "@/lib/content";

type TimelineProps = {
  items: TimelineItem[];
};

export function Timeline({ items }: TimelineProps) {
  return (
    <ol className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <li key={`${item.year}-${item.title}`} className="relative rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-xl">
          <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-c3-teal/30 bg-c3-teal/12 text-sm font-semibold text-c3-teal">
            {item.year}
          </span>
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-7 text-white/72">{item.description}</p>
        </li>
      ))}
    </ol>
  );
}
