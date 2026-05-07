import SectionBadge from "./ui/SectionBadge";

const cards = [
  {
    id: "mision",
    title: "Mision",
    content:
      "Potenciar talento joven mediante experiencias de alto nivel que integran competencia, creacion y conexion.",
    accent: "from-[#205298] to-[#4F5BA9]",
  },
  {
    id: "vision",
    title: "Vision",
    content:
      "Ser el referente regional de una nueva generacion tecnica con pertenencia, oportunidades e impacto.",
    accent: "from-[#33BEAC] to-[#4F5BA9]",
  },
];

export default function MissionVisionSection() {
  return (
    <section className="section-divider bg-[#F4F7FB] py-20 md:py-24">
      <div className="container-shell space-y-8">
        <SectionBadge label="Identidad C3" />
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <article
              key={card.id}
              id={card.id}
              className="relative overflow-hidden rounded-3xl border border-[#DDE6EF] bg-white p-8 shadow-[0_14px_28px_rgba(15,32,62,0.08)]"
            >
              <div
                className={`mb-6 h-1.5 w-24 rounded-full bg-gradient-to-r ${card.accent}`}
              />
              <h3 className="mb-4 text-3xl font-bold text-[#0F203E]">{card.title}</h3>
              <p className="text-base leading-8 text-[#31405c]">{card.content}</p>
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#DDE6EF]/70" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
