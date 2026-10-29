import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { ease, progress, springs } from "../../lib/motion";
import { B, f } from "./shared";

// Historia de Instagram (29 oct 2026): resumen del día enseñando las animaciones.
// Fondo oscuro, cada clip dentro de una "pantalla" con esquinas redondeadas y un rótulo encima.
const CLIPS: [string, number, string][] = [
  ["st_v1.mp4", 3.2, "Estilo 1 · Franja roja"],
  ["st_v2.mp4", 3.0, "Estilo 2 · Noticia"],
  ["st_check.mp4", 3.4, "Estilo 3 · Gráficos animados"],
  ["st_count.mp4", 3.0, "Contadores y lluvia de emojis"],
  ["st_ba.mp4", 4.2, "Me cambió el fondo de la oficina 🤯"],
  ["st_comment.mp4", 3.4, "Hasta la caja de comentarios"],
];
const INTRO = 2.6, OUTRO = 3.4;
export const STORY_TOTAL = Math.round((INTRO + CLIPS.reduce((a, c) => a + c[1], 0) + OUTRO) * 30);

const Label: React.FC<{ text: string; l: number }> = ({ text, l }) => {
  const s = spring({ frame: l, fps: 30, config: springs.snappy });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 212, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", color: B.black, fontFamily: `${B.font}, 'Noto Color Emoji'`, fontWeight: 700, fontSize: 46, padding: "12px 32px", borderRadius: 999, transform: `scale(${0.85 + 0.15 * s}) translateY(${(1 - s) * -20}px)`, opacity: s, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }}>{text}</div>
    </div>
  );
};

const Screen: React.FC<{ src: string; l: number; dur: number }> = ({ src, l, dur }) => {
  const inP = progress(l, 0, 10);
  const outP = progress(l, f(dur) - 5, 5, ease.in);
  return (
    <div style={{ position: "absolute", left: 119, top: 300, width: 842, height: 1497, borderRadius: 44, overflow: "hidden", border: "6px solid rgba(255,255,255,.9)", boxShadow: "0 30px 80px rgba(0,0,0,.6)", transform: `scale(${0.94 + 0.06 * inP}) translateX(${outP * -80}px) rotate(${(1 - inP) * 2}deg)`, opacity: Math.min(inP, 1 - outP * 0.6) }}>
      <OffthreadVideo src={staticFile(`local/${src}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

export const StoryRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 20);
  let t = f(INTRO);
  const seqs = CLIPS.map(([src, d, label]) => { const from = t; t += f(d); return { src, d, label, from }; });
  const outroFrom = t;
  const a = progress(frame, 4, 12), b = progress(frame, 14, 14);
  return (
    <AbsoluteFill style={{ background: B.black }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, rgba(225,6,0,${0.25 + 0.15 * glow}) 0%, rgba(15,20,25,0) 60%)` }} />
      {/* Intro */}
      {frame < f(INTRO) && (
        <div style={{ position: "absolute", left: 70, right: 70, top: 640, textAlign: "center", fontFamily: `${B.font}, 'Noto Color Emoji'`, fontWeight: 700, color: "#fff" }}>
          <div style={{ fontSize: 50, color: B.yellow, opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>LO QUE HE HECHO HOY</div>
          <div style={{ fontSize: 104, lineHeight: 1.05, marginTop: 16, opacity: b, transform: `translateY(${(1 - b) * 26}px)` }}>He puesto a una IA a editar mis vídeos 🤖</div>
        </div>
      )}
      {seqs.map((s) => (
        <Sequence key={s.src} from={s.from} durationInFrames={f(s.d)}>
          <ClipBlock src={s.src} dur={s.d} label={s.label} />
        </Sequence>
      ))}
      {/* Cierre: hueco libre abajo para poner la pegatina de preguntas de Instagram */}
      {frame >= outroFrom && (() => {
        const l = frame - outroFrom;
        const p1 = progress(l, 0, 12), p2 = progress(l, 10, 12);
        return (
          <div style={{ position: "absolute", left: 70, right: 70, top: 520, textAlign: "center", fontFamily: `${B.font}, 'Noto Color Emoji'`, fontWeight: 700, color: "#fff" }}>
            <div style={{ fontSize: 96, lineHeight: 1.05, opacity: p1, transform: `translateY(${(1 - p1) * 24}px)` }}>¿Os cuento cómo lo hago?</div>
            <div style={{ fontSize: 50, color: B.yellow, marginTop: 24, opacity: p2 }}>Pregúntame aquí abajo 👇</div>
          </div>
        );
      })()}
      {[0.1, ...seqs.map((s) => s.from / 30), outroFrom / 30].map((s) => (
        <Sequence key={s} from={Math.round(s * 30)} durationInFrames={20}><Audio src={staticFile("sfx/casino/card-slide-1.ogg")} volume={0.45} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

const ClipBlock: React.FC<{ src: string; dur: number; label: string }> = ({ src, dur, label }) => {
  const l = useCurrentFrame();
  return (
    <>
      <Screen src={src} l={l} dur={dur} />
      <Label text={label} l={l} />
    </>
  );
};
