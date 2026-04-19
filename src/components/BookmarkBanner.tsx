/**
 * Top-of-page banner. Tells visitors what this is — a static fallback for
 * immute.io — and asks them to bookmark it so they can find it when
 * the main site is unreachable.
 */
export function BookmarkBanner() {
  return (
    <div className="border-b border-emerald-accent/20 bg-emerald-accent/5">
      <div className="max-w-5xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-ink leading-snug">
          <span className="font-medium text-emerald-accent">
            Backup interface ·
          </span>{" "}
          Static GitHub Pages mirror. Use this when{" "}
          <a
            href="https://immute.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-emerald-accent/40 underline-offset-2 hover:text-emerald-accent"
          >
            immute.io
          </a>{" "}
          is unreachable.
        </div>
        <p className="text-[11px] font-mono text-ink-muted">
          ★ Bookmark this URL — it&apos;s your fallback if the main site is
          down.
        </p>
      </div>
    </div>
  );
}
