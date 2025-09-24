import type { Component } from '../types';
import { TRAIT_CATEGORIES, RARITY_LEVELS } from '../types';

// Component data based on your actual file structure
const componentData: Record<string, Record<string, string[]>> = {
  '00background': {
    extraordinary: ['Checkerboard.png', 'coins.png', 'fireworks.png', 'scribble.png', 'zebra-stripe.png'],
    original: ['black.png', 'white.png'],
    rare: ['dot n stripe.png', 'dots.png', 'hexagon.png', 'net.png', 'raindrops.jpg'],
    super_rare: ['flower.png', 'hearts.jpg', 'maple leaf.png']
  },
  '01body': {
    extraordinary: ['Chinese.png', 'suit.png'],
    original: ['check shirt.png', 'shirt.png', 'singlet.png', 'strapless.png', 't-shirt.png'],
    rare: ['french blouse.png', 'jacket.png', 'jumpsuit with stripesTee.png', 'jumpsuit.png', 'stripes turtleneck.png'],
    super_rare: ['half-shoulder.png', 'mermaid.png', 'suit-vest.png']
  },
  '02face': {
    extraordinary: ['face.png'],
    original: ['face.png'],
    rare: ['face.png'],
    super_rare: ['face.png']
  },
  '03hair': {
    extraordinary: ['lemon afro.PNG', 'rose double ponytail.PNG'],
    original: ['coffee curls.PNG', 'grey blue bob.PNG', 'purple beehive.PNG', 'royal blue pixie.PNG', 'turquoise high ponytail.PNG', 'watermelon low ponytail.PNG'],
    rare: ['black long hair.PNG', 'blonde pixie.PNG', 'brown long hair.PNG', 'platinum blonde fringe.PNG'],
    super_rare: ['ocean blue curls.PNG', 'pink space buns.PNG', 'pure blonde bob.PNG']
  },
  '03body hoodie': {
    extraordinary: ['hoodie.png'],
    original: ['blank.png'],
    rare: ['bow'],
    super_rare: ['blank.png']
  },
  '04mouth': {
    extraordinary: ['laugh.jpg', 'open mouth.jpg', 'open mouth.png', 'tongue out.jpg'],
    original: ['annoyed definitely.png', 'annoyed slightly.png', 'cheeky.png', 'cute side big.png', 'cute side small.png', 'irk big.png', 'irk small.png', 'smirk.png'],
    rare: ['indifferent.png', 'kiss.png', 'pissed.png', 'sexy lips.png', 'triangle lips.png'],
    super_rare: ['babyface.png', 'cute.png', 'polite.png']
  },
  '05eye': {
    extraordinary: ['eyes with lash.jpg', 'eyes with lash.png', 'smile.png', 'sunglasses.png'],
    original: ['annoyed.png', 'freckles angry.png', 'freckles look up.png', 'indifferent.png', 'right wink.png', 'roll eyes.png', 'tear drop.png', 'wide eyes.png'],
    rare: ['eyes closed.jpg', 'glasses.jpg', 'left wink.png', 'round glasses.jpg', 'sunglasses.jpg'],
    super_rare: ['cool glassse.jpg', 'doll eyes.png', 'download.png']
  },
  '06accessory': {
    extraordinary: ['earring.PNG'],
    original: ['blank.png'],
    rare: ['bow-shape earring.png', 'drop earring.png', 'loop earring.png'],
    super_rare: ['blank.png']
  },
  '07facemask': {
    extraordinary: ['blank.png'],
    original: ['blank.png'],
    rare: ['blank.png'],
    super_rare: ['face mask.PNG']
  }
};

export class ComponentService {
  private components: Component[] = [];

  constructor() {
    this.loadComponents();
  }

  private loadComponents() {
    let id = 0;

    for (const category of TRAIT_CATEGORIES) {
      for (const rarity of RARITY_LEVELS) {
        const files = componentData[category]?.[rarity] || [];

        for (const fileName of files) {
          this.components.push({
            id: `${category}_${rarity}_${id++}`,
            name: this.cleanName(fileName),
            path: `/pfp-input/${category}/${rarity}/${fileName}`,
            rarity: rarity as any,
            category
          });
        }
      }
    }
  }

  private cleanName(fileName: string): string {
    // Remove file extension and clean up name
    const nameWithoutExt = fileName.replace(/\.(png|jpg|jpeg)$/i, '');

    // Convert to title case and handle special cases
    if (nameWithoutExt === 'blank') return 'None';

    return nameWithoutExt
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  getComponentsByCategory(category: string): Component[] {
    return this.components.filter(comp => comp.category === category);
  }

  getComponentsByRarity(rarity: string): Component[] {
    return this.components.filter(comp => comp.rarity === rarity);
  }

  getAllComponents(): Component[] {
    return this.components;
  }

  getComponent(id: string): Component | undefined {
    return this.components.find(comp => comp.id === id);
  }
}

export const componentService = new ComponentService();