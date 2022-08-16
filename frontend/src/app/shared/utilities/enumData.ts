export function getEnumKeys(enumObj: any): string[] {
  return Object.keys(enumObj).filter((x) => isNaN(+x));
}

export function getEnumValues(enumObj: any): number[] {
  return Object.values(enumObj)
    .filter((x) => !isNaN(+x))
    .map((x) => +x);
}
