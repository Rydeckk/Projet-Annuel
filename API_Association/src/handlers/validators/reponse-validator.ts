import Joi from "joi"

export interface CreateReponseRequest {
    name: string,
    applicantId?: number
}

export const createReponseValidation = Joi.object<CreateReponseRequest>({
    name: Joi.string().required(),
    applicantId: Joi.number().optional()
})

export interface GetReponseRequest {
    id: number,
    sondageId: number
}

export const getReponseValidation = Joi.object<GetReponseRequest>({
    id: Joi.number().required(),
    sondageId: Joi.number().required()
})

export interface UpdateReponseValidation {
    id: number,
    name?: string,
    sondageId?: number,
    applicantId?: number
}

export const updateReponseValidation = Joi.object<UpdateReponseValidation>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    sondageId: Joi.number().optional(),
    applicantId: Joi.number().optional()
})

export interface GetReponsesRequest {
    page?: number,
    limit?: number,
    sondageId?: number
}

export const getReponsesValidation = Joi.object<GetReponsesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    sondageId: Joi.number().optional()
})

export interface GetReponseSondageRequest {
    id: number,
    sondageId: number
}

export const getReponseSondageValidation = Joi.object<GetReponseSondageRequest>({
    id: Joi.number().required(),
    sondageId: Joi.number().required()
})