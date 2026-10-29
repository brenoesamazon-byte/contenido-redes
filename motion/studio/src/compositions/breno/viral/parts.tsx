import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { ease, progress, springs } from "../../../lib/motion";
import { B, f } from "../shared";

// Utilidades de ventana: p = 0→1 al entrar, 1→0 al salir.
export const win = (frame: number, s: number, e: number, inF = 10, outF = 7) => {
  const a = f(s), b = f(e);
  if (frame < a || frame >= b) return { on: false, p: 0, l: 0 };
  const pin = progress(frame, a, inF);
  const pout = 1 - progress(frame, b - outF, outF, ease.in);
  return { on: true, p: Math.min(pin, pout), l: frame - a };
};

const stroke = (size: number): React.CSSProperties => ({ WebkitTextStroke: `${size * 0.08}px #000`, paintOrder: "stroke fill", textShadow: "0 10px 30px rgba(0,0,0,.45)" });
export const EMOJI = "'Noto Color Emoji'";

// 1 · Gancho: franja roja que barre + frase en dos líneas + emoji que rebota
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 0, 3.4, 6, 8);
  if (!on) return null;
  const sweep = progress(l, 0, 8);
  const a = progress(l, 5, 9), b = progress(l, 9, 10);
  const pop = spring({ frame: l - 14, fps: 30, config: springs.bouncy });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1170, height: 250, opacity: p }}>
      <div style={{ position: "absolute", inset: 0, background: B.red, transform: `scaleX(${sweep})`, transformOrigin: "left", boxShadow: "0 12px 36px rgba(0,0,0,.35)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: B.font, fontWeight: 700, color: "#fff" }}>
        <div style={{ fontSize: 44, opacity: a, transform: `translateY(${(1 - a) * 14}px)` }}>ESTE VÍDEO NO LO HE EDITADO YO</div>
        <div style={{ fontSize: 100, lineHeight: 1.05, opacity: b, transform: `translateY(${(1 - b) * 18}px)` }}>LO HA HECHO UNA IA</div>
      </div>
      <div style={{ position: "absolute", right: 24, top: -118, fontFamily: EMOJI, fontSize: 100, transform: `scale(${pop}) rotate(${(1 - pop) * -30}deg)` }}>🤯</div>
    </div>
  );
};

export const RetoTag: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const busy = (t >= 6.2 && t < 12.5) || (t >= 28.7 && t < 37.1) || (t >= 70.8 && t < 75.4);
  const p = busy ? 0 : progress(frame, 8, 12);
  return (
    <div style={{ position: "absolute", top: 290, right: 44, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, background: "#E4572E", color: "#fff", fontFamily: B.font, fontWeight: 700, fontSize: 34, padding: "10px 24px", borderRadius: 999, boxShadow: "0 6px 18px rgba(0,0,0,.3)" }}>RETO 10K · DÍA 17</div>
  );
};

// 2 · Ventana de terminal escribiendo el comando
export const Terminal: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 6.3, 12.4, 12, 8);
  if (!on) return null;
  const lines = ["$ claude", "> /motion edita mi vídeo con animaciones", "✓ Cortes  ✓ Subtítulos  ✓ Animaciones"];
  const starts = [10, 30, 110];
  const speed = 1.4; // letras por frame
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 300, opacity: p, transform: `translateY(${(1 - p) * -40}px) scale(${0.96 + 0.04 * p})` }}>
      <div style={{ borderRadius: 18, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,.5)", border: "1px solid rgba(255,255,255,.12)" }}>
        <div style={{ height: 44, background: "#2b2f36", display: "flex", alignItems: "center", gap: 10, paddingLeft: 18 }}>
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 16, height: 16, borderRadius: 99, background: c }} />)}
          <div style={{ marginLeft: 20, color: "#9aa4af", fontFamily: B.font, fontSize: 22 }}>Terminal — claude</div>
        </div>
        <div style={{ background: "rgba(13,16,20,.94)", padding: "20px 26px", fontFamily: "'DejaVu Sans Mono', monospace", fontSize: 32, lineHeight: 1.5, minHeight: 170 }}>
          {lines.map((t, i) => {
            const n = Math.max(0, Math.floor((l - starts[i]) * speed));
            if (n <= 0) return null;
            const shown = t.slice(0, n);
            const typing = n < t.length;
            return <div key={i} style={{ color: i === 2 ? "#28c840" : i === 1 ? "#ffd400" : "#e6edf3" }}>{shown}{typing && Math.floor(frame / 8) % 2 === 0 ? "▌" : ""}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

// 3 · Paso a paso: tres tarjetas numeradas que entran cuando lo dice
export const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p } = win(frame, 17.2, 24.8, 10, 8);
  if (!on) return null;
  const items: [string, string, number][] = [["1", "COMANDOS", 17.5], ["2", "SKILL", 19.5], ["3", "TERMINAL", 21.7]];
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1120, display: "flex", justifyContent: "center", gap: 18, opacity: p }}>
      {items.map(([n, t, at], i) => {
        const s = spring({ frame: frame - f(at), fps: 30, config: springs.snappy });
        const vis = frame >= f(at);
        return (
          <React.Fragment key={n}>
            <div style={{ opacity: vis ? 1 : 0, transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + 0.1 * s})`, width: 290, background: "#fff", borderRadius: 24, padding: "18px 10px", textAlign: "center", fontFamily: B.font, fontWeight: 700, boxShadow: "0 14px 34px rgba(0,0,0,.35)" }}>
              <div style={{ width: 66, height: 66, margin: "0 auto", borderRadius: 99, background: B.red, color: "#fff", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
              <div style={{ fontSize: 40, color: B.black, marginTop: 8 }}>{t}</div>
            </div>
            {i < 2 && <div style={{ alignSelf: "center", fontSize: 50, color: "#fff", opacity: frame >= f(items[i + 1][2]) ? 1 : 0, ...stroke(50) }}>→</div>}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// 4 · Letras que caen y rebotan
export const FallingWords: React.FC<{ s: number; e: number; text: string; top: number; size?: number; color?: string }> = ({ s, e, text, top, size = 110, color = "#fff" }) => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, s, e, 4, 8);
  if (!on) return null;
  const chars = text.split("");
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top, display: "flex", flexWrap: "wrap", justifyContent: "center", opacity: p, fontFamily: B.font, fontWeight: 700, fontSize: size, color }}>
      {chars.map((c, i) => {
        const k = spring({ frame: l - i * 1.6, fps: 30, config: { damping: 9, stiffness: 160 } });
        return <span key={i} style={{ display: "inline-block", whiteSpace: "pre", transform: `translateY(${(1 - k) * -700}px) rotate(${(1 - k) * (i % 2 ? 25 : -25)}deg)`, ...stroke(size) }}>{c}</span>;
      })}
    </div>
  );
};

// Ráfaga de emojis alrededor de un punto
export const Burst: React.FC<{ s: number; x: number; y: number; emojis: string[]; n?: number; dur?: number }> = ({ s, x, y, emojis, n = 10, dur = 1.6 }) => {
  const frame = useCurrentFrame();
  const l = frame - f(s);
  if (l < 0 || l > f(dur)) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const ang = (i / n) * Math.PI * 2 + (i % 3) * 0.3;
        const dist = 160 + (i % 4) * 70;
        const q = progress(l, 0, 22, ease.out);
        const o = 1 - progress(l, f(dur) - 12, 12);
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(ang) * dist * q - 40, top: y + Math.sin(ang) * dist * q - 40 + l * 1.2, fontFamily: EMOJI, fontSize: 64 + (i % 3) * 18, opacity: o, transform: `rotate(${(i % 2 ? 1 : -1) * l * 3}deg) scale(${0.6 + 0.4 * q})` }}>{emojis[i % emojis.length]}</div>;
      })}
    </>
  );
};

// Lluvia de emojis por toda la pantalla
export const EmojiRain: React.FC<{ s: number; e: number; emojis: string[] }> = ({ s, e, emojis }) => {
  const frame = useCurrentFrame();
  const l = frame - f(s);
  if (l < 0 || frame >= f(e)) return null;
  return (
    <>
      {Array.from({ length: 26 }).map((_, i) => {
        const x = i % 2 ? 30 + ((i * 97) % 220) : 800 + ((i * 89) % 200); // solo por los lados, sin tapar la cara
        const delay = (i * 7) % 40;
        const speed = 22 + ((i * 13) % 14);
        const y = (l - delay) * speed - 150;
        if (l < delay) return null;
        return <div key={i} style={{ position: "absolute", left: x, top: y, fontFamily: EMOJI, fontSize: 60 + ((i * 11) % 40), transform: `rotate(${(l * (i % 2 ? 4 : -4)) % 360}deg)` }}>{emojis[i % emojis.length]}</div>;
      })}
    </>
  );
};

// 5 · Titular que cae desde arriba cuando señala arriba
export const NewsDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 28.8, 33.3, 1, 8);
  if (!on) return null;
  const d = spring({ frame: l, fps: 30, config: { damping: 11, stiffness: 140 } });
  const blink = Math.floor(frame / 10) % 2 ? 0.35 : 1;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 285, opacity: p, transform: `translateY(${(1 - d) * -500}px) rotate(${(1 - d) * -6}deg)` }}>
      <div style={{ background: "#fff", border: `6px solid ${B.black}`, borderRadius: 18, padding: "18px 28px", fontFamily: B.font, boxShadow: "0 18px 40px rgba(0,0,0,.45)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 18, height: 18, borderRadius: 99, background: B.red, opacity: blink }} />
          <div style={{ fontWeight: 700, fontSize: 36, color: B.red, letterSpacing: ".06em" }}>ÚLTIMA HORA</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 52, color: B.black, lineHeight: 1.08, marginTop: 6 }}>Una IA ya edita vídeos sola desde el terminal</div>
      </div>
    </div>
  );
};

// 6 · Panel que se baja desde arriba ("tirar de aquí") con una gráfica que crece
export const PullDown: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 33.4, 37.0, 1, 8);
  if (!on) return null;
  const drop = progress(l, 2, 16, ease.out);
  const bars = [0.25, 0.4, 0.55, 0.8, 1];
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 0, height: 560 * drop, overflow: "hidden", opacity: p }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 560, background: "rgba(20,24,30,.92)", borderRadius: "0 0 30px 30px", padding: "300px 40px 30px", boxSizing: "border-box", boxShadow: "0 20px 50px rgba(0,0,0,.5)" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 22, height: 170 }}>
          {bars.map((h, i) => {
            const g = progress(l, 16 + i * 4, 14);
            return <div key={i} style={{ flex: 1, height: 170 * h * g, background: i === 4 ? B.yellow : "#5b6b7c", borderRadius: 10 }} />;
          })}
        </div>
        <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center", width: 80, height: 8, margin: "0 auto", background: "#fff", borderRadius: 9, opacity: 0.6 }} />
      </div>
    </div>
  );
};

// 7 · Encuesta para comentar
export const Poll: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 36.9, 41.1, 10, 8);
  if (!on) return null;
  const tap = progress(l, 55, 8);
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: 1110, opacity: p, transform: `scale(${0.94 + 0.06 * p}) rotate(-2deg)`, background: "#fff", borderRadius: 30, padding: "22px 26px", fontFamily: B.font, boxShadow: "0 18px 44px rgba(0,0,0,.4)" }}>
      <div style={{ fontWeight: 700, fontSize: 42, color: B.black, textAlign: "center" }}>¿Te lo enseño paso a paso?</div>
      <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
        {[["A", "SÍ, YA"], ["B", "MÁS TARDE"]].map(([k, t], i) => (
          <div key={k} style={{ flex: 1, padding: "16px 0", borderRadius: 18, textAlign: "center", fontWeight: 700, fontSize: 36, background: i === 0 ? `rgba(225,6,0,${0.1 + 0.9 * tap})` : "#eef0f2", color: i === 0 && tap > 0.5 ? "#fff" : B.black }}>{k} · {t}</div>
        ))}
      </div>
      <div style={{ textAlign: "center", fontWeight: 600, fontSize: 30, color: "#6b7280", marginTop: 10 }}>Responde en comentarios 👇</div>
    </div>
  );
};

// 8 · Contador grande
export const BigCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 41.2, 45.4, 6, 8);
  if (!on) return null;
  const v = Math.round(interpolate(l, [4, 50], [0, 10000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out }));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1120, textAlign: "center", opacity: p, fontFamily: B.font, fontWeight: 700 }}>
      <div style={{ fontSize: 190, color: B.yellow, lineHeight: 1, ...stroke(190) }}>+{v.toLocaleString("es-ES")}</div>
      <div style={{ fontSize: 70, color: "#fff", ...stroke(70) }}>COSAS QUE PUEDE HACER</div>
    </div>
  );
};

// 9 · Red de funciones conectadas a Claude Code
export const Network: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 47.2, 56.9, 12, 10);
  if (!on) return null;
  const cx = 540, cy = 1190;
  const nodes: [string, number, number][] = [["🎬 Vídeos", -330, -150], ["✂️ Cortes", 330, -150], ["✨ Animaciones", -360, 30], ["🖼️ Carruseles", 360, 30], ["📁 Drive", -280, 190], ["🐙 GitHub", 280, 190]];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {nodes.map(([, dx, dy], i) => {
          const q = progress(l, 20 + i * 10, 14);
          return <line key={i} x1={cx} y1={cy} x2={cx + dx * q} y2={cy + dy * q} stroke="#ffd400" strokeWidth={6} strokeDasharray="14 10" strokeDashoffset={-l * 2} />;
        })}
      </svg>
      <div style={{ position: "absolute", left: cx - 190, top: cy - 50, width: 380, height: 100, borderRadius: 99, background: "#d97757", color: "#fff", fontFamily: B.font, fontWeight: 700, fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 ${30 + 20 * Math.sin(l / 6)}px rgba(217,119,87,.9)` }}>Claude Code</div>
      {nodes.map(([t, dx, dy], i) => {
        const s = spring({ frame: l - 30 - i * 10, fps: 30, config: springs.snappy });
        return <div key={t} style={{ position: "absolute", left: cx + dx - 150, top: cy + dy - 36, width: 300, height: 72, borderRadius: 99, background: "#fff", fontFamily: `${B.font}, ${EMOJI}`, fontWeight: 700, fontSize: 34, color: B.black, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${s})`, boxShadow: "0 10px 26px rgba(0,0,0,.35)" }}>{t}</div>;
      })}
    </div>
  );
};

// 10 · Señal "mira aquí" donde levanta la mano
export const LookHere: React.FC<{ s: number; e: number; x: number; y: number; label: string }> = ({ s, e, x, y, label }) => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, s, e, 8, 8);
  if (!on) return null;
  const ring = (l % 24) / 24;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: p }}>
      <div style={{ position: "absolute", left: -90, top: -90, width: 180, height: 180, borderRadius: 999, border: "8px solid #ffd400", transform: `scale(${0.6 + ring * 0.8})`, opacity: 1 - ring }} />
      <div style={{ position: "absolute", left: -60, top: -60, width: 120, height: 120, borderRadius: 999, border: "6px solid #ffd400" }} />
      <div style={{ position: "absolute", left: 80, top: -40, whiteSpace: "nowrap", background: "#ffd400", color: B.black, fontFamily: `${B.font}, ${EMOJI}`, fontWeight: 700, fontSize: 44, padding: "10px 24px", borderRadius: 16, transform: `rotate(-4deg) scale(${spring({ frame: l - 4, fps: 30, config: springs.bouncy })})` }}>{label}</div>
    </div>
  );
};

// 11 · Lista de tareas que sale por el lado al que señala
export const TaskList: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 61.8, 68.9, 12, 8);
  if (!on) return null;
  const items: [string, number][] = [["Lunes · 2 reels", 63.0], ["Martes · carrusel", 64.0], ["Miércoles · 3 reels", 65.0], ["Semana 44 guardada", 66.3]];
  return (
    <div style={{ position: "absolute", right: 40, top: 760, width: 470, opacity: p, transform: `translateX(${(1 - p) * 300}px) rotate(${(1 - p) * 8}deg)`, background: "#fff", borderRadius: 26, padding: "22px 26px", fontFamily: B.font, boxShadow: "0 20px 44px rgba(0,0,0,.45)" }}>
      <div style={{ fontWeight: 700, fontSize: 30, color: B.red, letterSpacing: ".06em" }}>TAREAS · SEMANA 44</div>
      {items.map(([t, at]) => {
        const q = progress(frame, f(at), 10);
        return (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: q > 0.5 ? "#1a9b4b" : "#e5e7eb", color: "#fff", fontSize: 28, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.85 + 0.15 * q})` }}>{q > 0.5 ? "✓" : ""}</div>
            <div style={{ fontWeight: 700, fontSize: 32, color: B.black }}>{t}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: -46, top: 120, fontSize: 70, ...stroke(70), color: "#fff", transform: `translateX(${Math.sin(l / 5) * 8}px)` }}>←</div>
    </div>
  );
};

// 12 · Me gusta + comentario
export const LikeComment: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 79.5, 82.9, 6, 8);
  if (!on) return null;
  const h = spring({ frame: l, fps: 30, config: { damping: 7, stiffness: 180 } });
  const c = spring({ frame: l - 30, fps: 30, config: { damping: 8, stiffness: 180 } });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1100, display: "flex", justifyContent: "center", gap: 60, opacity: p, fontFamily: EMOJI }}>
      <div style={{ fontSize: 200, transform: `scale(${h})` }}>❤️</div>
      <div style={{ fontSize: 200, transform: `scale(${c})` }}>💬</div>
    </div>
  );
};

// 13 · Avión de papel: "envíalo a un amigo"
export const Share: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 82.9, 86.7, 8, 8);
  if (!on) return null;
  const t = progress(l, 6, 50, ease.inOut);
  const x = interpolate(t, [0, 1], [-150, 1150]);
  const y = 1150 - Math.sin(t * Math.PI) * 220;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: p }}>
      <div style={{ position: "absolute", left: x, top: y, fontFamily: EMOJI, fontSize: 130, transform: `rotate(${-20 + t * 30}deg)` }}>✈️</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330, display: "flex", justifyContent: "center" }}>
        <div style={{ background: "#fff", color: B.black, fontFamily: `${B.font}, ${EMOJI}`, fontWeight: 700, fontSize: 48, padding: "14px 34px", borderRadius: 99, boxShadow: "0 12px 30px rgba(0,0,0,.35)" }}>📲 Envíaselo a ese amigo</div>
      </div>
    </div>
  );
};

// 14 · Caja de comentario estilo Instagram escribiendo "LO QUIERO" + respuesta por privado
export const CommentBox: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 86.8, 97.3, 12, 8);
  if (!on) return null;
  const msg = "LO QUIERO 🔥";
  const n = Math.max(0, Math.min(msg.length, Math.floor((l - 15) / 3)));
  const sent = l > 15 + msg.length * 3 + 12;
  const dm = spring({ frame: l - f(4.8), fps: 30, config: springs.snappy });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1060, opacity: p, fontFamily: `${B.font}, ${EMOJI}` }}>
      <div style={{ background: "#fff", borderRadius: 26, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 16px 40px rgba(0,0,0,.4)" }}>
        <div style={{ width: 70, height: 70, borderRadius: 99, background: "linear-gradient(135deg,#feda75,#d62976,#4f5bd5)" }} />
        <div style={{ flex: 1, fontSize: 44, fontWeight: 700, color: n ? B.black : "#9ca3af" }}>{n ? msg.slice(0, n) : "Añade un comentario…"}{!sent && Math.floor(frame / 8) % 2 ? "|" : ""}</div>
        <div style={{ fontSize: 38, fontWeight: 700, color: sent ? "#9ca3af" : "#0095f6" }}>{sent ? "Enviado" : "Publicar"}</div>
      </div>
      {l > f(4.8) && (
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16, transform: `translateY(${(1 - dm) * 40}px)`, opacity: dm }}>
          <Img src={staticFile("local/avatar.jpg")} style={{ width: 76, height: 76, borderRadius: 99, border: "3px solid #fff" }} />
          <div style={{ background: "linear-gradient(135deg,#7b2ff7,#f107a3)", color: "#fff", borderRadius: 26, padding: "16px 26px", fontSize: 40, fontWeight: 700, boxShadow: "0 12px 30px rgba(0,0,0,.35)" }}>Te mando el tutorial gratis 📩</div>
        </div>
      )}
    </div>
  );
};

// 15 · Botón de seguir con avatar, nombre y verificado
export const Follow: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 97.3, 99.7, 8, 6);
  if (!on) return null;
  const pressed = l > 30;
  const press = pressed ? 0.94 + 0.06 * progress(l, 30, 6) : 1;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1160, display: "flex", justifyContent: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, background: "#fff", borderRadius: 99, padding: "14px 16px 14px 14px", boxShadow: "0 16px 40px rgba(0,0,0,.4)", fontFamily: B.font }}>
        <Img src={staticFile("local/avatar.jpg")} style={{ width: 90, height: 90, borderRadius: 99 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 40, color: B.black, display: "flex", alignItems: "center", gap: 8 }}>Breno
            <svg width="34" height="34" viewBox="0 0 24 24"><path fill="#1d9bf0" d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" /></svg>
          </div>
          <div style={{ fontSize: 30, color: "#6b7280" }}>@brenol.h</div>
        </div>
        <div style={{ marginLeft: 10, background: pressed ? "#eef0f2" : "#0095f6", color: pressed ? B.black : "#fff", fontWeight: 700, fontSize: 38, padding: "18px 34px", borderRadius: 18, transform: `scale(${press})` }}>{pressed ? "Siguiendo" : "Seguir"}</div>
      </div>
    </div>
  );
};

// 16 · CTA final que late
export const FinalCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { on, p, l } = win(frame, 99.7, 106.3, 8, 1);
  if (!on) return null;
  const beat = 1 + 0.04 * Math.max(0, Math.sin(l / 4.5));
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1060, opacity: p, transform: `scale(${beat})`, background: B.red, borderRadius: 30, padding: "24px 20px", textAlign: "center", fontFamily: `${B.font}, ${EMOJI}`, color: "#fff", boxShadow: "0 18px 44px rgba(0,0,0,.45)" }}>
      <div style={{ fontWeight: 700, fontSize: 44 }}>COMENTA</div>
      <div style={{ fontWeight: 700, fontSize: 110, lineHeight: 1.05 }}>«LO QUIERO»</div>
      <div style={{ fontWeight: 600, fontSize: 36, opacity: 0.95 }}>y te mando el tutorial gratis 👇</div>
    </div>
  );
};
