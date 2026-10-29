import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ease, progress } from "../../lib/motion";
import { B, BaseVideo, f, Subtitles, useWindow } from "./shared";

// V2 · Noticia: tarjeta blanca «ÚLTIMA HORA» con borde negro y rótulos (lower-thirds) cuando nombra cada herramienta.
const NewsCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(0.1, 5.4, 12, 8);
  if (!visible) return null;
  const tag = progress(frame, f(0.1), 10);
  const head = progress(frame, f(0.1) + 6, 14);
  const blink = Math.floor(frame / 12) % 2 === 0 ? 1 : 0.35;
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1180, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ background: B.white, border: `6px solid ${B.black}`, borderRadius: 18, padding: "26px 34px", boxShadow: "0 18px 40px rgba(0,0,0,.35)", fontFamily: B.font }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: tag }}>
          <div style={{ width: 20, height: 20, borderRadius: 99, background: B.red, opacity: blink }} />
          <div style={{ fontWeight: 700, fontSize: 40, color: B.red, letterSpacing: "0.06em" }}>ÚLTIMA HORA</div>
        </div>
        <div style={{ marginTop: 10, fontWeight: 700, fontSize: 60, lineHeight: 1.08, color: B.black, opacity: head, transform: `translateY(${(1 - head) * 16}px)` }}>
          Claude Code + Buzzy: así preparo 3 días de contenido
        </div>
      </div>
    </div>
  );
};

const LowerThird: React.FC<{ start: number; end: number; title: string; sub: string }> = ({ start, end, title, sub }) => {
  const frame = useCurrentFrame();
  const { p, visible } = useWindow(start, end, 12, 8);
  if (!visible) return null;
  const bar = progress(frame, f(start), 10, ease.out);
  const txt = progress(frame, f(start) + 5, 12);
  return (
    <div style={{ position: "absolute", left: 60, top: 1230, opacity: p, fontFamily: B.font }}>
      <div style={{ display: "flex", alignItems: "stretch", transform: `translateX(${(1 - bar) * -60}px)` }}>
        <div style={{ width: 12, background: B.red, borderRadius: 4 }} />
        <div style={{ background: "rgba(15,20,25,.88)", padding: "16px 28px", borderRadius: "0 12px 12px 0" }}>
          <div style={{ fontWeight: 700, fontSize: 54, color: B.white, opacity: txt }}>{title}</div>
          <div style={{ fontWeight: 500, fontSize: 32, color: "#cfd6dd", opacity: txt }}>{sub}</div>
        </div>
      </div>
    </div>
  );
};

export const V2Noticia: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const lowerOn = (t >= 10.8 && t < 13.5) || (t >= 13.6 && t < 17.1);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <BaseVideo />
      <NewsCard />
      <LowerThird start={10.8} end={13.5} title="Claude Code" sub="Agente de IA que programa y edita" />
      <LowerThird start={13.6} end={17.1} title="Buzzy" sub="IA para generar vídeo · plan gratuito" />
      {/* Mientras está la tarjeta, sin subtítulos; con rótulo, los subtítulos bajan */}
      <Subtitles y={lowerOn ? 1480 : 1460} hide={(x) => x < 5.4} />

      <Sequence from={3} durationInFrames={20}><Audio src={staticFile("sfx/interface/select_008.ogg")} volume={0.45} /></Sequence>
      <Sequence from={f(10.8)} durationInFrames={20}><Audio src={staticFile("sfx/ui/switch3.ogg")} volume={0.4} /></Sequence>
      <Sequence from={f(13.6)} durationInFrames={20}><Audio src={staticFile("sfx/ui/switch3.ogg")} volume={0.4} /></Sequence>
    </AbsoluteFill>
  );
};
