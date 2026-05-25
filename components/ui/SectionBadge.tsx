type SectionBadgeProps = {
  label: string;
};

export default function SectionBadge({ label }: SectionBadgeProps) {
  return (
    <span className="inline-flex rounded-full border border-[#8ca5cc66] bg-[#17315840] px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#8fd2f5] backdrop-blur-sm">
      {label}
    </span>
  );
}
