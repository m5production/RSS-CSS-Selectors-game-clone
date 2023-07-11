import { findNode } from '../../../../helpers/findNode';
import { IViewData } from '../../controller/types';
import './style.scss';

export class LevelNavigation {
  currentLevelId: number;
  levelsListNode: HTMLElement;
  changeLevelCallback: (levelId: number) => void;
  resetProgressCallback: () => ('self' | 'hint' | '')[];

  constructor(parameters: Pick<IViewData, 'levelId' | 'mappedLevels' | 'callbacks'>) {
    this.currentLevelId = parameters.levelId;
    this.levelsListNode = findNode({ nodeName: 'Levels list', className: 'levels-list' });
    this.changeLevelCallback = parameters.callbacks.changeLevelCallback;
    this.resetProgressCallback = parameters.callbacks.resetProgressCallback;
    const resetProgressBtn = findNode({ nodeName: 'Reset progress button', id: 'reset-progress-btn' });
    resetProgressBtn.addEventListener('click', () => this.resetProgress());
    const { mappedLevels, callbacks } = parameters;
    this.renderLevels({ mappedLevels, changeLevelCallback: callbacks.changeLevelCallback });
  }

  public markUseHint() {
    const currentLevelNode = document.querySelector(`.current`);
    if (!currentLevelNode) return;
    currentLevelNode.classList.add('hint-used');
    return currentLevelNode.textContent;
  }

  private renderLevels(parameters: {
    mappedLevels: ('self' | 'hint' | '')[],
    changeLevelCallback: (levelId: number) => void
  }) {
    this.levelsListNode.innerHTML = '';
    parameters.mappedLevels.forEach((levelPassedMethod, index) => {
      const node = this.makeLevelIndexNode(index + 1, levelPassedMethod);
      if (this.currentLevelId === index) node.classList.add('current');
      node.addEventListener('click', () => parameters.changeLevelCallback(index));
      this.levelsListNode.append(node);
    })
  }

  private resetProgress() {
    const newMappedData = this.resetProgressCallback();
    this.renderLevels({ mappedLevels: newMappedData, changeLevelCallback: this.changeLevelCallback });
  }

  private makeLevelIndexNode(id: number, levelPassedMethod: 'self' | 'hint' | '') {
    const node = document.createElement('li');

    node.className = 'levels-list--item';
    switch (levelPassedMethod) {
      case 'hint':
        node.classList.add('hint-used');
        break;
      case 'self':
        node.classList.add('passed');
        break;
      default:
        break;
    }
    node.textContent = String(id);

    return node;
  }
}