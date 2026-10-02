import { project } from "@/config/project";
import { httpUrl } from "@/lib/links";

export function sharePageUrl() {
  const configured = httpUrl(project.siteUrl);
  if (configured) return configured;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function xShareUrl(text: string) {
  const params = new URLSearchParams();
  params.set("text", text);
  const url = sharePageUrl();
  if (url) params.set("url", url);
  return `https://x.com/intent/tweet?${params.toString()}`;
}

export function openXShare(text: string) {
  window.open(xShareUrl(text), "_blank", "noopener,noreferrer");
}
