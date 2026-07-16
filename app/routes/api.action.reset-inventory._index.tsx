/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2Inventory } from "@ianlucas/cs2-lib";
import { redirect } from "react-router";
import { api } from "@api/api.server";
import { requireUser } from "@api/auth.server";
import { middleware } from "@api/middleware.server";
import { updateUserInventory } from "@api/models/user.server";
import type { Route } from "./+types/api.action.reset-inventory._index";

export const ApiActionResetInventoryUrl = "/api/action/reset-inventory";

export const loader = api(async ({ request }: Route.LoaderArgs) => {
  await middleware(request);
  const { id: userId } = await requireUser(request);
  await updateUserInventory(userId, new CS2Inventory().stringify());
  return redirect("/");
});
