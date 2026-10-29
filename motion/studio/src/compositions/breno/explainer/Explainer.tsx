import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { ease, progress, springs } from "../../../lib/motion";
import { f } from "../shared";
import { CUES, HL } from "./cues";
import { Arrow, Avatar, C, Card, Count, Cross, Emoji, EMO, FONT, Label, Pop, Scene, usePop, Verified } from "./kit";

// Vídeo explicativo "Qué son los infoproductos" (29 oct 2026). Voz en off de Breno.

// Texto de arriba: la frase que se está diciendo, palabra a palabra, con las clave en caja amarilla.
const TopText: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const c = CUES.find(([s, e]) => t >= s && t < e);
  if (!c) return null;
  const [s, e, txt] = c;
  const words = txt.split(" ");
  const span = (e - s) * 0.92;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 300, minHeight: 300, display: "flex", flexWrap: "wrap", justifyContent: "center", alignContent: "center", gap: "6px 16px", fontFamily: FONT, fontWeight: 700, fontSize: 62, lineHeight: 1.2 }}>
      {words.map((w, i) => {
        const at = s + (i / words.length) * span;
        const p = progress(frame, f(at), 5);
        const hl = HL.includes(w) || HL.includes(w.replace(/[.,:?]/g, ""));
        return (
          <span key={i} style={{ color: hl ? C.bg : C.text, background: hl ? C.yellow : "transparent", padding: hl ? "0 12px" : 0, borderRadius: 10, opacity: 0.18 + 0.82 * p, transform: `translateY(${(1 - p) * 8}px)` }}>{w}</span>
        );
      })}
    </div>
  );
};

const Bg: React.FC = () => {
  const frame = useCurrentFrame();
  const g = 0.5 + 0.5 * Math.sin(frame / 40);
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 62%, rgba(255,212,0,${0.07 + 0.04 * g}) 0%, rgba(11,15,20,0) 55%)` }} />
      <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "60px 60px", transform: `translateY(${(frame * 0.4) % 60}px)` }} />
    </AbsoluteFill>
  );
};

// Barra de progreso fina (estilo reproductor) con la sección actual
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{ position: "absolute", left: 60, right: 60, top: 260, height: 6, borderRadius: 9, background: "rgba(255,255,255,.1)" }}><div style={{ width: `${(frame / f(241.6)) * 100}%`, height: "100%", borderRadius: 9, background: C.yellow }} /></div>;
};

const Center: React.FC<{ children: React.ReactNode; gap?: number; dir?: "row" | "column"; style?: React.CSSProperties }> = ({ children, gap = 30, dir = "column", style }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: dir, alignItems: "center", justifyContent: "center", gap, ...style }}>{children}</div>
);

export const Explainer: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const whoosh: number[] = [0, 10.66, 20.04, 37.73, 46.79, 56.05, 69.81, 82.66, 96.14, 101.32, 114.6, 134.34, 145.68, 170.43, 191.37, 198.29, 212.82, 221.19, 226.0];
  return (
    <AbsoluteFill>
      <Bg />
      <Progress />
      <TopText />

      {/* 1 · Ebook 2007 → 10.000 millones */}
      <Scene s={0} e={10.66}>{() => (
        <Center>
          {t < 6.2 ? (
            <>
              <Pop at={0.2} from="scale"><Emoji e="📘" size={260} /></Pop>
              <Pop at={0.6}><Label size={110} color={C.yellow}>2007</Label></Pop>
              <Pop at={1.6}><Label size={44} color={C.muted}>Un ebook sobre videojuegos 🎮</Label></Pop>
            </>
          ) : (
            <>
              <Count at={6.3} to={10000} dur={2.4} suffix=" M$" size={170} />
              <Pop at={7.4}><Label size={56}>al año pasan por la empresa</Label></Pop>
            </>
          )}
        </Center>
      )}</Scene>

      {/* 2 · Quédate */}
      <Scene s={10.66} e={20.04}>{(l) => (
        <Center>
          <Pop at={11.0} from="scale"><Emoji e="🇪🇸" size={240} /></Pop>
          <Pop at={15.0}><Card accent={C.yellow}><Label size={58}>Casi nadie lo entiende 🤔</Label></Card></Pop>
          <Pop at={17.6}><Label size={50} color={C.yellow}>…y puede cambiar cómo ganas dinero</Label></Pop>
        </Center>
      )}</Scene>

      {/* 3 · Historia: ebook → sin forma de venderlo → 2011 plataforma → Hotmart */}
      <Scene s={20.04} e={37.73}>{() => (
        <Center gap={26}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Pop at={20.3}><Card style={{ textAlign: "center", width: 250 }}><Emoji e="📘" size={90} /><Label size={34}>2007 · Ebook</Label></Card></Pop>
            <Arrow at={23.9} />
            <Pop at={25.7}><Card accent={C.red} style={{ textAlign: "center", width: 250, position: "relative" }}><Emoji e="🛒" size={90} /><Label size={34}>¿Dónde lo vendo?</Label><Cross at={26.8} /></Card></Pop>
          </div>
          <Pop at={30.0}><Label size={96} color={C.yellow}>2011</Label></Pop>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Pop at={31.6}><Card style={{ textAlign: "center", width: 250 }}><Emoji e="👨‍💻👨‍💻" size={70} /><Label size={34}>Dos compañeros de uni</Label></Card></Pop>
            <Arrow at={34.0} />
            <Pop at={35.6} from="scale"><Card accent={C.yellow} style={{ textAlign: "center", width: 250 }}><Emoji e="🚀" size={90} /><Label size={42} color={C.yellow}>HOTMART</Label></Card></Pop>
          </div>
        </Center>
      )}</Scene>

      {/* 4 · Creadores, países y el récord */}
      <Scene s={37.73} e={56.05}>{() => (
        <Center gap={34}>
          {t < 46.8 ? (
            <>
              <div style={{ display: "flex", gap: 30 }}>
                <Card style={{ width: 430, textAlign: "center" }}><Emoji e="🧑‍🏫" size={80} /><Count at={38.3} to={250000} dur={2.4} size={88} /><Label size={36} color={C.muted}>creadores</Label></Card>
                <Card style={{ width: 430, textAlign: "center" }}><Emoji e="🌍" size={80} /><Count at={42.0} to={188} dur={1.6} size={88} /><Label size={36} color={C.muted}>países</Label></Card>
              </div>
              <WorldDots at={42.0} />
            </>
          ) : (
            <>
              <Pop at={46.9}><Label size={54}>1 solo creador en 2025</Label></Pop>
              <Count at={49.9} to={550} dur={2.2} prefix="+" suffix=" M" size={220} color={C.green} />
              <Pop at={50.5}><Label size={50} color={C.muted}>de reales brasileños</Label></Pop>
              <Pop at={54.4}><Card accent={C.yellow}><Label size={48}>vendiendo lo que sabe 🧠</Label></Card></Pop>
            </>
          )}
        </Center>
      )}</Scene>

      {/* 5 · Qué es un infoproducto */}
      <Scene s={56.05} e={69.81}>{() => (
        <Center gap={26}>
          <Pop at={56.2} from="scale"><Emoji e="📦" size={200} /></Pop>
          <Pop at={60.8}><Label size={64} color={C.yellow}>Conocimiento empaquetado</Label></Pop>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 18, maxWidth: 960 }}>
            {([["📘", "Ebook", 62.9], ["🎥", "Curso en vídeo", 64.0], ["🤝", "Mentoría", 65.6], ["📄", "Plantilla", 66.8], ["👥", "Comunidad", 68.1]] as [string, string, number][]).map(([e, n, at]) => (
              <Pop key={n} at={at} from="scale"><Card style={{ padding: "16px 26px", display: "flex", alignItems: "center", gap: 12 }}><Emoji e={e} size={52} /><Label size={38}>{n}</Label></Card></Pop>
            ))}
          </div>
        </Center>
      )}</Scene>

      {/* 6 · Cómo funciona: sabes algo → producto → internet → ×1000 */}
      <Scene s={69.81} e={82.66}>{() => (
        <Center gap={30}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {([["🧠", "Sabes algo", 70.0], ["📦", "Producto digital", 73.9], ["🌐", "Internet", 76.6]] as [string, string, number][]).map(([e, n, at], i) => (
              <React.Fragment key={n}>
                {i > 0 && <Arrow at={at - 0.3} w={70} />}
                <Pop at={at} from="scale"><Card style={{ width: 250, textAlign: "center", padding: "20px 10px" }}><Emoji e={e} size={90} /><Label size={34}>{n}</Label></Card></Pop>
              </React.Fragment>
            ))}
          </div>
          {t >= 78.2 && (
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <Pop at={78.3}><Card style={{ textAlign: "center" }}><Label size={36} color={C.muted}>Lo haces</Label><Label size={90}>1 vez</Label></Card></Pop>
              <Arrow at={79.6} />
              <Pop at={80.4}><Card accent={C.yellow} style={{ textAlign: "center" }}><Label size={36} color={C.muted}>Lo vendes</Label><Count at={80.5} to={1000} dur={1.6} prefix="×" size={90} /></Card></Pop>
            </div>
          )}
        </Center>
      )}</Scene>

      {/* 7 · Marketing = la otra mitad */}
      <Scene s={82.66} e={96.14}>{(l) => {
        const join = progress(frame, f(84.0), 16, ease.inOut);
        return (
          <Center gap={34}>
            <div style={{ display: "flex", gap: 0 }}>
              <div style={{ transform: `translateX(${(1 - join) * -120}px)` }}><Card style={{ width: 380, textAlign: "center", borderRadius: "30px 0 0 30px" }}><Emoji e="📦" size={90} /><Label size={44}>Producto</Label><Label size={70} color={C.yellow}>50 %</Label></Card></div>
              <div style={{ transform: `translateX(${(1 - join) * 120}px)` }}><Card accent={C.yellow} style={{ width: 380, textAlign: "center", borderRadius: "0 30px 30px 0" }}><Emoji e="📣" size={90} /><Label size={44}>Marketing</Label><Label size={70} color={C.yellow}>50 %</Label></Card></div>
            </div>
            <Pop at={86.0}><Label size={46} color={C.muted}>que llegue a quien lo necesita 🎯</Label></Pop>
            {t >= 91.8 && <Pop at={91.9}><Card accent={C.red} style={{ display: "flex", alignItems: "center", gap: 24 }}><Label size={46}>Sin marketing:</Label><Label size={80} color={C.red}>0 ventas</Label></Card></Pop>}
          </Center>
        );
      }}</Scene>

      {/* 8 · Like */}
      <Scene s={96.14} e={101.32}>{(l) => {
        const beat = 1 + 0.08 * Math.max(0, Math.sin(l / 4));
        return (
          <Center>
            <Pop at={96.3} from="scale"><Emoji e="❤️" size={300} style={{ transform: `scale(${beat})` }} /></Pop>
            <Pop at={96.8}><Label size={70}>Dale like</Label></Pop>
            <Pop at={98.0}><Label size={44} color={C.muted}>así le llega a más gente</Label></Pop>
          </Center>
        );
      }}</Scene>

      {/* 9 · Kajabi */}
      <Scene s={101.32} e={114.6}>{() => (
        <Center gap={30}>
          <Pop at={101.5}><Label size={50} color={C.muted}>No es solo Brasil 🇧🇷 · también en</Label></Pop>
          <Pop at={103.9} from="scale"><Label size={110} color={C.yellow}>KAJABI</Label></Pop>
          {t >= 105.9 && <Card style={{ textAlign: "center", width: 840 }}><Label size={38} color={C.muted}>facturado por sus creadores</Label><Count at={106.0} to={10000} dur={2.2} prefix="+" suffix=" M$" size={120} /></Card>}
          {t >= 110.5 && <Pop at={110.6} from="scale"><Card accent={C.green} style={{ display: "flex", alignItems: "center", gap: 20 }}><Emoji e="💰" size={90} /><div><Count at={110.6} to={1800} dur={1.4} size={90} color={C.green} /><Label size={40}>millonarios</Label></div></Card></Pop>}
        </Center>
      )}</Scene>

      {/* 10 · El creador típico */}
      <Scene s={114.6} e={134.34}>{() => (
        <Center gap={24}>
          <Pop at={114.8}><Label size={54}>El creador típico de 6 cifras…</Label></Pop>
          <div style={{ display: "flex", gap: 24 }}>
            <Pop at={119.5}><Card accent={C.red} style={{ width: 400, textAlign: "center", position: "relative" }}><Label size={36} color={C.muted}>Seguidores</Label><Label size={64}>Millones</Label><Cross at={122.0} /></Card></Pop>
            <Pop at={124.0}><Card accent={C.green} style={{ width: 400, textAlign: "center" }}><Label size={36} color={C.muted}>Seguidores</Label><Label size={64} color={C.green}>1.000–10.000</Label></Card></Pop>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <Pop at={126.4}><Card style={{ width: 400, textAlign: "center" }}><Emoji e="📧" size={70} /><Count at={126.5} to={4000} dur={1.4} size={70} /><Label size={34} color={C.muted}>correos en su lista</Label></Card></Pop>
            <Pop at={131.0}><Card style={{ width: 400, textAlign: "center" }}><Emoji e="🧑‍🤝‍🧑" size={70} /><Count at={131.1} to={300} dur={1.2} size={70} /><Label size={34} color={C.muted}>clientes</Label></Card></Pop>
          </div>
          <Pop at={133.0}><Label size={58} color={C.yellow}>Gente normal ✓</Label></Pop>
        </Center>
      )}</Scene>

      {/* 11 · La cuenta */}
      <Scene s={134.34} e={145.68}>{() => (
        <Center gap={34}>
          <Calc />
          {t >= 141.1 && (
            <div style={{ display: "flex", gap: 20 }}>
              {([["💻", "Ordenador", 141.2, true], ["🏪", "Local", 142.3, false], ["📦", "Stock", 143.1, false], ["👔", "Empleados", 144.4, false]] as [string, string, number, boolean][]).map(([e, n, at, ok]) => (
                <Pop key={n} at={at} from="scale"><Card accent={ok ? C.green : C.red} style={{ width: 205, textAlign: "center", padding: "18px 8px", position: "relative" }}><Emoji e={e} size={70} /><Label size={30}>{n}</Label>{!ok && <Cross at={at + 0.25} />}</Card></Pop>
              ))}
            </div>
          )}
        </Center>
      )}</Scene>

      {/* 12 · España: ¿humo? */}
      <Scene s={145.68} e={170.43}>{() => (
        <Center gap={24}>
          {t < 153.7 ? (
            <>
              <Pop at={145.8} from="scale"><Emoji e="🇪🇸" size={150} /></Pop>
              <Pop at={147.4}><Card style={{ borderRadius: "30px 30px 30px 6px" }}><Label size={56}>«Vendo un curso»</Label></Card></Pop>
              <Smoke at={150.6} />
            </>
          ) : (
            <>
              {([["🎓", "Cursos de 2.000 €", 153.8], ["🏎️", "Lamborghini en 3 meses", 156.2], ["🏠", "Casoplones de alquiler", 158.3], ["😞", "Pagaron y no aprendieron", 163.0]] as [string, string, number][]).map(([e, n, at]) => (
                <Pop key={n} at={at} from="left"><Card accent={C.red} style={{ width: 860, display: "flex", alignItems: "center", gap: 24, padding: "18px 28px", position: "relative" }}><Emoji e={e} size={70} /><Label size={44} style={{ textAlign: "left" }}>{n}</Label><div style={{ position: "absolute", right: 30, top: 18 }}><Emoji e="❌" size={60} /></div></Card></Pop>
              ))}
              <Pop at={167.9}><Label size={56} color={C.red}>Por eso aquí se desconfía</Label></Pop>
            </>
          )}
        </Center>
      )}</Scene>

      {/* 13 · Mercado lleno vs hueco */}
      <Scene s={170.43} e={191.37}>{() => {
        const full = progress(frame, f(174.4), 30, ease.out);
        const low = progress(frame, f(179.6), 24, ease.out);
        return (
          <Center gap={30}>
            {t < 188.7 ? (
              <>
                <Pop at={170.6}><Label size={54}>Fíjate en esto 👀</Label></Pop>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 80, height: 480 }}>
                  <div style={{ textAlign: "center" }}><div style={{ width: 230, height: 400 * full, background: C.red, borderRadius: 20, margin: "0 auto" }} /><Label size={36} style={{ marginTop: 14 }}>Otros países</Label><Label size={30} color={C.muted}>mercado lleno</Label></div>
                  <div style={{ textAlign: "center" }}><div style={{ width: 230, height: 120 * low, background: C.yellow, borderRadius: 20, margin: "0 auto" }} /><Label size={36} style={{ marginTop: 14 }}>España 🇪🇸</Label><Label size={30} color={C.muted}>casi vacío</Label></div>
                </div>
                {t >= 182.6 && <Pop at={182.7}><Card accent={C.green}><Label size={44}>Los que lo hacen bien, destacan ✨</Label></Card></Pop>}
              </>
            ) : (
              <WallToDoor at={188.8} />
            )}
          </Center>
        );
      }}</Scene>

      {/* 14 · Simple ≠ fácil, el 4 %, lo que hace falta */}
      <Scene s={191.37} e={212.82}>{() => (
        <Center gap={28}>
          {t < 198.29 ? (
            <>
              <Pop at={191.5}><Label size={50} color={C.muted}>Te voy a ser sincero 🤝</Label></Pop>
              <Pop at={195.9} from="scale"><Label size={130}>SIMPLE <span style={{ color: C.red }}>≠</span> FÁCIL</Label></Pop>
            </>
          ) : t < 206.0 ? (
            <>
              <Pop at={198.4}><Label size={40} color={C.muted}>Según Goldman Sachs</Label></Pop>
              <Dots at={199.0} hiAt={201.9} />
              <Pop at={202.0}><Label size={52}><span style={{ color: C.yellow }}>4 %</span> pasa de 100.000 $ al año</Label></Pop>
            </>
          ) : (
            <>
              <Pop at={206.0}><Label size={52}>Hace falta:</Label></Pop>
              {([["🧠", "Saber algo de verdad", 206.6], ["📣", "Saber venderlo", 209.2], ["🔁", "Ser constante", 211.0]] as [string, string, number][]).map(([e, n, at]) => (
                <Pop key={n} at={at} from="left"><Card accent={C.green} style={{ width: 760, display: "flex", alignItems: "center", gap: 24 }}><Emoji e={e} size={70} /><Label size={48}>{n}</Label><div style={{ marginLeft: "auto", fontSize: 60, color: C.green, fontFamily: FONT, fontWeight: 700 }}>✓</div></Card></Pop>
              ))}
            </>
          )}
        </Center>
      )}</Scene>

      {/* 15 · La puerta está abierta */}
      <Scene s={212.82} e={221.19}>{() => <Door at={212.9} />}</Scene>

      {/* 16 · En directo, desde cero */}
      <Scene s={221.19} e={226.0}>{() => (
        <Center gap={24}>
          <Pop at={221.3} from="scale"><Avatar size={220} /></Pop>
          <Pop at={221.7}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><Label size={64}>Breno</Label><Verified size={56} /></div></Pop>
          <Pop at={222.2}><Card accent={C.red} style={{ padding: "14px 30px" }}><Label size={44}>🔴 En directo · desde cero</Label></Card></Pop>
          <Pop at={224.1}><Label size={44} color={C.muted}>con trabajo y con mis hijos</Label></Pop>
        </Center>
      )}</Scene>

      {/* 17 · Comenta, envía, guarda */}
      <Scene s={226.0} e={241.6}>{() => <Outro />}</Scene>

      <Audio src={staticFile("local/vo_clean.wav")} />
      {whoosh.map((s) => (
        <Sequence key={s} from={f(s)} durationInFrames={20}><Audio src={staticFile("sfx/casino/card-slide-3.ogg")} volume={0.28} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Puntos que se encienden por el mundo
const WorldDots: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: 900, height: 260 }}>
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 157) % 900, y = (i * 89) % 240;
        const p = progress(frame, f(at) + i * 0.8, 8);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 16, height: 16, borderRadius: 99, background: C.yellow, opacity: 0.15 + 0.85 * p, boxShadow: p > 0.5 ? `0 0 16px ${C.yellow}` : "none", transform: `scale(${0.6 + 0.4 * p})` }} />;
      })}
    </div>
  );
};

// Calculadora: 300 × 100 € = 30.000 €
const Calc: React.FC = () => {
  const frame = useCurrentFrame();
  const parts: [string, number, string][] = [["300", 136.0, C.text], ["×", 136.9, C.muted], ["100 €", 137.4, C.text], ["=", 139.0, C.muted]];
  const res = interpolate(frame, [f(139.2), f(140.6)], [0, 30000], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease.out });
  return (
    <Card accent={C.yellow} style={{ width: 900, padding: "34px 36px" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 22, fontFamily: FONT, fontWeight: 700, fontSize: 96 }}>
        {parts.map(([p, at, c]) => <span key={p} style={{ color: c, opacity: progress(frame, f(at), 6) }}>{p}</span>)}
      </div>
      <div style={{ marginTop: 10, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 150, color: C.green, opacity: frame >= f(139.2) ? 1 : 0 }}>{Math.round(res).toLocaleString("es-ES")} €</div>
    </Card>
  );
};

// "¿Humo?" con humo que sube
const Smoke: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const l = frame - f(at);
  if (l < 0) return null;
  return (
    <div style={{ position: "relative", width: 700, height: 300 }}>
      {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 90 + i * 80, top: 160 - l * (2 + (i % 3)), fontFamily: EMO, fontSize: 80 + (i % 2) * 24, opacity: Math.max(0, 0.45 - l / 120), zIndex: 0 }}>💨</div>)}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}><Label size={130} color="#cfd6dd" style={{ transform: `scale(${spring({ frame: l, fps: 30, config: springs.bouncy })})` }}>¿HUMO?</Label></div>
    </div>
  );
};

// Muro que se rompe y deja ver una puerta
const WallToDoor: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const k = progress(frame, f(at) + 18, 16, ease.out);
  return (
    <div style={{ position: "relative", width: 900, height: 560 }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: k }}><Emoji e="🚪" size={260} /><Label size={64} color={C.yellow}>Es la oportunidad</Label></div>
      {Array.from({ length: 12 }).map((_, i) => {
        const col = i % 4, row = Math.floor(i / 4);
        const dx = (col - 1.5) * 200 * k, dy = (row - 1) * 140 * k + k * k * 300;
        return <div key={i} style={{ position: "absolute", left: 90 + col * 180, top: 70 + row * 140, width: 170, height: 130, background: "#8b4a36", border: "6px solid #5a2e22", borderRadius: 8, transform: `translate(${dx}px, ${dy}px) rotate(${(i % 2 ? 1 : -1) * k * 40}deg)`, opacity: Math.max(0, 1 - k * 1.4), display: "flex", alignItems: "center", justifyContent: "center" }}>{i === 5 && k < 0.2 ? <Label size={40}>MURO</Label> : null}</div>;
      })}
    </div>
  );
};

// 100 puntos, 4 se encienden
const Dots: React.FC<{ at: number; hiAt: number }> = ({ at, hiAt }) => {
  const frame = useCurrentFrame();
  const hi = [12, 47, 63, 88];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 56px)", gap: 14 }}>
      {Array.from({ length: 100 }).map((_, i) => {
        const p = progress(frame, f(at) + i * 0.25, 6);
        const on = hi.includes(i) && frame >= f(hiAt) + hi.indexOf(i) * 4;
        return <div key={i} style={{ width: 56, height: 56, borderRadius: 99, background: on ? C.yellow : "rgba(255,255,255,.14)", opacity: p, boxShadow: on ? `0 0 24px ${C.yellow}` : "none", transform: `scale(${on ? 1.15 : 1})` }} />;
      })}
    </div>
  );
};

// Puerta que se abre
const Door: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const o = progress(frame, f(at) + 6, 30, ease.inOut);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30 }}>
      <div style={{ position: "relative", width: 340, height: 480, perspective: 1400 }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, ${C.yellow} 0%, #ff9d00 60%, #b35c00 100%)`, borderRadius: 16, boxShadow: `0 0 ${80 * o}px ${C.yellow}` }} />
        <div style={{ position: "absolute", inset: 0, background: "#6b3d2a", border: "10px solid #3d2218", borderRadius: 16, transformOrigin: "left center", transform: `rotateY(${-70 * o}deg)`, opacity: 1 - 0.3 * o }}><div style={{ position: "absolute", right: 30, top: 250, width: 26, height: 26, borderRadius: 99, background: "#e8c26a" }} /></div>
      </div>
      <Label size={60} style={{ marginTop: 20 }}>La puerta está abierta</Label>
      <Pop at={217.0}><Label size={46} color={C.yellow}>🇪🇸 más que en casi ningún sitio</Label></Pop>
    </div>
  );
};

// Cierre: caja de comentario + enviar + guardar
const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const msg = "Yo sé hacer… ✍️";
  const n = Math.max(0, Math.min(msg.length, Math.floor((frame - f(227.0)) / 3)));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <Pop at={226.1}><Card style={{ width: 880, display: "flex", alignItems: "center", gap: 20, background: "#fff" }}><div style={{ width: 80, height: 80, borderRadius: 99, background: "linear-gradient(135deg,#feda75,#d62976,#4f5bd5)" }} /><div style={{ flex: 1, fontFamily: FONT, fontWeight: 700, fontSize: 50, color: n ? "#0f1419" : "#9ca3af" }}>{n ? msg.slice(0, n) : "Añade un comentario…"}</div><div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#0095f6" }}>Publicar</div></Card></Pop>
      <Pop at={231.0}><Label size={46} color={C.muted}>¿Qué sabes hacer que otros pagarían por aprender?</Label></Pop>
      <div style={{ display: "flex", gap: 24, marginTop: 10 }}>
        <Pop at={233.1} from="scale"><Card accent={C.yellow} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 28px" }}><Emoji e="📲" size={70} /><Label size={42}>Envíaselo a ese amigo</Label></Card></Pop>
      </div>
      <Pop at={238.5} from="scale"><Card accent={C.green} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 28px" }}><Emoji e="🔖" size={70} /><Label size={42}>Guárdalo para cuando te decidas</Label></Card></Pop>
    </div>
  );
};
