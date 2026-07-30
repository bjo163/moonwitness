import { create } from 'zustand';
import { DialogueNode, DialogueTree } from '../types/dialogue';

export type DialogueState = {
  isOpen: boolean;
  currentTree: DialogueTree | null;
  currentNode: DialogueNode | null;
  
  openDialogue: (tree: DialogueTree) => void;
  nextNode: (nodeId: string) => void;
  closeDialogue: () => void;
};

export const useDialogueStore = create<DialogueState>((set) => ({
  isOpen: false,
  currentTree: null,
  currentNode: null,

  openDialogue: (tree) => set({
    isOpen: true,
    currentTree: tree,
    currentNode: tree.nodes[tree.startNodeId]
  }),

  nextNode: (nodeId) => set((state) => {
    if (!state.currentTree) return state;
    const node = state.currentTree.nodes[nodeId];
    if (!node) return { isOpen: false, currentTree: null, currentNode: null };
    
    return { currentNode: node };
  }),

  closeDialogue: () => set({
    isOpen: false,
    currentTree: null,
    currentNode: null
  })
}));
