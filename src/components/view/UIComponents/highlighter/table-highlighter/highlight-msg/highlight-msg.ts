import './highlight-msg.scss';

export class HitghlightMsg {
  private msgNode: HTMLElement;

  constructor(elem: HTMLElement) {
    this.hideMsg = this.hideMsg.bind(this);

    this.msgNode = this.makeMsgNode(elem);
  }

  public showMsg(elem: HTMLElement) {
    elem.append(this.msgNode);
  }

  public hideMsg() {
    this.msgNode.remove();
  }

  private makeMsgNode(elem: HTMLElement) {
    function getTagName(elem: HTMLElement) {
      const tagName = elem.tagName.toLowerCase();
      const className = elem.className;
      const text = className.includes('small') ? `<${tagName} class="small"/>` : `<${tagName}>` ;
      return text + `</${tagName}>`;
    }

    const tag = getTagName(elem);
    const msgNode = document.createElement('div');
    msgNode.textContent = tag;
    msgNode.classList.add('highlight-msg');
    return msgNode;
  }
}