export type SiteRelease = { release: string; chainId: number };
type Options = {
  release: string;
  fetchRelease: () => Promise<unknown>;
  isBusy: () => boolean;
  isVisible: () => boolean;
  hasReloaded: (release: string) => boolean;
  reload: (release: string) => void;
};

// Metadata checks use our own web server, never a blockchain RPC.
export function createSiteUpdater(options: Options) {
  let pending: string | undefined;
  let checking = false;
  let disposed = false;
  let reloading = false;
  const flush = () => {
    if (disposed || reloading || !pending || !options.isVisible() || options.isBusy()
      || options.hasReloaded(pending)) return;
    reloading = true;
    options.reload(pending);
  };
  return {
    flush,
    async check() {
      if (disposed || checking || reloading || !options.isVisible()) return;
      checking = true;
      try {
        const value = await options.fetchRelease() as Partial<SiteRelease> | null;
        if (disposed || !value || value.chainId !== 1 || typeof value.release !== "string"
          || !/^[a-zA-Z0-9_-]{1,128}$/.test(value.release) || value.release === options.release) return;
        pending = value.release;
        flush();
      } catch {
        // Offline/failed checks must never replace the page or interrupt a wallet.
      } finally { checking = false; }
    },
    dispose() { disposed = true; pending = undefined; },
  };
}
