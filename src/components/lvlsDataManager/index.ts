import { ILevelData } from '../../common-types/index';
import * as levelsData from '../../levels-data/levels-data.json';

export class LevelsDataManager {
  private levels: ILevelData[];
  public levelsTotal: number;
  private hintUsedCallback: () => void;

  constructor(hintUsed: () => void) {
    this.saveProgress = this.saveProgress.bind(this);
    this.markUnpassedAll = this.markUnpassedAll.bind(this);
    
    this.hintUsedCallback = hintUsed;
    this.levels = Array.from(this.loadProgress() || levelsData);
    this.levelsTotal = this.levels.length;
    
    document.addEventListener('visibilitychange', this.saveProgress);
  }

  public mapLevels<T extends keyof ILevelData>(prop: T) {
    return this.levels.map((level) => level[prop]);
  }

  public markPassed(levelId: number) {
    const level = this.getLevelById(levelId);
    if (level.levelPassedMethod === 'hint') return;
    level.levelPassedMethod = 'self';
  }

  public markPassedWithHint(levelId: number) {
    const level = this.getLevelById(levelId);
    if (level.levelPassedMethod === 'self') return;
    level.levelPassedMethod = 'hint';
  }

  public markUnpassedAll() {
    this.levels.forEach((level) => level.levelPassedMethod = '');
  }

  public getFirstUndoneLevel() {
    const lastUndoneLevel = this.levels.find((level) => !level.levelPassedMethod);
    return lastUndoneLevel || this.levels[this.levels.length - 1];
  }
  
  public getLevelById(id: number) {
    if (id >= this.levels.length - 1) id = this.levels.length - 1;
    const level = this.levels.find((level) => level.levelId === id);
    if (!level) {
      throw new Error('Level data is not found!');
    }

    return level;
  }

  private loadProgress() {
    const levelsData = localStorage.getItem('levels');
    return levelsData ? JSON.parse(levelsData) : null;
  }

  private saveProgress() {
    if (document.visibilityState === 'visible') return;
    localStorage.setItem('levels', JSON.stringify(this.levels));
  }
}