import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const apiRoutePrefixes = [
  "api.",
  "healthz.",
  "translations.",
  "app[.]webmanifest.",
  "index[.]html."
];

const isApiMode = process.env.API_MODE === "true";

const allRoutes = await flatRoutes();
const filtered = allRoutes.filter((route) => {
  if (!isApiMode) return true;
  const file = (route.file ?? "").replace(/^routes\//, "");
  return apiRoutePrefixes.some((prefix) => file.startsWith(prefix));
});

export default filtered satisfies RouteConfig;