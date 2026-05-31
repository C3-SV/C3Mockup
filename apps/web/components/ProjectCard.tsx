import Link from "next/link";

type ProjectCardProps = {
  title: string;
  tag: string;
  description: string;
  cta: string;
  href: string;
  accent: "blue" | "turquoise";
};

const accentStyles = {
  blue: "from-[#205298] to-[#205298]",
  turquoise: "from-[#33BEAC] to-[#33BEAC]",
};

export default function ProjectCard({
  title,
  tag,
  description,
  cta,
  href,
  accent,
}: ProjectCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-[#DDE6EF] bg-white p-8 shadow-[0_14px_30px_rgba(15,32,62,0.08)] transition hover:-translate-y-1">
      <div
        className={`mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r ${accentStyles[accent]}`}
      />
      <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[${accent === "blue" ? "#205298" : "#33BEAC"}]`}>
        {tag}
      </p>
      <h3 className="mb-4 text-2xl font-bold text-[#0F203E]">{title}</h3>
      <p className="mb-8 text-base leading-8 text-[#31405c]">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center rounded-full bg-[#0F203E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#205298]"
      >
        {cta}
      </Link>
    </article>
  );
}
