export const readAloudLabels = {
  en: {
    title: "Listen to this article",
    play: "Listen",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    voice: "Voice",
    automatic: "Automatic",
    speed: "Speed",
    progress: "Reading progress",
    ready:
      "Reads text and captions. Skips code, tables, and interactive figures.",
    playing: "Reading aloud.",
    paused: "Paused. Resume repeats the current passage.",
    finished: "Finished reading.",
    unavailable:
      "No voice is available for this article’s language. Check your device’s speech settings.",
    error: "Reading stopped. Try another voice or press Listen to retry.",
    empty: "There is no article text to read.",
  },
  es: {
    title: "Escuchar este artículo",
    play: "Escuchar",
    pause: "Pausar",
    resume: "Continuar",
    stop: "Detener",
    voice: "Voz",
    automatic: "Automática",
    speed: "Velocidad",
    progress: "Progreso de lectura",
    ready:
      "Lee el texto y los pies de figura. Omite código, tablas y figuras interactivas.",
    playing: "Leyendo en voz alta.",
    paused: "En pausa. Al continuar se repite el pasaje actual.",
    finished: "Lectura terminada.",
    unavailable:
      "No hay una voz disponible para el idioma del artículo. Revisa los ajustes de voz de tu dispositivo.",
    error:
      "La lectura se detuvo. Prueba otra voz o pulsa Escuchar para reintentar.",
    empty: "No hay texto que leer.",
  },
  fr: {
    title: "Écouter cet article",
    play: "Écouter",
    pause: "Pause",
    resume: "Reprendre",
    stop: "Arrêter",
    voice: "Voix",
    automatic: "Automatique",
    speed: "Vitesse",
    progress: "Progression de la lecture",
    ready:
      "Lit le texte et les légendes. Ignore le code, les tableaux et les figures interactives.",
    playing: "Lecture à voix haute.",
    paused: "En pause. La reprise répète le passage actuel.",
    finished: "Lecture terminée.",
    unavailable:
      "Aucune voix disponible pour la langue de cet article. Vérifiez les réglages vocaux de votre appareil.",
    error:
      "La lecture s’est arrêtée. Essayez une autre voix ou appuyez sur Écouter pour réessayer.",
    empty: "Aucun texte à lire.",
  },
};

export type ReadingLanguage = keyof typeof readAloudLabels;

// Keep inline code and link labels, but not hidden tooltip definitions,
// diagram internals, executable examples, or controls injected by scripts.
const SKIP = [
  "script",
  "style",
  "template",
  "noscript",
  "pre",
  "svg",
  "math",
  "canvas",
  "table",
  "button",
  "input",
  "select",
  "textarea",
  "label",
  "audio",
  "video",
  "iframe",
  "nav",
  "[hidden]",
  '[aria-hidden="true"]',
  '[role="tooltip"]',
  '[role="img"]',
  ".post-figure-body",
  ".code-toolbar",
  ".next-post",
  "[data-read-aloud-skip]",
].join(",");

const BLOCK =
  /^(P|H[1-6]|LI|UL|OL|DIV|SECTION|ARTICLE|BLOCKQUOTE|FIGURE|FIGCAPTION|DL|DT|DD)$/;

/** Split at sentence boundaries, then at whitespace for unusually long text. */
function splitPassages(text: string, lang: ReadingLanguage): string[] {
  const sentences =
    typeof Intl.Segmenter === "function"
      ? Array.from(
          new Intl.Segmenter(lang, { granularity: "sentence" }).segment(text),
          (part) => part.segment,
        )
      : [text];

  return sentences.flatMap((sentence) => {
    const parts: string[] = [];
    let rest = sentence.trim();
    while (rest.length > 180) {
      const space = rest.lastIndexOf(" ", 180);
      const end = space > 0 ? space : 180;
      parts.push(rest.slice(0, end));
      rest = rest.slice(end).trim();
    }
    if (rest) parts.push(rest);
    return parts;
  });
}

/** Walk in document order so nested lists and paragraphs are read only once. */
export function articlePassages(
  article: HTMLElement,
  title: string,
  lang: ReadingLanguage,
): string[] {
  const blocks: string[] = [];
  let text = "";
  const flush = () => {
    const normalized = text.replace(/\s+/gu, " ").trim();
    if (normalized) blocks.push(normalized);
    text = "";
  };
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? "";
    } else if (node instanceof Element && !node.matches(SKIP)) {
      const block = BLOCK.test(node.tagName);
      if (block) flush();
      if (node.tagName === "BR") text += " ";
      node.childNodes.forEach(walk);
      if (block) flush();
    }
  };
  walk(article);
  flush();
  if (blocks.length === 0) return [];
  return [title, ...blocks].flatMap((block) => splitPassages(block, lang));
}
