type SectionBadgeProps = {
  label: string;
};

export default function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-[#DDE6EF] bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#205298]">
      {label}
    </span>
  );
}
