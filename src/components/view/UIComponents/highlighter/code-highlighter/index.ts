import { IHighlightCallbacks } from "../../../../../common-types";

export class CodeHighlighter {
  viewer: HTMLElement;
  highlightedElem: HTMLElement | null;
  callbacks: IHighlightCallbacks;

  constructor(codeContainer: HTMLElement, callbacks: IHighlightCallbacks) {
    this.handleMouseOverElem = this.handleMouseOverElem.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);

    this.viewer = codeContainer;
    this.callbacks = callbacks;

    this.highlightedElem = null;

    this.viewer.addEventListener('mousemove', this.handleMouseOverElem);
  }

  private handleMouseOverElem(event: MouseEvent) {
    const elem = (event.target as HTMLElement).closest('.code-block') as HTMLElement | null;
    if (!elem || elem.classList.contains('highlight')) return;
    this.highlightedElem = elem;
    this.callbacks.startHighlight(elem.dataset.markupBlockId);
    this.highlightedElem.addEventListener('mouseout', this.handleMouseOut);
  }

  private handleMouseOut() {
    if (!this.highlightedElem) return;
    const elem = this.highlightedElem;
    elem.removeEventListener('mouseout', this.handleMouseOut);
    this.callbacks.stopHighlight(elem.dataset.markupBlockId);
  }

  public highlightCodeElem(elemId: string) {
    const elem = this.viewer.querySelector(`[data-markup-block-id="${elemId}"]`) as HTMLElement | null;
    if (!elem) return;
    elem.classList.add('highlight');
    this.highlightedElem = elem;
  }

  public removeHighlight(elemId: string) {
    const elem = this.viewer.querySelector(`[data-markup-block-id="${elemId}"]`) as HTMLElement | null;
    if (!elem) return;
    elem.classList.remove('highlight');
    this.highlightedElem = null;
  }
}