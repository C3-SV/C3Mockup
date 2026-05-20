import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("space-y-5", centered && "mx-auto max-w-3xl text-center")}>
      {eyebrow ? (
        <Badge variant={centered ? "light" : "default"} className={cn(centered && "mx-auto w-fit")}>
          {eyebrow}
        </Badge>
      ) : null}
      <div className="space-y-3">
        <h2 className="text-balance text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          {title}
        </h2>
        <p className="text-base leading-8 text-white/72 md:text-lg">{description}</p>
      </div>
    </div>
  );
}
