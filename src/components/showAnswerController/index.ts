export class ShowAnswerController {
  private correctAnswer: string | null;
  private userInputNode: HTMLInputElement;
  private showAnswerBtnNode: HTMLButtonElement;
  private timer: NodeJS.Timeout | null;
  private hintUsedCallback: () => void;

  constructor(userInputNode: HTMLInputElement, hintUsedCallback: () => void) {
    this.abortShowAnswer = this.abortShowAnswer.bind(this);
    this.handleShowAnswerBtnClick = this.handleShowAnswerBtnClick.bind(this);

    this.userInputNode = userInputNode;
    this.correctAnswer = null;
    this.showAnswerBtnNode = document.getElementById('show-answer-btn') as HTMLButtonElement;
    this.showAnswerBtnNode.addEventListener('click', this.handleShowAnswerBtnClick);
    this.timer = null;
    this.hintUsedCallback = hintUsedCallback;
  }

  public initializeCorrectAnswer(answer: string) {
    this.correctAnswer = answer;
  }

  private handleShowAnswerBtnClick(e: MouseEvent) {
    e.stopPropagation();
    this.hintUsedCallback();
    this.showAnswerBtnNode.removeEventListener('click', this.handleShowAnswerBtnClick);
    this.userInputNode.value = '';
    if (!this.correctAnswer) throw new Error('Searched selector is not passed!');
    this.showAnswer(this.correctAnswer);
  }

  private showAnswer(correctAnswer: string, index = 0) {
    if (index >= correctAnswer.length) {
      this.showAnswerBtnNode.addEventListener('click', this.handleShowAnswerBtnClick);
      return;
    }
    const text = this.userInputNode.value;
    this.userInputNode.value = text + correctAnswer[index];
    this.timer = setTimeout(() => this.showAnswer(correctAnswer, index + 1), 400);
    document.addEventListener('click', this.abortShowAnswer);
  }

  private abortShowAnswer() {
    if (!this.timer) return;
    clearTimeout(this.timer);
    this.timer = null;
    document.removeEventListener('click', this.abortShowAnswer);
    this.showAnswerBtnNode.addEventListener('click', this.handleShowAnswerBtnClick);
  }
}