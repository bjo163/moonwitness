import { z } from 'zod';

export const questTypeSchema = z.enum(['STORY', 'SIDE', 'DAILY', 'REPEATABLE']);
export const questObjectiveTypeSchema = z.enum(['KILL_MONSTER', 'COLLECT_ITEM', 'TALK_NPC', 'REACH_LOCATION']);

export const questObjectiveSchema = z.object({
  id: z.string(),
  type: questObjectiveTypeSchema,
  targetId: z.string(),
  requiredAmount: z.number().int().positive(),
  description: z.string()
});

export const questRewardSchema = z.object({
  nur: z.number().optional(),
  exp: z.number().optional(),
  items: z.array(z.object({
    itemId: z.string(),
    amount: z.number()
  })).optional()
});

export const questSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  type: questTypeSchema,
  levelReq: z.number().int().nonnegative().optional(),
  prerequisiteQuestId: z.string().optional(),
  
  objectives: z.array(questObjectiveSchema),
  rewards: questRewardSchema
});

export const questDatabaseSchema = z.record(z.string(), questSchema);

export type QuestTemplateType = z.infer<typeof questSchema>;
