import Joi from "joi"

/**
 * @swagger
 * definitions:
 *   CreateRoleRequest:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         minLength: 3
 *         description: Le nom du rôle.
 *         example: "Nom du rôle"
 *         required: true
 *       isMember:
 *         type: boolean
 *         description: Indique si le rôle est un rôle membre de l'association.
 *         example: true
 *         required: true
 *       isAdmin:
 *         type: boolean
 *         description: Indique si le rôle est un rôle administrateur de l'association.
 *         example: true
 *         required: true
 *       isSuperAdmin:
 *         type: boolean
 *         description: Indique si le rôle est un rôle super administrateur de l'application.
 *         example: true
 *         required: true
 *       associationId:
 *          type: number
 *          description: Indique sur quel association le rôle doit être actif
 *          example: 123
 *          required: true
 */

export interface createRoleRequest {
    name: string,
    isMember: boolean,
    isAdmin: boolean,
    isSuperAdmin: boolean,
    associationId: number
}

export const createRoleValidation = Joi.object<createRoleRequest>({
    name: Joi.string()
        .min(3)
        .required(),
    isMember: Joi.bool()
        .required(),
    isAdmin: Joi.bool()
        .required(),
    isSuperAdmin: Joi.bool()
        .required(),
    associationId: Joi.number()
        .required()
})

export interface GetRoleByIdRequest {
    id: number
}

export const getRoleByIdValidation = Joi.object<GetRoleByIdRequest>({
    id: Joi.number().required()
})

export interface GetRolesRequest {
    page?: number,
    limit?: number,
    isMember?: boolean,
    isAdmin?: boolean,
    isSuperAdmin?: boolean,
    associationId?: number
}

export const getRolesValidation = Joi.object<GetRolesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    isMember: Joi.bool()
        .optional(),
    isAdmin: Joi.bool()
        .optional(),
    isSuperAdmin: Joi.bool()
        .optional(),
    associationId: Joi.number()
        .optional()
})

/**
 * @swagger
 * definitions:
 *   UpdateRoleRequest:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         format: int64
 *         description: L'ID du rôle à mettre à jour.
 *         example: 123
 *       name:
 *         type: string
 *         minLength: 3
 *         description: Le nom du rôle.
 *         example: "Nom du rôle"
 *         required: true
 *       isMember:
 *         type: boolean
 *         description: Indique si le rôle est un rôle membre de l'association.
 *         example: true
 *         required: true
 *       isAdmin:
 *         type: boolean
 *         description: Indique si le rôle est un rôle administrateur de l'association.
 *         example: true
 *         required: true
 *       isSuperAdmin:
 *         type: boolean
 *         description: Indique si le rôle est un rôle super administrateur de l'application.
 *         example: true
 *         required: true
 *       associationId:
 *          type: number
 *          description: Indique sur quel association le rôle doit être actif
 *          example: 123
 *          required: true
 */

export interface UpdateRoleRequest {
    id: number,
    name?: string,
    isMember?: boolean,
    isAdmin?: boolean,
    isSuperAdmin?: boolean,
    associationId?: number
}

export const updateRoleValidation = Joi.object<UpdateRoleRequest>({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .min(3)
        .optional(),
    isMember: Joi.bool()
        .optional(),
    isAdmin: Joi.bool()
        .optional(),
    isSuperAdmin: Joi.bool()
        .optional(),
    associationId: Joi.number()
        .optional()
})

/**
 * @swagger
 * definitions:
 *   CreateMyRoleRequest:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         minLength: 3
 *         description: Le nom du rôle.
 *         example: "Nom du rôle"
 *         required: true
 *       isMember:
 *         type: boolean
 *         description: Indique si le rôle est un rôle membre de l'association.
 *         example: true
 *         required: true
 *       isAdmin:
 *         type: boolean
 *         description: Indique si le rôle est un rôle administrateur de l'association.
 *         example: true
 *         required: true
 */

export interface createMyRoleRequest {
    name: string,
    isMember: boolean,
    isAdmin: boolean
}

export const createMyRoleValidation = Joi.object<createMyRoleRequest>({
    name: Joi.string()
        .min(3)
        .required(),
    isMember: Joi.bool()
        .required(),
    isAdmin: Joi.bool()
        .required()
})

export interface GetRoleByIdRequest {
    id: number
}

export const getMyRoleByIdValidation = Joi.object<GetRoleByIdRequest>({
    id: Joi.number().required()
})

export interface GetMyRolesRequest {
    page?: number,
    limit?: number,
    isMember?: boolean,
    isAdmin?: boolean
}

export const getMyRolesValidation = Joi.object<GetMyRolesRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    isMember: Joi.bool()
        .optional(),
    isAdmin: Joi.bool()
        .optional()
})

/**
 * @swagger
 * definitions:
 *   UpdateMyRoleRequest:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *         format: int64
 *         description: L'ID du rôle à mettre à jour.
 *         example: 123
 *         required: true
 *       name:
 *         type: string
 *         minLength: 3
 *         description: Le nom du rôle.
 *         example: "Nom du rôle"
 *       isMember:
 *         type: boolean
 *         description: Indique si le rôle est un rôle membre de l'association.
 *         example: true
 *       isAdmin:
 *         type: boolean
 *         description: Indique si le rôle est un rôle administrateur de l'association.
 *         example: true
 */

export interface UpdateMyRoleRequest {
    id: number,
    name?: string,
    isMember?: boolean,
    isAdmin?: boolean
}

export const updateMyRoleValidation = Joi.object<UpdateMyRoleRequest>({
    id: Joi.number()
        .required(),
    name: Joi.string()
        .min(3)
        .optional(),
    isMember: Joi.bool()
        .optional(),
    isAdmin: Joi.bool()
        .optional(),
})