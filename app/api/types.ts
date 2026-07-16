export interface ItemEditorAttributes {
  keychains?: Record<string, { id: number; seed?: number; x?: number; y?: number; z?: number }>;
  nameTag?: string;
  patches?: Record<string, number>;
  quantity: number;
  seed?: number;
  statTrak?: boolean;
  stickers?: Record<string, { id: number; rotation?: number; schema?: number; wear?: number; x?: number; y?: number }>;
  wear?: number;
}
