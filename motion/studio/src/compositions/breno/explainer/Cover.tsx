import React from "react";
import { AbsoluteFill } from "remotion";
import { C, EMO, FONT } from "./kit";

// Portada del explicativo de infoproductos. Todo dentro del recorte 4:5 del perfil (y 285–1635).
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, fontFamily: FONT }}>
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,212,0,.16) 0%, rgba(11,15,20,0) 60%)" }} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
    <div style={{ position: "absolute", left: 60, right: 60, top: 470, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      <div style={{ fontFamily: EMO, fontSize: 210, lineHeight: 1 }}>📘</div>
      <div style={{ fontWeight: 700, fontSize: 92, color: C.text, textAlign: "center", lineHeight: 1.05 }}>UN EBOOK DE 2007</div>
      <div style={{ fontWeight: 700, fontSize: 92, color: C.bg, background: C.yellow, padding: "6px 26px", borderRadius: 16, textAlign: "center", lineHeight: 1.1 }}>HOY MUEVE</div>
      <div style={{ fontWeight: 700, fontSize: 168, color: C.yellow, lineHeight: 1, textShadow: `0 0 50px ${C.yellow}66` }}>10.000 M$</div>
      <div style={{ fontWeight: 700, fontSize: 52, color: C.muted, textAlign: "center" }}>al año 🤯</div>
    </div>
  </AbsoluteFill>
);
