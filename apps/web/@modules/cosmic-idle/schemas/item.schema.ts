import { z } from 'zod';

export const itemCategorySchema = z.enum(['CONSUMABLE', 'MATERIAL', 'WEAPON', 'ARMOR', 'KEY_ITEM']);
export const itemRaritySchema = z.enum(['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY']);

export const baseItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: itemCategorySchema,
  rarity: itemRaritySchema,
  price: z.number().int().nonnegative(),
  maxStack: z.number().int().positive(),
  icon: z.string()
});

export const equippableStatsSchema = z.object({
  atkBonus: z.number().optional(),
  defBonus: z.number().optional(),
  hpBonus: z.number().optional(),
  mpBonus: z.number().optional(),
  agiBonus: z.number().optional(),
});

export const equippableItemSchema = baseItemSchema.extend({
  category: z.enum(['WEAPON', 'ARMOR']),
  stats: equippableStatsSchema
});

export const consumableItemSchema = baseItemSchema.extend({
  category: z.literal('CONSUMABLE'),
  effects: z.object({
    healHp: z.number().optional(),
    healMp: z.number().optional(),
    buffAtk: z.number().optional(),
  })
});

// A union that handles all item types
export const itemSchema = z.discriminatedUnion('category', [
  equippableItemSchema,
  consumableItemSchema,
  baseItemSchema.extend({ category: z.enum(['MATERIAL', 'KEY_ITEM']) })
]);

export const itemDatabaseSchema = z.record(z.string(), itemSchema);

export type ItemType = z.infer<typeof itemSchema>;
