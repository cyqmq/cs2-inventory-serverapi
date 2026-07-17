import { data } from "react-router";
import { findRequestUser } from "@api/auth.server";
import { middleware } from "@api/middleware.server";
import { getClientRules } from "@api/models/rule";
import { steamCallbackUrl } from "@api/models/rule.server";
import { getBackground } from "@api/preferences/background.server";
import { getLanguage } from "@api/preferences/language.server";
import { getToggleable } from "@api/preferences/toggleable.server";
import { getSession } from "@api/session.server";
import { nonEmptyString } from "@shared/utils/misc";
import {
  ASSETS_BASE_URL,
  CLOUDFLARE_ANALYTICS_TOKEN,
  SOURCE_COMMIT,
  VIEWER_ASSETS_BASE_URL,
  VIEWER_EMBED_URL
} from "@api/env.server";
import {
  resolveViewerOriginAllowed,
  resolveViewerCatalog
} from "@api/data/viewer.server";
import type { Route } from "./+types/api.init._index";

export async function loader({ request }: Route.LoaderArgs) {
  await middleware(request);
  const session = await getSession(request.headers.get("Cookie"));
  const user = await findRequestUser(request);
  const ipCountry = request.headers.get("CF-IPCountry");
  const { origin: appUrl, host: appSiteName } = new URL(
    await steamCallbackUrl.get()
  );
  const clientRules = await getClientRules(user?.id);
  return data({
    rules: {
      ...clientRules,
      assetsBaseUrl: nonEmptyString(ASSETS_BASE_URL),
      viewerEmbedUrl: nonEmptyString(VIEWER_EMBED_URL),
      viewerAssetsBaseUrl: nonEmptyString(VIEWER_ASSETS_BASE_URL),
      cloudflareAnalyticsToken: nonEmptyString(CLOUDFLARE_ANALYTICS_TOKEN),
      sourceCommit: SOURCE_COMMIT,
      viewerOriginAllowed: resolveViewerOriginAllowed({
        enabled: clientRules.viewerEnabled,
        hostname: new URL(appUrl).hostname,
        key: clientRules.viewerKey
      }),
      viewerCatalog: clientRules.viewerEnabled
        ? await resolveViewerCatalog()
        : undefined,
      meta: { appUrl, appSiteName }
    },
    preferences: {
      ...(await getBackground(session)),
      ...(await getLanguage(session, ipCountry)),
      ...(await getToggleable(session))
    },
    user
  });
}
