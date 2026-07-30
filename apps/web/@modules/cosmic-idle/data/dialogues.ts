import { DialogueTree } from '../types/dialogue';

export const DIALOGUE_DB: Record<string, DialogueTree> = {
  welcome_dialogue: {
    id: 'welcome_dialogue',
    startNodeId: 'start',
    nodes: {
      start: {
        id: 'start',
        speakerName: 'Guide Protocol',
        portraitIcon: 'Bot',
        text: 'Greetings, Traveler. I am the Guide Protocol. Are you here to restore the Cosmic Web?',
        choices: [
          { text: 'Yes, I am.', nextNodeId: 'path_yes' },
          { text: 'No, just wandering.', nextNodeId: 'path_no' }
        ]
      },
      path_yes: {
        id: 'path_yes',
        speakerName: 'Guide Protocol',
        portraitIcon: 'Bot',
        text: 'Excellent. Take this Nur to aid your journey.',
        triggers: [
          { type: 'ADD_NUR', payload: 100 }
        ],
        nextNodeId: 'end_node'
      },
      path_no: {
        id: 'path_no',
        speakerName: 'Guide Protocol',
        portraitIcon: 'Bot',
        text: 'I see. The cosmos is vast. Do not lose your way.',
        nextNodeId: 'end_node'
      },
      end_node: {
        id: 'end_node',
        speakerName: 'Guide Protocol',
        portraitIcon: 'Bot',
        text: 'Step on the green zone to transition to a new sector. Farewell.',
        endDialogue: true
      }
    }
  }
};
