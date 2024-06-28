import Joi from "joi"

export interface CreatePlanningRequest {
    title: string
    date: Date,
    location: string,
    startTime: string,
    endTime: string,
    calendar_name: string
    listUser?: Array<number>
}

export const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

export const createPlanningValidation = Joi.object<CreatePlanningRequest>({
    title: Joi.string().required(),
    date: Joi.date().iso().required(),
    location: Joi.string().required(),
    startTime: Joi.string().pattern(timeRegex).required(),
    endTime: Joi.string().pattern(timeRegex).required(),
    calendar_name: Joi.string().required(),
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
    location?: string,
    startTime?: string,
    endTime?: string,
    calendar_name?: string,
    listUser?: Array<number>
}

export const updatePlanningValidation = Joi.object<UpdatePlanningValidation>({
    id: Joi.number().required(),
    title: Joi.string().optional(),
    date: Joi.date().iso().optional(),
    location: Joi.string().optional(),
    startTime: Joi.string().pattern(timeRegex).optional(),
    endTime: Joi.string().pattern(timeRegex).optional(),
    calendar_name: Joi.string().optional(),
    listUser: Joi.array().items(Joi.number()).optional()
})

export interface GetPlanningsRequest {
    page?: number,
    limit?: number,
    date?: Date,
    location?: string,
    startTime?: string,
    endTime?: string,
    calendar_name?: string
    listUser?: Array<number>
}

export const getPlanningsValidation = Joi.object<GetPlanningsRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    date: Joi.date().iso().optional(),
    location: Joi.string().optional(),
    startTime: Joi.string().pattern(timeRegex).optional(),
    endTime: Joi.string().pattern(timeRegex).optional(),
    calendar_name: Joi.string().optional(),
    listUser: Joi.array().items(Joi.number()).optional()
})