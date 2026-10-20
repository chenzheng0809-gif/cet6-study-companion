import type { MetadataRoute } from "next";

/** PWA-ready manifest. Round 1 ships the architecture; icons arrive in round 2. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CET-6 Study Companion · 六级备考督学",
    short_name: "六级督学",
    description: "每天一点点，六级稳稳向前。",
    start_url: "/",
    display: "standalone",
    background_color: "#F8F8F5",
    theme_color: "#DFFF63",
    orientation: "portrait",
    lang: "zh-CN",
    icons: [],
  };
}
