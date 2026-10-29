import { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

// Permite "re-temporizar" el explicativo: si hay un frame en el contexto, se usa ese en vez del real.
export const FrameCtx = createContext<number | null>(null);
export const useF = () => {
  const real = useCurrentFrame();
  const v = useContext(FrameCtx);
  return v ?? real;
};
