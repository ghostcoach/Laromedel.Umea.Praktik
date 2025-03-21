import {ICategory} from "../api/category";
import {SubjectArea} from "../../subject-area/api/subject-area";
import {MemoryCard} from "@games/memory-card";
import {generateId} from "@utility/util";
import {CardContent} from "@games/card-content";

const kommunikationBaseHref: string = "/assets/subject-area/kommunikation";
const alfabetetBaseHref: string = `${kommunikationBaseHref}/alfabetet`;
const enklaOrdBaseHref: string = `${kommunikationBaseHref}/enkla-ord`;
const kanslorBaseHref: string = `${kommunikationBaseHref}/kanslor`;
const skolordBaseHref: string = `${kommunikationBaseHref}/skolord`;

const kommunikationScoreCardAltText: string = "Två spelkort med rosamönstrad bakgrund och vit ram lagda över varandra";
const scoreCardImage: string = `${kommunikationBaseHref}/poang-kort.svg`;

export const kommunikationData: ICategory[] = [
  {
    name: "alfabetet",
    displayName: "Alfabetet",
    menuImage: `${alfabetetBaseHref}/alfabetet-menu.svg`,
    menuImageAlt: "Texten 'abc' placerad på en rosa bakgrund med prickmönster.",
    cardFrontImage: `${kommunikationBaseHref}/spelkort-framsida.svg`,
    cardBackImage: `${kommunikationBaseHref}/spelkort-baksida.svg`,
    scoreCardImage: scoreCardImage,
    scoreCardImageAlt: kommunikationScoreCardAltText,
    subjectArea: SubjectArea.KOMMUNIKATION,
    cards: [
      new MemoryCard(generateId(), "a", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "b", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "c", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "d", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "e", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "f", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "g", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "h", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "i", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "j", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "k", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "l", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "m", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "n", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "o", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "p", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "q", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "r", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "s", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "t", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "u", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "v", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "w", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "x", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "y", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "z", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "å", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "ä", alfabetetBaseHref, CardContent.WORD, true),
      new MemoryCard(generateId(), "ö", alfabetetBaseHref, CardContent.WORD, true),
    ],
    wordsNotInSameDeck: [],
  },
  {
    name: "enklaOrd",
    displayName: "Enkla ord",
    menuImage: `${kommunikationBaseHref}/enkla-ord/enkla-ord-menu.svg`,
    menuImageAlt: "Texten 'so-la' and 'sa-la' i två vita rutor som är placerad mot en rosa bakgrund med prickmönster.",
    cardFrontImage: `${kommunikationBaseHref}/spelkort-framsida.svg`,
    cardBackImage: `${kommunikationBaseHref}/spelkort-baksida.svg`,
    scoreCardImage: scoreCardImage,
    scoreCardImageAlt: kommunikationScoreCardAltText,
    subjectArea: SubjectArea.KOMMUNIKATION,
    cards: [
      new MemoryCard(generateId(), "arm", enklaOrdBaseHref),
      new MemoryCard(generateId(), "la", enklaOrdBaseHref),
      new MemoryCard(generateId(), "lo", enklaOrdBaseHref),
      new MemoryCard(generateId(), "mil", enklaOrdBaseHref),
      new MemoryCard(generateId(), "mos", enklaOrdBaseHref),
      new MemoryCard(generateId(), "orm", enklaOrdBaseHref),
      new MemoryCard(generateId(), "os", enklaOrdBaseHref),
      new MemoryCard(generateId(), "ram", enklaOrdBaseHref),
      new MemoryCard(generateId(), "rim", enklaOrdBaseHref),
      new MemoryCard(generateId(), "ro", enklaOrdBaseHref),
      new MemoryCard(generateId(), "ros", enklaOrdBaseHref),
      new MemoryCard(generateId(), "sa", enklaOrdBaseHref),
      new MemoryCard(generateId(), "sal", enklaOrdBaseHref),
      new MemoryCard(generateId(), "sil", enklaOrdBaseHref),
      new MemoryCard(generateId(), "so", enklaOrdBaseHref),
      new MemoryCard(generateId(), "sol", enklaOrdBaseHref),
    ],
    wordsNotInSameDeck: [],
  },
  {
    name: "kanslor",
    displayName: "Känslor",
    menuImage: `${kommunikationBaseHref}/kanslor/kanslor-menu.svg`,
    menuImageAlt: "En rosa kortbaksida med två vita cirklar; en med ett ledset ansikte och en tår, och en med ett glatt ansikte.",
    cardFrontImage: `${kommunikationBaseHref}/spelkort-framsida.svg`,
    cardBackImage: `${kommunikationBaseHref}/spelkort-baksida.svg`,
    scoreCardImage: scoreCardImage,
    scoreCardImageAlt: kommunikationScoreCardAltText,
    subjectArea: SubjectArea.KOMMUNIKATION,
    cards: [
      new MemoryCard(generateId(), "arg", kanslorBaseHref),
      new MemoryCard(generateId(), "avundsjuk", kanslorBaseHref),
      new MemoryCard(generateId(), "förvånad", kanslorBaseHref),
      new MemoryCard(generateId(), "frustrerad", kanslorBaseHref),
      new MemoryCard(generateId(), "glad", kanslorBaseHref),
      new MemoryCard(generateId(), "intresserad", kanslorBaseHref),
      new MemoryCard(generateId(), "irriterad", kanslorBaseHref),
      new MemoryCard(generateId(), "kär", kanslorBaseHref),
      new MemoryCard(generateId(), "ledsen", kanslorBaseHref),
      new MemoryCard(generateId(), "nöjd", kanslorBaseHref),
      new MemoryCard(generateId(), "nyfiken", kanslorBaseHref),
      new MemoryCard(generateId(), "orolig", kanslorBaseHref),
      new MemoryCard(generateId(), "pigg", kanslorBaseHref),
      new MemoryCard(generateId(), "rädd", kanslorBaseHref),
      new MemoryCard(generateId(), "stolt", kanslorBaseHref),
      new MemoryCard(generateId(), "trött", kanslorBaseHref),
    ],
    wordsNotInSameDeck: [],
  },
  {
    name: "skolord",
    displayName: "Skolord",
    menuImage: `${kommunikationBaseHref}/skolord/skolord-menu.svg`,
    menuImageAlt: "En rosa kortbaksida med en vit figur som sitter vid ett bord och skriver eller ritar.",
    cardFrontImage: `${kommunikationBaseHref}/spelkort-framsida.svg`,
    cardBackImage: `${kommunikationBaseHref}/spelkort-baksida.svg`,
    scoreCardImage: scoreCardImage,
    scoreCardImageAlt: kommunikationScoreCardAltText,
    subjectArea: SubjectArea.KOMMUNIKATION,
    cards: [
      new MemoryCard(generateId(), "dator", skolordBaseHref),
      new MemoryCard(generateId(), "idrottshall", skolordBaseHref),
      new MemoryCard(generateId(), "lärobok", skolordBaseHref),
      new MemoryCard(generateId(), "matsal", skolordBaseHref),
      new MemoryCard(generateId(), "musiksal", skolordBaseHref),
      new MemoryCard(generateId(), "penna", skolordBaseHref),
      new MemoryCard(generateId(), "rast", skolordBaseHref),
      new MemoryCard(generateId(), "schema", skolordBaseHref),
      new MemoryCard(generateId(), "skolbänk", skolordBaseHref),
      new MemoryCard(generateId(), "skolgård", skolordBaseHref),
      new MemoryCard(generateId(), "skrivbok", skolordBaseHref),
      new MemoryCard(generateId(), "suddgummi", skolordBaseHref),
      new MemoryCard(generateId(), "surfplatta", skolordBaseHref),
      new MemoryCard(generateId(), "textilslöjd", skolordBaseHref),
      new MemoryCard(generateId(), "träslöjd", skolordBaseHref),
      new MemoryCard(generateId(), "whiteboard", skolordBaseHref),
    ],
    wordsNotInSameDeck: [],
  },
];
