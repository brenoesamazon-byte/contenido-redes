import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { FrameCtx } from "./frame";
import { CUES } from "./cues";
import { Explainer, WHOOSH_OLD } from "./Explainer";

// Versión con la voz clonada (ElevenLabs): reutiliza todas las animaciones del explicativo
// y las reajusta al nuevo ritmo, mapeando el tiempo nuevo al antiguo frase a frase.
export const TTS_TOTAL_S = 202.5;
// Inicio de cada frase (mismo orden que CUES) en el audio nuevo
const NEW_STARTS = [0, 4.16, 7.2, 10.0, 12.6, 14.6, 17.4, 21.1, 22.3, 25.88, 26.9, 31.3, 33.08, 37.3, 40.08, 42.6, 45.56, 47.5, 49.1, 51.6, 53.76, 57.38, 58.98, 61.58, 65.16, 68.66, 71.18, 75.0, 79.04, 84.24, 88.32, 93.18, 96.38, 99.36, 104.54, 106.9, 109.3, 112.78, 114.24, 117.14, 119.32, 123.92, 125.1, 129.2, 130.72, 135.22, 137.94, 141.32, 143.42, 145.9, 148.78, 152.1, 155.82, 157.4, 161.52, 163.38, 165.94, 168.42, 170.6, 174.52, 179.06, 182.08, 185.48, 188.34, 190.56, 194.2, 196.26, 198.3];
const OLD = [...CUES.map((c) => c[0]), CUES[CUES.length - 1][1]];
const NEW = [...NEW_STARTS, TTS_TOTAL_S];

const lerpMap = (t: number, from: number[], to: number[]) => {
  for (let i = 0; i < from.length - 1; i++) {
    if (t >= from[i] && t < from[i + 1]) return to[i] + ((t - from[i]) / (from[i + 1] - from[i])) * (to[i + 1] - to[i]);
  }
  return to[to.length - 1] - 0.001;
};

export const ExplainerTTS: React.FC = () => {
  const frame = useCurrentFrame();
  const oldT = lerpMap(frame / 30, NEW, OLD);
  return (
    <AbsoluteFill>
      <FrameCtx.Provider value={Math.round(oldT * 30)}>
        <Explainer withAudio={false} />
      </FrameCtx.Provider>
      <Audio src={staticFile("local/vo_tts.wav")} />
      {WHOOSH_OLD.map((s) => (
        <Sequence key={s} from={Math.round(lerpMap(s, OLD, NEW) * 30)} durationInFrames={20}><Audio src={staticFile("sfx/casino/card-slide-3.ogg")} volume={0.28} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
