import Joi from "joi"

/**
 * @swagger
* definitions:
*  CreateAssociationRequest:
*    type: object
*    properties:
*      name:
*        type: string
*        description: Nom de l'association.
*        example: AssoName
*      description:
*        type: string
*        description: Description de l'association.
*        example: Je suis une asso
*      domainName:
*        type: string
*        description: Nom de domaine de l'association.
*        example: monAsso
*    required:
*      - name
*      - description
*      - domainName
*/

export interface CreateAssociationRequest {
    name: string,
    description: string,
    domainName: string
}

export const createAssociationValidation = Joi.object<CreateAssociationRequest>({
    name: Joi.string().required(),
    description: Joi.string().required(),
    domainName: Joi.string().required()
})

export interface GetAssociationRequest {
    id: number
}

export const getAssociationValidation = Joi.object<GetAssociationRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
* definitions:
*  UpdateAssociationRequest:
*    type: object
*    properties:
*      id:
*        type: integer
*        description: L'ID du compte.
*        example: 123
*      name:
*        type: string
*        description: Nom de l'association.
*        example: AssoName
*      description:
*        type: string
*        description: Description de l'association.
*        example: Je suis une asso
*      domainName:
*        type: string
*        description: Nom de domaine de l'association.
*        example: monAsso
*      themeId:
*        type: number
*        description: Numéro du thème de l'association
*        example: 123
*      gedId:
*        type: number
*        description: Numéro de la GED de l'association
*        example: 123
*/

export interface UpdateAssociationRequest {
    id: number,
    name?: string,
    description?: string,
    domainName?: string,
    themeId?: number,
    gedId?: number
}

export const updateAssociationValidation = Joi.object<UpdateAssociationRequest>({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .optional(),
    description: Joi.string()
        .optional(),
    domainName: Joi.string()
        .optional(),
    themeId: Joi.number()
        .optional(),
    gedId: Joi.number()
        .optional()
})

/**
 * @swagger
* definitions:
*  UpdateMyAssociationRequest:
*    type: object
*    properties:
*      name:
*        type: string
*        description: Nom de l'association.
*        example: AssoName
*      description:
*        type: string
*        description: Description de l'association.
*        example: Je suis une asso
*/

export interface UpdateMyAssociationRequest {
    name?: string,
    description?: string
}

export const updateMyAssociationValidation = Joi.object<UpdateMyAssociationRequest>({
    name: Joi.string()
        .optional(),
    description: Joi.string()
        .optional()
})
