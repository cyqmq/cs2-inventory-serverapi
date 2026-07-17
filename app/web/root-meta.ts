/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { MetaFunction } from "react-router";
import { DEFAULT_APP_NAME } from "./app-defaults";

export function getMetaTitle(key?: string): MetaFunction {
  return function meta({ matches }) {
    const rootData = matches.find((match) => match.id === "root");
    const rootMatchData = rootData?.loaderData as Record<string, any> | undefined;
    const appName = rootMatchData?.rules?.appName || DEFAULT_APP_NAME;
    return [
      { title: `${key !== undefined ? `${key} - ` : ""}${appName}` }
    ];
  };
}