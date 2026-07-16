/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { z } from "zod";
import { api } from "@api/api.server";
import { middleware } from "@api/middleware.server";
import {
  API_SCOPE,
  STATTRAK_INCREMENT_SCOPE,
  isApiKeyValid
} from "@api/models/api-credential.server";
import {
  existsUser,
  findUniqueUser,
  manipulateUserInventory
} from "@api/models/user.server";
import {
  badRequest,
  methodNotAllowed,
  noContent,
  unauthorized
} from "@api/responses.server";
import { nonNegativeInt } from "@shared/utils/shapes";
import type { Route } from "./+types/api.increment-item-stattrak._index";

export const action = api(async ({ request }: Route.ActionArgs) => {
  await middleware(request);
  if (request.method !== "POST") {
    throw methodNotAllowed;
  }
  const { apiKey, userId, targetUid } = z
    .object({
      apiKey: z.string(),
      userId: z.string(),
      targetUid: nonNegativeInt
    })
    .parse(await request.json());

  if (!(await isApiKeyValid(apiKey, [API_SCOPE, STATTRAK_INCREMENT_SCOPE]))) {
    throw unauthorized;
  }

  if (!(await existsUser(userId))) {
    throw badRequest;
  }

  try {
    const { inventory: rawInventory } = await findUniqueUser(userId);
    await manipulateUserInventory({
      rawInventory,
      userId,
      manipulate(inventory) {
        inventory.incrementItemStatTrak(targetUid);
      }
    });
    return noContent;
  } catch {
    return badRequest;
  }
});

export { loader } from "./api.$";
