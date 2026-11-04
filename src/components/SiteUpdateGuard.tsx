"use client";
import { useEffect, useRef } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { createSiteUpdater } from "../lib/siteUpdate";

const RELEASE = __SITE_RELEASE__;
const PARAMETER = "__immute_release";

export function SiteUpdateGuard() {
  const mutations = useIsMutating();
  const receipts = useIsFetching({ predicate: query => query.queryKey[0] === "waitForTransactionReceipt" });
  const walletBusy = useRef(false);
  walletBusy.current = mutations > 0 || receipts > 0;

  useEffect(() => {
    if (!RELEASE) return;
    const initial = new URL(window.location.href);
    if (initial.searchParams.get(PARAMETER) === RELEASE) {
      initial.searchParams.delete(PARAMETER);
      window.history.replaceState(window.history.state, "", initial.href);
    }
    let lastCheck = 0;
    let controller: AbortController | undefined;
    const updater = createSiteUpdater({
      release: RELEASE,
      isVisible: () => document.visibilityState === "visible",
      isBusy: () => walletBusy.current
        || !!document.querySelector('[role="dialog"], [aria-modal="true"], [data-sonner-toast][data-type="loading"]')
        || (document.activeElement instanceof HTMLElement
          && document.activeElement.matches('input, textarea, select, [contenteditable="true"]')),
      fetchRelease: async () => {
        controller = new AbortController();
        const timeout = window.setTimeout(() => controller?.abort(), 5000);
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}release.json?t=${Date.now()}`, { cache: "no-store", credentials: "omit", signal: controller.signal });
          if (!response.ok) throw new Error("Release check unavailable");
          return await response.json();
        } finally { window.clearTimeout(timeout); }
      },
      hasReloaded: release => {
        if (new URL(window.location.href).searchParams.get(PARAMETER) === release) return true;
        try { return window.sessionStorage.getItem("immute-auto-update") === release; } catch { return false; }
      },
      reload: release => {
        try { window.sessionStorage.setItem("immute-auto-update", release); } catch {}
        const url = new URL(window.location.href);
        url.searchParams.set(PARAMETER, release);
        window.location.replace(url.href);
      },
    });
    const check = () => {
      if (document.visibilityState !== "visible" || Date.now() - lastCheck < 10000) return;
      lastCheck = Date.now();
      void updater.check();
    };
    check();
    const polling = window.setInterval(check, 120000);
    const deferred = window.setInterval(updater.flush, 5000);
    window.addEventListener("focus", check);
    window.addEventListener("pageshow", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      updater.dispose(); controller?.abort();
      window.clearInterval(polling); window.clearInterval(deferred);
      window.removeEventListener("focus", check);
      window.removeEventListener("pageshow", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);
  return null;
}
