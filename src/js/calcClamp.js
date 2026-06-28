// Tailwind utility prefix -> { read, label }.
// `read` is the longhand we sample from getComputedStyle (shorthands like
// paddingBlock resolve inconsistently across browsers); `label` is what we
// print. When a utility sets two sides equally (px/py), reading one longhand
// is correct but the printed name should reflect the axis it controls.
// Extend as needed; falls back to font-size (the common case in these demos).
const PROPERTY_MAP = {
	text: { read: "fontSize", label: "font-size" },
	leading: { read: "lineHeight", label: "line-height" },
	tracking: { read: "letterSpacing", label: "letter-spacing" },
	p: { read: "padding", label: "padding" },
	px: { read: "paddingLeft", label: "padding-inline" },
	py: { read: "paddingTop", label: "padding-block" },
	m: { read: "margin", label: "margin" },
	mx: { read: "marginLeft", label: "margin-inline" },
	my: { read: "marginTop", label: "margin-block" },
	gap: { read: "gap", label: "gap" },
	w: { read: "width", label: "width" },
	h: { read: "height", label: "height" },
	"min-w": { read: "minWidth", label: "min-width" },
	"min-h": { read: "minHeight", label: "min-height" },
	"max-w": { read: "maxWidth", label: "max-width" },
	"max-h": { read: "maxHeight", label: "max-height" },
	size: { read: "width", label: "size" },
	rounded: { read: "borderRadius", label: "border-radius" },
};

const FALLBACK = { read: "fontSize", label: "font-size" };

// Reports the live value a clampwind utility resolves to at the current
// viewport, e.g. `text-[clamp(40,96)]` -> "font-size: 73.4112px;".
//
// Rather than reimplement the clamp() math, we drop a hidden probe element
// carrying the same class and read back its computed style. postcss-clampwind
// has already compiled that class into real CSS, so the browser does the
// interpolation for us and the value stays correct on every resize.
export default function calcClamp(opts = {}) {
	return {
		probe: null,
		prop: FALLBACK,
		onResize: null,

		init() {
			const cls = (opts.class || "").trim();
			if (!cls) return;

			// Utility prefix sits before the first "-[", after any variant (e.g. "md:text").
			const prefix = cls.split("-[")[0].split(":").pop();
			this.prop = PROPERTY_MAP[prefix] || FALLBACK;

			this.probe = document.createElement("span");
			this.probe.className = cls;
			this.probe.style.cssText =
				"position:absolute;top:0;left:0;visibility:hidden;pointer-events:none;";
			document.body.appendChild(this.probe);

			this.update();

			this.onResize = () => this.update();
			window.addEventListener("resize", this.onResize);
		},

		update() {
			const value = getComputedStyle(this.probe)[this.prop.read];
			this.$el.textContent = `${this.prop.label}: ${value};`;
		},

		destroy() {
			if (this.onResize) window.removeEventListener("resize", this.onResize);
			this.probe?.remove();
		},
	};
}
