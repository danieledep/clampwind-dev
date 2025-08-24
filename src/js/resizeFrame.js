export default function resizeFrame(options = { minPx: 350, maxPx: 750 }) {
  return {
    minPx: options.minPx,
    maxPx: options.maxPx,
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
      // clamp initial width
      const initial = this.$el.offsetWidth;
      this.frameWidth = Math.max(this.minPx, Math.min(this.maxPx, initial));
      this.startWidth = this.frameWidth;
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
