import Joi from "joi"

export interface CreateAssembleeRequest {
    location: string
    description: string
    beginDate: Date
    endDate: Date
}

export const createAssembleeValidation = Joi.object<CreateAssembleeRequest>({
    location: Joi.string().required(),
    description: Joi.string().required(),
    beginDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required()
})

export interface GetAssembleeRequest {
    id: number
}

export const getAssembleeValidation = Joi.object<GetAssembleeRequest>({
    id: Joi.number().required()
})

export interface UpdateAssembleeValidation {
    id: number,
    location?: string
    description?: string
    beginDate?: Date
    endDate?: Date
}

export const updateAssembleeValidation = Joi.object<UpdateAssembleeValidation>({
    id: Joi.number().required(),
    description: Joi.string().optional(),
    location: Joi.string().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
})

export interface GetAssembleesRequest {
    page?: number,
    limit?: number,
    location?: string
    beginDate?: Date
    endDate?: Date
}

export const getAssembleesValidation = Joi.object<GetAssembleesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    location: Joi.string().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
})