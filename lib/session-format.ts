// lib/session-format.ts
export function parseDevice(userAgent?: string | null) {
  if (!userAgent) return "অজানা ডিভাইস";

  const browser = /Edg\//.test(userAgent)
    ? "Edge"
    : /Chrome\//.test(userAgent)
      ? "Chrome"
      : /Firefox\//.test(userAgent)
        ? "Firefox"
        : /Safari\//.test(userAgent)
          ? "Safari"
          : "ব্রাউজার";

  const os = /Windows/.test(userAgent)
    ? "Windows"
    : /Mac OS/.test(userAgent)
      ? "macOS"
      : /Android/.test(userAgent)
        ? "Android"
        : /iPhone|iPad/.test(userAgent)
          ? "iOS"
          : /Linux/.test(userAgent)
            ? "Linux"
            : "";

  return os ? `${browser} · ${os}` : browser;
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("bn-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}
