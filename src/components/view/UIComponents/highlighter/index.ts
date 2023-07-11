import { CodeHighlighter } from "./code-highlighter";
import { TableHighlighter } from "./table-highlighter";

export class Highlighter {
  table: TableHighlighter;
  htmlViewer: CodeHighlighter;

  constructor(table: HTMLElement, htmlViewer: HTMLElement) {
    this.startHighlight = this.startHighlight.bind(this);
    this.stopHighlight = this.stopHighlight.bind(this);

    const callbacks = {
      startHighlight: this.startHighlight,
      stopHighlight: this.stopHighlight
    }
    this.table = new TableHighlighter(table, callbacks);
    this.htmlViewer = new CodeHighlighter(htmlViewer, callbacks);
  }

  startHighlight(elemId: string | undefined) {
    if (!elemId) return;
    this.htmlViewer.highlightCodeElem(elemId);
    this.table.highlightElement(elemId);
  }

  stopHighlight(elemId: string | undefined) {
    if (!elemId) return;
    this.htmlViewer.removeHighlight(elemId);
    this.table.removeHighlight(elemId);
  }
}