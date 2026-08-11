// Import every concrete debuff so it registers itself before use.
import './Freeze';
import './Timer';

export { Debuff } from './Debuff';
export type { debuffData } from './Debuff';
export { DebuffRegistry, debuffRegistry } from './DebuffRegistry';
export { Freeze } from './Freeze';
export { Timer } from './Timer';
