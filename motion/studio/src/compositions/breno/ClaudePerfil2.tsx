import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease, progress } from "../../lib/motion";
import { B, f, FPS, useWindow } from "./shared";

// «Claude me dijo por qué no me siguen» · toma única a cámara (30 oct 2026). Base en public/local/claude2_base.mp4.
export const CLAUDE_PERFIL2_TOTAL_S = 40.1;

const SEGS: { start: number; end: number; text: string }[] = [
  { start: 0.09, end: 2.55, text: "Me faltan 40 seguidores para llegar a 5.000" },
  { start: 3.1, end: 4.55, text: "y esta semana he perdido" },
  { start: 4.6, end: 8.0, text: "así que le pedí a Claude que me dijera por qué" },
  { start: 8.09, end: 12.9, text: "Le pasé mis estadísticas y en dos minutos me soltó tres cosas que yo no había visto" },
  { start: 12.93, end: 13.6, text: "Una" },
  { start: 13.85, end: 16.5, text: "Casi 9 de cada 10 seguidores son de Brasil" },
  { start: 16.57, end: 19.95, text: "y yo hablo en español así que mis vídeos no les llegan" },
  { start: 20.0, end: 20.7, text: "Dos" },
  { start: 21.4, end: 26.15, text: "En un mes me vieron más de 8.000 personas y solo me siguieron 6" },
  { start: 26.18, end: 26.9, text: "Tres" },
  { start: 27.16, end: 32.1, text: "Los vídeos que más enganchan son en los que cuento mi vida y no los consejos" },
  { start: 32.34, end: 34.5, text: "Comenta PERFIL y te mando el prompt" },
  { start: 34.84, end: 37.2, text: "para que lo hagas con tu cuenta Sígueme" },
  { start: 37.25, end: 40.1, text: "que si no el mensaje no te va a llegar" },
];
const KEY = ["40", "5.000", "PERDIDO", "CLAUDE", "TRES", "UNA", "9", "10", "BRASIL", "ESPAÑOL", "DOS", "8.000", "6", "VIDA", "CONSEJOS", "PERFIL", "PROMPT", "SÍGUEME"];

const chunks = (() => {
  const out: { start: number; end: number; words: string[] }[] = [];
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
  const size = 84;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${s})`, textAlign: "center", fontFamily: B.font, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: B.white, WebkitTextStroke: `${size * 0.09}px #000`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,.35)" }}>
        {c.words.map((w, i) => (
          <span key={i} style={{ color: KEY.includes(w.replace(/[^A-Z0-9.ÁÉÍÓÚÑ]/g, "")) ? B.yellow : B.white }}>{w}{i < c.words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </div>
  );
};

// Gancho: etiqueta del reto + título + barra de progreso 4.960 / 5.000 que se queda corta.
const HookCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(0, 4.5, 6, 8);
  if (!visible) return null;
  const l2 = progress(frame, 6, 10);
  const bar = progress(frame, 10, 40, ease.out);
  const shake = frame > 50 && frame < 62 ? Math.sin(frame * 2.2) * 6 : 0;
  const n = Math.round(4900 + 60 * bar);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 170, opacity: p, transform: `translateY(${(1 - p) * -24}px)`, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: B.font }}>
      <div style={{ background: B.red, color: B.white, fontWeight: 700, fontSize: 30, letterSpacing: "0.08em", padding: "8px 22px", borderRadius: 10, marginBottom: 12 }}>RETO 10K · DÍA 18</div>
      <div style={{ background: B.white, border: `6px solid ${B.black}`, borderRadius: 20, padding: "16px 30px", textAlign: "center", boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
        <div style={{ fontWeight: 700, fontSize: 60, lineHeight: 1.05, color: B.black }}>CLAUDE ME DIJO</div>
        <div style={{ fontWeight: 700, fontSize: 60, lineHeight: 1.05, color: B.red, opacity: l2 }}>POR QUÉ NO ME SIGUEN</div>
      </div>
      <div style={{ marginTop: 16, width: 620, transform: `translateX(${shake}px)` }}>
        <div style={{ height: 26, borderRadius: 99, background: "rgba(15,20,25,.55)", border: "3px solid #fff", overflow: "hidden" }}>
          <div style={{ width: `${(n / 5000) * 100}%`, height: "100%", background: B.yellow }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontWeight: 700, fontSize: 34, color: B.white, WebkitTextStroke: "3px #000", paintOrder: "stroke fill" }}>
          <span>{n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span><span>5.000</span>
        </div>
      </div>
    </div>
  );
};

// Tarjetas 1 · 2 · 3 arriba, sobre la pared, sin tapar la cara.
const PointCard: React.FC<{ start: number; end: number; n: string; a: React.ReactNode; b: React.ReactNode }> = ({ start, end, n, a, b }) => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(start, end, 10, 8);
  if (!visible) return null;
  const num = progress(frame, f(start), 12, ease.out);
  const txt = progress(frame, f(start) + 5, 12);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 200, opacity: p, display: "flex", alignItems: "center", gap: 24, fontFamily: B.font }}>
      <div style={{ flex: "0 0 auto", width: 140, height: 140, borderRadius: 999, background: B.yellow, border: `6px solid ${B.black}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 90, color: B.black, transform: `scale(${0.5 + 0.5 * num}) rotate(${(1 - num) * -25}deg)` }}>{n}</div>
      <div style={{ flex: 1, background: B.white, border: `6px solid ${B.black}`, borderRadius: 20, padding: "16px 24px", opacity: txt, transform: `translateX(${(1 - txt) * 40}px)`, boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
        <div style={{ fontWeight: 700, fontSize: 50, lineHeight: 1.05, color: B.black }}>{a}</div>
        <div style={{ fontWeight: 700, fontSize: 50, lineHeight: 1.05, color: B.red }}>{b}</div>
      </div>
    </div>
  );
};

// Contador 0 → 8.000 para el dato que duele.
const CountUp: React.FC<{ start: number; to: number; dur: number }> = ({ start, to, dur }) => {
  const frame = useCurrentFrame();
  const v = Math.round(to * progress(frame, f(start), f(dur), ease.out));
  return <span>{v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>;
};

const ClaudeChip: React.FC<{ start: number; end: number; text: string }> = ({ start, end, text }) => {
  const { p, visible } = useWindow(start, end, 10, 8);
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", justifyContent: "center", opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#F5F0E8", border: `5px solid ${B.black}`, borderRadius: 999, padding: "14px 30px", fontFamily: B.font, fontWeight: 700, fontSize: 46, color: B.black }}>
        <span style={{ color: "#D97757", fontSize: 54 }}>✳</span>{text}
      </div>
    </div>
  );
};

const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(32.3, 40.1, 10, 4);
  if (!visible) return null;
  const pulse = 1 + 0.03 * Math.sin(frame / 5);
  const fol = progress(frame, f(36.4), 10, ease.out);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1080, opacity: p, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, fontFamily: B.font }}>
      <div style={{ transform: `scale(${pulse})`, background: B.white, border: `6px solid ${B.black}`, borderRadius: 22, padding: "18px 36px", textAlign: "center", boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
        <div style={{ fontWeight: 700, fontSize: 44, color: B.black }}>💬 COMENTA</div>
        <div style={{ fontWeight: 800, fontSize: 96, lineHeight: 1, color: B.red }}>PERFIL</div>
        <div style={{ fontWeight: 600, fontSize: 36, color: B.black, marginTop: 6 }}>y te mando el prompt</div>
      </div>
      <div style={{ opacity: fol, transform: `translateY(${(1 - fol) * 20}px) scale(${1 + 0.06 * Math.max(0, Math.sin((frame - f(36.4)) / 4))})`, background: "#0095F6", color: B.white, fontWeight: 700, fontSize: 44, padding: "12px 40px", borderRadius: 14 }}>Seguir</div>
    </div>
  );
};

// Cortes reales de la toma (para zoom suave) y cambios a plano del portátil.
const CUTS = [0, 4.58, 8.03, 11.02, 12.93, 16.53, 17.0, 19.94, 19.98, 26.18, 29.23, 30.94, 32.29, 33.24, 36.59];
const FLASH = [8.03, 11.02, 17.0, 19.94];
const WHOOSH = [7.96, 10.95, 16.93, 19.87];

const padVol = (fr: number) => {
  const t = fr / FPS;
  const broll = (t >= 8.03 && t < 11.02) || (t >= 17.0 && t < 19.94) ? 0.12 : 0.07;
  const fin = interpolate(t, [38.3, 40.1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ini = interpolate(t, [0, 1], [0.4, 1], { extrapolateRight: "clamp" });
  return broll * fin * ini;
};
const beatVol = (start: number, end: number, v: number) => (fr: number) => {
  const t = fr / FPS + start;
  return v * interpolate(t, [start, start + 0.5, end - 1.0, end], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

export const ClaudePerfil2: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const segStart = [...CUTS].reverse().find((c) => t >= c) ?? 0;
  const segEnd = CUTS.find((c) => c > t) ?? CLAUDE_PERFIL2_TOTAL_S;
  const zoom = 1 + 0.035 * Math.min(1, (t - segStart) / Math.max(0.5, segEnd - segStart));
  const flash = FLASH.reduce((a, c) => Math.max(a, interpolate(t - c, [0, 0.04, 0.2], [0, 0.5, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })), 0);
  const subsY = t >= 32.3 ? 1560 : 1290;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo src={staticFile("local/claude2_base.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "#fff", opacity: flash, pointerEvents: "none" }} />
      <HookCard />
      <ClaudeChip start={8.1} end={11.0} text="Claude analizando mi perfil" />
      <PointCard start={12.93} end={19.95} n="1" a="9 DE CADA 10" b="SON DE BRASIL 🇧🇷" />
      <PointCard start={20.0} end={26.15} n="2" a={<><CountUp start={21.4} to={8000} dur={2.2} /> ME VIERON</>} b="SOLO 6 ME SIGUIERON" />
      <PointCard start={26.18} end={32.2} n="3" a="TU VIDA ENGANCHA" b="TUS CONSEJOS NO" />
      <Cta />
      {t < 32.3 || t >= 34.5 ? <Subs y={subsY} /> : null}

      <Audio src={staticFile("local/pad.wav")} volume={padVol} />
      <Sequence from={0} durationInFrames={f(4.6)}><Audio src={staticFile("local/heartbeat.wav")} volume={beatVol(0, 4.6, 0.5)} /></Sequence>
      <Sequence from={f(21.4)} durationInFrames={f(4.75)}><Audio src={staticFile("local/heartbeat.wav")} volume={beatVol(21.4, 26.15, 0.45)} /></Sequence>
      <Sequence from={2} durationInFrames={20}><Audio src={staticFile("sfx/interface/select_008.ogg")} volume={0.4} /></Sequence>
      <Sequence from={52} durationInFrames={20}><Audio src={staticFile("sfx/interface/error_005.ogg")} volume={0.35} /></Sequence>
      {WHOOSH.map((s) => (
        <Sequence key={`w${s}`} from={f(s)} durationInFrames={20}><Audio src={staticFile("local/whoosh.wav")} volume={0.35} /></Sequence>
      ))}
      {[8.15, 8.45, 8.7, 9.05].map((s, i) => (
        <Sequence key={`k${s}`} from={f(s)} durationInFrames={10}><Audio src={staticFile(`sfx/keyboard/keypress-${["004", "009", "015", "021"][i]}.wav`)} volume={0.3} /></Sequence>
      ))}
      {[12.93, 20.0, 26.18].map((s) => (
        <Sequence key={s} from={f(s)} durationInFrames={20}><Audio src={staticFile("sfx/interface/drop_002.ogg")} volume={0.5} /></Sequence>
      ))}
      <Sequence from={f(32.3)} durationInFrames={20}><Audio src={staticFile("sfx/interface/bong_001.ogg")} volume={0.4} /></Sequence>
      <Sequence from={f(36.4)} durationInFrames={10}><Audio src={staticFile("sfx/ui/click3.ogg")} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};
