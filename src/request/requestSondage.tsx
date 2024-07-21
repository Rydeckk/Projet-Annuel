import { ReponseType } from "./requestReponse"

export type SondageType = {
    id: number,
    name: string,
    beginDate: Date,
    endDate: Date,
    reponses: ReponseType[]
}