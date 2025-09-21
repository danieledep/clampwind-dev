export default function resizeFrame() {
  return {
    minPx: null,
    maxPx: null,
    isResizing: false,
    startX: 0,
    startWidth: 0,
    frameWidth: 0,
    nextWidth: null,
    rafId: null,
    moveHandler: null,
    upHandler: null,
    handleEl: null,

    init() {
      const style = getComputedStyle(this.$root);
      const parsePx = (v, fallback) => {
        if (!v || v === 'none' || v === 'auto') return fallback;
        const n = parseFloat(v);
        return Number.isFinite(n) ? n : fallback;
      };

      this.minPx = parsePx(style.minWidth, 0);
      this.maxPx = parsePx(style.maxWidth, Infinity);

      const initial = this.$root.offsetWidth;
      this.frameWidth = Math.max(this.minPx, Math.min(this.maxPx, initial));
      this.startWidth = this.frameWidth;

      window.addEventListener('resize', () => {
        const style = getComputedStyle(this.$root);
        const parsePx = (v, fallback) => {
          if (!v || v === 'none' || v === 'auto') return fallback;
          const n = parseFloat(v);
          return Number.isFinite(n) ? n : fallback;
        };
        this.minPx = parsePx(style.minWidth, 0);
        this.maxPx = parsePx(style.maxWidth, Infinity);
        this.frameWidth = Math.max(this.minPx, Math.min(this.maxPx, this.$root.offsetWidth));
      });
    },

    startResize(e) {
      e.preventDefault();
      this.isResizing = true;
      this.startX = e.clientX;
      this.startWidth = this.frameWidth; // ✅ ensure baseline width
      this.handleEl = e.currentTarget;

      if (e.pointerId != null && this.handleEl.setPointerCapture) {
        this.handleEl.setPointerCapture(e.pointerId);
      }

      this.moveHandler = (ev) => this.queueResize(ev);
      this.upHandler   = (ev) => this.stopResize(ev);

      document.addEventListener('pointermove', this.moveHandler);
      document.addEventListener('pointerup', this.upHandler, { once: true });
      document.addEventListener('pointercancel', this.upHandler, { once: true });
    },

    queueResize(e) {
      if (!this.isResizing) return;

      const deltaX = e.clientX - this.startX;
      const rawWidth = this.startWidth + deltaX;
      this.nextWidth = Math.max(this.minPx, Math.min(this.maxPx, rawWidth));

      if (this.rafId == null) {
        this.rafId = requestAnimationFrame(() => {
          if (this.nextWidth != null) this.frameWidth = this.nextWidth;
          this.rafId = null;
        });
      }
    },

    stopResize(e = null) { // ✅ make event optional
      if (!this.isResizing) return;

      if (this.rafId != null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
        if (this.nextWidth != null) this.frameWidth = this.nextWidth;
      }

      if (this.handleEl && e && e.pointerId != null && this.handleEl.releasePointerCapture) {
        try { this.handleEl.releasePointerCapture(e.pointerId); } catch (_) {}
      }

      document.removeEventListener('pointermove', this.moveHandler);
      this.moveHandler = this.upHandler = null;
      this.isResizing = false;
    },

    // Alpine cleans up automatically; include only if you need manual cleanup
    destroyed() {
      this.stopResize();
    }
  }
}
