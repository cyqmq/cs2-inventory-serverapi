import { middleware } from "@api/middleware.server";
import { commitSession, getSession } from "@api/session.server";
import { upsertUser } from "@api/models/user.server";
import { badRequest } from "@api/responses.server";
import { ELECTRON_AUTH_SECRET } from "@api/env.server";
import type { Route } from "./+types/api.auth.electron._index";

export async function loader({ request }: Route.LoaderArgs) {
  await middleware(request);
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get("steamId");
  const secret = searchParams.get("secret");
  const nickname = searchParams.get("nickname") || "Player";
  const avatarUrl = searchParams.get("avatar") || "";

  if (!steamId || !secret || secret !== ELECTRON_AUTH_SECRET) {
    throw badRequest;
  }

  const userId = await upsertUser({
    steamID: steamId,
    nickname,
    avatar: { medium: avatarUrl }
  });
  const session = await getSession(request.headers.get("cookie"));
  session.set("userId", userId);

  return Response.json({
    sessionCookie: await commitSession(session)
  });
}
