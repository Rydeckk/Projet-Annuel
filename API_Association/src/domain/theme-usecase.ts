import { DataSource } from "typeorm";
import { Theme } from "../database/entities/theme";
import { Association } from "../database/entities/association";

export interface UpdateThemeParams {
    firstColor?: string,
    colorText?: string,
    backgroundColor?: string
}

export class ThemeUseCase {
    constructor(private readonly db: DataSource) { }

    async updateTheme(id: number, updateTheme: UpdateThemeParams): Promise <Theme | null> {
        const repoTheme = this.db.getRepository(Theme)
        const themeFound = await repoTheme.findOne({where: {id: id}})
        if(themeFound === null) return null

        if(updateTheme.firstColor!== undefined) {
            themeFound.firstColor = updateTheme.firstColor
        }

        if(updateTheme.colorText !== undefined) {
            themeFound.colorText = updateTheme.colorText
        }

        if(updateTheme.backgroundColor !== undefined) {
            themeFound.backgroundColor = updateTheme.backgroundColor
        }

        const updatedAsso = await repoTheme.save(themeFound)
        return updatedAsso
    }
}