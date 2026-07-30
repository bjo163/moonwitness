import { useInventoryStore } from '../../store/inventory.store';
import { DataManager } from '../../engine/core/DataManager';
import { ItemCategory, InventorySlot } from '../../types/inventory';
import { EventBus } from '../../engine/core/EventBus';

export class InventorySystem {
  
  /**
   * Adds items to the inventory, handling stacking automatically.
   */
  static addItem(itemId: string, amount: number): boolean {
    const template = DataManager.getItem(itemId);
    if (!template) return false;

    const store = useInventoryStore.getState();
    let slots = [...store.slots];
    let remaining = amount;

    // First pass: try to fill existing non-full stacks
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (!slot) continue;
      if (slot.itemId === itemId && slot.quantity < template.maxStack) {
        const space = template.maxStack - slot.quantity;
        const addAmount = Math.min(space, remaining);
        
        slot.quantity += addAmount;
        remaining -= addAmount;
        
        if (remaining <= 0) break;
      }
    }

    // Second pass: create new slots for the remainder
    while (remaining > 0) {
      const addAmount = Math.min(template.maxStack, remaining);
      slots.push({
        slotId: crypto.randomUUID(),
        itemId,
        quantity: addAmount
      });
      remaining -= addAmount;
    }

    store.setSlots(slots);
    
    // Emit quest event in case we have a COLLECT_ITEM objective
    EventBus.emit('quest:progress', {
      type: 'COLLECT_ITEM',
      targetId: itemId,
      amount: amount
    });
    
    return true;
  }

  /**
   * Removes items from the inventory, clearing empty slots.
   */
  static removeItem(itemId: string, amount: number): boolean {
    const store = useInventoryStore.getState();
    let slots = [...store.slots];
    let remaining = amount;
    
    // Check if we have enough total
    const totalOwned = slots.filter(s => s && s.itemId === itemId).reduce((acc, curr) => acc + curr.quantity, 0);
    if (totalOwned < amount) return false;

    for (let i = slots.length - 1; i >= 0; i--) {
      const slot = slots[i];
      if (!slot) continue;
      if (slot.itemId === itemId) {
        if (slot.quantity > remaining) {
          slot.quantity -= remaining;
          remaining = 0;
          break;
        } else {
          remaining -= slot.quantity;
          slots.splice(i, 1); // Remove empty slot
        }
      }
    }

    store.setSlots(slots);
    return true;
  }

  /**
   * Equips a specific slot item to a target monster.
   */
  static equipItem(slotId: string, monsterId: string): boolean {
    const store = useInventoryStore.getState();
    const slotIndex = store.slots.findIndex(s => s && s.slotId === slotId);
    if (slotIndex === -1) return false;

    const slot = store.slots[slotIndex];
    if (!slot) return false;

    const template = DataManager.getItem(slot.itemId);
    if (!template) return false;
    
    if (template.category !== 'WEAPON' && template.category !== 'ARMOR') {
      return false;
    }

    let equipment = { ...store.equipment };
    if (!equipment[monsterId]) {
      equipment[monsterId] = { weaponSlot: null, armorSlot: null };
    }

    // Find old equipped item for this category
    const isWeapon = template.category === 'WEAPON';
    // Just update the reference
    if (isWeapon) {
      equipment[monsterId].weaponSlot = slotId;
    } else {
      equipment[monsterId].armorSlot = slotId;
    }

    store.setEquipment(equipment);
    
    // Trigger stat recalculation
    EventBus.emit('equipment:changed', monsterId);

    return true;
  }

  static unequipItem(monsterId: string, category: 'WEAPON' | 'ARMOR') {
    const store = useInventoryStore.getState();
    let equipment = { ...store.equipment };
    if (!equipment[monsterId]) return;

    if (category === 'WEAPON') {
      equipment[monsterId].weaponSlot = null;
    } else {
      equipment[monsterId].armorSlot = null;
    }

    store.setEquipment(equipment);
    EventBus.emit('equipment:changed', monsterId);
  }

  // --- Filtering & Sorting ---

  static filterInventory(category: ItemCategory): InventorySlot[] {
    const store = useInventoryStore.getState();
    return store.slots.filter(s => DataManager.getItem(s.itemId)?.category === category);
  }

  static sortInventory(method: 'NAME' | 'RARITY' | 'CATEGORY') {
    const store = useInventoryStore.getState();
    let slots = [...store.slots];

    slots.sort((a, b) => {
      const tA = DataManager.getItem(a.itemId);
      const tB = DataManager.getItem(b.itemId);
      if (!tA || !tB) return 0;

      if (method === 'NAME') {
        return tA.name.localeCompare(tB.name);
      } else if (method === 'CATEGORY') {
        return tA.category.localeCompare(tB.category);
      } else if (method === 'RARITY') {
        // Arbitrary rarity weights could be assigned, skipping complex impl for framework
        return 0; 
      }
      return 0;
    });

    store.setSlots(slots);
  }

  // --- Serialization ---
  static serialize(): string {
    const store = useInventoryStore.getState();
    return JSON.stringify({ slots: store.slots, equipment: store.equipment });
  }

  static deserialize(jsonStr: string) {
    try {
      const parsed = JSON.parse(jsonStr);
      const store = useInventoryStore.getState();
      if (parsed.slots) store.setSlots(parsed.slots);
      if (parsed.equipment) store.setEquipment(parsed.equipment);
    } catch (e) {
      console.error("Failed to parse inventory", e);
    }
  }
}
