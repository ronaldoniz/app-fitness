import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Evolução Fitness",
    short_name: "Evolução",
    description:
      "Acompanhamento privado e objetivo da evolução de peso para adultos.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#07111f",
    theme_color: "#07111f",
    lang: "pt-BR",
    categories: ["health", "lifestyle"],
    icons: [
      {
        src: "/icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
