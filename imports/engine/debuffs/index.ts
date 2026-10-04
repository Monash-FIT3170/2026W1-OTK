// Import every concrete debuff so it registers itself before use.
import './Freeze';
import './Timer';
import './Inflation';
import './Evasion';

export { Debuff } from './Debuff';
export type { debuffData } from './Debuff';
export { DebuffRegistry, debuffRegistry } from './DebuffRegistry';
export { Freeze } from './Freeze';
export { Timer } from './Timer';
export { Inflation } from './Inflation';
export { Evasion } from './Evasion';
