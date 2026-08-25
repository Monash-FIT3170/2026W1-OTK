import { cardData } from './types';
import './card/registerAllCards';
import { FerociousClaw } from './card/FerociousClaw';
import { FogClearing } from './card/FogClearing';
import { Transcode } from './card/Transcode';
import { TeaCeremony } from './card/TeaCeremony';
import { TaxThePoor } from './card/TaxThePoor';
import { RichGetRicher } from './card/RichGetRicher';
import { FinalStand } from './card/FinalStand';
import { MistConjuring } from './card/MistConjuring';
import { KillingBlow } from './card/KillingBlow';
import { AggraRay } from './card/AggraRay';
import { DivideAndConquer } from './card/DivideAndConquer';
import { DoubleSacrifice } from './card/DoubleSacrifice';
import { HelpingHand } from './card/HelpingHand';
import { NowYouSeeMe } from './card/NowYouSeeMe';
import { Reload } from './card/Reload';
import { ShortSword } from './card/ShortSword';

const CARD_CLASSES = [
  Transcode,
  FogClearing,
  FerociousClaw,
  TeaCeremony,
  TaxThePoor,
  RichGetRicher,
  FinalStand,
  MistConjuring,
  KillingBlow,
  AggraRay,
  DivideAndConquer,
  DoubleSacrifice,
  FinalStand,
  HelpingHand,
  NowYouSeeMe,
  Reload,
  ShortSword,
];

export function buildAvailableCards(): cardData[] {
  return CARD_CLASSES.map((CardClass) => new CardClass().toJSON());
}
