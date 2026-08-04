import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

// Stats pulls in react-activity-calendar and is well below the fold — split it
// out so it doesn't sit in the initial bundle.
const Stats = dynamic(() =>
  import("@/components/sections/Stats").then((m) => m.Stats),
);

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Stats />
      <Contact />
      <Footer />
    </>
  );
}
