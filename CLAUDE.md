# Contenido de redes de Breno (@brenol.h)

Repositorio donde se guarda todo el contenido para Instagram, TikTok y YouTube Shorts.
Breno lo gestiona desde el móvil con Claude Code. Habla en español informal.

## Regla principal: guardar siempre y sin preguntar

Todo lo que Breno pida para redes (guion, carrusel, texto de publicación, ideas, miniatura, subtítulos)
se guarda automáticamente en este repo, en la carpeta que toque, y al terminar se hace
`git add`, `git commit` y `git push` sin pedir confirmación.

## Regla: cuando Breno manda un vídeo, entregar el paquete completo de una vez

Sin preguntar y en una sola entrega:
1. **Vídeo editado** (cortes, subtítulos, animaciones, sonido), comprimido a menos de 30 MB y enviado con SendUserFile.
2. **Guion final** tal como queda en el montaje, con texto en pantalla, textos de publicación para Instagram y TikTok (máx. 5 hashtags) y, si hay CTA con palabra, el regalo que se manda.
3. **Portada** 1080x1920 en JPG: fotograma con la boca cerrada mirando a cámara, con el título del gancho (2 líneas sin puntuación) arriba, sin tapar la cara. Se saca con `remotion still` o ffmpeg + texto.
Todo se guarda en la carpeta de la semana (el .md del guion; la portada en una subcarpeta con el mismo nombre) con commit y push. Solo se pregunta si falta algo imprescindible.

## Regla: ganchos siempre del banco

Antes de escribir cualquier guion o portada, leer `plantillas/ganchos.md` (reglas de Callaway + banco de 30 ganchos + formato «El truco de Claude»). Cada gancho sale de un tipo del banco, sin repetir tipo dos días seguidos, y se apunta en el «Registro de ganchos usados» de ese archivo.

## Estructura

```
semanas/
  AAAA-SNN/            # semana ISO, p. ej. 2026-S44
    instagram/
    tiktok/
    youtube/
    videos.md          # enlaces a los vídeos de esa semana en Google Drive
plantillas/            # formatos reutilizables (estructura de guion, de carrusel, etc.)
```

- La semana se calcula con `date +%G-S%V`. Si la carpeta de la semana no existe, se crea con sus tres subcarpetas.
- Si una pieza sirve para varias plataformas, se guarda en la principal y se añade una línea en las otras apuntando a ella. No se duplica.

## Nombres de archivo

`AAAA-MM-DD_tema-corto.md` en minúsculas y con guiones. Ejemplos:
- `2026-10-29_carrusel-errores-gimnasio.md`
- `2026-10-30_guion-agentes-de-voz.md`

Las imágenes de carruseles van en una subcarpeta con el mismo nombre que su `.md`.

## Contenido de cada archivo

Cabecera breve: plataforma, tipo (guion, carrusel, texto…), fecha prevista de publicación y estado
(`borrador`, `listo`, `publicado`). Debajo, el contenido.

- Guiones: texto corrido para leer de seguido (gancho, desarrollo, cierre), con texto en pantalla de 2 líneas sin puntuación.
- Textos de publicación: una versión para Instagram y otra para TikTok, con 5 hashtags como máximo en cada una.

## Vídeos: NO van en este repo

Los vídeos se guardan en Google Drive, en la carpeta `Contenido redes / AAAA-SNN`
(carpeta raíz: https://drive.google.com/drive/folders/1Y6KUANpbYx5XpmudmmPXSHbCPFGsyKVq).
Aquí solo se añade el enlace en `semanas/AAAA-SNN/videos.md` con una línea por vídeo:
`- 2026-10-29 · tema · plataforma · enlace`.
Nunca se suben archivos de vídeo (.mp4, .mov…) ni archivos de más de 50 MB al repo.

## Animaciones: Motion Architect (`/motion`)

Para intros, ganchos animados, logos, contadores o tarjetas tipo «ÚLTIMA HORA», usar `/motion` (y `/motion-render` para sacar el mp4).
Viene incluido en este repo (MIT, de Enrique Rocha / tododeia):
- Skill y agente en `.claude/skills/motion-architect/` y `.claude/agents/`; comandos en `.claude/commands/`.
- Estudio de Remotion en `motion/studio/`. En una sesión nueva, si no existe `motion/studio/node_modules`, correr `npm ci --no-fund --no-audit` ahí antes de empezar.
- Marca de Breno en `motion/studio/brand.json`: sacarla del «Kit de marca Breno» (https://claude.ai/artifact/5amsWkXkC9w4hNy3xmUA2r) la primera vez que se use.
- Los storyboards se quedan en `motion/studio/storyboards/` y las composiciones en `motion/studio/src/compositions/`, con commit y push como todo lo demás.
- Los mp4 renderizados (`motion/studio/out/`) NO se suben al repo: van a la carpeta de la semana en Drive y su enlace a `videos.md`.
- Motion Architect anima; no corta vídeos hablando a cámara. Para quitar pausas se usa la skill de cortes.

### Vídeos de Breno con animaciones (probado el 29 oct 2026)
- Flujo: cortes secos con la skill de cortes → copiar el vídeo cortado a `motion/studio/public/local/base.mp4` (ignorado por git) → animar encima con las composiciones de `motion/studio/src/compositions/breno/`.
- Estilos listos (cada uno es un archivo): `V1Reto` (franja roja + RETO 10K + subtítulos), `V2Noticia` (tarjeta ÚLTIMA HORA + rótulos), `V3Kinetic` (gráficos cinéticos, sin subtítulos), `V4Vlog` (look cine, título de episodio, lista de tareas y cierre con pregunta).
- Los textos y tiempos van en `SEGMENTS` de `breno/shared.tsx`; el resto de gráficos tiene sus segundos en cada archivo.
- En la nube no hay Google Fonts: usar la entrada `src/breno.ts` (fuentes del sistema, Poppins) y el Chrome local:
  `npx remotion render src/breno.ts BrenoV1Reto out/v1.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --concurrency=2`
  (si esa ruta no existe, buscar `chrome-headless-shell` con `find /opt -name chrome-headless-shell`). Tarda unos 6 min por vídeo de 54 s.
- Después, comprimir a menos de 30 MB para enviarlo (`-b:v 3600k`).

## Commits

Mensajes cortos en español: `añade carrusel errores gimnasio (S44, instagram)`.

### Formato «El truco de Claude» (probado el 30 oct 2026)
- Plantilla: `motion/studio/src/compositions/breno/ClaudePerfil2.tsx` (toma única a cámara + planos del portátil, tarjetas 1·2·3 arriba sobre la pared, barra de seguidores, contador, CTA «COMENTA PALABRA», latido/música/whoosh generados en `public/local/`).
- Grabación: móvil en vertical, a cámara, de cerca, delante de la estantería blanca; sin AirPods; dejar aire encima de la cabeza. Nada en horizontal.
- Voz clonada (ElevenLabs) solo en tramos sin cara (portátil, capturas). A cámara, siempre su voz.
- Montaje: cortar pausas y repeticiones, `highpass,afftdn,acompressor,loudnorm -14` en la voz; revisar fotogramas con `remotion still` antes del render completo.
- Para ahorrar uso: una sesión nueva por vídeo y todos los cambios en un solo mensaje.
