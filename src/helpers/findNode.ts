export type IFindNode = {
  nodeName: string,
  className?: string,
  id?: string
}

export function findNode({nodeName, className, id}: IFindNode): HTMLElement {
  let node: Element | null;
  
  if (className) node = document.querySelector(`.${className}`);
  else if (id) node = document.getElementById(id);
  else throw new Error('"className" and "id" can\'t be both "null" or "undefined"')
  
  if (!node) throw new Error(`${nodeName} wasn't found`)

  return node as HTMLElement;
}