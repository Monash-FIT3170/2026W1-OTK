// DeckBuilder.ts

import { cardData } from './types';
import { cardRegistry } from './card/CardRegistry';
import { FerociousClaw } from './card/FerociousClaw';
import { FogClearing } from './card/FogClearing';
import { Transcode } from './card/Transcode';
import { TeaCeremony } from './card/TeaCeremony';
import { MistConjuring } from './card/MistConjuring';
import { KillingBlow } from './card/KillingBlow';
import { AggraRay } from './card/AggraRay';

export class DeckBuilder {
  static buildStartingDeck(): cardData[] {
    return [
      new Transcode().toJSON(),
      new Transcode().toJSON(),
      new Transcode().toJSON(),
      new Transcode().toJSON(),
      new FogClearing().toJSON(),
      new FogClearing().toJSON(),
      new FogClearing().toJSON(),
      new FogClearing().toJSON(),
      new FerociousClaw().toJSON(),
      new FerociousClaw().toJSON(),
      new FerociousClaw().toJSON(),
      new FerociousClaw().toJSON(),
      new TeaCeremony().toJSON(),
      new TeaCeremony().toJSON(),
      new TeaCeremony().toJSON(),
      new MistConjuring().toJSON(),
      new MistConjuring().toJSON(),
      new MistConjuring().toJSON(),
      new MistConjuring().toJSON(),
      new KillingBlow().toJSON(),
      new KillingBlow().toJSON(),
      new KillingBlow().toJSON(),
      new KillingBlow().toJSON(),
      new AggraRay().toJSON(),
      new AggraRay().toJSON(),
      new AggraRay().toJSON(),
    ];
  }
}
