import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3000 },
  plugins: [reactRouter()],
  define: {
    __SPLASH_SCRIPT__: JSON.stringify(""),
    __TRANSLATION_CHECKSUM__: JSON.stringify(""),
    __SOURCE_COMMIT__: JSON.stringify(process.env.SOURCE_COMMIT)
  }
});
