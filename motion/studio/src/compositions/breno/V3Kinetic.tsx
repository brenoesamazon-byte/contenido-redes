import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { ease, progress, springs } from "../../lib/motion";
import { B, BaseVideo, f, useWindow } from "./shared";

// V3 · Tipografía cinética: sin subtítulos; en cada idea clave aparece un gráfico distinto sobre el pecho.
const Y = 1190; // zona segura: debajo de la barbilla, encima de la UI de Reels

const Pop: React.FC<{ start: number; end: number; children: React.ReactNode }> = ({ start, end, children }) => {
  const frame = useCurrentFrame();
  const { p, visible, local } = useWindow(start, end, 10, 7);
  if (!visible) return null;
  const s = spring({ frame: local, fps: 30, config: springs.snappy });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: Y, display: "flex", justifyContent: "center", opacity: p, transform: `scale(${0.92 + 0.08 * s})` }}>
      {children}
    </div>
  );
};

const Big: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = B.white, size = 120 }) => (
  <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: size, lineHeight: 1, color, textAlign: "center", WebkitTextStroke: `${size * 0.07}px #000`, paintOrder: "stroke fill", textShadow: "0 10px 28px rgba(0,0,0,.4)" }}>{children}</div>
);

const Chip: React.FC<{ children: React.ReactNode; bg?: string; color?: string }> = ({ children, bg = B.white, color = B.black }) => (
  <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 64, background: bg, color, padding: "18px 40px", borderRadius: 999, boxShadow: "0 14px 34px rgba(0,0,0,.35)" }}>{children}</div>
);

const CounterPop: React.FC = () => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [6, 30], [0, 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out }));
  return (
    <Pop start={0.1} end={4.4}>
      <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <Big size={230} color={B.yellow}>{n}</Big>
        <div><Big size={76}>DÍAS DE</Big><Big size={76}>CONTENIDO</Big><Big size={60} color={B.yellow}>ADELANTADO</Big></div>
      </div>
    </Pop>
  );
};

const Days: React.FC = () => {
  const frame = useCurrentFrame();
  const items = ["LUN", "MAR", "MIÉ"];
  return (
    <Pop start={4.5} end={8.5}>
      <div style={{ display: "flex", gap: 22 }}>
        {items.map((d, i) => {
          const p = progress(frame, f(4.5) + i * 9, 10);
          const done = i < 2;
          return (
            <div key={d} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)`, width: 250, height: 230, borderRadius: 26, background: done ? B.white : "rgba(255,255,255,.18)", border: done ? "none" : "5px dashed #fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: B.font, fontWeight: 700, color: done ? B.black : B.white, boxShadow: "0 14px 30px rgba(0,0,0,.3)" }}>
              <div style={{ fontSize: 70 }}>{d}</div>
              <div style={{ fontSize: 40, color: done ? "#1a9b4b" : B.yellow }}>{done ? "LISTO" : "+1 DÍA"}</div>
            </div>
          );
        })}
      </div>
    </Pop>
  );
};

const Toggle: React.FC = () => {
  const frame = useCurrentFrame();
  const k = progress(frame, f(17.2) + 12, 14, ease.inOut); // el interruptor se queda en GRATIS
  return (
    <Pop start={17.2} end={23.6}>
      <div style={{ display: "flex", alignItems: "center", gap: 30, fontFamily: B.font, fontWeight: 700 }}>
        <Big size={70} color={k > 0.5 ? B.yellow : B.white}>GRATIS</Big>
        <div style={{ width: 210, height: 110, borderRadius: 99, background: "rgba(15,20,25,.85)", border: "5px solid #fff", position: "relative" }}>
          <div style={{ position: "absolute", top: 9, left: interpolate(k, [0, 1], [110, 10]), width: 82, height: 82, borderRadius: 99, background: B.yellow }} />
        </div>
        <Big size={70} color={k > 0.5 ? "rgba(255,255,255,.55)" : B.white}>PRO</Big>
      </div>
    </Pop>
  );
};

const Checklist: React.FC = () => {
  const frame = useCurrentFrame();
  const items: [string, number][] = [["CONTENIDOS", 26.6], ["ANIMACIONES", 28.6], ["CORTES", 30.4], ["TODO CON IA", 32.2]];
  return (
    <Pop start={23.8} end={34.5}>
      <div style={{ background: "rgba(255,255,255,.95)", borderRadius: 28, padding: "26px 40px", minWidth: 640, boxShadow: "0 18px 40px rgba(0,0,0,.35)", fontFamily: B.font }}>
        <div style={{ fontWeight: 700, fontSize: 40, color: B.red, letterSpacing: "0.05em", marginBottom: 6 }}>CLAUDE CODE HACE:</div>
        {items.map(([txt, at]) => {
          const p = progress(frame, f(at), 10);
          return (
            <div key={txt} style={{ display: "flex", alignItems: "center", gap: 20, fontWeight: 700, fontSize: 56, color: B.black, opacity: 0.25 + 0.75 * p, lineHeight: 1.25 }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: p > 0.5 ? "#1a9b4b" : "#d9dee3", color: "#fff", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.9 + 0.1 * p})` }}>{p > 0.5 ? "✓" : ""}</div>
              {txt}
            </div>
          );
        })}
      </div>
    </Pop>
  );
};

export const V3Kinetic: React.FC = () => {
  const sfx: [number, string][] = [[0.15, "drop_002"], [4.5, "click_002"], [8.6, "select_008"], [10.8, "switch_002"], [13.6, "switch_002"], [17.2, "switch_005"], [23.8, "drop_001"], [26.6, "click_003"], [28.6, "click_003"], [30.4, "click_003"], [32.2, "click_003"], [34.7, "glitch_002"], [42.4, "select_008"], [46.1, "drop_002"], [50.5, "bong_001"]];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <BaseVideo />
      <CounterPop />
      <Days />
      <Pop start={8.6} end={10.7}><Chip bg="#1a9b4b" color="#fff">BAJO CONTROL ✓</Chip></Pop>
      <Pop start={10.8} end={13.5}><Chip>⌘ CLAUDE CODE</Chip></Pop>
      <Pop start={13.6} end={17.1}><Chip bg={B.yellow}>▶ BUZZY</Chip></Pop>
      <Toggle />
      <Checklist />
      <Pop start={34.7} end={42.2}><div style={{ textAlign: "center" }}><Big size={90}>¿ME PASO</Big><Big size={120} color={B.yellow}>AL PRO?</Big></div></Pop>
      <Pop start={42.4} end={45.9}><Chip bg={B.red} color="#fff">OS LO CUENTO AQUÍ</Chip></Pop>
      <Pop start={46.1} end={50.4}><div style={{ textAlign: "center" }}><Big size={80}>FALLAR</Big><Big size={100} color={B.yellow}>= APRENDER</Big></div></Pop>
      <Pop start={50.5} end={54}><Big size={110}>NOS VEMOS MAÑANA</Big></Pop>
      {sfx.map(([t, n]) => (
        <Sequence key={t} from={f(t)} durationInFrames={24}><Audio src={staticFile(`sfx/interface/${n}.ogg`)} volume={0.35} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
