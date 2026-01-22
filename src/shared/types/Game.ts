export interface GameState {
  id: string;
  players: Player[];
  rounds: Round[];
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'finished' | 'paused';
}

export interface Player {
  id: string;
  name: string;
  score: number;
  initialChips?: number;
}

export interface Round {
  id: string;
  roundNumber: number;
  scores: Record<string, number>;
  timestamp: Date;
}
