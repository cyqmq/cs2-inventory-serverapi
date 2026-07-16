import type { CS2BaseInventoryItem } from "@ianlucas/cs2-lib";

export type ViewerItem = Pick<
  CS2BaseInventoryItem,
  "id" | "seed" | "wear" | "stickers" | "statTrak" | "nameTag"
>;
