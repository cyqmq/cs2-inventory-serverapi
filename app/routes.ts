import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const apiRoutePrefixes = [
  "api.",
  "healthz.",
  "translations.",
  "app[.]webmanifest.",
  "index[.]html."
];

const routes = await flatRoutes();
export default routes.filter((route) => {
  const file = (route.file ?? "").replace(/^routes\//, "");
  return apiRoutePrefixes.some((prefix) => file.startsWith(prefix));
});
