import type { Config } from "@react-router/dev/config";

const isApiMode = process.env.API_MODE === "true";

export default {
  ssr: !isApiMode,
  prerender: false
} satisfies Config;