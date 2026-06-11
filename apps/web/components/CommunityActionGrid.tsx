import { LayoutGrid } from "./ui/layout-grid";
import { communityPortraits } from "@/lib/home";

const cards = communityPortraits.map((portrait, index) => ({
  id: index + 1,
  thumbnail: portrait.src,
  title: portrait.name,
  subtitle: portrait.role,
  description:
    "Rostro real del equipo que sostiene la comunidad, las competencias y la operación del ecosistema.",
  accent: portrait.accent,
}));

export default function CommunityActionGrid() {
  return <LayoutGrid cards={cards} />;
}
