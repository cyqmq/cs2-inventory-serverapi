import { CS2Economy, CS2_ITEMS } from "@ianlucas/cs2-lib";
import { english } from "@ianlucas/cs2-lib/translations";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { warmViewerCaches } from "./data/viewer.server";
import { setupLogo } from "./logo.server";
import { setupRules } from "./models/rule";
import { scheduleInactivityReset } from "./routines/reset-inactive-inventory";
import { setupPurge } from "./routines/setup-purge";
import { setupTranslation } from "./translation.server";

CS2Economy.load({ items: CS2_ITEMS, language: english });
setupTranslation();
Promise.all([
  setupPurge().catch(() => {}),
  setupRules()
    .then(() => Promise.all([setupLogo(), warmViewerCaches()]))
    .catch(() => {})
]).then(() => {
  scheduleInactivityReset();
});

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  if (isbot(request.headers.get("user-agent"))) {
    return handleBotRequest(request, responseStatusCode, responseHeaders, reactRouterContext);
  }
  return handleBrowserRequest(request, responseStatusCode, responseHeaders, reactRouterContext);
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(new Response(stream, { headers: responseHeaders, status: responseStatusCode }));
          pipe(body);
        },
        onShellError(error: unknown) { reject(error); },
        onError(error: unknown) {
          if (shellRendered) console.error(error);
        }
      }
    );
    setTimeout(abort, 5_000);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(new Response(stream, { headers: responseHeaders, status: responseStatusCode }));
          pipe(body);
        },
        onShellError(error: unknown) { reject(error); },
        onError(error: unknown) {
          if (shellRendered) console.error(error);
        }
      }
    );
    setTimeout(abort, 5_000);
  });
}
