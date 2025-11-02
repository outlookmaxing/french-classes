import { useEffect } from "react";

export function usePrefetchNextScene(assets: string[] = []) {
  useEffect(() => {
    const links: HTMLLinkElement[] = [];
    assets.forEach((href) => {
      if (!href) return;
      const l = document.createElement("link");
      l.rel = "prefetch";
      l.href = href;
      document.head.appendChild(l);
      links.push(l);
    });
    return () => links.forEach(l => l.remove());
  }, [assets]);
}