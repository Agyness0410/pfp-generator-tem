export interface Component {
  id: string;
  name: string;
  path: string;
  rarity: 'extraordinary' | 'rare' | 'original' | 'super_rare';
  category: string;
}

export interface TraitSelection {
  background?: Component;
  body?: Component;
  face?: Component;
  hair?: Component;
  bodyHoodie?: Component;
  mouth?: Component;
  eye?: Component;
  accessory?: Component;
  facemask?: Component;
}

export interface AvatarCombination {
  id: string;
  traits: TraitSelection;
  hash: string;
  timestamp: number;
  userId: string;
  description?: string;
}

export const TRAIT_CATEGORIES = [
  '00background',
  '01body',
  '02face',
  '03hair',
  '03body hoodie',
  '04mouth',
  '05eye',
  '06accessory',
  '07facemask'
] as const;

export const RARITY_LEVELS = [
  'extraordinary',
  'rare',
  'original',
  'super_rare'
] as const;