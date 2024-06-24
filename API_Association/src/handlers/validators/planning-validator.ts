import Joi from "joi"

export interface CreatePlanningRequest {
    title: string
    date: Date,
    start_time: string,
    end_time: string
    listUser?: Array<number>
}

export const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const createPlanningValidation = Joi.object<CreatePlanningRequest>({
    title: Joi.string().required(),
    date: Joi.date().iso().required(),
    start_time: Joi.string().pattern(timeRegex).required(),
    end_time: Joi.string().pattern(timeRegex).required(),
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
    date?: Date,
    start_time?: string,
    end_time?: string
    listUser?: Array<number>
}

export const updatePlanningValidation = Joi.object<UpdatePlanningValidation>({
    id: Joi.number().required(),
    title: Joi.string().optional(),
    date: Joi.date().iso().optional(),
    start_time: Joi.string().pattern(timeRegex).optional(),
    end_time: Joi.string().pattern(timeRegex).optional(),
    listUser: Joi.array().items(Joi.number()).optional()
})

export interface GetPlanningsRequest {
    page?: number,
    limit?: number,
    date?: Date,
    start_time?: string,
    end_time?: string
    listUser?: Array<number>
}

export const getPlanningsValidation = Joi.object<GetPlanningsRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    date: Joi.date().iso().optional(),
    start_time: Joi.string().pattern(timeRegex).optional(),
    end_time: Joi.string().pattern(timeRegex).optional(),
    listUser: Joi.array().items(Joi.number()).optional()
})