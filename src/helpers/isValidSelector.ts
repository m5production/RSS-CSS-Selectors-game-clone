export function isValidSelector(selector: string) {
  const queryCheck = (s: string) => document.createDocumentFragment().querySelector(s);
  try {
    queryCheck(selector);
    return true;
  } catch (error) {
    return false;
  }
}