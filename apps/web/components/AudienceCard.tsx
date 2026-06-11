import Link from "next/link";
import type { IconType } from "react-icons";
import { Card, CardDescription, CardTitle } from "./ui/card-hover-effect";

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
  return (
    <Link href={href} className="group block h-full">
      <Card className="relative h-full rounded-[2rem] border border-white/10 bg-[#122449] p-0 transition duration-300 group-hover:-translate-y-1 group-hover:border-white/18">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_84%_14%,rgba(255,255,255,0.05),transparent_24%)] opacity-85 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="relative z-10 flex h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <span
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
              style={{
                color: accent,
                backgroundColor: `${accent}22`,
                boxShadow: `0 0 0 1px ${accent}16`,
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
          <p className="mt-3 text-sm leading-7 text-white/76">{text}</p>

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

          <span
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 transition group-hover:underline"
            style={{ color: accent }}
          >
            {cta}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
