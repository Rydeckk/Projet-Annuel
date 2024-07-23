import Joi from "joi"

export interface GetTransactionsRequest {
    page?: number,
    limit?: number,
    type?: string,
    userId?: number
}

export const getTransactionsValidation = Joi.object<GetTransactionsRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    type: Joi.string().valid('don').optional(),
    userId: Joi.number().optional()
})