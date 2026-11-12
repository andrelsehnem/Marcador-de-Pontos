export type {
  CanastraConfig,
  CanastraGame,
  CanastraScore as Score,
} from '../../../shared/types/Canastra';

export { DEFAULT_CANASTRA_CONFIG as DEFAULT_CONFIG } from '../../../shared/types/Canastra';

import { createDefaultCanastraGame } from '../../../shared/types/Canastra';

export const DEFAULT_GAME = createDefaultCanastraGame();
