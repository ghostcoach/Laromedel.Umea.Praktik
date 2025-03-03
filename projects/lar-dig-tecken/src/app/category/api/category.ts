export enum Category{
  ALLA = 'visa alla',
  // Estetisk verksamhet
  BILDBEGREPP = 'bildbegrepp',
  INSTRUMENT = 'instrument',
  SYSLOJD = 'syslöjd',
  TRASLOJD = 'traslöjd',
  // Kommunikation
  ALFABETET = 'alfabetet',
  ENKLA_ORD = 'enkla ord',
  KANSLOR = 'känslor',
  SKOLORD = 'skolord',
  // Motorik
  SPORT = 'sport',
  VATTENSAKERHET = 'vattensäkerhet',
  RORELSE = 'rörelse',
  IDROTTSHALL = 'idrottshall',
  // Vardagsaktiviteter
  FORDON = 'fordon',
  KOKSREDSKAP = 'köksredskap',
  FRUKT = 'frukt',
  GRONSAKER_OCH_ROTFRUKTER = 'grönsaker och rotfrukter',
  LIVSMEDEL = 'livsmedel',
  RELIGION = 'religion',
  SAMHALLET = 'samhället',
  TRAFIK = 'trafik',
  // Verklighetsuppfattning
  DJUR = 'djur',
  VAXTER = 'växter',
  ANTAL = 'antal',
  LAGESORD = 'lägesord',
  KLADER = 'kläder',
  PENGAR = 'pengar',
  VARDAGSTEKNIK = 'vardagsteknik',
}

export enum SubjectArea {
  ALLA = 'alla',
  ESTETISK_VERKSAMHET = 'estetisk verksamhet',
  KOMMUNIKATION = 'kommunikation',
  MOTORIK = 'motorik',
  VARDAGSAKTIVITET = 'vardagsaktivitet',
  VERKLIGHETSUPPFATTNING = 'verklighetsuppfattning'
}

export interface ISubjectArea {
  subjectArea: SubjectArea,
  categories: ICategory[]
}

export interface ICategory {
  category: Category,
  words: string[]
}