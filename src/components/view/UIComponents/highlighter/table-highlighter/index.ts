import { IHighlightCallbacks } from "../../../../../common-types";
import { HitghlightMsg } from "./highlight-msg/highlight-msg";

export class TableHighlighter {
  private table: HTMLElement;
  private msg: HitghlightMsg | null;
  private callbacks: IHighlightCallbacks;

  constructor(table: HTMLElement, callbacks: IHighlightCallbacks) {
    this.handleMouseOverTable = this.handleMouseOverTable.bind(this);
    this.removeHighlight = this.removeHighlight.bind(this);

    this.callbacks = callbacks;
    this.table = table;
    this.makeIds(this.table.children);
    this.msg = null;

    this.table.addEventListener('mousemove', this.handleMouseOverTable);
  }

  private makeIds(children: HTMLCollection, parentId: number | null = null) {
    Array.from(children).forEach((node, id) => {
      const elemId = parentId === null ? String(id) : [parentId, id].join(','); 
      node.setAttribute('data-table-item-id', elemId);
      if (node.children.length === 0) return;
      this.makeIds(node.children, id);
    });
  }

  private handleMouseOverTable(e: MouseEvent) {
    const nestedElem = e.target as HTMLElement;
    if (nestedElem.dataset.tableItemId === undefined || nestedElem.classList.contains('hovered')) return;

    const elemId = nestedElem.dataset.tableItemId;
    this.callbacks.startHighlight(elemId);
    nestedElem.onmouseout = () => this.callbacks.stopHighlight(elemId);
  }

  public highlightElement(elemId: string) {
    const elem = this.table.querySelector(`[data-table-item-id="${elemId}"]`) as HTMLElement | null;
    if (!elem) return;
    elem.classList.add('hovered');
    this.msg = new HitghlightMsg(elem);
    this.msg.showMsg(elem);
  }

  public removeHighlight(elemId: string) {
    const elem = this.table.querySelector(`[data-table-item-id="${elemId}"]`) as HTMLElement | null;
    if (!elem) return;
    elem.classList.remove('hovered');
    this.msg?.hideMsg();
  }
}