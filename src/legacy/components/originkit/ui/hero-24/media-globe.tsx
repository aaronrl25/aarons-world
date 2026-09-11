"use client";

"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Globe from "./globe";

const ACCENT = "#e8c476";

export const MediaGlobe = ({ query }: { query: string }) => {
  const reduced = useReducedMotion();
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  if (!matches) return null;

  return (
    <Globe
      scale={9.7}
      speed={reduced ? 0 : 0.5}
      stopOnHover
      initialLatitude={23}
      initialLongitude={-102}
      fill="dots"
      dots={{ color: ACCENT, size: 5, density: 8, allDots: false }}
      showOutline
      outlineColor={ACCENT}
      showGrid
      graticuleColor="#706047"
      oceanColor="#08080c"
      style={{ width: "100%", height: "100%" }}
    />
  );
};