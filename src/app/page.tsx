"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { Intro } from "@/components/intro/Intro";
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
  const [introDone, setIntroDone] = useState(false);

  // Stable so Intro's effects never re-run and restart the timeline.
  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <>
      {/* Rendered first so the curtain paints before anything else. The
          sections below still mount and fetch during the intro, so the reveal
          lands on a page that is already ready. */}
      {!introDone && <Intro onDone={handleIntroDone} />}

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
