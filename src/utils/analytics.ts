const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const STORAGE_KEY = 'stationGuessr.utm';

/**
 * Captures UTM params from the initial page load (e.g. a YouTube community
 * post link) and keeps them in sessionStorage so they survive client-side
 * navigation, ready for a future analytics integration (GA4, etc.).
 */
export function captureUtmParams(): void {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  if (Object.keys(utm).length > 0) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    } catch {
      // sessionStorage may be unavailable (e.g. private browsing); non-critical.
    }
  }
}

export function getStoredUtmParams(): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Placeholder analytics hook. Wire this up to GA4 (gtag) once an account exists. */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, { ...getStoredUtmParams(), ...params });
  }
}
