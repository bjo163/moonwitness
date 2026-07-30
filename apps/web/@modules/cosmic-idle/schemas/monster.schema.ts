import { z } from 'zod';

export const baseStatsSchema = z.object({
  hp: z.number(),
  mp: z.number(),
  atk: z.number(),
  def: z.number(),
  mag: z.number(),
  mdef: z.number(),
  spd: z.number(),
});

export const elementSchema = z.enum([
  'NORMAL', 'FIRE', 'WATER', 'GRASS', 
  'ELECTRIC', 'EARTH', 'LIGHT', 'DARK'
]);

export const monsterTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  level: z.number().int().positive(),
  element: elementSchema,
  
  baseStats: baseStatsSchema,
  
  // Growth multipliers
  hpGrowth: z.number(),
  mpGrowth: z.number(),
  atkGrowth: z.number(),
  defGrowth: z.number(),
  magGrowth: z.number(),
  mdefGrowth: z.number(),
  spdGrowth: z.number(),

  // Combat AI / Available skills
  skills: z.array(z.string()),
  
  // Visual asset key
  spriteKey: z.string(),
  
  // Future evolution
  evolutions: z.array(z.object({
    levelReq: z.number(),
    targetId: z.string()
  })).optional(),

  // Weaknesses & Resistances (2.0 = double damage, 0.5 = half damage)
  affinities: z.record(elementSchema, z.number()).optional(),
});

export const monsterDatabaseSchema = z.record(z.string(), monsterTemplateSchema);

export type MonsterTemplateType = z.infer<typeof monsterTemplateSchema>;
