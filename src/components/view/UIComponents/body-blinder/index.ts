import './style.scss';

export class BodyBlinder {
  private node: HTMLElement;

  constructor() {
    this.node = this.makeBlinderNode();
  }

  private makeBlinderNode() {
    const node = document.createElement('div');
    node.className = 'body-blinder';
    return node;
  }

  public show() {
    document.body.append(this.node);
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = scrollBarWidth + 'px';
  }

  public hide() {
    this.node.remove();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }
}