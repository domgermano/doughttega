/**
 * Runs `callback` once the page has finished loading AND the browser is idle.
 * Used to keep heavy, non-essential work (like three.js) off the critical
 * loading path. Returns a function that cancels the pending call.
 */
export function whenIdle(callback: () => void): () => void {
  const schedule = (): (() => void) => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(callback, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    // Safari has no requestIdleCallback
    const id = window.setTimeout(callback, 2000);
    return () => window.clearTimeout(id);
  };

  if (document.readyState === "complete") return schedule();

  let cancel = () => {};
  const onLoad = () => {
    cancel = schedule();
  };
  window.addEventListener("load", onLoad, { once: true });
  return () => {
    window.removeEventListener("load", onLoad);
    cancel();
  };
}
