export enum Category{
  ALLA = 'visa alla',
  BILDBEGREPP = 'bildbegrepp',
  INSTRUMENT = 'instrument',
  SYSLOJD = 'syslöjd',
  TRASLOJD = 'traslöjd',
  ALFABETET = 'alfabetet',
  ENKLA_ORD = 'enkla ord',
  KANSLOR = 'känslor',
  SKOLORD = 'skolord',
  SPORT = 'sport',
  VATTENSAKERHET = 'vattensäkerhet',
  RORELSE = 'rörelse',
  IDROTTSHALL = 'idrottshall',
  KOKSREDSKAP = 'köksredskap',
  FRUKT = 'frukt',
  GRONSAKER_OCH_ROTFRUKTER = 'grönsaker och rotfrukter',
  LIVSMEDEL = 'livsmedel',
  DJUR = 'djur',
  VAXTER = 'växter',
  ANTAL = 'antal',
  LAGESORD = 'lägesord',
}

export enum SubjectArea {
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