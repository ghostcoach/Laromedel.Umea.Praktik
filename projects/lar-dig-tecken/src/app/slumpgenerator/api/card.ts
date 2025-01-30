import { Category } from "../../category/api/category"

export interface IFirstCard {
    category: Category,
    word: string
}

export interface ICardStatus {
    isSelected: boolean,
    isCorrect: boolean
}