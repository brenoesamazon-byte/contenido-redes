import React from "react";
import { AbsoluteFill, Audio, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease, progress } from "../../../lib/motion";
import { B, f } from "../shared";
import { CUES, KEY } from "./data";
import { BigCounter, Burst, CommentBox, EmojiRain, FallingWords, FinalCTA, Follow, Hook, LikeComment, LookHere, Network, NewsDrop, Poll, PullDown, RetoTag, Share, Steps, TaskList, Terminal, win } from "./parts";

// Zoom de golpe en momentos clave (empieza ampliado y vuelve suave)
const PUNCH = [0, 41.2, 79.5, 99.7];
const zoomAt = (t: number) => {
  let z = 1;
  for (const s of PUNCH) {
    if (t >= s && t < s + 1.2) z = Math.max(z, interpolate(t, [s, s + 1.2], [1.1, 1], { easing: ease.out }));
  }
  return z;
};

// Antes / después del fondo
const BA = { orig: [70.9, 73.6] as const, wipe: [72.4, 73.6] as const };

const Subs: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const c = CUES.find(([s, e]) => t >= s && t < e);
  if (!c) return null;
  const words = c[2].toUpperCase().split(" ");
  // trocea la frase en grupos de 3–4 palabras repartidos en el tiempo
  const groups: string[][] = [];
  for (let i = 0; i < words.length; i += words.length > 6 ? 4 : 3) groups.push(words.slice(i, i + (words.length > 6 ? 4 : 3)));
  const idx = Math.min(groups.length - 1, Math.floor(((t - c[0]) / (c[1] - c[0])) * groups.length));
  const gStart = c[0] + (idx * (c[1] - c[0])) / groups.length;
  const s = interpolate(frame - f(gStart), [0, 3], [0.86, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out });
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1480, textAlign: "center", transform: `scale(${s})`, fontFamily: B.font, fontWeight: 700, fontSize: 76, lineHeight: 1.08, color: "#fff", WebkitTextStroke: "7px #000", paintOrder: "stroke fill", textShadow: "0 6px 18px rgba(0,0,0,.4)" }}>
      {groups[idx].map((w, i) => <span key={i} style={{ color: KEY.includes(w.replace(/[^A-ZÁÉÍÓÚÑ]/g, "")) ? B.yellow : "#fff" }}>{w} </span>)}
    </div>
  );
};

const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const a = win(frame, 70.9, 72.5, 6, 4);
  const b = win(frame, 73.5, 75.3, 6, 8);
  const label = (txt: string, p: number, color: string) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", opacity: p }}>
      <div style={{ background: color, color: color === "#fff" ? B.black : "#fff", fontFamily: B.font, fontWeight: 700, fontSize: 64, padding: "10px 40px", borderRadius: 16, boxShadow: "0 12px 30px rgba(0,0,0,.4)", transform: `scale(${0.9 + 0.1 * p})` }}>{txt}</div>
    </div>
  );
  return (
    <>
      {a.on && label("ANTES", a.p, "#fff")}
      {b.on && label("AHORA ✨", b.p, B.red)}
    </>
  );
};

export const ViralTest: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const z = zoomAt(t);
  // cortinilla: el vídeo original tapa al nuevo y se va descubriendo de izquierda a derecha
  const showOrig = t >= BA.orig[0] && t < BA.orig[1];
  const wipe = progress(frame, f(BA.wipe[0]), f(BA.wipe[1] - BA.wipe[0]), ease.inOut);
  const sfx: [number, string, number][] = [
    [0.05, "impact/impactPlate_heavy_000", 0.5], [0.45, "interface/drop_002", 0.45], [6.3, "interface/select_008", 0.4],
    [17.5, "ui/switch3", 0.4], [19.5, "ui/switch3", 0.4], [21.7, "ui/switch3", 0.4], [24.9, "casino/card-slide-1", 0.5],
    [28.8, "impact/impactMetal_light_002", 0.45], [33.5, "casino/card-slide-3", 0.5], [36.9, "interface/bong_001", 0.35],
    [41.2, "impact/impactPlate_heavy_001", 0.5], [47.3, "interface/select_008", 0.35], [58.7, "interface/glitch_002", 0.35],
    [61.8, "casino/card-slide-5", 0.5], [70.9, "interface/switch_005", 0.4], [72.4, "casino/card-shove-1", 0.5],
    [79.5, "interface/drop_001", 0.45], [80.5, "interface/drop_002", 0.45], [82.9, "casino/card-slide-7", 0.5],
    [87.4, "ui/click1", 0.3], [88.4, "ui/click2", 0.3], [89.4, "ui/click3", 0.3], [91.6, "interface/bong_001", 0.35],
    [97.3, "interface/select_008", 0.4], [98.3, "ui/click5", 0.5], [99.7, "impact/impactPlate_heavy_000", 0.5],
  ];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${z})`, transformOrigin: "50% 38%" }}>
        <OffthreadVideo src={staticFile("local/viral_bg.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {showOrig && (
          <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${wipe * 100}%)` }}>
            <OffthreadVideo src={staticFile("local/viral_orig.mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        )}
        {showOrig && wipe > 0 && wipe < 1 && <div style={{ position: "absolute", top: 0, bottom: 0, left: `${wipe * 100}%`, width: 10, marginLeft: -5, background: "#fff", boxShadow: "0 0 30px rgba(255,255,255,.9)" }} />}
      </AbsoluteFill>

      <RetoTag />
      <Hook />
      <Terminal />
      <Steps />
      <FallingWords s={24.8} e={28.7} text="VÍDEOS CON ANIMACIONES" top={1120} size={96} />
      <Burst s={25.4} x={540} y={1180} emojis={["🎬", "✨", "🔥", "⚡"]} />
      <NewsDrop />
      <PullDown />
      <Poll />
      <EmojiRain s={41.2} e={45.4} emojis={["🎬", "✂️", "✨", "🤖", "🔥", "📈"]} />
      <BigCounter />
      <Network />
      <LookHere s={60.4} e={62.3} x={210} y={330} label="👀 MIRA ESTO" />
      <TaskList />
      <FallingWords s={68.9} e={70.9} text="CAMBIO DE FONDO" top={1150} size={100} color={B.yellow} />
      <BeforeAfter />
      <LikeComment />
      <Burst s={79.7} x={540} y={1200} emojis={["❤️", "💬", "🔥"]} n={12} />
      <Share />
      <CommentBox />
      <Follow />
      <FinalCTA />
      <Burst s={99.9} x={540} y={1200} emojis={["🔥", "👇", "💬", "🚀"]} n={12} dur={2} />
      <Subs />

      {sfx.map(([s, n, v]) => (
        <Sequence key={`${s}-${n}`} from={f(s)} durationInFrames={30}><Audio src={staticFile(`sfx/${n}.ogg`)} volume={v} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
