import Alpine from 'alpinejs'
import ResizeFrame from './resizeFrame.js'
import '/src/css/main.css'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'


Alpine.data('resizeFrame', ResizeFrame);

window.Alpine = Alpine

Alpine.start()

Prism.hooks.add("wrap", function (env) {
  // Only modify attribute values (e.g., inside class="")
  if (env.type !== "attr-value") return;

  // Split class list by spaces
  let classes = env.content.split(/\s+/);
  classes = classes.map(cls => {
    if (cls.includes("clamp(")) {
      return `<span class="highlight bg-[lab(19.93%_-1.66_-9.7)] rounded px-4 py-2">${cls}</span>`;
    }
    return cls;
  });

  env.content = classes.join(" ");
});

Prism.highlightAll()
