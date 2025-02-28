import {TextStyleMap} from "@utility/text-style-map";
import {StyleMap} from "@utility/style-map";

export function isTwoOrFour(value: number | null): boolean {
  return value === 2 || value === 4;
}

export function isSix(value: number | null): boolean {
  return value === 6;
}

export function isEight(value: number | null): boolean {
  return value === 8;
}

export function isTenOrTwelve(value: number | null): boolean {
  return value === 10 || value === 12;
}

export function isFourteenOrSixteen(value: number | null): boolean {
  return value === 14 || value === 16;
}

export function getNumberKey(numberOfCards: number | null): string {
  if (numberOfCards === null) {
    return "";
  }
  let key: string = "";

  if (isTwoOrFour(numberOfCards)) {
    key = "2or4";
  } else if (isSix(numberOfCards)) {
    key = "6";
  } else if (isEight(numberOfCards)) {
    key = "8";
  } else if (isTenOrTwelve(numberOfCards)) {
    key = "10or12";
  } else if (isFourteenOrSixteen(numberOfCards)) {
    key = "14or16";
  }

  return key;
}

function getNumberKeyForAllCardSizes(numberOfCards: number | null): string {
  if (numberOfCards === null) {
    return "";
  }
  return numberOfCards.toString();
}

export function getTextClasses(numberOfCards: number | null, isUppercase: boolean | null, styles: TextStyleMap): string {
  const key: string = getNumberKey(numberOfCards);
  return isUppercase ? styles[key].uppercase : styles[key].lowercase;
}

export function getStyleClassesForAllCardSizes(numberOfCards: number | null, styles: StyleMap): string {
  const key: string = getNumberKeyForAllCardSizes(numberOfCards);
  return styles[key];
}

export function getCardSizeClasses(numberOfCards: number | null): string {
  const key: string = getNumberKey(numberOfCards);
  return cardSizeStyles[key];
}

export const cardSizeStyles: StyleMap = {
  "2or4":
    "outline-3 w-40 landscape-mobile:w-42 portrait-mobile:w-52 md:w-48 lg:w-64 xl:w-80 2xl:w-96 4xl:w-[25rem] narrow-2xl:w-80 narrow-3xl:w-80 narrow-4xl:w-80",
  "6": "w-32 landscape-mobile:w-36 portrait-mobile:w-44 md:w-40 lg:w-56 lg:w-56 xl:w-80 2xl 3xl:w-96 4xl:w-[25rem] narrow-3xl:w-80 narrow-4xl:w-80",
  "8": "w-28 landscape-mobile:w-32 md:w-36 lg:w-56 2xl:w-64 xl2:w-72 3xl:w-80 4xl:w-96 narrow-3xl:w-64 narrow-4xl:w-64",
  "10or12":
    "w-36 landscape-mobile:w-40 md:w-40 lg:w-52 xl:w-60 2xl:w-72 4xl:w-80 narrow-lg:w-40 narrow-xl:w-44 narrow-2xl:w-52 narrow-3xl:w-56 narrow-4xl:w-56",
  "14or16":
    "w-24 landscape-mobile:w-28 md:w-32 lg:w-52 xl:w-56 2xl:w-56 3xl:w-60 4xl:w-72 narrow-lg:w-44 narrow-2xl:w-44 narrow-3xl:w-44 narrow-4xl:w-44",
};
