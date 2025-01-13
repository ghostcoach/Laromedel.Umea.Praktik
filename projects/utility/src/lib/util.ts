export function range(n: number): number[] {
  return Array.from({length: n}, (_, i) => i + 1);
}

export function getKeyByValue<T extends string | number>(enumObj: Record<string, T>, value: T): string | undefined {
  return Object.keys(enumObj)
    .find((key) => enumObj[key] === value)
    ?.toLowerCase();
}

export function lineRange(start: number, end: number): number[] {
  const numberLine: number[] = [];
  for (let i: number = start; i <= end; i++) {
    numberLine.push(i);
  }
  return numberLine;
}

export function customSort<T>(array: T[], key: keyof T): T[] {
  const adjustOrder: (str: string) => string = (str: string): string => {
    if (/^[åäö]/i.test(str)) {
      return `z${str}`;
    }
    return str;
  };

  return array.sort((a, b) => {
    const valA: string = String(a[key]);
    const valB: string = String(b[key]);
    const adjustedValA: string = adjustOrder(valA);
    const adjustedValB: string = adjustOrder(valB);
    return adjustedValA.localeCompare(adjustedValB);
  });
}

export function shuffle<T>(array: T[]): T[] {
  const copy: T[] = [...array];
  for (let i: number = copy.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function hasUndefinedProperties<T>(obj: T): boolean {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (obj[key] === undefined) {
        return true;
      }
    }
  }
  return false;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function replaceSpecialCharacters(str: string): string {
  return str
    .toLowerCase()
    .replace(/[åä]/g, "a")
    .replace(/[ö]/g, "o")
    .replace(/[^a-z0-9]/g, "");
}

export function parseName(name: string): string {
  return replaceSpecialCharacters(name).replace(/ /g, "-").toLowerCase();
}
