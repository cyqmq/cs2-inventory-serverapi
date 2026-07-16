/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getUserIdFromRequest } from "./auth.server";
import { migrateInventory } from "@api/middleware/migrate-inventory.server";
import { removeTrailingDots } from "@api/middleware/remove-trailing-dots.server";
import { removeTrailingSlashes } from "@api/middleware/remove-trailing-slashes.server";
import { touchLastSeen } from "./models/user.server";

export async function middleware(request: Request, userId?: string) {
  userId ??= await getUserIdFromRequest(request);
  await removeTrailingDots(request);
  await removeTrailingSlashes(request);
  await migrateInventory(userId);
  if (userId !== undefined) {
    await touchLastSeen(userId);
  }
}
