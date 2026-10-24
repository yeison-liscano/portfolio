/**
 * Browser helpers for the toolbars on post code blocks: the copy button
 * every block gets (Post.astro) and the Python runner (PyodideRunner.astro).
 */

/** The code inside a Shiki block, one line per `.line` span. */
export const codeText = (pre: HTMLPreElement): string => {
  const codeEl = pre.querySelector("code");
  if (!codeEl) return "";
  const lines = codeEl.querySelectorAll(".line");
  if (lines.length > 0) {
    return Array.from(lines)
      .map((line) => line.textContent || "")
      .join("\n");
  }
  return codeEl.textContent || "";
};

/** A "Copy" button for `pre` that says "Copied" for two seconds. */
export const copyButton = (pre: HTMLPreElement): HTMLButtonElement => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "code-copy-btn";
  button.textContent = "Copy";
  button.setAttribute("aria-label", "Copy code");
  let reset: number | undefined;
  const show = (text: string) => {
    button.textContent = text;
    window.clearTimeout(reset);
    reset = window.setTimeout(() => (button.textContent = "Copy"), 2000);
  };
  button.addEventListener("click", () => {
    // navigator.clipboard is undefined outside secure origins.
    const copied =
      navigator.clipboard?.writeText(codeText(pre)) ??
      Promise.reject(new Error("Clipboard unavailable"));
    copied.then(
      () => show("Copied"),
      () => {
        // Clipboard access can be blocked (insecure origin, permissions):
        // select the code so the reader can copy it by hand.
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(pre.querySelector("code") ?? pre);
        selection?.removeAllRanges();
        selection?.addRange(range);
        show("Selected");
      },
    );
  });
  return button;
};
