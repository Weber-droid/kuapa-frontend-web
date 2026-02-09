import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kuapa - AI Crop Disease Detection",
    short_name: "Kuapa",
    description:
      "Detect crop diseases instantly using AI. Kuapa helps farmers protect their harvests with smart disease identification and treatment recommendations.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#22c55e",
    orientation: "portrait-primary",
    categories: ["agriculture", "utilities", "productivity"],
    icons: [
      {
        src: "/icons/icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/dashboard.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow",
        label: "Dashboard showing farm health overview",
      },
      {
        src: "/screenshots/scan.png",
        sizes: "1080x1920",
        type: "image/png",
        form_factor: "narrow",
        label: "Camera scan for disease detection",
      },
    ],
    shortcuts: [
      {
        name: "Scan Crop",
        short_name: "Scan",
        description: "Open camera to scan a crop for diseases",
        url: "/scan",
        icons: [{ src: "/icons/scan-shortcut.png", sizes: "96x96" }],
      },
      {
        name: "Scan History",
        short_name: "History",
        description: "View your previous scan results",
        url: "/history",
        icons: [{ src: "/icons/history-shortcut.png", sizes: "96x96" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
