import Joi from "joi"

export interface CreateTypeAdhesionRequest {
    type: string,
    montant: number
}

export const createTypeAdhesionValidation = Joi.object<CreateTypeAdhesionRequest>({
    type: Joi.string().valid("monthly","quarterly","yearly").required(),
    montant: Joi.number().required()
})

export interface GetTypeAdhesionRequest {
    id: number
}

export const getTypeAdhesionValidation = Joi.object<GetTypeAdhesionRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
* definitions:
*  UpdateTypeAdhesionRequest:
*    type: object
*    properties:
*      type:
*        type: string
*        description: Le type du type d'adhesion.
*        example: "monSuperTypeAdhesion"
*      montant:
*        type: string
*        description: Le montant du type d'dhesion.
*        example: "monSuperTypeAdhesion"
*    required:
*      - id
*      - montant
*/

export interface UpdateTypeAdhesionRequest {
    id: number,
    type?: string,
    montant?: number
}

export const updateTypeAdhesionValidation = Joi.object<UpdateTypeAdhesionRequest>({
    id: Joi.number()
        .required(),
    type: Joi.string()
        .valid("monthly","quarterly","yearly")
        .optional(),
    montant: Joi.number()
        .optional(),
})

export interface GetListTypeAdhesionRequest {
    page?: number,
    limit?: number,
    type?: string,
    greaterThan?: number,
    lessThan?: number
}

export const getListTypeAdhesionValidation = Joi.object<GetListTypeAdhesionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    type: Joi.string().valid("monthly","quarterly","yearly").optional(),
    greaterThan: Joi.number().optional(),
    lessThan: Joi.number().optional()
})
