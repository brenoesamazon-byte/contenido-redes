import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease, progress } from "../../lib/motion";
import { B, f, FPS, useWindow } from "./shared";
import { DATA } from "./nov2data";

// 2 nov 2026 · tres vídeos: noticia Google (pantalla partida), pódcast huchas (Reto 10K) y ayudante gratis (Reto 10K).

type Seg = { start: number; end: number; text: string };
type Chunk = { start: number; end: number; words: string[] };

const toChunks = (segs: readonly Seg[]): Chunk[] => {
  const out: Chunk[] = [];
  for (const s of segs) {
    const words = s.text.toUpperCase().replace(/[.,:;«»¿?¡!]/g, "").split(/\s+/).filter(Boolean);
    const groups: string[][] = [];
    let cur: string[] = [];
    for (const w of words) {
      cur.push(w);
      const len = cur.join(" ").length;
      if (cur.length >= 4 || (cur.length >= 2 && len > 14)) { groups.push(cur); cur = []; }
    }
    if (cur.length) { if (cur.length === 1 && groups.length && groups[groups.length - 1].length < 4) groups[groups.length - 1].push(...cur); else groups.push(cur); }
    const total = groups.reduce((a, g) => a + g.join(" ").length + 2, 0);
    let t = s.start;
    for (const g of groups) {
      const d = ((g.join(" ").length + 2) / total) * (s.end - s.start);
      out.push({ start: t, end: t + d, words: g });
      t += d;
    }
  }
  return out;
};

const clean = (w: string) => w.replace(/[^A-ZÁÉÍÓÚÑÜ0-9%]/g, "");

const Subs: React.FC<{ chunks: Chunk[]; keywords: string[]; y: (t: number) => number; hide?: (t: number) => boolean; size?: number }> = ({ chunks, keywords, y, hide, size = 84 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const c = chunks.find((k) => t >= k.start && t < k.end);
  if (!c || (hide && hide(t))) return null;
  const local = frame - f(c.start);
  const s = interpolate(local, [0, 3], [0.88, 1], { extrapolateRight: "clamp", easing: ease.out });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: y(t), display: "flex", justifyContent: "center" }}>
      <div style={{ transform: `scale(${s})`, textAlign: "center", fontFamily: B.font, fontWeight: 700, fontSize: size, lineHeight: 1.08, color: B.white, WebkitTextStroke: `${size * 0.09}px #000`, paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,.35)" }}>
        {c.words.map((w, i) => (
          <span key={i} style={{ color: keywords.includes(clean(w)) ? B.yellow : B.white }}>{w}{i < c.words.length - 1 ? " " : ""}</span>
        ))}
      </div>
    </div>
  );
};

const Base: React.FC<{ src: string; split?: boolean; offsetY?: number }> = ({ src, split, offsetY = 300 }) => (
  <AbsoluteFill>
    {split ? (
      <div style={{ position: "absolute", left: 0, top: 960, width: 1080, height: 960, overflow: "hidden" }}>
        <OffthreadVideo src={staticFile(src)} style={{ position: "absolute", left: 0, top: -offsetY, width: 1080, height: 1920 }} />
      </div>
    ) : (
      <OffthreadVideo src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    )}
  </AbsoluteFill>
);

// Franja roja del gancho (solo vídeos Reto 10K)
const HookBar: React.FC<{ l1: string; l2: string; top?: number; end?: number }> = ({ l1, l2, top = 1215, end = 6.2 }) => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(0.1, end, 10, 8);
  if (!visible) return null;
  const sweep = progress(frame, f(0.1), 9, ease.out);
  const a = progress(frame, f(0.1) + 6, 10);
  const b = progress(frame, f(0.1) + 10, 12);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, height: 210, opacity: p }}>
      <div style={{ position: "absolute", inset: 0, background: B.red, transformOrigin: "left center", transform: `scaleX(${sweep})`, boxShadow: "0 10px 30px rgba(0,0,0,.3)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontFamily: B.font, fontWeight: 700, color: B.white, textTransform: "uppercase" }}>
        <div style={{ fontSize: 48, letterSpacing: "0.04em", opacity: a, transform: `translateY(${(1 - a) * 14}px)` }}>{l1}</div>
        <div style={{ fontSize: 84, lineHeight: 1.05, opacity: b, transform: `translateY(${(1 - b) * 18}px)` }}>{l2}</div>
      </div>
    </div>
  );
};

const RetoTag: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const p = progress(frame, 4, 14);
  return (
    <div style={{ position: "absolute", top: 300, right: 48, opacity: p, transform: `translateX(${(1 - p) * 40}px)`, background: B.orange, color: B.white, fontFamily: B.font, fontWeight: 700, fontSize: 38, padding: "12px 28px", borderRadius: 999, boxShadow: "0 6px 18px rgba(0,0,0,.25)" }}>
      {text}
    </div>
  );
};

// Tarjeta paso / dato (lower third)
const Card: React.FC<{ start: number; end: number; num?: string; title: string; sub?: string; top?: number }> = ({ start, end, num, title, sub, top = 1210 }) => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(start, end, 10, 8);
  if (!visible) return null;
  const bar = progress(frame, f(start), 10, ease.out);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, opacity: p, fontFamily: B.font, display: "flex", transform: `translateX(${(1 - bar) * -70}px)` }}>
      {num && (
        <div style={{ width: 128, background: B.red, color: B.white, fontWeight: 700, fontSize: 84, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "16px 0 0 16px" }}>{num}</div>
      )}
      <div style={{ background: "rgba(15,20,25,.9)", padding: "18px 30px", borderRadius: num ? "0 16px 16px 0" : 16, borderLeft: num ? "none" : `12px solid ${B.red}` }}>
        <div style={{ fontWeight: 700, fontSize: 56, color: B.white, lineHeight: 1.08 }}>{title}</div>
        {sub && <div style={{ fontWeight: 500, fontSize: 34, color: "#cfd6dd", marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
};

const Sfx: React.FC<{ at: number; src: string; v?: number }> = ({ at, src, v = 0.4 }) => (
  <Sequence from={f(at)} durationInFrames={30}><Audio src={staticFile(src)} volume={v} /></Sequence>
);

const Divider: React.FC = () => <div style={{ position: "absolute", left: 0, right: 0, top: 954, height: 12, background: B.red, boxShadow: "0 0 18px rgba(0,0,0,.35)" }} />;

/* ───────────── VÍDEO 1 · NOTICIA GOOGLE (pantalla partida) ───────────── */
const V1 = DATA.v1;
const SPLIT1_END = 19.9;
const C1 = toChunks(V1.segments as unknown as Seg[]);
const K1 = ["GOOGLE", "ADMITIR", "ENCONTRAR", "12", "20", "PLANO", "CHATGPT", "CLAUDE", "FALLO", "TEMAS", "PREGUNTAS", "REVÉS", "5", "BAR", "VÍDEO", "FRASE", "EXACTA", "PUBLICA"];

const NewsCardTop: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(0.1, 5.6, 12, 8);
  if (!visible) return null;
  const head = progress(frame, f(0.1) + 6, 14);
  const blink = Math.floor(frame / 12) % 2 === 0 ? 1 : 0.35;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 600, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ background: B.white, border: `6px solid ${B.black}`, borderRadius: 18, padding: "22px 32px", boxShadow: "0 18px 40px rgba(0,0,0,.35)", fontFamily: B.font }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 20, height: 20, borderRadius: 99, background: B.red, opacity: blink }} />
          <div style={{ fontWeight: 700, fontSize: 38, color: B.red, letterSpacing: "0.06em" }}>ÚLTIMA HORA</div>
        </div>
        <div style={{ marginTop: 8, fontWeight: 700, fontSize: 64, lineHeight: 1.06, color: B.black, opacity: head, transform: `translateY(${(1 - head) * 16}px)` }}>
          GOOGLE LO ADMITE<br />YA NO TE BUSCAN ASÍ
        </div>
      </div>
    </div>
  );
};

// Arriba: la grabación real del artículo de Social Media Today
const ArticleTop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const z = interpolate(frame, [0, f(SPLIT1_END)], [1.0, 1.06]);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 960, overflow: "hidden", background: "#fff" }}>
      <Sequence from={0} durationInFrames={f(16)}>
        <OffthreadVideo src={staticFile("local/sr.mp4")} playbackRate={0.72} muted style={{ position: "absolute", left: 0, top: -150, width: 1080, height: 2346, transform: `scale(${z})`, transformOrigin: "50% 20%" }} />
      </Sequence>
      {t >= 16 && <ChatAsk />}
      <div style={{ position: "absolute", left: 24, bottom: 22, background: "rgba(15,20,25,.82)", color: "#fff", fontFamily: B.font, fontWeight: 600, fontSize: 26, padding: "8px 16px", borderRadius: 10 }}>
        Fuente: Social Media Today · Andrew Hutchinson · 1 nov 2026
      </div>
    </div>
  );
};

// Datos 19 % → 17 % → 12 % encima del artículo
const Stats: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(6.4, 15.9, 10, 8);
  if (!visible) return null;
  const items = [
    { q: "1T", v: "+19 %", at: 6.6 },
    { q: "2T", v: "+17 %", at: 8.2 },
    { q: "3T", v: "+12 %", at: 9.6 },
  ];
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 470, opacity: p, display: "flex", gap: 22, justifyContent: "center", fontFamily: B.font }}>
      {items.map((it, i) => {
        const a = progress(frame, f(it.at), 10, ease.out);
        const last = i === 2;
        return (
          <div key={i} style={{ flex: 1, background: last ? B.red : B.white, border: `5px solid ${B.black}`, borderRadius: 18, padding: "18px 10px", textAlign: "center", opacity: a, transform: `translateY(${(1 - a) * 30}px) scale(${0.9 + a * 0.1})`, boxShadow: "0 14px 30px rgba(0,0,0,.3)" }}>
            <div style={{ fontWeight: 600, fontSize: 32, color: last ? "#ffe1df" : "#5b6372" }}>Búsquedas {it.q}</div>
            <div style={{ fontWeight: 700, fontSize: 76, color: last ? B.white : B.black }}>{it.v}</div>
          </div>
        );
      })}
    </div>
  );
};

// La gente ya pregunta a la IA
const ChatAsk: React.FC = () => {
  const frame = useCurrentFrame();
  const a = progress(frame, f(16.1), 12);
  const b = progress(frame, f(17.3), 12);
  const typed = "¿Cómo consigo mis primeros clientes sin anuncios?";
  const n = Math.floor(interpolate(frame, [f(16.2), f(17.6)], [0, typed.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  return (
    <AbsoluteFill style={{ background: "#f3f1ec", fontFamily: B.font, alignItems: "center", justifyContent: "center", gap: 30 }}>
      <div style={{ display: "flex", gap: 18, opacity: a }}>
        {["ChatGPT", "Claude"].map((x) => (
          <div key={x} style={{ background: B.black, color: B.white, fontWeight: 700, fontSize: 40, padding: "12px 28px", borderRadius: 999 }}>{x}</div>
        ))}
      </div>
      <div style={{ width: 900, background: B.white, borderRadius: 30, padding: "30px 36px", boxShadow: "0 16px 40px rgba(0,0,0,.15)", opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>
        <div style={{ fontSize: 30, color: "#8a8794", fontWeight: 600 }}>Pregunta</div>
        <div style={{ fontSize: 50, fontWeight: 700, color: B.black, lineHeight: 1.15 }}>{typed.slice(0, n)}<span style={{ opacity: Math.floor(frame / 8) % 2 ? 1 : 0 }}>|</span></div>
      </div>
      <div style={{ fontSize: 44, fontWeight: 700, color: B.red, opacity: b }}>La gente ya no busca: pregunta</div>
    </AbsoluteFill>
  );
};

export const N1Noticia: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const split = t < SPLIT1_END;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Base src="local/n1.mp4" split={split} offsetY={380} />
      {split && <><ArticleTop /><Divider /><Stats /></>}
      <NewsCardTop />
      <Card start={33.5} end={36.9} num="1" title="Apunta 5 preguntas" sub="las que siempre te hacen" />
      <Card start={36.9} end={41.35} num="2" title="Con sus palabras" sub="tal cual, de barra de bar" />
      <Card start={41.4} end={46.3} num="3" title="1 vídeo por pregunta" sub="respóndela en la primera frase" />
      <Subs chunks={C1} keywords={K1} y={(x) => (x < SPLIT1_END ? 1690 : (x >= 33.5 && x < 46.3) ? 1500 : 1460)} hide={(x) => x < 5.6} />
      <Sfx at={0.1} src="sfx/interface/select_008.ogg" v={0.45} />
      <Sfx at={6.6} src="sfx/ui/switch3.ogg" />
      <Sfx at={8.2} src="sfx/ui/switch3.ogg" />
      <Sfx at={9.6} src="sfx/ui/switch3.ogg" />
      <Sfx at={16.1} src="sfx/interface/click_002.ogg" />
      <Sfx at={SPLIT1_END} src="sfx/interface/drop_002.ogg" v={0.35} />
      <Sfx at={33.5} src="sfx/ui/switch3.ogg" />
      <Sfx at={36.9} src="sfx/ui/switch3.ogg" />
      <Sfx at={41.4} src="sfx/ui/switch3.ogg" />
    </AbsoluteFill>
  );
};
export const N1_TOTAL = V1.total;

/* ───────────── VÍDEO 2 · PÓDCAST HUCHAS (Reto 10K) ───────────── */
const V2 = DATA.v2;
const C2 = toChunks(V2.segments as unknown as Seg[]);
const K2 = ["CINCO", "HIJO", "RICHARD", "GRACIA", "VERDAD", "5", "EUROS", "3", "HUCHAS", "EURO", "DOS", "TRANSPARENTE", "TOCA", "MÁS", "PRIMERO", "EDUCACIÓN", "FINANCIERA", "SEGUNDO", "ESFUERZO", "TERCERO", "MIEDO", "INVERTIR", "40", "AÑOS", "FONDO", "INDEXADO", "PRÁCTICA", "COMENTARIOS"];
const RICH = [4.1, 7.9];
const HUCHAS = [11.4, 32.7];

const RichardTop: React.FC = () => {
  const frame = useCurrentFrame();
  const a = progress(frame, f(RICH[0]), 10);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 960, overflow: "hidden", background: "#111" }}>
      <Sequence from={f(RICH[0])} durationInFrames={f(RICH[1] - RICH[0])}>
        <OffthreadVideo src={staticFile("local/richard.mp4")} muted style={{ position: "absolute", left: 0, top: -250, width: 1080, height: 2385 }} />
      </Sequence>
      <div style={{ position: "absolute", left: 40, bottom: 40, display: "flex", alignItems: "center", gap: 14, background: B.white, borderRadius: 999, padding: "12px 28px 12px 16px", fontFamily: B.font, opacity: a, transform: `translateX(${(1 - a) * -40}px)` }}>
        <div style={{ width: 22, height: 22, borderRadius: 99, background: B.red }} />
        <div style={{ fontWeight: 700, fontSize: 40, color: B.black }}>Idea de @richard_gracia</div>
      </div>
    </div>
  );
};

const Jar: React.FC<{ at: number; amount: string; label: string; glass?: boolean; extra?: number }> = ({ at, amount, label, glass, extra }) => {
  const frame = useCurrentFrame();
  const a = progress(frame, f(at), 12, ease.out);
  const plus = extra !== undefined ? progress(frame, f(extra), 10, ease.out) : 0;
  return (
    <div style={{ width: 300, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: a, transform: `translateY(${(1 - a) * 60}px) scale(${0.85 + 0.15 * a})` }}>
      <div style={{ position: "relative", width: 250, height: 330, borderRadius: "40px 40px 70px 70px", background: glass ? "rgba(190,225,255,.35)" : B.orange, border: `7px solid ${glass ? "#9cc7e8" : "#b23f1e"}`, boxShadow: "0 18px 40px rgba(0,0,0,.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: -30, width: 150, height: 34, borderRadius: 10, background: "#4a4f57" }} />
        {glass && <div style={{ position: "absolute", bottom: 20, left: 30, right: 30, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>{Array.from({ length: plus > 0.5 ? 10 : 8 }).map((_, i) => <div key={i} style={{ width: 40, height: 40, borderRadius: 99, background: "#f2c230", border: "4px solid #c79a10" }} />)}</div>}
        <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 84, color: glass ? B.black : B.white, zIndex: 2, marginTop: glass ? -120 : 0 }}>{amount}</div>
        {extra !== undefined && (
          <div style={{ position: "absolute", top: -90, right: -40, background: B.red, color: B.white, fontFamily: B.font, fontWeight: 700, fontSize: 56, padding: "8px 22px", borderRadius: 999, opacity: plus, transform: `scale(${0.6 + plus * 0.4}) rotate(-6deg)` }}>+2 €</div>
        )}
      </div>
      <div style={{ fontFamily: B.font, fontWeight: 700, fontSize: 40, color: B.black, textAlign: "center", lineHeight: 1.1 }}>{label}</div>
    </div>
  );
};

const HuchasTop: React.FC = () => {
  const frame = useCurrentFrame();
  const h = progress(frame, f(HUCHAS[0]), 10);
  return (
    <AbsoluteFill style={{ height: 960, background: "#f3f1ec", fontFamily: B.font }}>
      <div style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontWeight: 700, fontSize: 60, color: B.black, opacity: h }}>
        <span style={{ color: B.red }}>5 €</span> a la semana · 3 huchas
      </div>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 40 }}>
        <Jar at={15.7} amount="1 €" label={"Para dar\na quien lo necesita"} />
        <Jar at={20.05} amount="2 €" label="Para gastar" />
        <Jar at={23.7} amount="2 €" label="No se toca" glass extra={29.6} />
      </div>
    </AbsoluteFill>
  );
};

export const N2Podcast: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const inRich = t >= RICH[0] && t < RICH[1];
  const inH = t >= HUCHAS[0] && t < HUCHAS[1];
  const split = inRich || inH;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Base src="local/n2.mp4" split={split} offsetY={380} />
      {inRich && <RichardTop />}
      {inH && <HuchasTop />}
      {split && <Divider />}
      <HookBar l1="Tu hijo con 5 años" l2="Tres huchas" top={1235} end={4.08} />
      {!split && <RetoTag text="RETO 10K · DÍA 21" />}
      <Card start={34.05} end={37.1} num="1" title="Educación financiera" />
      <Card start={37.1} end={45.0} num="2" title="Su propio esfuerzo" sub="y ayudar a los demás" />
      <Card start={45.0} end={51.1} num="3" title="Sin miedo a invertir" />
      <Card start={57.85} end={66.2} title="¿Lo has intentado?" sub="Cuéntamelo en comentarios" />
      <Subs chunks={C2} keywords={K2} y={(x) => (split ? 1690 : x < 4.1 ? 1480 : (x >= 34 && x < 51.1) || x >= 57.85 ? 1500 : 1450)} />
      <Sfx at={0.1} src="sfx/interface/drop_002.ogg" v={0.5} />
      <Sfx at={RICH[0]} src="sfx/interface/click_002.ogg" />
      <Sfx at={HUCHAS[0]} src="sfx/interface/click_002.ogg" />
      <Sfx at={15.7} src="sfx/ui/switch3.ogg" />
      <Sfx at={20.05} src="sfx/ui/switch3.ogg" />
      <Sfx at={23.7} src="sfx/ui/switch3.ogg" />
      <Sfx at={29.6} src="sfx/interface/bong_001.ogg" v={0.35} />
      <Sfx at={34.05} src="sfx/ui/switch3.ogg" />
      <Sfx at={37.1} src="sfx/ui/switch3.ogg" />
      <Sfx at={45.0} src="sfx/ui/switch3.ogg" />
    </AbsoluteFill>
  );
};
export const N2_TOTAL = V2.total;

/* ───────────── VÍDEO 3 · AYUDANTE GRATIS (Reto 10K) ───────────── */
const V3 = DATA.v3;
const C3 = toChunks(V3.segments as unknown as Seg[]);
const K3 = ["AYUDANTE", "GRATIS", "USANDO", "CLAUDE", "3000", "QUIERO", "PROGRAMAR", "HIJOS", "ORGANIZADO", "CÓDIGO", "TAREA", "TIEMPO", "TRES", "UNO", "DOS", "SEMANA", "NUEVO", "SOLA", "PROMPT", "MÍO"];

const Comments: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(8.0, 15.4, 10, 8);
  if (!visible) return null;
  const list = [
    { at: 8.1, u: "@laura.emprende", t: "Lo quiero" },
    { at: 9.0, u: "@davidmarketing", t: "Lo quiero!!" },
    { at: 12.5, u: "@nuria_online", t: "¿Sirve sin saber programar?" },
    { at: 13.4, u: "@javi.negocio", t: "Lo quiero, pásamelo" },
  ];
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1090, opacity: p, display: "flex", flexDirection: "column", gap: 14, fontFamily: B.font }}>
      {list.map((c, i) => {
        const a = progress(frame, f(c.at), 9, ease.out);
        return (
          <div key={i} style={{ alignSelf: i % 2 ? "flex-end" : "flex-start", background: B.white, borderRadius: 24, padding: "14px 24px", boxShadow: "0 10px 24px rgba(0,0,0,.28)", opacity: a, transform: `translateY(${(1 - a) * 24}px) scale(${0.9 + a * 0.1})` }}>
            <div style={{ fontWeight: 600, fontSize: 26, color: "#8a8794" }}>{c.u}</div>
            <div style={{ fontWeight: 700, fontSize: 42, color: B.black }}>{c.t}</div>
          </div>
        );
      })}
    </div>
  );
};

const Cta: React.FC<{ start: number; end: number; word: string }> = ({ start, end, word }) => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(start, end, 10, 6);
  if (!visible) return null;
  const pulse = 1 + 0.03 * Math.sin((frame - f(start)) / 4);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ background: B.white, border: `6px solid ${B.black}`, borderRadius: 22, padding: "18px 40px", fontFamily: B.font, textAlign: "center", transform: `scale(${pulse * (0.85 + 0.15 * p)})`, boxShadow: "0 18px 40px rgba(0,0,0,.35)" }}>
        <div style={{ fontWeight: 700, fontSize: 40, color: "#5b6372" }}>COMENTA</div>
        <div style={{ fontWeight: 700, fontSize: 104, color: B.red, lineHeight: 1 }}>{word}</div>
        <div style={{ fontWeight: 600, fontSize: 32, color: B.black, marginTop: 6 }}>y te mando el mío</div>
      </div>
    </div>
  );
};

export const N3Ayudante: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cards = (t >= 30.1 && t < 50.95) || (t >= 8 && t < 15.4) || t >= 52.2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Base src="local/n3.mp4" />
      <HookBar l1="Ayudante gratis" l2="No lo estás usando" top={1235} />
      <RetoTag text="RETO 10K · DÍA 21" />
      <Comments />
      <Card start={30.1} end={38.05} num="1" title="Elige 1 tarea" sub="la que repites cada semana" />
      <Card start={38.1} end={44.9} num="2" title="Explícasela a Claude" sub="qué recibe · qué hace · qué entrega" />
      <Card start={44.94} end={50.95} num="3" title="Revisa y corrige 1 vez" sub="a la segunda ya va sola" />
      <Cta start={52.2} end={58.86} word="PROMPT" />
      <Subs chunks={C3} keywords={K3} y={(x) => (x < 6.2 ? 1480 : (x >= 8 && x < 15.4) || x >= 52.2 ? 1600 : cards ? 1520 : 1450)} />
      <Sfx at={0.1} src="sfx/interface/drop_002.ogg" v={0.5} />
      <Sfx at={8.1} src="sfx/interface/click_002.ogg" />
      <Sfx at={12.5} src="sfx/interface/click_002.ogg" />
      <Sfx at={30.1} src="sfx/ui/switch3.ogg" />
      <Sfx at={38.1} src="sfx/ui/switch3.ogg" />
      <Sfx at={44.94} src="sfx/ui/switch3.ogg" />
      <Sfx at={52.2} src="sfx/interface/bong_001.ogg" v={0.35} />
    </AbsoluteFill>
  );
};
export const N3_TOTAL = V3.total;
