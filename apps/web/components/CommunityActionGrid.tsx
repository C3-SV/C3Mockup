import { LayoutGrid } from "./ui/layout-grid";
import { communityPortraits } from "@/lib/home";

const cards = communityPortraits.map((portrait, index) => ({
  id: index + 1,
  thumbnail: portrait.src,
  className: "md:col-span-1",
  content: (
    <div className="max-w-[16rem] space-y-2 text-left">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/65">
        Comunidad C3
      </p>
      <h4 className="text-2xl font-bold text-white">{portrait.name}</h4>
      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white/72">
        {portrait.role}
      </p>
      <p className="text-sm leading-7 text-white/78">
        Rostro real del equipo que sostiene la comunidad, las competencias y la operación del ecosistema.
      </p>
    </div>
  ),
}));

export default function CommunityActionGrid() {
  return <LayoutGrid cards={cards} />;
}
