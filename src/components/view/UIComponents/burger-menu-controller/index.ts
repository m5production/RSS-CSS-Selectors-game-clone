import { BodyBlinder } from '../body-blinder';
import './styles/index.scss';

export class BurgerMenu {
  btnNode: HTMLElement;
  menuNode: HTMLElement;
  isShown: boolean;
  blinder: BodyBlinder;

  constructor() {
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleBodyClick = this.handleBodyClick.bind(this);

    this.btnNode = document.getElementById('burger-menu-btn') as HTMLElement;
    this.menuNode = document.getElementById('nav-bar') as HTMLElement;
    this.blinder = new BodyBlinder();
    this.isShown = false;

    this.btnNode.addEventListener('click', this.handleBtnClick);
  }

  private handleBtnClick(e: MouseEvent) {
    if (this.isShown) return;
    e.stopPropagation();
    this.show();
  }

  public show() {
    this.isShown = true;
    this.btnNode.style.right = '2rem';
    this.btnNode.classList.add('pressed');
    this.menuNode.classList.add('active');
    document.body.addEventListener('click', this.handleBodyClick);
    this.blinder.show();
  }

  private handleBodyClick(e: MouseEvent) {
    const targetElem = (e.target as HTMLElement);
    if (targetElem.closest('#nav-bar') === this.menuNode && !targetElem.closest('.levels-list--item')) return;
    this.hide();
  }

  public hide() {
    this.isShown = false;
    this.btnNode.style.right = '';
    this.btnNode.classList.remove('pressed');
    this.menuNode.classList.remove('active');
    this.blinder.hide();
    document.body.removeEventListener('click', this.handleBodyClick);
  }
}