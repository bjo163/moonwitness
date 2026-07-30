import { z } from 'zod';

export const npcRoleSchema = z.enum([
  'TOWNSFOLK',
  'MERCHANT',
  'QUEST_GIVER',
  'GUARD',
  'ENEMY'
]);

export const waypointSchema = z.object({
  x: z.number(),
  y: z.number(),
  waitTimeMs: z.number().default(1000)
});

export const npcScheduleEntrySchema = z.object({
  startTime: z.number(), // In-game hour (0-23)
  behavior: z.enum(['IDLE', 'PATROL', 'SLEEP']),
  targetMap: z.string().optional(),
  waypoints: z.array(waypointSchema).optional(),
});

export const npcTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  spriteKey: z.string(),
  role: npcRoleSchema,
  
  // Dialogue
  defaultDialogueId: z.string().optional(),
  
  // AI Settings
  moveSpeed: z.number().default(50),
  defaultBehavior: z.enum(['IDLE', 'PATROL']),
  defaultWaypoints: z.array(waypointSchema).optional(),
  
  // Daily Schedule (Future-proofing for Stardew/Persona style schedules)
  schedule: z.array(npcScheduleEntrySchema).optional(),

  // Role specific
  shopId: z.string().optional(),
  battleTemplateId: z.string().optional()
});

export const npcDatabaseSchema = z.record(z.string(), npcTemplateSchema);

export type NpcTemplateType = z.infer<typeof npcTemplateSchema>;
export type NpcWaypointType = z.infer<typeof waypointSchema>;
