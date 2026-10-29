import React from "react";
import { Composition } from "remotion";
import { FPS, TOTAL } from "./shared";
import { V1Reto } from "./V1Reto";
import { V2Noticia } from "./V2Noticia";
import { V3Kinetic } from "./V3Kinetic";
import { V4Vlog } from "./V4Vlog";
import { ViralTest } from "./viral/ViralTest";
import { VIRAL_TOTAL_S } from "./viral/data";
import { StoryRecap, STORY_TOTAL } from "./StoryRecap";
import { Explainer } from "./explainer/Explainer";
import { VO_TOTAL_S } from "./explainer/cues";
import { ExplainerTTS, TTS_TOTAL_S } from "./explainer/Warp";
import { Cover } from "./explainer/Cover";

const comps = [
  { id: "BrenoV1Reto", component: V1Reto },
  { id: "BrenoV2Noticia", component: V2Noticia },
  { id: "BrenoV3Kinetic", component: V3Kinetic },
  { id: "BrenoV4Vlog", component: V4Vlog },
];

export const BrenoRoot: React.FC = () => (
  <>
    {comps.map((c) => (
      <Composition key={c.id} id={c.id} component={c.component} durationInFrames={TOTAL} fps={FPS} width={1080} height={1920} />
    ))}
    <Composition id="BrenoExplainerInfoproductos" component={Explainer} durationInFrames={Math.round(VO_TOTAL_S * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="BrenoExplainerTTS" component={ExplainerTTS} durationInFrames={Math.round(TTS_TOTAL_S * FPS)} fps={FPS} width={1080} height={1920} />
    <Composition id="BrenoCoverInfoproductos" component={Cover} durationInFrames={1} fps={FPS} width={1080} height={1920} />
    <Composition id="BrenoStoryRecap" component={StoryRecap} durationInFrames={STORY_TOTAL} fps={FPS} width={1080} height={1920} />
    <Composition id="BrenoViralTest" component={ViralTest} durationInFrames={Math.round(VIRAL_TOTAL_S * FPS)} fps={FPS} width={1080} height={1920} />
  </>
);
