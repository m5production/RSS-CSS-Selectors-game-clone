export type IHighlightCallbacks = {
  startHighlight: (elemId?: string) => void,
  stopHighlight: (elemId?: string) => void
}

export type IGameControllerCallbacks = {
  onWin: (levelId: number | null) => void;
  handleWrongSelector: () => void;
  handleWrongAnswer: (userAnswer: string) => void;
  handleHintUsed: () => void;
}

export type ILevelData = {
  levelId: number,
  description: string,
  disposition: string,
  levelPassedMethod: 'self' | 'hint' | '';
  searched: string
}