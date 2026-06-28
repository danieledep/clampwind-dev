import Alpine from 'alpinejs'
import ResizeFrame from './resizeFrame.js'
import setFavicon from "./favicon.js";
import smoothScroll from "./smoothScroll.js";
import '/src/css/main.css'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'


Alpine.data('resizeFrame', ResizeFrame);
Alpine.data('smoothScroll', smoothScroll);

window.Alpine = Alpine

Alpine.start()

// Only wrap clamp() classes in pills for code blocks opted in via .clamp-highlight.
// The wrap hook has no element reference, so record it per-element in before-highlight
// (highlighting is synchronous, so this flag is current for the element being stringified).
let clampHighlight = false;
Prism.hooks.add("before-highlight", function (env) {
  clampHighlight = env.element.classList.contains("clamp-highlight");
});

Prism.hooks.add("wrap", function (env) {
  if (!clampHighlight) return;

  // Only modify attribute values (e.g., inside class="")
  if (env.type !== "attr-value") return;

  // env.content is already-rendered HTML: the quote characters are wrapped in
  // their own token spans. So don't split on whitespace (that would shatter the
  // inner markup) — instead wrap only the plain-text class runs containing
  // clamp(). Excluding whitespace, angle brackets and quotes keeps the
  // surrounding token markup intact.
  env.content = env.content.replace(
    /[^\s<>"']*clamp\([^\s<>"']*/g,
    cls => `<span class="highlight bg-[lab(19.93%_-1.66_-9.7)] rounded px-4 py-2">${cls}</span>`
  );
});

setFavicon();

Prism.highlightAll()
