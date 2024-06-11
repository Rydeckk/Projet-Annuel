import Joi from "joi"

export interface CreateDocumentRequest {
    name: string,
    path: string,
    folderId?: number
}

export const createDocumentValidation = Joi.object<CreateDocumentRequest>({
    name: Joi.string().required(),
    path: Joi.string().required(),
    folderId: Joi.number().optional()
})

export interface GetDocumentRequest {
    id: number
}

export const getDocumentValidation = Joi.object<GetDocumentRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
* definitions:
*  UpdateDocumentRequest:
*    type: object
*    properties:
*      id:
*        type: number
*        description: L'Id du fichier.
*        example: 123
*      name:
*        type: string
*        description: Le nom du fichier.
*        example: "monSuperDocument"
*      path:
*        type: string
*        description: Le chemin du fichier.
*        example: "monSuperDocument"
*    required:
*      - id
*/

export interface UpdateDocumentRequest {
    id: number,
    name?: string,
    path?: string,
    folderId?: number
}

export const updateDocumentValidation = Joi.object<UpdateDocumentRequest>({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .optional(),
    path: Joi.string()
        .optional(),
    folderId: Joi.number()
        .optional()
})

export interface GetListDocumentRequest {
    page?: number,
    limit?: number,
    createdAfter?: Date,
    createdBefore?: Date,
    folderId?: number
}

export const getListDocumentValidation = Joi.object<GetListDocumentRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    createdAfter: Joi.date().iso().optional(),
    createdBefore: Joi.date().iso().optional(),
    folderId: Joi.number().optional()
})
