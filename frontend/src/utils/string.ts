export function specialsSeparated(str: string): string[] {
  if (str.match(/.*[.,!?]/)) {
    return [str.slice(0, str.length - 1), str.charAt(str.length - 1)];
  } else {
    return [str, ""];
  }
}

export function compareIgnoreCase(str1: string, str2: string) {
  return str1.toLocaleLowerCase() == str2.toLocaleLowerCase();
}
