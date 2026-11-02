# Un jardín para Monita

Experiencia romántica en React + Vite, pensada primero para teléfono. La aplicación funciona en el navegador y no tiene backend ni analítica. Las respuestas se guardan únicamente en `sessionStorage` durante la sesión actual.

## Requisitos

- Node.js 20.19+ (o 22.12+)
- npm

## Ejecutar localmente

```bash
npm install
npm run dev
```

Vite mostrará la dirección local. Para compilar y revisar la versión de producción:

```bash
npm run build
npm run preview
```

## Personalizar

- `src/data/content.ts`: elogios, preguntas, ideas para la cita y texto de la carta.
- `src/App.tsx`: flujo, cierres amables, privacidad y opciones que se pueden incluir en el resumen compartido.
- `src/components/Lily.tsx`: ilustración SVG original del lirio.
- `src/styles.css`: paleta, tipografía, composición y comportamiento responsive.
- `public/lily.svg`: favicon botánico.

## GitHub Pages

El workflow `.github/workflows/deploy.yml` compila y publica el sitio en `https://dgalvezfonseca.github.io/webmo/` al subir cambios a `main` o al ejecutarlo manualmente. Configura el repositorio para publicar GitHub Pages mediante **GitHub Actions** y crea el secreto de Actions `VITE_WEB3FORMS_ACCESS_KEY` con el valor de `.env.local` antes de ejecutar el workflow. No subas `.env.local`.

Para generar localmente el build con la ruta de publicación:

```powershell
$env:GITHUB_PAGES = 'true'
$env:VITE_BASE_PATH = '/webmo/'
npm run build
Remove-Item Env:GITHUB_PAGES
Remove-Item Env:VITE_BASE_PATH
```

Los archivos estáticos quedan en `dist/`. El workflow falla antes de crear el artefacto si no está configurada la Access Key.

## Privacidad y compartir

La destinataria puede seleccionar explícitamente qué elecciones compartir. Las respuestas emocionales y el texto libre quedan fuera del resumen. El texto se puede editar y copiar antes de abrir WhatsApp; abrirlo no envía el mensaje. No se configura número telefónico ni servicio de analítica.
