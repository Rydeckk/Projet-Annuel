import Joi from "joi"

export interface CreateLocalRequest {
    name: string,
    country: string,
    city: string,
    zip: string,
    address: string,
    phone: string,
    email: string
}

export const createLocalValidation = Joi.object<CreateLocalRequest>({
    name: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    zip: Joi.string().required().min(5).max(5),
    address: Joi.string().required(),
    phone: Joi.string().min(10).max(10).required(),
    email: Joi.string().required()
})

export interface GetLocalRequest {
    id: number
}

export const getLocalValidation = Joi.object<GetLocalRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
* definitions:
*  UpdateLocalRequest:
*    type: object
*    properties:
*      name:
*        type: string
*        description: Le nom du local.
*        example: "monSuperLocal"
*      country:
*        type: string
*        description: Le pays du local.
*        example: "monSuperLocal"
*      city:
*        type: string
*        description: La ville du local.
*        example: "monSuperLocal"
*      zip:
*        type: string
*        description: Le code postal du local.
*        example: "75000"
*      address:
*        type: string
*        description: L'adresse du local.
*        example: "monSuperLocal"
*    required:
*      - id
*      - montant
*/

export interface UpdateLocalRequest {
    id: number,
    name?: string,
    country?: string,
    city?: string,
    zip?: string
    address?: string,
    phone?: string,
    email?: string
}

export const updateLocalValidation = Joi.object<UpdateLocalRequest>({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .optional(),
    country: Joi.string()
        .optional(),
    city: Joi.string()
        .optional(),
    zip: Joi.string()
        .optional()
        .min(5)
        .max(5),
    address: Joi.string()
        .optional(),
    phone: Joi.string().min(10).max(10).optional(),
    email: Joi.string().optional()
})

export interface GetListLocalRequest {
    page?: number,
    limit?: number,
    name?: string,
    country?: string,
    city?: string,
    zip?: string,
    address?: string
}

export const getListLocalValidation = Joi.object<GetListLocalRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    name: Joi.string().optional(),
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    zip: Joi.string().optional().min(5).max(5),
    address: Joi.string().optional()
})
