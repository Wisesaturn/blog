export default function convertSpaceToDash(str: string): string {
  return str.replace(/\s+/g, '-');
}
