/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { MetaFunction } from "react-router";
import { getMetaTitle } from "@web/root-meta";

export const meta: MetaFunction = getMetaTitle();

export default function Index() {
  return (
    <main
      style={{
        fontFamily: "sans-serif",
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto"
      }}
    >
      <h1>CS2 Inventory Simulator API</h1>
      <p>Backend API server is running.</p>
      <ul>
        <li>
          <a href="/api/init">/api/init</a> — Initialize session data
        </li>
        <li>
          <a href="/healthz">/healthz</a> — Health check
        </li>
      </ul>
    </main>
  );
}