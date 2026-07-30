import { z } from 'zod';
import { baseStatsSchema } from './monster.schema';

export const playerClassSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  baseStats: baseStatsSchema.extend({ luk: z.number() }),
  statGrowth: baseStatsSchema.extend({ luk: z.number() })
});

export const titleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  bonuses: z.object({
    hp: z.number().optional(),
    mp: z.number().optional(),
    atk: z.number().optional(),
    def: z.number().optional(),
    mag: z.number().optional(),
    mdef: z.number().optional(),
    spd: z.number().optional(),
    luk: z.number().optional(),
  }).optional()
});

export const achievementSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.enum(['KILL_MONSTERS', 'COLLECT_NUR', 'REACH_LEVEL', 'CRAFT_ITEMS']),
  targetAmount: z.number(),
  rewardTitleId: z.string().optional()
});

export const expCurveSchema = z.object({
  base: z.number(),
  multiplier: z.number(),
  maxLevel: z.number()
});

export const progressionDatabaseSchema = z.object({
  expCurve: expCurveSchema,
  classes: z.record(z.string(), playerClassSchema),
  titles: z.record(z.string(), titleSchema),
  achievements: z.record(z.string(), achievementSchema)
});
