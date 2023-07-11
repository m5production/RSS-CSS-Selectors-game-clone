import './styles/index.scss';
import 'highlight.js/styles/atom-one-dark-reasonable.css';
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';

type IMarkedMarkup = {
  value: string,
  isStartOfTagWithNestness?: boolean,
  isEndOfTagWithNestness?: boolean,
  isNested?: boolean,
};

hljs.registerLanguage('xml', xml);

export class HtmlViewer {
  public node: HTMLElement;
  private disposition: HTMLDivElement[];

  constructor(disposition: string) {
    this.node = document.getElementById('html-code') as HTMLElement;
    this.disposition = this.makeDisposition(disposition);
    this.update(this.disposition);
  }

  private update(disposition: HTMLDivElement[]) {
    this.node.innerHTML = '';
    disposition.forEach((el) => this.node.insertAdjacentElement('beforeend', el));
  }

  private makeDisposition(str: string) {
    function isStartOfTagWithNestedElems(index: number, elems: string[]) {
      if (index >= elems.length - 1) return false;
      const elem = elems[index];
      const nextElem = elems[index + 1];
      if (!elem.startsWith('\t') && nextElem.startsWith('\t')) return true;
      return false;
    }

    function isEndOfTagWithNestedElems(index: number, elems: string[]) {
      if (index <= 0) return false;
      const elem = elems[index];
      const prevElem = elems[index - 1];
      if (!elem.startsWith('\t') && prevElem.startsWith('\t')) return true;
      return false;
    }

    function isNested(elem: string) {
      return elem.startsWith('\t');
    }

    function findEndTagIndex(indexOfOpenTag: number, array: Array<IMarkedMarkup>) {
      for (let i = indexOfOpenTag + 1; i < array.length; i += 1) {
        const elem = array[i];
        if (elem.isEndOfTagWithNestness) return i;
      }
      return -1;
    }

    const makeCompoundElem = (arr: IMarkedMarkup[], parentId: number) => {
      const highlightedOpenTag = this.highlightString(arr[0].value);
      const highlightedCloseTag = this.highlightString(arr[arr.length - 1].value);
      const highlightedWrappedNestedElems = arr.slice(1, arr.length - 1)
        .map((el, index) => this.wrapElement(this.highlightString(el.value), [parentId, index]).outerHTML);
      return `${highlightedOpenTag}\n${highlightedWrappedNestedElems.join('\n')}${highlightedCloseTag}`;
    }

    const markedElements = str.split(/[\n]+/).map((elem, index, elems): {
      value: string,
      isStartOfTagWithNestness?: boolean,
      isEndOfTagWithNestness?: boolean,
      isNested?: boolean,
    } => {
      if (isStartOfTagWithNestedElems(index, elems)) {
        return { value: elem, isStartOfTagWithNestness: true }
      }
      if (isEndOfTagWithNestedElems(index, elems)) {
        return { value: elem, isEndOfTagWithNestness: true }
      }
      if (isNested(elem)) {
        return { value: elem, isNested: true }
      }
      return { value: elem };
    });

    let elementId = 0;

    const disposition: HTMLDivElement[] = [];
    for (let i = 0; i < markedElements.length; i += 1) {
      const currentElem = markedElements[i];
      if (currentElem.isStartOfTagWithNestness) {
        const indexOfClosingTag = findEndTagIndex(i, markedElements);
        const compoundElem = makeCompoundElem(markedElements.slice(i, indexOfClosingTag + 1), elementId);
        disposition.push(this.wrapElement(compoundElem, [elementId++, null]));
        i = indexOfClosingTag;
        continue;
      }
      const highlighted = this.highlightString(currentElem.value);
      disposition.push(this.wrapElement(highlighted, [elementId++, null]));
    }

    return disposition;
  }

  private wrapElement(str: string, id: [number, number | null]) {
    const elWrapper = document.createElement('div');
    const idAttr = id[1] === null ? String(id[0]) : id.join(',');
    elWrapper.setAttribute('data-markup-block-id', String(idAttr));
    elWrapper.className = 'code-block';
    elWrapper.insertAdjacentHTML('afterbegin', str);
    return elWrapper as HTMLDivElement;
  }

  private highlightString(str: string) {
    return hljs.highlight(str, { language: 'xml' }).value;
  }
}