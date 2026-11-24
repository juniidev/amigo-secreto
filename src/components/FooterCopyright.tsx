"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

export default function FooterCopyright() {
  const [taps, setTaps] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const handleTap = () => {
    const next = taps + 1;
    setTaps(next);

    if (next >= 5) {
      setUnlocked(true);
      setTaps(0);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.9 },
      });
      setTimeout(() => setUnlocked(false), 4000);
    }
  };

  return (
    <footer className="py-6 text-center text-xs text-slate-400 select-none">
      <button
        type="button"
        onClick={handleTap}
        className="cursor-pointer transition hover:text-slate-600 active:scale-95"
      >
        {unlocked
          ? "🎅 ¡Modo Santa desbloqueado! Hecho con cariño por Henry"
          : "© 2026 Henry Matarrita. Todos los derechos reservados."}
      </button>
    </footer>
  );
}
