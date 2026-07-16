/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { z } from "zod";
import { api } from "@api/api.server";
import { middleware } from "@api/middleware.server";
import {
  API_SCOPE,
  INVENTORY_SCOPE,
  isApiKeyValid
} from "@api/models/api-credential.server";
import { findUniqueUser, manipulateUserInventory } from "@api/models/user.server";
import {
  badRequest,
  methodNotAllowed,
  noContent,
  unauthorized
} from "@api/responses.server";
import { clientInventoryItemShape } from "@api/utils/shapes.server";
import type { Route } from "./+types/api.add-item._index";

export const action = api(async ({ request }: Route.ActionArgs) => {
  await middleware(request);
  if (request.method !== "POST") {
    throw methodNotAllowed;
  }
  const { apiKey, userId, inventoryItem } = z
    .object({
      apiKey: z.string(),
      inventoryItem: clientInventoryItemShape,
      userId: z.string()
    })
    .parse(await request.json());

  if (!(await isApiKeyValid(apiKey, [API_SCOPE, INVENTORY_SCOPE]))) {
    throw unauthorized;
  }

  try {
    const { inventory: rawInventory } = await findUniqueUser(userId);
    await manipulateUserInventory({
      rawInventory,
      userId,
      manipulate(inventory) {
        inventory.add(inventoryItem);
      }
    });
    return noContent;
  } catch {
    return badRequest;
  }
});

export { loader } from "./api.$";
