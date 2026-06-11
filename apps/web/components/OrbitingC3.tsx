import Image from "next/image";
import { OrbitingCircles } from "./ui/orbiting-circles";

const orbitLabels = [
  { label: "Compite", color: "#205298" },
  { label: "Crea", color: "#33BEAC" },
  { label: "Conecta", color: "#4F5BA9" },
] as const;

type OrbitingC3Props = {
  className?: string;
};

export default function OrbitingC3({ className = "" }: OrbitingC3Props) {
  return (
    <div className={`relative mx-auto w-full max-w-[34rem] ${className}`}>
      <div className="relative hidden aspect-square w-full md:block">
        <div
          aria-hidden="true"
          className="absolute inset-[10%] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-[18%] rounded-full border border-white/8"
        />
        <div
          aria-hidden="true"
          className="absolute inset-[26%] rounded-full border border-white/6"
        />
        <div
          aria-hidden="true"
          className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_center,rgba(15,32,62,0.08),transparent_62%),radial-gradient(circle_at_18%_18%,rgba(51,190,172,0.12),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(79,91,169,0.12),transparent_30%)]"
        />

        <div className="absolute inset-0">
          <OrbitingCircles radius={138} duration={28} iconSize={92} className="rounded-full">
            {orbitLabels.map((item) => (
              <span
                key={item.label}
                className="flex h-full w-full items-center justify-center rounded-full border border-white/14 bg-[#122449]/90 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_28px_rgba(2,8,22,0.24)] backdrop-blur-md"
                style={{
                  boxShadow: `0 0 0 1px ${item.color}22, 0 14px 28px rgba(2, 8, 22, 0.24)`,
                }}
              >
                {item.label}
              </span>
            ))}
          </OrbitingCircles>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-[17rem] w-[17rem] items-center justify-center rounded-full border border-white/12 bg-[#102240]/92 shadow-[0_26px_65px_rgba(2,8,22,0.34)]">
            <div
              aria-hidden="true"
              className="absolute inset-[-10px] rounded-full bg-[radial-gradient(circle_at_center,rgba(51,190,172,0.18),transparent_58%)] blur-xl"
            />
            <Image
              src="/brand/logo-c3-claro-con-color.png"
              alt="Logo principal de C3"
              width={720}
              height={720}
              className="relative z-10 h-[11rem] w-[11rem] object-contain drop-shadow-[0_16px_32px_rgba(3,11,27,0.52)]"
              priority
            />
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-[#102240]">
          <Image
            src="/brand/logo-c3-claro-con-color.png"
            alt="Logo principal de C3"
            width={320}
            height={320}
            className="h-28 w-28 object-contain"
            priority
          />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {orbitLabels.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
              style={{
                borderColor: `${item.color}55`,
                backgroundColor: `${item.color}18`,
              }}
            >
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
