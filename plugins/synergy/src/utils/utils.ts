export function deduplicate(arr: string[]) {
  return [...new Set(arr)];
}
