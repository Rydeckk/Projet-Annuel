import express, { Response } from "express"
import { Request } from "../types/express"
import { authMiddlewareSuperAdmin } from "./middleware/auth-middleware"
import { getUserByIdValidation, getUsersValidation, updateUserValidation } from "./validators/user-validator"
import { generateValidationErrorMessage } from "./validators/generate-validation-messages"
import { hash } from "bcrypt"
import { AppDataSource } from "../database/database"
import { UserUseCase } from "../domain/user-usecase"
import { Role } from "../database/entities/role"
import { AssociationUseCase } from "../domain/associationn-usecase"
import { RoleUseCase } from "../domain/role-usecase"
import { createRoleValidation, getRoleByIdValidation, getRolesValidation, updateRoleValidation } from "./validators/role-validator"
import { Association } from "../database/entities/association"
import { GED } from "../database/entities/ged"
import { Theme } from "../database/entities/theme"
import { createAssociationValidation, updateAssociationValidation } from "./validators/association-validator"

export const initRoutesSA = (app: express.Application) => {

    //#region Routes Association

    /**
     * @swagger
     * /association:
     *   post:
     *     summary: Créer un nouvel environnement pour une association.
     *     description: Créer un nouvel environnement pour une association en utilisant les données fournies dans le corps de la requête.
     *     tags:
     *       - Association SuperAdmin
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/CreateAssociationRequest'
     *     responses:
     *       '201':
     *         description: Association créée avec succès.
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '403':
     *         description: Non autorisé. L'utilisateur doit être un super administrateur.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.post("/association", authMiddlewareSuperAdmin,async (req: Request, res: Response) => {
        const validation = createAssociationValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createAssociationRequest = validation.value
        const associationRepo = AppDataSource.getRepository(Association)

        const createdGED = await AppDataSource.getRepository(GED).save({})
        const createdTheme = await AppDataSource.getRepository(Theme).save({name: createAssociationRequest.name + "_theme"})
        try {

            const associationCreated = await associationRepo.save(
                {...createAssociationRequest,
                ged: createdGED,
                theme: createdTheme}
                
            )
            res.status(201).send(associationCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    /**
     * @swagger
     * /association/{id}:
     *   patch:
     *     summary: Modifier l'environnement de l'association.
     *     description: Modifier l'environnement de l'association en utilisant les données fournies dans le corps de la requête.
     *     tags:
     *       - Association SuperAdmin
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/UpdateAssociationRequest'
     *     responses:
     *       '201':
     *         description: Association modifiée avec succès.
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '403':
     *         description: Non autorisé. L'utilisateur doit être un super administrateur.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.patch("/association/:id", authMiddlewareSuperAdmin,async (req: Request, res: Response) => {
        const validation = updateAssociationValidation.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateAssociationRequest = validation.value

        try {
            const assoUseCase = new AssociationUseCase(AppDataSource)
            const updatedAsso = await assoUseCase.updateAssociation(updateAssociationRequest.id,{...updateAssociationRequest})
            res.status(201).send(updatedAsso)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })


    //#endregion

    //#region Routes User
    /**
     * @swagger
     * /user:
     *   get:
     *     summary: Récupérer la liste des utilisateurs.
     *     description: Récupère une liste d'utilisateurs en fonction des paramètres de requête fournis.
     *     tags:
     *       - Utilisateur
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: limit
     *         description: Limite le nombre d'utilisateurs retournés par page.
     *         required: false
     *         schema:
     *           type: integer
     *         example: 20
     *       - in: query
     *         name: page
     *         description: Indique la page de résultats à récupérer.
     *         required: false
     *         schema:
     *           type: integer
     *         example: 1
     *       - in: query
     *         name: isAdmin
     *         description: Indique si l'utilisateur est un administrateur.
     *         required: false
     *         schema:
     *           type: boolean
     *         example: true
     *     responses:
     *       '200':
     *         description: Succès - Retourne la liste des utilisateurs demandée.
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '401':
     *         description: Non autorisé. L'utilisateur doit être un administrateur.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.get("/user",authMiddlewareSuperAdmin, async (req: Request, res: Response) => {
        const validation = getUsersValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listUsersRequest = validation.value
        let limit = 20
        if (listUsersRequest.limit) {
            limit = listUsersRequest.limit
        }
        const page = listUsersRequest.page ?? 1

        try {
            const userUseCase = new UserUseCase(AppDataSource)
            const selectedUser = await userUseCase.getListUser({ ...listUsersRequest, page, limit })
            res.status(200).send(selectedUser)
        }catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    /**
    * @swagger
    * /user/{id}:
    *   get:
    *     summary: Récupérer un utilisateur par son ID.
    *     description: Récupère un utilisateur existant en fonction de l'ID spécifié.
    *     tags:
    *       - Utilisateur
    *     security:
    *       - bearerAuth: []
    *     parameters:
    *       - in: path
    *         name: id
    *         description: L'ID de l'utilisateur à récupérer.
    *         required: true
    *         schema:
    *           type: integer
    *           example: 123
    *     responses:
    *       '200':
    *         description: Succès - Retourne les détails de l'utilisateur demandé.
    *       '400':
    *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
    *       '401':
    *         description: Non autorisé. L'utilisateur doit être un administrateur.
    *       '404':
    *         description: L'utilisateur spécifié n'a pas été trouvé.
    *       '500':
    *         description: Erreur interne du serveur.
    */
    app.get("/user/:id",authMiddlewareSuperAdmin ,async (req: Request, res: Response) => {
        const validation = getUserByIdValidation.validate({...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getUserRequest = validation.value

        try {
            const userUseCase = new UserUseCase(AppDataSource)
            const selectedUser = await userUseCase.getUser(getUserRequest.id)
            if (selectedUser === null) {
                res.status(404).send({"error": `User ${getUserRequest.id} not found`})
                return
            }
            res.status(200).send(selectedUser)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    /**
    * @swagger
    * /user/{id}:
    *   patch:
    *     summary: Modifier un utilisateur par son ID.
    *     description: Modifier un utilisateur existant en fonction de l'ID spécifié.
    *     tags:
    *       - Utilisateur
    *     security:
    *       - bearerAuth: []
    *     parameters:
    *       - in: path
    *         name: id
    *         description: L'ID de l'utilisateur à récupérer.
    *         required: true
    *         schema:
    *           type: integer
    *           example: 123
    *     requestBody:
    *       content:
    *         application/json:
    *           schema:
    *             $ref: '#/definitions/UpdateUserRequest'
    *     responses:
    *       '200':
    *         description: Succès - Retourne les détails de l'utilisateur demandé.
    *       '400':
    *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
    *       '401':
    *         description: Non autorisé. L'utilisateur doit être un administrateur.
    *       '404':
    *         description: L'utilisateur spécifié n'a pas été trouvé.
    *       '500':
    *         description: Erreur interne du serveur.
    */

    app.patch("/user/:id", authMiddlewareSuperAdmin, async (req: Request, res: Response) => {
        const validation = updateUserValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateUserRequest = validation.value
        let password = updateUserRequest.password
        if(updateUserRequest.password) {
            password = await hash(updateUserRequest.password, 10);
        }

        try {
            const userUseCase = new UserUseCase(AppDataSource)
            const selectedUser = await userUseCase.updateUser(updateUserRequest.id,{
                ...updateUserRequest,
                password: password
            })
            if (selectedUser === null) {
                res.status(404).send({"error": `User ${updateUserRequest.id} not found`})
                return
            }
            res.status(200).send(selectedUser)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })
    //#endregion

    //#region Role SuperAdmin
    /**
     * @swagger
     * /role:
     *   post:
     *     summary: Créer un nouveau rôle.
     *     description: Crée un nouveau rôle en utilisant les données fournies dans le corps de la requête.
     *     tags:
     *       - Rôle SuperAdmin
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/CreateRoleRequest'
     *     responses:
     *       '201':
     *         description: Rôle créé avec succès.
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '401':
     *         description: Non autorisé. L'utilisateur doit être un super administrateur.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.post('/role', authMiddlewareSuperAdmin ,async (req: Request, res: Response) => {
        const validation = createRoleValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        

        const createRoleRequest = validation.value

        const assoUseCase = new AssociationUseCase(AppDataSource)
        const assoFound = await assoUseCase.getAssociation(createRoleRequest.associationId)

        if(!assoFound) {
            res.status(404).send({ error: "Association not found" })
            return
        }

        const roleRepo = AppDataSource.getRepository(Role)
        try {

            const roleCreated = await roleRepo.save(
                {...createRoleRequest,
                    association: assoFound
                }
            )
            res.status(201).send(roleCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    /**
     * @swagger
     * /role/{id}:
     *   get:
     *     summary: Récupérer un rôle par son ID.
     *     description: Récupère un rôle existant en fonction de l'ID spécifié.
     *     tags:
     *       - Rôle SuperAdmin
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: L'ID du rôle à récupérer.
     *         required: true
     *         schema:
     *           type: integer
     *           example: 123
     *     responses:
     *       '200':
     *         description: Succès - Retourne les détails du rôle demandé.
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '401':
     *         description: Non autorisé. L'utilisateur doit être un super administrateur.
     *       '404':
     *         description: Le rôle spécifié n'a pas été trouvé.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.get("/role/:id", authMiddlewareSuperAdmin, async (req: Request, res: Response) => {
        const validation = getRoleByIdValidation.validate({...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getRoleRequest = validation.value

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const selectedRole = await roleUseCase.getRole(getRoleRequest.id)
            if (selectedRole === null) {
                res.status(404).send({"error": `Role ${getRoleRequest.id} not found`})
                return
            }
            res.status(200).send(selectedRole)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })

    /**
     * @swagger
     * /role:
     *   get:
     *     summary: Récupérer la liste des rôles.
     *     description: Récupère une liste de rôles en fonction des paramètres de requête fournis.
     *     tags:
     *       - Rôle SuperAdmin
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: limit
     *         description: Limite le nombre de rôles retournés par page.
     *         required: false
     *         schema:
     *           type: integer
     *         example: 20
     *       - in: query
     *         name: page
     *         description: Indique la page de résultats à récupérer.
     *         required: false
     *         schema:
     *           type: integer
     *         example: 1
     *       - in: query
     *         name: isMember
     *         description: Filtre sur les rôles membre ou non
     *         required: false
     *         schema:
     *           type: boolean
     *         example: false
     *       - in: query
     *         name: isAdmin
     *         description: Filtre sur les rôles admin ou non
     *         required: false
     *         schema:
     *           type: boolean
     *         example: false
     *       - in: query
     *         name: isSuperAdmin
     *         description: Filtre sur les rôles superAdmin ou non
     *         required: false
     *         schema:
     *           type: boolean
     *         example: false
     *       - in: query
     *         name: associationId
     *         description: Filtre sur une association
     *         required: false
     *         schema:
     *           type: number
     *         example: 123
     *     responses:
     *       '200':
     *         description: Succès - Retourne la liste des rôles demandée.
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '401':
     *         description: Non autorisé. L'utilisateur doit être un super administrateur.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.get("/role", authMiddlewareSuperAdmin ,async (req: Request, res: Response) => {
        const validation = getRolesValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const listRolesRequest = validation.value
        let limit = 20
        if (listRolesRequest.limit) {
            limit = listRolesRequest.limit
        }
        const page = listRolesRequest.page ?? 1

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const selectedRole = await roleUseCase.getListRole({ ...listRolesRequest, page, limit })
            res.status(200).send(selectedRole)
        }catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    /**
     * @swagger
     * /role/{id}:
     *   patch:
     *     summary: Mettre à jour un rôle existant.
     *     description: Met à jour un rôle existant en fonction de l'ID spécifié et des données fournies dans le corps de la requête.
     *     tags:
     *       - Rôle SuperAdmin
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: L'ID du rôle à mettre à jour.
     *         required: true
     *         schema:
     *           type: integer
     *           example: 123
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/UpdateRoleRequest'
     *     responses:
     *       '200':
     *         description: Rôle mis à jour avec succès.
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '401':
     *         description: Non autorisé. L'utilisateur doit être un super administrateur.
     *       '404':
     *         description: Le rôle spécifié n'a pas été trouvé.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.patch("/role/:id", authMiddlewareSuperAdmin ,async (req: Request, res: Response) => {

        const validation = updateRoleValidation.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateRoleRequest = validation.value

        try {
            const roleUsecase = new RoleUseCase(AppDataSource);
            const updatedRole = await roleUsecase.updateRole(updateRoleRequest.id, { ...updateRoleRequest })
            if (updatedRole === null) {
                res.status(404).send({"error": `Role ${updateRoleRequest.id} not found`})
                return
            }
            res.status(200).send(updatedRole)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    /**
     * @swagger
     * /role/{id}:
     *   delete:
     *     summary: Supprimer un rôle existant.
     *     description: Supprime un rôle existant en fonction de l'ID spécifié.
     *     tags:
     *       - Rôle SuperAdmin
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         description: L'ID du rôle à supprimer.
     *         required: true
     *         schema:
     *           type: integer
     *           example: 123
     *     responses:
     *       '200':
     *         description: Rôle supprimé avec succès.
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: "Rôle supprimé : Nom du rôle"
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '401':
     *         description: Non autorisé. L'utilisateur doit être un super administrateur.
     *       '404':
     *         description: Le rôle spécifié n'a pas été trouvé.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.delete("/role/:id", authMiddlewareSuperAdmin ,async (req: Request, res: Response) => {
        const validation = getRoleByIdValidation.validate({...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getRoleRequest = validation.value

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const deletedRole = await roleUseCase.deleteRole(getRoleRequest.id)
            if (deletedRole === null) {
                res.status(404).send({"error": `Role ${getRoleRequest.id} not found`})
                return
            }
            res.status(200).send(`Role deleted : ${deletedRole.name}`)
        }catch(error) {
            console.log(error)
            res.status(500).send({error: "Internal error"})
        }
    })
    //#endregion

    //#region Route Ping
    app.get("/ping", async (req: Request, res: Response) => {
        try {
            res.status(200).send("Connexion OK")
        } catch (error) {
            res.status(500).send("Internal Error")
        }
    })
    //#endregion
}