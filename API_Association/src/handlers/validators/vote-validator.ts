import Joi from "joi"

export interface CreateVoteRequest {
    name: string,
    beginDate: Date,
    endDate: Date,
    voteIdParent?: number
}

export const createVoteValidation = Joi.object<CreateVoteRequest>({
    name: Joi.string().required(),
    beginDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    voteIdParent: Joi.number().optional()
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
    endDate?: Date,
    voteIdParent?: number
}

export const updateVoteValidation = Joi.object<UpdateVoteValidation>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    voteIdParent: Joi.number().optional()
})

export interface GetVotesRequest {
    page?: number,
    limit?: number,
    beginDate?: Date,
    endDate?: Date,
    voteIdParent?: number
}

export const getVotesValidation = Joi.object<GetVotesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    beginDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    voteIdParent: Joi.number().optional()
})