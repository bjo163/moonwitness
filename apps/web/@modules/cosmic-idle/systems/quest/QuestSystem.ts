import { EventBus } from '../../engine/core/EventBus';
import { useQuestStore } from '../../store/quest.store';
import { usePlayerStore } from '../../store/player.store';
import { DataManager } from '../../engine/core/DataManager';
import { QuestInstance, QuestEventPayload } from '../../types/quest';

export class QuestSystem {
  static initialize() {
    // Listen to global events
    EventBus.on('quest:progress', this.handleEvent, this);
    EventBus.on('quest:start', this.startQuest, this);
    
    // Check daily resets on init
    this.checkDailyResets();
  }

  static destroy() {
    EventBus.off('quest:progress', this.handleEvent, this);
    EventBus.off('quest:start', this.startQuest, this);
  }

  static startQuest(questId: string) {
    const template = DataManager.getQuest(questId);
    if (!template) return;

    const store = useQuestStore.getState();
    if (store.quests[questId]) return; // Already exists

    const progress: Record<string, { id: string; currentAmount: number }> = {};
    template.objectives.forEach(obj => {
      progress[obj.id] = { id: obj.id, currentAmount: 0 };
    });

    const newQuest: QuestInstance = {
      id: questId,
      status: 'ACTIVE',
      progress,
      timestamp: Date.now()
    };

    store.addQuest(newQuest);
    EventBus.emit('ui:toast', `Quest Accepted: ${template.title}`);
  }

  private static handleEvent(payload: QuestEventPayload) {
    const store = useQuestStore.getState();
    const quests = store.quests;

    Object.values(quests).forEach(quest => {
      if (quest.status !== 'ACTIVE') return;

      const template = DataManager.getQuest(quest.id);
      if (!template) return;

      let updated = false;

      template.objectives.forEach((obj: any) => {
        // If objective matches the event type and target
        if (obj.type === payload.type && (obj.targetId === payload.targetId || obj.targetId === 'any')) {
          const prog = quest.progress[obj.id];
          if (prog) {
            const currentProgress = prog.currentAmount;
            if (currentProgress < obj.requiredAmount) {
              const newAmount = Math.min(obj.requiredAmount, currentProgress + payload.amount);
              prog.currentAmount = newAmount;
              updated = true;
            }
          }
        }
      });

      if (updated) {
        store.updateQuest(quest.id, { progress: { ...quest.progress } });
        this.checkCompletion(quest.id);
      }
    });
  }

  private static checkCompletion(questId: string) {
    const store = useQuestStore.getState();
    const quest = store.quests[questId];
    const template = DataManager.getQuest(questId);

    if (!quest || !template || quest.status !== 'ACTIVE') return;

    const allComplete = template.objectives.every((obj: any) => {
      const prog = quest.progress[obj.id];
      return prog && prog.currentAmount >= obj.requiredAmount;
    });

    if (allComplete) {
      store.updateQuest(questId, { status: 'COMPLETED' });
      EventBus.emit('ui:toast', `Quest Completed: ${template.title}!`);
      
      // Auto-claim is false, wait for user to call claimReward
    }
  }

  static claimReward(questId: string) {
    const store = useQuestStore.getState();
    const quest = store.quests[questId];
    const template = DataManager.getQuest(questId);

    if (!quest || !template || quest.status !== 'COMPLETED') return false;

    // Disburse rewards
    const playerStore = usePlayerStore.getState();
    if (template.rewards.nur) playerStore.addNur(template.rewards.nur);
    if (template.rewards.exp) {
      // Add exp logic here
    }
    if (template.rewards.items) {
      // Add item logic here
    }

    store.updateQuest(questId, { status: 'REWARD_CLAIMED' });
    EventBus.emit('ui:toast', `Rewards Claimed for: ${template.title}`);

    // If there's a follow-up story quest, start it
    // if (template.nextQuestId) {
    //   setTimeout(() => {
    //     this.startQuest(template.nextQuestId!);
    //   }, 1000);
    // }

    return true;
  }

  private static checkDailyResets() {
    const store = useQuestStore.getState();
    const quests = store.quests;
    
    // Get midnight of local client time
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    Object.values(quests).forEach(quest => {
      const template = DataManager.getQuest(quest.id);
      if (template?.type === 'DAILY') {
        if (quest.timestamp && quest.timestamp < midnight) {
          // Reset quest
          store.updateQuest(quest.id, {
            status: 'INACTIVE', // Or remove it entirely so it can be picked up again
            timestamp: Date.now() 
          });
        }
      }
    });
  }

  static serialize(): string {
    return JSON.stringify(useQuestStore.getState().quests);
  }

  static deserialize(jsonStr: string) {
    try {
      const parsed = JSON.parse(jsonStr);
      useQuestStore.getState().setQuests(parsed);
    } catch (e) {
      console.error("Failed to parse quests", e);
    }
  }
}
