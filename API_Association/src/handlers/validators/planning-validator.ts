import Joi from "joi"

export interface CreatePlanningRequest {
    title: string
    beginDate: Date,
    endDate: Date,
    listUser?: Array<number>
}

export const createPlanningValidation = Joi.object<CreatePlanningRequest>({
    title: Joi.string().required(),
    beginDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    listUser: Joi.array().items(Joi.number()).optional()
})

export interface GetPlanningRequest {
    id: number
}

export const getPlanningValidation = Joi.object<GetPlanningRequest>({
    id: Joi.number().required()
})

export interface UpdatePlanningValidation {
    id: number,
    title?: string,
    beginDate?: Date,
    endDate?: Date,
    listUser?: Array<number>
}

export const updatePlanningValidation = Joi.object<UpdatePlanningValidation>({
    id: Joi.number().required(),
    title: Joi.string().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    listUser: Joi.array().items(Joi.number()).optional()
})

export interface GetPlanningsRequest {
    page?: number,
    limit?: number,
    beginDate?: Date,
    endDate?: Date,
    listUser?: Array<number>
}

export const getPlanningsValidation = Joi.object<GetPlanningsRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    listUser: Joi.array().items(Joi.number()).optional()
})