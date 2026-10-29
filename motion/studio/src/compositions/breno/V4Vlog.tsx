import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease, progress } from "../../lib/motion";
import { B, BaseVideo, f, Subtitles, useWindow } from "./shared";

// V4 · Vlog «Día a día»: look cinematográfico, bandas negras con título de episodio,
// tarjeta con la lista de tareas a mitad de vídeo y cierre con pregunta para comentarios.
const Letterbox: React.FC = () => {
  const frame = useCurrentFrame();
  const inP = progress(frame, 0, 14);
  const outP = progress(frame, f(2.6), 12, ease.inOut);
  const h = 230 * inP * (1 - outP);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: h, background: "#000" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h, background: "#000" }} />
    </>
  );
};

const EpisodeTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(0.2, 3.0, 14, 10);
  if (!visible) return null;
  const k = progress(frame, f(0.2), 18);
  const t = progress(frame, f(0.2) + 8, 16);
  const line = progress(frame, f(0.2) + 4, 20);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1230, opacity: p, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: B.font, color: B.white }}>
      <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: `${0.2 + 0.3 * (1 - k)}em`, opacity: k }}>DÍA A DÍA · EP. 01</div>
      <div style={{ width: 520 * line, height: 4, background: B.yellow, margin: "18px 0" }} />
      <div style={{ fontSize: 86, fontWeight: 700, lineHeight: 1.05, textAlign: "center", opacity: t, transform: `translateY(${(1 - t) * 18}px)`, textShadow: "0 8px 30px rgba(0,0,0,.55)" }}>Organizando<br />la semana</div>
    </div>
  );
};

const TaskCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(36.0, 45.8, 14, 10);
  if (!visible) return null;
  const rows: [string, string, number][] = [["Contenido 3 días adelantado", "done", 36.4], ["Edición con Claude Code", "done", 37.2], ["Probar Buzzy Pro", "wip", 38.0]];
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1150, opacity: p, transform: `translateX(${(1 - p) * 60}px) rotate(${(1 - p) * 3}deg)`, background: "rgba(255,255,255,.96)", borderRadius: 26, padding: "24px 30px", boxShadow: "0 18px 44px rgba(0,0,0,.35)", fontFamily: B.font }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: "#6b7280", letterSpacing: "0.08em" }}>ESTA SEMANA</div>
      {rows.map(([txt, st, at]) => {
        const q = progress(frame, f(at), 12);
        return (
          <div key={txt} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, opacity: q, transform: `translateY(${(1 - q) * 12}px)` }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: st === "done" ? "#1a9b4b" : B.yellow, color: st === "done" ? "#fff" : B.black, fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{st === "done" ? "✓" : "…"}</div>
            <div style={{ fontSize: 36, fontWeight: 700, color: B.black, textDecoration: st === "done" ? "line-through" : "none", textDecorationColor: "#9ca3af" }}>{txt}</div>
          </div>
        );
      })}
    </div>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(50.6, 54.0, 14, 1);
  if (!visible) return null;
  const q = progress(frame, f(50.6) + 10, 14);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1180, opacity: p, transform: `translateY(${(1 - p) * 24}px)`, background: B.white, borderRadius: 28, padding: "26px 34px", fontFamily: B.font, boxShadow: "0 18px 44px rgba(0,0,0,.35)" }}>
      <div style={{ fontSize: 34, fontWeight: 700, color: B.red, letterSpacing: "0.06em" }}>NOS VEMOS MAÑANA</div>
      <div style={{ fontSize: 54, fontWeight: 700, color: B.black, lineHeight: 1.1, marginTop: 6, opacity: q }}>¿Y tú cómo organizas tu semana? Te leo en comentarios</div>
    </div>
  );
};

export const V4Vlog: React.FC = () => {
  const frame = useCurrentFrame();
  const grain = interpolate(frame % 4, [0, 3], [0.03, 0.05]);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {/* Look cálido y con más contraste */}
      <BaseVideo filter="contrast(1.08) saturate(1.12) sepia(0.10) brightness(1.02)" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)" }} />
      <AbsoluteFill style={{ background: "#fff", opacity: grain, mixBlendMode: "overlay" }} />
      <Letterbox />
      <EpisodeTitle />
      <TaskCard />
      <Outro />
      <Subtitles y={1470} size={80} hide={(x) => x < 3.0 || x >= 50.6} />
      <Sequence from={4} durationInFrames={30}><Audio src={staticFile("sfx/interface/bong_001.ogg")} volume={0.3} /></Sequence>
      <Sequence from={f(36.0)} durationInFrames={20}><Audio src={staticFile("sfx/interface/drop_001.ogg")} volume={0.35} /></Sequence>
      <Sequence from={f(50.6)} durationInFrames={20}><Audio src={staticFile("sfx/interface/drop_002.ogg")} volume={0.35} /></Sequence>
    </AbsoluteFill>
  );
};
