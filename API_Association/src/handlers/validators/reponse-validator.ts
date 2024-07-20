import Joi from "joi"

export interface CreateReponseRequest {
    name: string,
    voteId?: number,
    sondageId?: number,
    applicantId?: Array<number>
}

export const createReponseValidation = Joi.object<CreateReponseRequest>({
    name: Joi.string().required(),
    voteId: Joi.number().optional(),
    sondageId: Joi.number().optional(),
    applicantId: Joi.array().items(Joi.number()).optional()
})

export interface GetReponseRequest {
    id: number,
    voteId?: number,
    sondageId?: number,
}

export const getReponseValidation = Joi.object<GetReponseRequest>({
    id: Joi.number().required(),
    voteId: Joi.number().optional(),
    sondageId: Joi.number().optional()
})

export interface UpdateReponseValidation {
    id: number,
    name?: string,
    voteId?: number,
    sondageId?: number,
    applicantId?: Array<number>
}

export const updateReponseValidation = Joi.object<UpdateReponseValidation>({
    id: Joi.number().required(),
    name: Joi.string().optional(),
    voteId: Joi.number().optional(),
    sondageId: Joi.number().optional(),
    applicantId: Joi.array().items(Joi.number()).optional()
})

export interface GetReponsesRequest {
    page?: number,
    limit?: number,
    voteId?: number,
    sondageId?: number,
}

export const getReponsesValidation = Joi.object<GetReponsesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    voteId: Joi.number().optional(),
    sondageId: Joi.number().optional()
})