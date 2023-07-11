import { IGameControllerCallbacks, ILevelData } from "../../common-types";
import { findNode } from "../../helpers/findNode";
import { isValidSelector } from "../../helpers/isValidSelector";
import { ShowAnswerController } from "../showAnswerController";

export class GameController {
  private userInputNode: HTMLInputElement;
  private tableNode: HTMLElement;
  private callbacks: IGameControllerCallbacks;
  private userEnterBtnNode: HTMLButtonElement;
  private levelId: number | null;
  private correctSelector: string | null;
  private answerController: ShowAnswerController;

  constructor(callbacks: IGameControllerCallbacks) {
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleKeyEnterPress = this.handleKeyEnterPress.bind(this);

    this.userInputNode = findNode({ nodeName: 'User Input', id: 'user-input' }) as HTMLInputElement;
    this.tableNode = findNode({ nodeName: 'Table', id: 'table' });
    this.userEnterBtnNode = findNode({nodeName: 'User Enter Button', id: 'user-enter-btn'}) as HTMLButtonElement;
    this.callbacks = callbacks;
    this.levelId = null;
    this.correctSelector = null;
    this.answerController = new ShowAnswerController(this.userInputNode, callbacks.handleHintUsed);

    document.onkeydown = this.handleKeyEnterPress;
    this.userEnterBtnNode.onclick = this.handleUserInput;
  }

  public initializeLevel(levelData: Pick<ILevelData, 'levelId' | 'searched'>) {
    this.levelId = levelData.levelId;
    this.correctSelector = levelData.searched;
    this.answerController.initializeCorrectAnswer(levelData.searched);
  }

  private handleKeyEnterPress(e: KeyboardEvent) {
    if (e.key !== 'Enter' || document.activeElement !== this.userInputNode) return;
    this.handleUserInput();
  }

  private handleUserInput() {
    const userAnswer = this.userInputNode.value;
    if (!isValidSelector(userAnswer)) {
      this.callbacks.handleWrongSelector();
      return;
    }
    const isCorrectAnswer = this.isCorrectAnswer(userAnswer);

    if (!isCorrectAnswer) {
      this.callbacks.handleWrongAnswer(userAnswer);
      return;
    }

    this.userInputNode.value = '';
    this.callbacks.onWin(this.levelId);
  }

  private findElementsOnTable(selector: string) {
    return Array.from(this.tableNode.querySelectorAll(selector));
  }

  private isCorrectAnswer(userAnswer: string) {
    const actual = this.findElementsOnTable(userAnswer);
    if (!this.correctSelector) throw new Error('CorrectSelector was not provided!');
    const expected = this.findElementsOnTable(this.correctSelector);
    if (!expected) throw new Error(`Correct answer is ${expected}.`);

    if (actual.length !== expected.length) return false;

    let isCorrect = true;
    expected.forEach((elem) => {
      if (!actual.includes(elem)) isCorrect = false;
    });

    return isCorrect;
  }
}