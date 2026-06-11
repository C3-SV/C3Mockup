import Image from "next/image";
import { OrbitingCircles } from "./ui/orbiting-circles";
import { lineVisuals } from "@/lib/content";

const orbitLabels = [lineVisuals.compite, lineVisuals.crea, lineVisuals.conecta] as const;

type OrbitingC3Props = {
  className?: string;
};

export default function OrbitingC3({ className = "" }: OrbitingC3Props) {
  return (
    <div className={`relative mx-auto w-full max-w-[50rem] ${className}`}>
      <div className="relative hidden aspect-square w-full md:block">
        <div
          aria-hidden="true"
          className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,32,62,0.04),transparent_60%),radial-gradient(circle_at_20%_22%,rgba(51,190,172,0.12),transparent_28%),radial-gradient(circle_at_80%_24%,rgba(79,91,169,0.12),transparent_30%),radial-gradient(circle_at_50%_84%,rgba(32,82,152,0.1),transparent_28%)]"
        />

        <div className="absolute inset-0">
          <OrbitingCircles
            path={false}
            radius={242}
            duration={34}
            iconSize={148}
            className="rounded-full"
          >
            {orbitLabels.map((item) => (
              <span
                key={item.key}
                className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-full border px-4 text-center shadow-[0_14px_28px_rgba(2,8,22,0.24)] backdrop-blur-md"
                style={{
                  borderColor: `${item.color}55`,
                  backgroundColor: "#122449e6",
                  boxShadow: `0 0 0 1px ${item.color}18, 0 14px 28px rgba(2, 8, 22, 0.24)`,
                }}
              >
                <Image
                  src={item.logo}
                  alt=""
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain"
                  aria-hidden="true"
                />
                <span
                  className="text-[0.76rem] font-semibold uppercase tracking-[0.18em]"
                  style={{ color: item.color }}
                >
                  {item.name}
                </span>
              </span>
            ))}
          </OrbitingCircles>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-[20.5rem] w-[20.5rem] items-center justify-center rounded-full border border-white/10 bg-[#102240]/94 shadow-[0_26px_65px_rgba(2,8,22,0.34)]">
            <Image
              src="/brand/logo-c3-claro-con-color.png"
              alt="Logo principal de C3"
              width={720}
              height={720}
              className="relative z-10 h-[13.8rem] w-[13.8rem] object-contain drop-shadow-[0_16px_32px_rgba(3,11,27,0.52)]"
              priority
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        <div className="relative mx-auto flex h-56 w-56 items-center justify-center rounded-full border border-white/10 bg-[#102240]">
          <Image
            src="/brand/logo-c3-claro-con-color.png"
            alt="Logo principal de C3"
            width={360}
            height={360}
            className="h-32 w-32 object-contain"
            priority
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {orbitLabels.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
              style={{
                borderColor: `${item.color}55`,
                backgroundColor: `${item.color}18`,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
