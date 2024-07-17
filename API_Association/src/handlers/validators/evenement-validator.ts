import Joi from "joi"

export interface CreateEvenementRequest {
    name: string,
    type: string,
    isPublic: boolean,
    beginDate: Date,
    endDate: Date
}

export const createEvenementValidation = Joi.object<CreateEvenementRequest>({
    name: Joi.string().required(),
    type: Joi.string().required(),
    isPublic: Joi.bool().required(),
    beginDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required()
})

export interface GetEvenementRequest {
    id: number
}

export const getEvenementValidation = Joi.object<GetEvenementRequest>({
    id: Joi.number().required()
})

export interface UpdateEvenementValidation {
    id: number,
    name?: string,
    type?: string,
    isPublic?: boolean,
    beginDate?: Date,
    endDate?: Date
}

export const updateEvenementValidation = Joi.object<UpdateEvenementValidation>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    type: Joi.string().optional(),
    isPublic: Joi.bool().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
})

export interface GetEvenementsRequest {
    page?: number,
    limit?: number,
    type?: string,
    isPublic?: boolean,
    beginDate?: Date,
    endDate?: Date
}

export const getEvenementsValidation = Joi.object<GetEvenementsRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    type: Joi.string().optional(),
    isPublic: Joi.bool().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
})

export interface GetEvenementsPublicRequest {
    page?: number,
    limit?: number,
    type?: string,
    beginDate?: Date,
    endDate?: Date,
    domainName: string
}

export const getEvenementsPublicValidation = Joi.object<GetEvenementsPublicRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    type: Joi.string().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    domainName: Joi.string().required()
})