import { ELECTRON_AUTH_SECRET } from "@api/env.server";
import { badRequest } from "@api/responses.server";
import type { Route } from "./+types/api.auth.electron-config._index";

export async function loader({ request }: Route.LoaderArgs) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  if (!secret || secret !== ELECTRON_AUTH_SECRET) throw badRequest;
  return Response.json({
    steamApiKey: process.env.STEAM_API_KEY || ""
  });
}
