import Joi from "joi"

export interface GetAdhesionRequest {
    id: number
}

export const getAdhesionValidation = Joi.object<GetAdhesionRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
* definitions:
*  UpdateAdhesionRequest:
*    type: object
*    properties:
*      name:
*        type: string
*        description: Le nom du local.
*        example: "monSuperAdhesion"
*      country:
*        type: string
*        description: Le pays du local.
*        example: "monSuperAdhesion"
*      city:
*        type: string
*        description: La ville du local.
*        example: "monSuperAdhesion"
*      zip:
*        type: string
*        description: Le code postal du local.
*        example: "75000"
*      address:
*        type: string
*        description: L'adresse du local.
*        example: "monSuperAdhesion"
*    required:
*      - id
*      - montant
*/

export interface UpdateAdhesionRequest {
    id: number,
    isActive?: boolean,
    typeAdhesion?: string,
    beginDate?: Date,
    endDate?: Date
}

export const updateAdhesionValidation = Joi.object<UpdateAdhesionRequest>({
    id: Joi.number()
        .required(),
    isActive: Joi.bool()
        .optional(),
    typeAdhesion: Joi.number()
        .optional(),
    beginDate: Joi.date()
        .iso()
        .optional(),
    endDate: Joi.date()
        .iso()
        .optional()
})

export interface GetListAdhesionRequest {
    page?: number,
    limit?: number,
    isActive?: boolean,
    typeAdhesion?: string,
    beginDate?: Date,
    endDate?: Date
}

export const getListAdhesionValidation = Joi.object<GetListAdhesionRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    isActive: Joi.bool()
        .optional(),
    typeAdhesion: Joi.number()
        .optional(),
    beginDate: Joi.date()
        .iso()
        .optional(),
    endDate: Joi.date()
        .iso()
        .optional()
})
