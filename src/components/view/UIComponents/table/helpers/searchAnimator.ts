export function animateSearched(table: HTMLElement, searched: string) {
  const elems = Array.from(table.querySelectorAll(searched));
  elems.forEach((el) => el.classList.add('chosen'));
}