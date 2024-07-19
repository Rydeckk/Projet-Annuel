import Joi, { string } from "joi"

export interface UpdateThemeRequest {
    firstColor?: string,
    colorText?: string,
    backgroundColor?: string
}

export const updateThemeValidation = Joi.object<UpdateThemeRequest> ({
    firstColor: Joi.string().optional(),
    colorText: Joi.string().optional(),
    backgroundColor: Joi.string().optional()
})