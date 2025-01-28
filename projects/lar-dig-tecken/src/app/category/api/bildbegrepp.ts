import { IFile } from './file'

export enum BildbegreppWords {
    BLA = 'blå',
    BRUN = 'brun',
    GRON = 'grön',
    GUL = 'gul',
    ROD = 'röd',
    ROSA = 'rosa',
    SVART = 'svart',
    VIT = 'vit',
    DUK = 'duk',
    FARGPENNA = 'färgpenna',
    FORKLADE = 'förkläde',
    LIM = 'lim',
    PALETT = 'palett',
    PENSEL = 'pensel',
    SAX = 'sax',
    STAFFLI = 'staffli',
    TEJP = 'tejp',
    VATTENFARG = 'vattenfärg'
}

export interface IBildbegrepp {
    word: BildbegreppWords,
    file: IFile
}

