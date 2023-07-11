import { animateSearched } from './helpers/searchAnimator';
import './style.scss';

export class TableController {
  public node: HTMLDivElement;

  constructor() {
    this.node = document.getElementById('table') as HTMLDivElement;
  }

  public renderWin() {
    const corectElements = this.node.querySelectorAll('.chosen');
    if (!corectElements.length) return;
    corectElements.forEach((element) => element.classList.add('clean'));
    return corectElements[corectElements.length - 1];
  }

  public renderWrongAnswer(userAnswer: string) {
    const handleAnimationEnd = () => {
      foundChildren.forEach((child) => {
        child.classList.remove('wrong');
        child.removeEventListener('animationend', handleAnimationEnd);
      });
    }

    const foundChildren = Array.from(this.node.querySelectorAll(userAnswer));
    if (foundChildren.length === 0) foundChildren.push(document.querySelector('.level-description') as HTMLElement);

    foundChildren.forEach((child) => {
      child.classList.add('wrong');
      child.addEventListener('animationend', handleAnimationEnd);
    });
  }

  public update(disposition: string, searched: string) {
    this.clear();
    this.populate(disposition);
    animateSearched(this.node, searched);
  }

  private populate(itemsString: string) {
    this.node.insertAdjacentHTML("afterbegin", itemsString);
  }

  private clear() {
    this.node.innerHTML = '';
  }
}