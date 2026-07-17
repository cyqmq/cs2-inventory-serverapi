/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { assert } from "@ianlucas/cs2-lib";
import dotenv from "dotenv";

dotenv.config({
  quiet: true
});

assert(process.env.DATABASE_URL, "DATABASE_URL must be set");
export const DATABASE_URL = process.env.DATABASE_URL;

assert(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
export const SESSION_SECRET = process.env.SESSION_SECRET;

assert(
  process.env.ELECTRON_AUTH_SECRET,
  "ELECTRON_AUTH_SECRET must be set (generate a random value)"
);
export const ELECTRON_AUTH_SECRET = process.env.ELECTRON_AUTH_SECRET;

export const {
  ASSETS_BASE_URL,
  CLOUDFLARE_ANALYTICS_TOKEN,
  CS2_CSGO_PATH,
  PUBLIC_HOSTNAME,
  SOURCE_COMMIT,
  STEAM_API_KEY,
  STEAM_CALLBACK_URL,
  TRUSTED_HOSTNAMES,
  VIEWER_ASSETS_BASE_URL,
  VIEWER_EMBED_URL,
  VIEWER_KEY
} = process.env;
