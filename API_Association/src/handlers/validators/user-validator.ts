import Joi from "joi";

/**
 * @swagger
 * definitions:
 *   CreateUserRequest:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         format: email
 *         example: user@example.com
 *         required: true
 *       password:
 *         type: string
 *         format: password
 *         example: password123
 *         required: true
 *       firstName:
 *         type: string
 *         example: John
 *         required: true
 *       lastName:
 *         type: string
 *         example: Doe
 *         required: true
 *       address:
 *         type: string
 *         example: 2 rue des fleurs
 *         required: true
 */

export const createUserValidation = Joi.object<CreateUserValidationRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    domainName: Joi.string().required()
}).options({ abortEarly: false });

export interface CreateUserValidationRequest {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    address: string,
    domainName: string
}

/**
 * @swagger
 * definitions:
 *   LoginUserRequest:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         format: email
 *         example: user@example.com
 *         required: true
 *       password:
 *         type: string
 *         format: password
 *         example: password123
 *         required: true
 */

export const LoginUserValidation = Joi.object<LoginUserValidationRequest>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    domainName: Joi.string().required()
}).options({ abortEarly: false });

export interface LoginUserValidationRequest {
    email: string
    password: string,
    domainName: string
}

export interface GetUsersRequest {
    page?: number
    limit?: number,
    isMember?: boolean,
    isAdmin?: boolean,
    isSuperAdmin?: boolean,
    associationId?: number
}

export const getUsersValidation = Joi.object<GetUsersRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    isMember: Joi.bool().optional(),
    isAdmin: Joi.bool().optional(),
    isSuperAdmin: Joi.bool().optional(),
    associationId: Joi.number().optional()
})

export interface GetUserByIdRequest {
    id: number  
}

export const getUserByIdValidation = Joi.object<GetUserByIdRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
 * definitions:
 *   UpdateUserRequest:
 *     type: object
 *     properties:
 *       password:
 *         type: string
 *         format: password
 *         example: password123
 *       roleId:
 *          type: number
 *          example: 123
 *       associationId:
 *          type: number
 *          example: 123
 */

export interface UpdateUserRequest {
    id: number,
    password?: string,
    roleId?: number,
    associationId?: number
}

export const updateUserValidation = Joi.object<UpdateUserRequest>({
    id: Joi.number().required(),
    password: Joi.string().optional(),
    roleId: Joi.number().optional(),
    associationId: Joi.number().optional()
})

export interface GetMyUsersRequest {
    page?: number
    limit?: number,
    isMember?: boolean,
    isAdmin?: boolean
}

export const getMyUsersValidation = Joi.object<GetMyUsersRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    isMember: Joi.bool().optional(),
    isAdmin: Joi.bool().optional()
})

export interface GetMyUserByIdRequest {
    id: number  
}

export const getMyUserByIdValidation = Joi.object<GetMyUserByIdRequest>({
    id: Joi.number().required()
})

/**
 * @swagger
 * definitions:
 *   UpdateMyUserRequest:
 *     type: object
 *     properties:
 *       roleId:
 *          type: number
 *          example: 123
 */

export interface UpdateMyUserRequest {
    id: number,
    roleId?: number
}

export const updateMyUserValidation = Joi.object<UpdateMyUserRequest>({
    id: Joi.number().required(),
    roleId: Joi.number().optional()
})

export interface UpdateMyInfoUserRequest {
    email?: string,
    firstName?: string,
    lastName?: string,
    address?: string
}

export const updateMyInfoUserValidation = Joi.object<UpdateMyInfoUserRequest>({
    email: Joi.string().optional(),
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    address: Joi.string().optional(),
})