import {ICategory} from "../api/category";
import {estetiskVerksamhetData} from "./estetisk-verksamhet-data";
import {kommunikationData} from "./kommunikation-data";
import {motorikData} from "./motorik-data";
import {vardagsaktiviteterData} from "./vardagsaktiviteter-data";
import {verklighetsuppfattningData} from "./verklighetsuppfattning-data";

export const categoryData: ICategory[] = [
  ...kommunikationData,
  ...estetiskVerksamhetData,
  ...motorikData,
  ...vardagsaktiviteterData,
  ...verklighetsuppfattningData,
];
