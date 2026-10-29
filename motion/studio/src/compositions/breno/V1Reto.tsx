import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease, progress } from "../../lib/motion";
import { B, BaseVideo, f, Subtitles, useWindow } from "./shared";

// V1 · Padre emprendedor: franja roja con el gancho (entra barriendo de izquierda a derecha),
// etiqueta RETO 10K arriba a la derecha y subtítulos.
const HookBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(0.1, 6.2, 10, 8);
  if (!visible) return null;
  const sweep = progress(frame, f(0.1), 9, ease.out); // la barra crece de lado a lado
  const l1 = progress(frame, f(0.1) + 6, 10);
  const l2 = progress(frame, f(0.1) + 10, 12);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1215, height: 210, opacity: p }}>
      <div style={{ position: "absolute", inset: 0, background: B.red, transformOrigin: "left center", transform: `scaleX(${sweep})`, boxShadow: "0 10px 30px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: B.font, fontWeight: 700, color: B.white, textTransform: "uppercase" }}>
        <div style={{ fontSize: 46, letterSpacing: "0.04em", opacity: l1, transform: `translateY(${(1 - l1) * 14}px)` }}>Llevo 3 días adelantado</div>
        <div style={{ fontSize: 84, lineHeight: 1.05, opacity: l2, transform: `translateY(${(1 - l2) * 18}px)` }}>Así edito con IA</div>
      </div>
    </div>
  );
};

const RetoTag: React.FC = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, 4, 14);
  return (
    <div style={{ position: "absolute", top: 300, right: 48, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, background: B.orange, color: B.white, fontFamily: B.font, fontWeight: 700, fontSize: 38, padding: "12px 28px", borderRadius: 999, boxShadow: "0 6px 18px rgba(0,0,0,.25)" }}>
      RETO 10K · DÍA 17
    </div>
  );
};

export const V1Reto: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <BaseVideo />
      <HookBar />
      <RetoTag />
      {/* Durante la franja los subtítulos bajan un poco para no pisarla */}
      <Subtitles y={t < 6.2 ? 1470 : 1440} />
      <Sequence from={3} durationInFrames={20}><Audio src={staticFile("sfx/interface/drop_002.ogg")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
