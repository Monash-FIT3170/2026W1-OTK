// DeckBuilder.ts

// importing components
import { cardData } from './types';
import { cardRegistry } from './card/CardRegistry';
import { FerociousClaw } from './card/FerociousClaw';
import { FogClearing } from './card/FogClearing';
import { Transcode } from './card/Transcode';

export class DeckBuilder {
  // builds and returns the starting deck as plain card data
  static buildStartingDeck(): cardData[] {
    return [
      new FerociousClaw().toJSON(),
      new FerociousClaw().toJSON(),
      new FogClearing().toJSON(),
      new FogClearing().toJSON(),
      new Transcode().toJSON(),
      new Transcode().toJSON(),
    ];
  }
}
