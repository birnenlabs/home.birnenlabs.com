export function parseAsString(val: any): string|undefined {
  if (val === undefined || typeof val === 'string') {
    return val;
  }
  throw new Error(`Expected a string, but received: ${typeof val}`);
}
