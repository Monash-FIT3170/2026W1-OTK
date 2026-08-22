import type { Debuff } from './Debuff';

export class DebuffRegistry {
  private registry: Map<string, new () => Debuff> = new Map();

  register(debuffId: string, DebuffClass: new () => Debuff): void {
    if (this.registry.has(debuffId)) {
      throw new Error(`Debuff already registered: ${debuffId}`);
    }
    this.registry.set(debuffId, DebuffClass);
  }

  create(debuffId: string): Debuff {
    const DebuffClass = this.registry.get(debuffId);
    if (!DebuffClass) {
      throw new Error(`Unknown debuffId: ${debuffId}`);
    }
    return new DebuffClass();
  }
}

export const debuffRegistry = new DebuffRegistry();
