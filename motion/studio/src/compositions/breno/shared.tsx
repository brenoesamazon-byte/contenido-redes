import React from "react";
import { AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { ease, progress } from "../../lib/motion";

// Marca de Breno (Kit de marca): Poppins Bold para vídeo, rojo franja, naranja etiqueta, amarillo palabras clave.
export const B = {
  font: "Poppins, Inter, sans-serif",
  red: "#E10600",
  orange: "#E4572E",
  yellow: "#FFD400",
  white: "#FFFFFF",
  black: "#0F1419",
};

export const FPS = 30;
export const f = (s: number) => Math.round(s * FPS);

// Tramos del vídeo ya cortado (segundos) con el texto que dice Breno.
export const SEGMENTS: { start: number; end: number; text: string }[] = [
  { start: 0, end: 4.467, text: "Organización de contenido. Llevo tres días de contenido adelantado" },
  { start: 4.467, end: 8.567, text: "desde el lunes y el martes, procurando adelantar un día" },
  { start: 8.567, end: 10.733, text: "pero lo estamos gestionando bastante bien" },
  { start: 10.733, end: 13.567, text: "Estoy utilizando la herramienta Claude Code" },
  { start: 13.567, end: 17.133, text: "y la herramienta de Buzzy que os he hablado anteriormente" },
  { start: 17.133, end: 23.667, text: "Todavía no la he probado en modo Pro, la estoy probando en modo gratuito. La verdad que es una pasada" },
  { start: 23.667, end: 34.567, text: "Entonces estoy usando Claude Code para programar los contenidos, las animaciones, los cortes, todo lo que hago aquí" },
  { start: 34.567, end: 42.333, text: "Esta semana me estoy poniendo las pilas con eso y si veo que tengo que tener el plan Pro" },
  { start: 42.333, end: 45.967, text: "pues lo haré, y os dejaré por aquí qué tal la herramienta" },
  { start: 45.967, end: 54.0, text: "Hay algunos fallos, como podéis ver en algunos vídeos, pero estamos empezando y estamos aprendiendo. Así que nos vemos mañana" },
];
export const TOTAL = f(54.0);

const KEYWORDS = ["TRES", "DÍAS", "ADELANTADO", "CLAUDE", "CODE", "BUZZY", "PRO", "GRATUITO", "PASADA", "CONTENIDOS", "ANIMACIONES", "CORTES", "PILAS", "FALLOS", "APRENDIENDO", "MAÑANA", "BIEN"];

type Chunk = { start: number; end: number; words: string[] };
// Trocea cada tramo en fragmentos de 2–4 palabras, con el tiempo repartido por número de letras.
export const chunks: Chunk[] = (() => {
  const out: Chunk[] = [];
  for (const s of SEGMENTS) {
    const words = s.text.toUpperCase().replace(/[.,]/g, "").split(/\s+/);
    const groups: string[][] = [];
    let cur: string[] = [];
    for (const w of words) {
      cur.push(w);
      const len = cur.join(" ").length;
      if (cur.length >= 4 || (cur.length >= 2 && len > 15)) { groups.push(cur); cur = []; }
    }
    if (cur.length) { if (cur.length === 1 && groups.length) groups[groups.length - 1].push(...cur); else groups.push(cur); }
    const total = groups.reduce((a, g) => a + g.join(" ").length + 2, 0);
    let t = s.start;
    for (const g of groups) {
      const d = ((g.join(" ").length + 2) / total) * (s.end - s.start);
      out.push({ start: t, end: t + d, words: g });
      t += d;
    }
  }
  return out;
})();

// Fondo: el vídeo de Breno ya cortado, con un filtro opcional.
export const BaseVideo: React.FC<{ filter?: string; volume?: number }> = ({ filter, volume = 1 }) => (
  <AbsoluteFill>
    <OffthreadVideo src={staticFile("local/base.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover", filter }} volume={volume} />
  </AbsoluteFill>
);

// Subtítulos estilo Breno: Poppins Bold mayúsculas, contorno negro, palabras clave en amarillo, entrada 88→100 %.
export const Subtitles: React.FC<{ y?: number; hide?: (t: number) => boolean; size?: number }> = ({ y = 1480, hide, size = 86 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const c = chunks.find((k) => t >= k.start && t < k.end);
  if (!c || (hide && hide(t))) return null;
  const local = frame - f(c.start);
  const s = interpolate(local, [0, 3], [0.88, 1], { extrapolateRight: "clamp", easing: ease.out });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y, display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${s})`, textAlign: "center", fontFamily: B.font, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: B.white, WebkitTextStroke: `${size * 0.09}px #000`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,.35)" }}>
        {c.words.map((w, i) => (
          <span key={i} style={{ color: KEYWORDS.includes(w.replace(/[^A-ZÁÉÍÓÚÑ]/g, "")) ? B.yellow : B.white }}>{w}{i < c.words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </div>
  );
};

// Ventana de visibilidad con entrada ease-out y salida más rápida.
export const useWindow = (start: number, end: number, inDur = 12, outDur = 8) => {
  const frame = useCurrentFrame();
  const a = f(start), b = f(end);
  const pin = progress(frame, a, inDur);
  const pout = 1 - progress(frame, b - outDur, outDur, ease.in);
  const visible = frame >= a && frame < b;
  return { p: visible ? Math.min(pin, pout) : 0, pin, local: frame - a, visible };
};
