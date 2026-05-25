import Image from "next/image";
import Link from "next/link";
import { lineVisuals } from "@/lib/content";

type DiagramNodeKey = "compite" | "crea" | "conecta" | "center";

type DiagramNode = {
  key: DiagramNodeKey;
  label: string;
  href?: string;
  logo: string;
  color?: string;
  x: number;
  y: number;
  size: number;
};

const viewBoxWidth = 1000;
const viewBoxHeight = 680;

const nodes: DiagramNode[] = [
  {
    key: "compite",
    label: "Compite",
    href: "/compite",
    logo: "/brand/compite-blanco.png",
    color: lineVisuals.compite.color,
    x: 176,
    y: 164,
    size: 226,
  },
  {
    key: "crea",
    label: "Crea",
    href: "/crea",
    logo: "/brand/crea-blanco.png",
    color: lineVisuals.crea.color,
    x: 824,
    y: 164,
    size: 226,
  },
  {
    key: "conecta",
    label: "Conecta",
    href: "/conecta",
    logo: "/brand/conecta-blanco.png",
    color: lineVisuals.conecta.color,
    x: 500,
    y: 552,
    size: 236,
  },
  {
    key: "center",
    label: "C3",
    logo: "/brand/logo-c3-claro-con-color.png",
    x: 500,
    y: 270,
    size: 272,
  },
];

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`;
}

function CircleNode({ node }: { node: DiagramNode }) {
  const titleClass = node.key === "center" ? "text-xs" : "text-sm";
  const labelColorClass = node.key === "center" ? "text-white/80" : "text-white";

  return (
    <div
      className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
      style={{
        left: percent(node.x, viewBoxWidth),
        top: percent(node.y, viewBoxHeight),
        width: node.size,
      }}
    >
      {node.key === "center" ? (
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: node.size,
            height: node.size,
            backgroundColor: "#102240",
            boxShadow: "0 18px 54px rgba(2,8,22,0.34)",
          }}
        >
          <Image
            src={node.logo}
            alt="Logo central de C3"
            width={160}
            height={160}
            className="h-44 w-44 object-contain"
          />
        </div>
      ) : (
        <Link
          href={node.href ?? "/"}
          className="group flex items-center justify-center rounded-full outline-none"
          style={{
            width: node.size,
            height: node.size,
            backgroundColor: "#122449",
            boxShadow: `0 18px 48px rgba(2,8,22,0.28)`,
            border: `1px solid ${node.color}55`,
          }}
        >
          <Image
            src={node.logo}
            alt={`Logo de ${node.label}`}
            width={112}
            height={112}
            className="h-20 w-20 object-contain transition duration-200 group-hover:scale-[1.04]"
          />
        </Link>
      )}

      <span className={`mt-4 font-semibold uppercase tracking-[0.18em] ${titleClass} ${labelColorClass}`}>
        {node.label}
      </span>
    </div>
  );
}

export default function C3EcosystemDiagram() {
  return (
    <div className="space-y-5">
      <div className="hidden md:block">
        <div className="relative mx-auto aspect-[1000/680] w-full max-w-[94rem] overflow-hidden rounded-[2.4rem] bg-[#132548]/78 p-6 lg:p-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(circle at 50% 38%, rgba(79,91,169,0.14), transparent 28%), radial-gradient(circle at 50% 58%, rgba(51,190,172,0.08), transparent 24%)",
            }}
          />
          {nodes.map((node) => (
            <CircleNode key={node.key} node={node} />
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        <div className="rounded-[2rem] bg-[#122449]/88 p-6 text-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[#102240]">
            <Image
              src="/brand/logo-c3-claro-con-color.png"
              alt="Logo central de C3"
              width={132}
              height={132}
              className="h-28 w-28 object-contain"
            />
          </div>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/82">
            Plataforma C3
          </p>
        </div>

        {nodes
          .filter((node) => node.key !== "center")
          .map((node) => (
            <Link
              key={node.key}
              href={node.href ?? "/"}
              className="rounded-[2rem] bg-[#122449]/88 px-5 py-4 text-center shadow-[0_12px_30px_rgba(2,8,22,0.22)]"
            >
              <div
                className="mx-auto flex h-[152px] w-[152px] items-center justify-center rounded-full"
                style={{
                  backgroundColor: "#122449",
                  boxShadow: "0 18px 42px rgba(2,8,22,0.22)",
                  border: `1px solid ${node.color}55`,
                }}
              >
                <Image
                  src={node.logo}
                  alt={`Logo de ${node.label}`}
                  width={104}
                  height={104}
                  className="h-20 w-20 object-contain"
                />
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                {node.label}
              </p>
            </Link>
          ))}
      </div>
    </div>
  );
}
