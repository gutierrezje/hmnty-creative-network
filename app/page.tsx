import Wall from "./components/Wall";
import { TALENT } from "@/data/talent";

export default function Home() {
  return (
    <main className="flex-1">
      <header className="border-b border-rule px-6 pt-10 pb-8 sm:px-10">
        <p className="meta text-ash">HMNTY Studios · San Diego</p>
        <h1 className="mt-6 max-w-3xl text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          The reel is the résumé.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-ash">
          Local creative work, shown before anything else. No names, no schools,
          no networks until you have seen what someone made. When you find
          someone, a person at HMNTY makes the introduction.
        </p>
      </header>

      <Wall talent={TALENT} />

      <footer className="border-t border-rule px-6 py-10 sm:px-10">
        <p className="meta text-ash">
          Built at the Social Impact Hack-AI-thon · San Diego · Aug 2026
        </p>
      </footer>
    </main>
  );
}
