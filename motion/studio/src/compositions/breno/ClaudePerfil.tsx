import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease, progress } from "../../lib/motion";
import { B, f, FPS, useWindow } from "./shared";

// «Claude me dijo por qué no me siguen» (30 oct 2026). Base ya cortada en public/local/claude_base.mp4.
export const CLAUDE_PERFIL_TOTAL_S = 47.4;

const SEGS: { start: number; end: number; text: string }[] = [
  { start: 0.09, end: 4.8, text: "Me faltan 40 seguidores para llegar a 5.000 y esta semana he perdido" },
  { start: 4.86, end: 7.85, text: "así que le pedí a Claude que me dijera por qué" },
  { start: 7.92, end: 13.88, text: "Le pasé mis estadísticas y en dos minutos me soltó tres cosas que yo no había visto" },
  { start: 14.0, end: 14.58, text: "Una" },
  { start: 14.64, end: 20.33, text: "Casi 9 de cada 10 seguidores son de Brasil y yo hablo español así que mis vídeos no les llegan" },
  { start: 20.4, end: 20.85, text: "Dos" },
  { start: 20.91, end: 24.78, text: "En un mes me vieron más de 8.000 personas y solo me siguieron 6" },
  { start: 24.85, end: 26.25, text: "Ven el vídeo y se van" },
  { start: 26.32, end: 27.08, text: "Y tres" },
  { start: 27.12, end: 31.48, text: "Los vídeos que más enganchan son los que cuento mi vida no los de consejos" },
  { start: 31.53, end: 33.81, text: "Y_esto_no_solo_sirve_para_redes" },
  { start: 33.87, end: 37.36, text: "Si vendes algo es lo mismo que entender por qué" },
  { start: 37.42, end: 40.18, text: "la gente entra en tu página y no compra" },
  { start: 40.22, end: 42.33, text: "Comenta PERFIL y te mando el prompt" },
  { start: 42.38, end: 45.13, text: "para que lo hagas con tu cuenta Sígueme" },
  { start: 45.2, end: 47.43, text: "que si no el mensaje no te llega" },
];
const KEY = ["40", "5.000", "PERDIDO", "CLAUDE", "TRES", "UNA", "9", "10", "BRASIL", "DOS", "8.000", "6", "VAN", "VIDA", "CONSEJOS", "VENDES", "COMPRA", "PERFIL", "PROMPT", "SÍGUEME"];

type Chunk = { start: number; end: number; words: string[] };
const chunks: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const s of SEGS) {
    const words = s.text.toUpperCase().split(/\s+/);
    const groups: string[][] = [];
    let cur: string[] = [];
    for (const w of words) {
      cur.push(w);
      if (cur.length >= 3 || (cur.length >= 2 && cur.join(" ").length > 13)) { groups.push(cur); cur = []; }
    }
    if (cur.length) { if (cur.length === 1 && groups.length) groups[groups.length - 1].push(...cur); else groups.push(cur); }
    const total = groups.reduce((a, g) => a + g.join(" ").length + 2, 0);
    let t = s.start;
    for (const g of groups) { const d = ((g.join(" ").length + 2) / total) * (s.end - s.start); out.push({ start: t, end: t + d, words: g }); t += d; }
  }
  return out;
})();

const Subs: React.FC<{ y: number }> = ({ y }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const c = chunks.find((k) => t >= k.start && t < k.end);
  if (!c) return null;
  const s = interpolate(frame - f(c.start), [0, 3], [0.85, 1], { extrapolateRight: "clamp", easing: ease.out });
  const size = 82;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${s})`, textAlign: "center", fontFamily: B.font, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: B.white, WebkitTextStroke: `${size * 0.09}px #000`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,.35)" }}>
        {c.words.map((w, i) => (
          <span key={i} style={{ color: KEY.includes(w.replace(/[^A-Z0-9.ÁÉÍÓÚÑ]/g, "")) ? B.yellow : B.white }}>{w.replace(/_/g, " ")}{i < c.words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </div>
  );
};

// Tarjeta del gancho: arriba, sin tapar la cara.
const HookCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(0, 4.2, 6, 8);
  if (!visible) return null;
  const l2 = progress(frame, 6, 10);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 210, opacity: p, transform: `translateY(${(1 - p) * -24}px)`, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: B.font }}>
      <div style={{ background: B.red, color: B.white, fontWeight: 700, fontSize: 32, letterSpacing: "0.08em", padding: "8px 22px", borderRadius: 10, marginBottom: 14 }}>RETO 10K · DÍA 18</div>
      <div style={{ background: B.white, border: `6px solid ${B.black}`, borderRadius: 20, padding: "20px 34px", textAlign: "center", boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
        <div style={{ fontWeight: 700, fontSize: 66, lineHeight: 1.05, color: B.black }}>CLAUDE ME DIJO</div>
        <div style={{ fontWeight: 700, fontSize: 66, lineHeight: 1.05, color: B.red, opacity: l2 }}>POR QUÉ NO ME SIGUEN</div>
      </div>
    </div>
  );
};

// Tarjetas 1 · 2 · 3: a la altura del pecho, nunca sobre la cara.
const PointCard: React.FC<{ start: number; end: number; n: string; a: string; b: string }> = ({ start, end, n, a, b }) => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(start, end, 10, 8);
  if (!visible) return null;
  const num = progress(frame, f(start), 12, ease.out);
  const txt = progress(frame, f(start) + 5, 12);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1040, opacity: p, display: "flex", alignItems: "center", gap: 26, fontFamily: B.font }}>
      <div style={{ flex: "0 0 auto", width: 150, height: 150, borderRadius: 999, background: B.yellow, border: `6px solid ${B.black}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 96, color: B.black, transform: `scale(${0.5 + 0.5 * num}) rotate(${(1 - num) * -25}deg)` }}>{n}</div>
      <div style={{ flex: 1, background: B.white, border: `6px solid ${B.black}`, borderRadius: 20, padding: "18px 26px", opacity: txt, transform: `translateX(${(1 - txt) * 40}px)`, boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
        <div style={{ fontWeight: 700, fontSize: 52, lineHeight: 1.05, color: B.black }}>{a}</div>
        <div style={{ fontWeight: 700, fontSize: 52, lineHeight: 1.05, color: B.red }}>{b}</div>
      </div>
    </div>
  );
};

// Chapa de Claude sobre el portátil.
const ClaudeChip: React.FC<{ start: number; end: number; text: string }> = ({ start, end, text }) => {
  const { p, visible } = useWindow(start, end, 10, 8);
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 260, display: "flex", justifyContent: "center", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#F5F0E8", border: `5px solid ${B.black}`, borderRadius: 999, padding: "14px 30px", fontFamily: B.font, fontWeight: 700, fontSize: 46, color: B.black }}>
        <span style={{ color: "#D97757", fontSize: 54 }}>✳</span>{text}
      </div>
    </div>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(40.23, 47.4, 10, 4);
  if (!visible) return null;
  const pulse = 1 + 0.03 * Math.sin(frame / 5);
  const fol = progress(frame, f(43.43), 10, ease.out);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1010, opacity: p, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, fontFamily: B.font }}>
      <div style={{ transform: `scale(${pulse})`, background: B.white, border: `6px solid ${B.black}`, borderRadius: 22, padding: "18px 36px", textAlign: "center", boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
        <div style={{ fontWeight: 700, fontSize: 44, color: B.black }}>💬 COMENTA</div>
        <div style={{ fontWeight: 800, fontSize: 96, lineHeight: 1, color: B.red }}>PERFIL</div>
        <div style={{ fontWeight: 600, fontSize: 36, color: B.black, marginTop: 6 }}>y te mando el prompt</div>
      </div>
      <div style={{ opacity: fol, transform: `translateY(${(1 - fol) * 20}px)`, background: "#0095F6", color: B.white, fontWeight: 700, fontSize: 44, padding: "12px 40px", borderRadius: 14 }}>Seguir</div>
    </div>
  );
};

const CUTS = [0, 7.02, 7.82, 12.61, 20.32, 20.87, 24.77, 26.27, 31.47, 35.62, 37.37, 40.22, 45.12];
const FLASH = [7.82, 12.61, 31.47, 35.62, 40.22];
const WHOOSH = [7.75, 12.53, 31.4, 35.55, 40.13];

// Música de fondo: más baja cuando hablas, sube un poco en los planos del portátil y se apaga al final.
const padVol = (fr: number) => {
  const t = fr / FPS;
  const broll = (t >= 7.82 && t < 12.61) || (t >= 31.47 && t < 35.62) ? 0.13 : 0.075;
  const fin = interpolate(t, [45.63, 47.63], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ini = interpolate(t, [0, 1], [0.4, 1], { extrapolateRight: "clamp" });
  return broll * fin * ini;
};
const beatVol = (start: number, end: number, v: number) => (fr: number) => {
  const t = fr / FPS + start;
  return v * interpolate(t, [start, start + 0.6, end - 1.2, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

export const ClaudePerfil: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const subsY = t >= 14.0 && t < 31.48 ? 1420 : t >= 40.23 ? 1500 : 1430;
  // Zoom lento dentro de cada plano (sin acercarse demasiado) y destello corto en los cambios de escena.
  const segStart = [...CUTS].reverse().find((c) => t >= c) ?? 0;
  const segEnd = CUTS.find((c) => c > t) ?? CLAUDE_PERFIL_TOTAL_S;
  const zoom = 1 + 0.03 * Math.min(1, (t - segStart) / Math.max(0.5, segEnd - segStart));
  const flash = FLASH.reduce((a, c) => Math.max(a, interpolate(t - c, [0, 0.04, 0.2], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo src={staticFile("local/claude_base.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <HookCard />
      <ClaudeChip start={7.9} end={12.58} text="Claude analizando mi perfil" />
      <PointCard start={14.0} end={20.33} n="1" a="9 DE CADA 10" b="SON DE BRASIL" />
      <PointCard start={20.4} end={26.25} n="2" a="8.000 ME VIERON" b="SOLO 6 ME SIGUIERON" />
      <PointCard start={26.32} end={31.48} n="3" a="TU VIDA ENGANCHA" b="TUS CONSEJOS NO" />
      <ClaudeChip start={31.53} end={35.58} text="Sirve para tu negocio" />
      <Cta />
      {t < 40.23 || t >= 42.33 ? <Subs y={subsY} /> : null}

      <Sequence from={2} durationInFrames={20}><Audio src={staticFile("sfx/interface/select_008.ogg")} volume={0.45} /></Sequence>
            <Sequence from={f(9.73)} durationInFrames={10}><Audio src={staticFile("sfx/keyboard/keypress-004.wav")} volume={0.35} /></Sequence>
      <Sequence from={f(10.03)} durationInFrames={10}><Audio src={staticFile("sfx/keyboard/keypress-009.wav")} volume={0.35} /></Sequence>
      <Sequence from={f(10.28)} durationInFrames={10}><Audio src={staticFile("sfx/keyboard/keypress-015.wav")} volume={0.35} /></Sequence>
      {[14.0, 20.4, 26.32].map((s) => (
        <Sequence key={s} from={f(s)} durationInFrames={20}><Audio src={staticFile("sfx/interface/drop_002.ogg")} volume={0.5} /></Sequence>
      ))}
      <Sequence from={f(40.23)} durationInFrames={20}><Audio src={staticFile("sfx/interface/bong_001.ogg")} volume={0.4} /></Sequence>
      <Sequence from={f(43.43)} durationInFrames={10}><Audio src={staticFile("sfx/ui/click3.ogg")} volume={0.5} /></Sequence>

      {/* Música suave de fondo */}
      <Audio src={staticFile("local/pad.wav")} volume={padVol} />
      {/* Latido: tensión en el gancho y en el dato que duele */}
      <Sequence from={0} durationInFrames={f(7.83)}><Audio src={staticFile("local/heartbeat.wav")} volume={beatVol(0, 7.83, 0.5)} /></Sequence>
      <Sequence from={f(20.4)} durationInFrames={f(5.85)}><Audio src={staticFile("local/heartbeat.wav")} volume={beatVol(20.4, 26.25, 0.45)} /></Sequence>
      {WHOOSH.map((s) => (
        <Sequence key={`w${s}`} from={f(s)} durationInFrames={20}><Audio src={staticFile("local/whoosh.wav")} volume={0.35} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
