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
    voteId: number
}

export const getReponseValidation = Joi.object<GetReponseRequest>({
    id: Joi.number().required(),
    voteId: Joi.number().required()
})

export interface UpdateReponseValidation {
    id: number,
    name?: string,
    voteId?: number,
    applicantId?: number
}

export const updateReponseValidation = Joi.object<UpdateReponseValidation>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    voteId: Joi.number().optional(),
    applicantId: Joi.number().optional()
})

export interface GetReponsesRequest {
    page?: number,
    limit?: number,
    voteId?: number,
    applicantId?: number
}

export const getReponsesValidation = Joi.object<GetReponsesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    voteId: Joi.number().optional(),
    applicantId: Joi.number().optional()
})

export interface GetReponseVoteRequest {
    id: number,
    voteId: number
}

export const getReponseVoteValidation = Joi.object<GetReponseVoteRequest>({
    id: Joi.number().required(),
    voteId: Joi.number().required()
})