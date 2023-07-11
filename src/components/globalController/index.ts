import './style/index.scss';
import { GameController } from '../gameController';
import { LevelsDataManager } from '../lvlsDataManager';
import { ILevelData } from '../../common-types/index';
import { View } from '../view/controller';
import { BurgerMenu } from '../view/UIComponents/burger-menu-controller';

export class GlobalController {
  private levelsManager: LevelsDataManager;
  private gameManager: GameController;
  viewManager: View;

  constructor() {
    this.handleWin = this.handleWin.bind(this);
    this.markHintUsed = this.markHintUsed.bind(this);
    this.changeLevel = this.changeLevel.bind(this);
    this.resetProgress = this.resetProgress.bind(this);
    this.handleWrongAnswer = this.handleWrongAnswer.bind(this);
    this.handleWrongSelector = this.handleWrongSelector.bind(this);

    new BurgerMenu();
    this.levelsManager = new LevelsDataManager(this.markHintUsed);
    this.gameManager = new GameController({
      onWin: this.handleWin,
      handleWrongSelector: this.handleWrongSelector,
      handleWrongAnswer: this.handleWrongAnswer,
      handleHintUsed: this.markHintUsed
    });
    this.viewManager = new View();
  }

  private markHintUsed() {
    const levelId = this.viewManager.renderHintUsed();
    if (!levelId) return;
    this.levelsManager.markPassedWithHint(Number(levelId) - 1);
  }

  public initialize() {
    const firstUndoneLevel = this.levelsManager.getFirstUndoneLevel();
    this.startLevel(firstUndoneLevel);
  }

  public changeLevel(newLevelId: number) {
    const newLevelData = this.levelsManager.getLevelById(newLevelId);
    this.startLevel(newLevelData);
  }

  private startLevel(levelData: ILevelData) {
    const { disposition, description, levelId, levelPassedMethod, searched } = levelData;
    this.gameManager.initializeLevel({
      levelId,
      searched
    });
    const mappedLevels = this.levelsManager.mapLevels('levelPassedMethod');
    this.viewManager.initializeLevel({
      searched,
      levelId,
      description,
      disposition,
      levelPassedMethod,
      mappedLevels: mappedLevels,
      callbacks: {
        changeLevelCallback: this.changeLevel,
        resetProgressCallback: this.resetProgress,
      }
    });
  }

  private resetProgress() {
    this.levelsManager.markUnpassedAll();
    return this.levelsManager.mapLevels('levelPassedMethod');
  }

  public handleHintUse(levelId: number | null) {
    if (levelId === null) throw new Error('LevelID was not provided!');
    this.levelsManager.markPassedWithHint(levelId);
    const nextLevel = this.levelsManager.getLevelById(levelId + 1);
    this.startLevel(nextLevel);
  }

  public handleWin(levelId: number | null) {
    if (levelId === null) throw new Error('LevelID was not provided!');
    this.levelsManager.markPassed(levelId);
    const lastCorrectElement = this.viewManager.renderWin();
    lastCorrectElement?.addEventListener('animationend', () => {
      const nextLevel = this.levelsManager.getLevelById(levelId + 1);
      this.startLevel(nextLevel);
    });
  }

  public handleWrongAnswer(userAnswer: string) {
    this.viewManager.renderWrongAnswer(userAnswer);
  }

  public handleWrongSelector() {
    this.viewManager?.renderWrongSelector();
  }
}