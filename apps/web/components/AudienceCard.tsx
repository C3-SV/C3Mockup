import Link from "next/link";
import type { IconType } from "react-icons";
import { Card, CardDescription, CardTitle } from "./ui/card-hover-effect";
import { Button } from "./ui/button";

type AudienceCardProps = {
  title: string;
  subtitle: string;
  text: string;
  cta: string;
  href: string;
  icon: IconType;
  accent: string;
  benefits: string[];
  index: number;
};

function toneFromAccent(accent: string) {
  if (accent === "#205298") return "blue";
  if (accent === "#33BEAC") return "turquoise";
  return "purple";
}

export default function AudienceCard({
  title,
  subtitle,
  text,
  cta,
  href,
  icon: Icon,
  accent,
  benefits,
  index,
}: AudienceCardProps) {
  const tone = toneFromAccent(accent);

  return (
    <Card
      className="group relative h-full rounded-[1.9rem] border border-white/10 bg-[#122449] p-0 transition duration-300 hover:-translate-y-1 hover:border-white/18"
      style={{
        boxShadow: `0 18px 38px rgba(2, 8, 22, 0.18)`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(255,255,255,0.05),transparent_24%)] opacity-85 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <span
            className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border"
            style={{
              color: accent,
              backgroundColor: `${accent}16`,
              borderColor: `${accent}26`,
              boxShadow: `0 0 0 1px ${accent}12`,
            }}
          >
            <Icon size={20} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-white/42">
            0{index + 1}
          </span>
        </div>

        <CardTitle className="mt-5 text-2xl font-bold text-white">{title}</CardTitle>
        <CardDescription className="mt-2 text-sm font-semibold leading-7" style={{ color: accent }}>
          {subtitle}
        </CardDescription>
        <p className="mt-3 text-sm leading-7 text-white/78">{text}</p>

        <ul className="mt-4 flex flex-wrap gap-2">
          {benefits.map((benefit) => (
            <li
              key={`${title}-${benefit}`}
              className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-semibold text-white/72"
            >
              {benefit}
            </li>
          ))}
        </ul>

        <div className="mt-7">
          <Button asChild variant="secondary" tone={tone} size="sm" className="rounded-full px-5">
            <Link href={href}>{cta}</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
