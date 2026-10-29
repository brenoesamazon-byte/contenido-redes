import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { ease, progress, springs } from "../../lib/motion";
import { B, f } from "./shared";

// Historia de Instagram (29 oct 2026) · v2: enseña el proceso, sin llamada a la acción
// y sin la oficina real (solo clips con el fondo de estudio o grabados fuera).
const EMO = "'Noto Color Emoji'";
const MONO = "'DejaVu Sans Mono', monospace";

// Duraciones de cada escena (s)
const SC = { intro: 2.6, terminal: 5.0, pipeline: 3.8, net: 4.2, grid: 3.6, effects: 3.0, hook: 3.2, outro: 2.6 };
const order = ["intro", "terminal", "pipeline", "net", "grid", "effects", "hook", "outro"] as const;
const starts: Record<string, number> = {};
{ let t = 0; for (const k of order) { starts[k] = t; t += SC[k]; } }
export const STORY_TOTAL = Math.round(order.reduce((a, k) => a + SC[k], 0) * 30);

const Kicker: React.FC<{ text: string; l: number; top?: number }> = ({ text, l, top = 212 }) => {
  const s = spring({ frame: l, fps: 30, config: springs.snappy });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center" }}>
      <div style={{ background: "#fff", color: B.black, fontFamily: `${B.font}, ${EMO}`, fontWeight: 700, fontSize: 46, padding: "12px 32px", borderRadius: 999, opacity: s, transform: `scale(${0.85 + 0.15 * s}) translateY(${(1 - s) * -20}px)`, boxShadow: "0 10px 30px rgba(0,0,0,.4)" }}>{text}</div>
    </div>
  );
};

const Phone: React.FC<{ src: string; l: number; dur: number; x?: number; y?: number; w?: number }> = ({ src, l, dur, x = 119, y = 300, w = 842 }) => {
  const inP = progress(l, 0, 10);
  const outP = progress(l, f(dur) - 5, 5, ease.in);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: w * 16 / 9, borderRadius: w * 0.052, overflow: "hidden", border: "6px solid rgba(255,255,255,.9)", boxShadow: "0 30px 80px rgba(0,0,0,.6)", transform: `scale(${0.94 + 0.06 * inP}) translateX(${outP * -80}px)`, opacity: Math.min(inP, 1 - outP * 0.6) }}>
      <OffthreadVideo src={staticFile(`local/${src}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
};

// Intro
const Intro: React.FC = () => {
  const l = useCurrentFrame();
  const a = progress(l, 4, 12), b = progress(l, 14, 14);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 660, textAlign: "center", fontFamily: `${B.font}, ${EMO}`, fontWeight: 700, color: "#fff" }}>
      <div style={{ fontSize: 50, color: B.yellow, opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>LO QUE HE HECHO HOY</div>
      <div style={{ fontSize: 104, lineHeight: 1.05, marginTop: 16, opacity: b, transform: `translateY(${(1 - b) * 26}px)` }}>He puesto a una IA a editar mis vídeos 🤖</div>
    </div>
  );
};

// Terminal grande escribiendo las órdenes que le di
const TerminalScene: React.FC = () => {
  const l = useCurrentFrame();
  const p = progress(l, 0, 10);
  const lines: [string, string, number][] = [
    ["$ claude", "#e6edf3", 4],
    ["> corta las pausas de mi vídeo", "#ffd400", 14],
    ["  ✓ 2:55 → 1:46", "#28c840", 44],
    ["> cámbiame el fondo por un estudio", "#ffd400", 56],
    ["  ✓ estudio nuevo", "#28c840", 88],
    ["> /motion añade animaciones", "#ffd400", 98],
    ["  ✓ 16 animaciones listas", "#28c840", 128],
  ];
  return (
    <>
      <Kicker text="Solo le escribo lo que quiero" l={l} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 420, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
        <div style={{ borderRadius: 26, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.6)", border: "1px solid rgba(255,255,255,.15)" }}>
          <div style={{ height: 64, background: "#2b2f36", display: "flex", alignItems: "center", gap: 14, paddingLeft: 26 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />)}
            <div style={{ marginLeft: 24, color: "#9aa4af", fontFamily: B.font, fontSize: 30 }}>Terminal — claude</div>
          </div>
          <div style={{ background: "rgba(13,16,20,.97)", padding: "30px 34px", fontFamily: MONO, fontSize: 40, lineHeight: 1.6, minHeight: 820 }}>
            {lines.map(([t, c, at], i) => {
              const n = Math.max(0, Math.floor((l - at) * 1.6));
              if (n <= 0) return null;
              const done = t.trim().startsWith("✓");
              const shown = done ? t : t.slice(0, n);
              const typing = !done && n < t.length;
              return <div key={i} style={{ color: c, opacity: done ? progress(l, at, 6) : 1 }}>{shown}{typing && Math.floor(l / 8) % 2 === 0 ? "▌" : ""}</div>;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

// Barras de progreso de cada fase
const Pipeline: React.FC = () => {
  const l = useCurrentFrame();
  const steps: [string, string, number][] = [["✂️", "Cortes secos", 6], ["🪄", "Cambio de fondo", 22], ["💬", "Subtítulos", 38], ["✨", "Animaciones", 54], ["🎬", "Render final", 70]];
  return (
    <>
      <Kicker text="Y la IA hace el resto" l={l} />
      <div style={{ position: "absolute", left: 80, right: 80, top: 470, display: "flex", flexDirection: "column", gap: 34 }}>
        {steps.map(([e, t, at]) => {
          const show = spring({ frame: l - at + 6, fps: 30, config: springs.snappy });
          const pr = interpolate(l, [at, at + 22], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.inOut });
          const done = pr >= 100;
          return (
            <div key={t} style={{ opacity: show, transform: `translateX(${(1 - show) * -60}px)`, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 26, padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: `${B.font}, ${EMO}`, fontWeight: 700, color: "#fff", fontSize: 46 }}>
                <span>{e} {t}</span>
                <span style={{ color: done ? "#28c840" : B.yellow, fontSize: 40 }}>{done ? "✓" : `${Math.round(pr)}%`}</span>
              </div>
              <div style={{ marginTop: 16, height: 16, borderRadius: 99, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
                <div style={{ width: `${pr}%`, height: "100%", borderRadius: 99, background: done ? "#28c840" : `linear-gradient(90deg, ${B.red}, ${B.yellow})` }} />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

// Cuatro estilos a la vez
const Grid: React.FC = () => {
  const l = useCurrentFrame();
  const clips: [string, string][] = [["st_v1.mp4", "Franja roja"], ["st_v2.mp4", "Noticia"], ["st_check.mp4", "Gráficos"], ["st_v4.mp4", "Vlog"]];
  const w = 420, h = (w * 16) / 9, gx = 60, gy = 40, x0 = (1080 - (2 * w + gx)) / 2, y0 = 330;
  return (
    <>
      <Kicker text="El mismo vídeo, 4 estilos" l={l} />
      {clips.map(([src, t], i) => {
        const s = spring({ frame: l - i * 4, fps: 30, config: springs.snappy });
        const x = x0 + (i % 2) * (w + gx), y = y0 + Math.floor(i / 2) * (h + gy);
        return (
          <div key={src} style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, overflow: "hidden", border: "4px solid rgba(255,255,255,.9)", boxShadow: "0 20px 50px rgba(0,0,0,.55)", transform: `scale(${0.8 + 0.2 * s})`, opacity: s }}>
            <OffthreadVideo src={staticFile(`local/${src}`)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 14, top: 14, background: B.red, color: "#fff", fontFamily: B.font, fontWeight: 700, fontSize: 28, padding: "6px 16px", borderRadius: 99 }}>{i + 1} · {t}</div>
          </div>
        );
      })}
    </>
  );
};

// Cierre sin llamada a la acción: el balance del día
const Outro: React.FC = () => {
  const l = useCurrentFrame();
  const stats: [string, string][] = [["2", "vídeos editados"], ["5", "estilos distintos"], ["0", "programas de edición"]];
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 520, fontFamily: `${B.font}, ${EMO}`, fontWeight: 700, color: "#fff" }}>
      <div style={{ fontSize: 50, color: B.yellow, textAlign: "center", opacity: progress(l, 0, 10) }}>BALANCE DEL DÍA 17</div>
      {stats.map(([n, t], i) => {
        const s = spring({ frame: l - 8 - i * 7, fps: 30, config: springs.snappy });
        return (
          <div key={t} style={{ display: "flex", alignItems: "baseline", gap: 28, marginTop: 34, opacity: s, transform: `translateY(${(1 - s) * 30}px)` }}>
            <div style={{ fontSize: 150, lineHeight: 1, color: i === 2 ? B.red : "#fff", width: 130, textAlign: "right" }}>{n}</div>
            <div style={{ fontSize: 58 }}>{t}</div>
          </div>
        );
      })}
    </div>
  );
};

const ClipScene: React.FC<{ src: string; dur: number; label: string }> = ({ src, dur, label }) => {
  const l = useCurrentFrame();
  return (<><Phone src={src} l={l} dur={dur} /><Kicker text={label} l={l} /></>);
};

export const StoryRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(frame / 20);
  const seq = (k: keyof typeof SC, node: React.ReactNode) => (
    <Sequence key={k} from={f(starts[k])} durationInFrames={f(SC[k])}>{node}</Sequence>
  );
  const keys = [0.6, 2.9, 3.4, 4.1, 4.5, 5.0, 5.4, 6.4]; // tecleo en la escena del terminal (s desde su inicio)
  return (
    <AbsoluteFill style={{ background: B.black }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 35%, rgba(225,6,0,${0.22 + 0.12 * glow}) 0%, rgba(15,20,25,0) 60%)` }} />
      {seq("intro", <Intro />)}
      {seq("terminal", <TerminalScene />)}
      {seq("pipeline", <Pipeline />)}
      {seq("net", <ClipScene src="st_net.mp4" dur={SC.net} label="Todo conectado a Claude Code" />)}
      {seq("grid", <Grid />)}
      {seq("effects", <ClipScene src="st_count.mp4" dur={SC.effects} label="Contadores, emojis, gráficos…" />)}
      {seq("hook", <ClipScene src="st_hook.mp4" dur={SC.hook} label="Gancho animado desde el segundo 1" />)}
      {seq("outro", <Outro />)}
      {order.map((k) => (
        <Sequence key={`s-${k}`} from={f(starts[k])} durationInFrames={20}><Audio src={staticFile("sfx/casino/card-slide-1.ogg")} volume={0.4} /></Sequence>
      ))}
      {keys.map((k) => (
        <Sequence key={`k-${k}`} from={f(starts.terminal) + Math.round(k * 15)} durationInFrames={10}><Audio src={staticFile("sfx/ui/click2.ogg")} volume={0.25} /></Sequence>
      ))}
      {[6, 22, 38, 54, 70].map((at) => (
        <Sequence key={`p-${at}`} from={f(starts.pipeline) + at + 22} durationInFrames={15}><Audio src={staticFile("sfx/interface/select_008.ogg")} volume={0.3} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
