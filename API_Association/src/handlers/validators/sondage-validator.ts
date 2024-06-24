import Joi from "joi"

export interface CreateSondageRequest {
    name: string,
    beginDate: Date,
    endDate: Date
}

export const createSondageValidation = Joi.object<CreateSondageRequest>({
    name: Joi.string().required(),
    beginDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required()
})

export interface GetSondageRequest {
    id: number
}

export const getSondageValidation = Joi.object<GetSondageRequest>({
    id: Joi.number().required()
})

export interface UpdateSondageValidation {
    id: number,
    name?: string,
    beginDate?: Date,
    endDate?: Date
}

export const updateSondageValidation = Joi.object<UpdateSondageValidation>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
})

export interface GetSondagesRequest {
    page?: number,
    limit?: number,
    beginDate?: Date,
    endDate?: Date
}

export const getSondagesValidation = Joi.object<GetSondagesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
})