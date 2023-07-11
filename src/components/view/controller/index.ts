import { HtmlViewer } from "../UIComponents/code-editor";
import { TableController } from "../UIComponents/table";
import { LevelNavigation } from "../UIComponents/nav-bar";
import { IViewData } from "./types";
import { Highlighter } from "../UIComponents/highlighter";

export class View {
  private table: TableController;
  private levelNav?: LevelNavigation;

  constructor() {
    this.table = new TableController();
  }

  public initializeLevel(parameters: IViewData) {
    const {searched, levelId, disposition, description, mappedLevels, callbacks } = parameters;
    this.makeTextDescription(description);
    this.levelNav = new LevelNavigation({ levelId, mappedLevels, callbacks });
    const htmlViewer = new HtmlViewer(disposition);
    this.table.update(disposition, searched);
    new Highlighter(this.table.node, htmlViewer.node);
  }

  public renderHintUsed() {
    if (!this.levelNav) return;
    return this.levelNav.markUseHint();
  }

  public renderWin() {
    return this.table.renderWin();
  }

  public renderWrongAnswer(userAns: string) {
    this.table.renderWrongAnswer(userAns);
  }

  public renderWrongSelector() {
    const codeBlocksNode = document.getElementById('editor-viewer-wrapper');
    if (!codeBlocksNode) return;

    const removeAnimationClass = () => {
      codeBlocksNode.classList.remove('wrong');
      codeBlocksNode.removeEventListener('animationend', removeAnimationClass);
    };

    codeBlocksNode.classList.add('wrong');
    
    codeBlocksNode.addEventListener('animationend', removeAnimationClass);
  }

  private makeTextDescription(description: string) {
    const taskDescriptionNode = document.getElementById('task-description');
    if (!taskDescriptionNode) throw new Error('Task Description node is missing');
    taskDescriptionNode.textContent = description;
  }
}