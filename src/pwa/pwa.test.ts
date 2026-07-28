import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import manifest from "../app/manifest";

describe("PWA", () => {
  it("declares an installable standalone manifest with both required icon sizes", () => {
    const value = manifest();
    const iconSizes = value.icons?.map((icon) => icon.sizes);

    expect(value.name).toBe("Evolução Fitness");
    expect(value.start_url).toBe("/");
    expect(value.display).toBe("standalone");
    expect(iconSizes).toContain("192x192");
    expect(iconSizes).toContain("512x512");
    expect(value.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ src: "/icon/192" }),
        expect.objectContaining({ src: "/icon/512" }),
      ]),
    );
  });

  it("limits service worker caching to framework and PWA static assets", () => {
    const serviceWorker = readFileSync(
      new URL("../../public/sw.js", import.meta.url),
      "utf8",
    );

    expect(serviceWorker).toContain('url.pathname.startsWith("/_next/static/")');
    expect(serviceWorker).toContain("PWA_ASSETS.has(url.pathname)");
    expect(serviceWorker).toContain('"/icon/192"');
    expect(serviceWorker).toContain('"/icon/512"');
    expect(serviceWorker).not.toContain("request.destination");
    expect(serviceWorker).not.toContain("/configuracoes/exportar");
  });
});
