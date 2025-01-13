export interface ISpyName {
  p: string;
}

export interface ISpyObj {
  baseName: string;
  methodNames: readonly string[] | { [p: string]: ISpyName };
  propertyNames?: readonly string[] | { [p: string]: ISpyName } | undefined;
}
