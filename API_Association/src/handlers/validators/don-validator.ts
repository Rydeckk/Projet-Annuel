import Joi from "joi"

export interface CreateDonRequest {
    montant: number
}

export const createDonValidation = Joi.object<CreateDonRequest>({
    montant: Joi.number().min(1).required()
})