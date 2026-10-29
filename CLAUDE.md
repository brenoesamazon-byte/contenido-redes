# Contenido de redes de Breno (@brenol.h)

Repositorio donde se guarda todo el contenido para Instagram, TikTok y YouTube Shorts.
Breno lo gestiona desde el móvil con Claude Code. Habla en español informal.

## Regla principal: guardar siempre y sin preguntar

Todo lo que Breno pida para redes (guion, carrusel, texto de publicación, ideas, miniatura, subtítulos)
se guarda automáticamente en este repo, en la carpeta que toque, y al terminar se hace
`git add`, `git commit` y `git push` sin pedir confirmación.

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

## Commits

Mensajes cortos en español: `añade carrusel errores gimnasio (S44, instagram)`.
