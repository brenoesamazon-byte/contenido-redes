// Punto de entrada solo con las composiciones de Breno.
// Usa fuentes del sistema (Poppins) en vez de Google Fonts, así renderiza también en la nube sin internet.
// Render: npx remotion render src/breno.ts BrenoV1Reto out/v1.mp4
import { registerRoot } from "remotion";
import { BrenoRoot } from "./compositions/breno/Root";

registerRoot(BrenoRoot);
