import Joi from "joi"

export interface CreateVoteRequest {
    name: string,
    beginDate: Date,
    endDate: Date
}

export const createVoteValidation = Joi.object<CreateVoteRequest>({
    name: Joi.string().required(),
    beginDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required()
})

export interface GetVoteRequest {
    id: number
}

export const getVoteValidation = Joi.object<GetVoteRequest>({
    id: Joi.number().required()
})

export interface UpdateVoteValidation {
    id: number,
    name?: string,
    beginDate?: Date,
    endDate?: Date
}

export const updateVoteValidation = Joi.object<UpdateVoteValidation>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
})

export interface GetVotesRequest {
    page?: number,
    limit?: number,
    beginDate?: Date,
    endDate?: Date
}

export const getVotesValidation = Joi.object<GetVotesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
})