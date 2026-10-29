import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { ease, progress, springs } from "../../../lib/motion";
import { B, f } from "../shared";

// Piezas reutilizables para vídeos explicativos estilo "esto es así porque".
export const EMO = "'Noto Color Emoji'";
export const FONT = `${B.font}, ${EMO}`;
export const C = { bg: "#0b0f14", card: "#151b23", line: "rgba(255,255,255,.12)", yellow: "#FFD400", red: "#E10600", green: "#22c55e", text: "#F4F1EA", muted: "#8b98a5" };

/** Escena: ventana de tiempo con entrada suave y salida rápida. Los hijos reciben el frame local. */
export const Scene: React.FC<{ s: number; e: number; children: (l: number, t: number) => React.ReactNode }> = ({ s, e, children }) => {
  const frame = useCurrentFrame();
  if (frame < f(s) || frame >= f(e)) return null;
  const l = frame - f(s);
  const pin = progress(l, 0, 10);
  const pout = 1 - progress(frame, f(e) - 7, 7, ease.in);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 620, height: 900, opacity: Math.min(pin, pout), transform: `translateY(${(1 - pin) * 30}px) scale(${1.15 * (0.97 + 0.03 * pin)})` }}>
      {children(l, frame / 30)}
    </div>
  );
};

/** Aparece con muelle cuando el tiempo global pasa de `at` (segundos). */
export const usePop = (at: number, cfg = springs.snappy) => {
  const frame = useCurrentFrame();
  return spring({ frame: frame - f(at), fps: 30, config: cfg });
};

export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: "up" | "down" | "left" | "right" | "scale" }> = ({ at, children, style, from = "up" }) => {
  const s = usePop(at);
  const d = (1 - s) * 50;
  const tr = from === "up" ? `translateY(${d}px)` : from === "down" ? `translateY(${-d}px)` : from === "left" ? `translateX(${-d * 2}px)` : from === "right" ? `translateX(${d * 2}px)` : `scale(${0.6 + 0.4 * s})`;
  return <div style={{ opacity: Math.min(1, s * 1.4), transform: tr, ...style }}>{children}</div>;
};

/** Número que cuenta hasta su valor. */
export const Count: React.FC<{ at: number; to: number; dur?: number; prefix?: string; suffix?: string; size?: number; color?: string; decimals?: number }> = ({ at, to, dur = 1.6, prefix = "", suffix = "", size = 180, color = C.yellow, decimals = 0 }) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [f(at), f(at + dur)], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out });
  const txt = v.toLocaleString("es-ES", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, color, lineHeight: 1, textAlign: "center", fontVariantNumeric: "tabular-nums", textShadow: `0 0 40px ${color}55` }}>{prefix}{txt}{suffix}</div>;
};

export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string }> = ({ children, style, accent }) => (
  <div style={{ background: C.card, border: `2px solid ${accent ?? C.line}`, borderRadius: 30, padding: "26px 30px", boxShadow: "0 24px 60px rgba(0,0,0,.5)", fontFamily: FONT, color: C.text, ...style }}>{children}</div>
);

export const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 48, color = C.text, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: size, color, textAlign: "center", lineHeight: 1.12, ...style }}>{children}</div>
);

export const Emoji: React.FC<{ e: string; size?: number; style?: React.CSSProperties }> = ({ e, size = 120, style }) => <div style={{ fontFamily: EMO, fontSize: size, lineHeight: 1, ...style }}>{e}</div>;

/** Flecha que se dibuja. */
export const Arrow: React.FC<{ at: number; w?: number; dir?: "right" | "down" }> = ({ at, w = 90, dir = "right" }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, f(at), 10);
  return <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 70, color: C.yellow, opacity: p, transform: `${dir === "down" ? "rotate(90deg) " : ""}translateX(${(1 - p) * -20}px)`, width: w, textAlign: "center" }}>→</div>;
};

/** Sello rojo de "tachado". */
export const Cross: React.FC<{ at: number }> = ({ at }) => {
  const s = usePop(at, { damping: 9, stiffness: 220 });
  return <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}><div style={{ fontSize: 150, color: C.red, fontFamily: FONT, fontWeight: 700, transform: `scale(${2 - s}) rotate(-12deg)`, opacity: s }}>✕</div></div>;
};

export const Avatar: React.FC<{ size?: number }> = ({ size = 120 }) => <Img src={staticFile("local/avatar.jpg")} style={{ width: size, height: size, borderRadius: 999, border: "4px solid #fff" }} />;

export const Verified: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24"><path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" /></svg>
);
