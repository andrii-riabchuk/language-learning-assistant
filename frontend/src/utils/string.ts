export function specialsSeparated(str: string): string[] {
  const specials = '.,!?:';
  let specialIndex = -1;
  for (let i=0; i < str.length; i++){
    if (specials.includes(str[i])){
      specialIndex = i;
      break;
    }
  }
  if (specialIndex == -1) {
    return [str, ""]
  } else {
    return [str.slice(0, specialIndex), str.slice(specialIndex, str.length)]
  }
}

export function compareIgnoreCase(str1: string, str2: string) {
  return str1.toLocaleLowerCase() == str2.toLocaleLowerCase();
}

// consider word as normal if it contains at least one letter
export function isNormalWord(str: string) {
  const regExp = /[a-zA-Z]/g;
  return regExp.test(str);
}

export function getLineFeed(str: string) {
  return str.split('\n').length - 1
}