import type { TraitSelection, AvatarCombination } from '../types';

// Simple hash function for avatar combinations
const createHash = (selections: TraitSelection): string => {
  const keys: (keyof TraitSelection)[] = [
    'background', 'body', 'face', 'hair', 'bodyHoodie', 'mouth', 'eye', 'accessory', 'facemask'
  ];

  const parts = keys.map(key => selections[key]?.id || 'none').join('|');

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < parts.length; i++) {
    const char = parts.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36);
};

export class AvatarService {
  private storageKey = 'herstory_avatar_combinations';

  private getStoredCombinations(): AvatarCombination[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveCombinations(combinations: AvatarCombination[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(combinations));
    } catch (error) {
      console.error('Failed to save combinations:', error);
    }
  }

  async checkUniqueness(selections: TraitSelection): Promise<boolean> {
    const hash = createHash(selections);
    const combinations = this.getStoredCombinations();

    return !combinations.some(combo => combo.hash === hash);
  }

  async saveAvatar(
    userId: string,
    selections: TraitSelection,
    description?: string
  ): Promise<AvatarCombination> {
    const hash = createHash(selections);
    const combinations = this.getStoredCombinations();

    // Double-check uniqueness
    if (combinations.some(combo => combo.hash === hash)) {
      throw new Error('This combination already exists');
    }

    const avatar: AvatarCombination = {
      id: `avatar_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      traits: selections,
      hash,
      timestamp: Date.now(),
      userId,
      description
    };

    combinations.push(avatar);
    this.saveCombinations(combinations);

    return avatar;
  }

  async getUserAvatars(userId: string): Promise<AvatarCombination[]> {
    const combinations = this.getStoredCombinations();
    return combinations.filter(combo => combo.userId === userId);
  }

  async getAllCombinations(): Promise<AvatarCombination[]> {
    return this.getStoredCombinations();
  }

  // For admin/debugging purposes
  clearAllCombinations(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const avatarService = new AvatarService();