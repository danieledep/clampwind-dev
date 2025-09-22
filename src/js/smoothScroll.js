export default (opt = { offset: null }) => ({
	hash: null,
	targetEl: null,
	offset: opt.offset || null,
	scrollOffset: null,

	init() {
		if (!this.$root.hash) {
			// doesn't start with a hash
			return;
		}

		this.hash = decodeURIComponent(this.$root.hash);
		this.targetEl = document.body.querySelector(this.hash);
		if (!this.targetEl) {
			// element doesn't exist
			return;
		}

		// Calculate the scroll offset
		this.scrollOffset = this.calculateOffset(opt.offset);

		// Add click event listener
		this.$root.addEventListener("click", (event) => this.scroll(event));
	},

	calculateOffset(offset) {
		if (offset === null) {
			return parseInt(
				getComputedStyle(this.targetEl).getPropertyValue("scroll-margin-top") ||
					getComputedStyle(this.targetEl).getPropertyValue("scroll-padding-top") ||
						0
			);
		}

		if (typeof offset === "string") {
			if (offset.startsWith("--")) {
				return parseInt(
					getComputedStyle(document.documentElement).getPropertyValue(offset)
				);
			} else if (offset.endsWith("px")) {
				return parseInt(offset);
			} else if (offset.endsWith("rem")) {
				return (
					parseInt(offset) *
					parseInt(getComputedStyle(document.documentElement).fontSize)
				);
			} else {
				const offsetEl = document.body.querySelector(offset);
				if (offsetEl) {
					return offsetEl.clientHeight;
				} else {
					console.warn(`Offset element not found: ${offset}`);
				}
			}
		} else if (offset instanceof HTMLElement) {
			return offset.clientHeight;
		} else if (typeof offset === "number") {
			return offset;
		} else {
			console.warn(`Invalid offset type: ${typeof offset}`);
		}
	},

	scroll(event) {
		event.stopPropagation();
		event.preventDefault();

		const targetBox = this.targetEl.getBoundingClientRect();
		const y = targetBox.top + window.scrollY - this.scrollOffset;

		window.scrollTo({ top: y, left: 0, behavior: "smooth" });

		history.pushState({}, document.title, this.$root.hash);

	},
});
