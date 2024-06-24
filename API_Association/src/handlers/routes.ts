import express, { Response } from "express";
import { generateValidationErrorMessage } from "./validators/generate-validation-messages";
import { AppDataSource } from "../database/database";
import { authMiddleware, authMiddlewareAdmin, authMiddlewareMember, authMiddlewareSuperAdmin } from "./middleware/auth-middleware";
import { createMyRoleValidation, createRoleValidation, getMyRoleByIdValidation, getMyRolesValidation, getRoleByIdValidation, getRolesValidation, updateMyRoleValidation, updateRoleValidation } from "./validators/role-validator";
import { Role } from "../database/entities/role";
import { RoleUseCase } from "../domain/role-usecase";
import { getUserByIdValidation, getUsersValidation, updateUserValidation } from "./validators/user-validator";
import { getConnectedUser, UserUseCase } from "../domain/user-usecase";
import { getTransactionsValidation } from "./validators/transactions-validator";
import { TransactionUseCase } from "../domain/transaction-usecase";
import { UserHandler } from "./user";
import { Request } from "../types/express"
import { updateMyAssociationValidation } from "./validators/association-validator";
import { AssociationUseCase } from "../domain/associationn-usecase";
import { initRoutesSA } from "./routesSA"
import { createLocalValidation, getListLocalValidation, getLocalValidation, updateLocalValidation } from "./validators/local-validator";
import { LocalUseCase } from "../domain/local-usecase";
import { Local } from "../database/entities/local";
import { createMaterielValidation, getListMaterielValidation, getMaterielValidation, updateMaterielValidation } from "./validators/materiel-validator";
import { Materiel } from "../database/entities/materiel";
import { MaterielUseCase } from "../domain/materiel-usecase";
import { createEvenementValidation, getEvenementsValidation, getEvenementValidation, updateEvenementValidation } from "./validators/evenement-validator";
import { Evenement } from "../database/entities/evenement";
import { EvenementUseCase } from "../domain/evenement-usecase";
import { createVoteValidation, getVotesValidation, getVoteValidation, updateVoteValidation } from "./validators/vote-validator";
import { Vote } from "../database/entities/vote";
import { VoteUseCase } from "../domain/vote-usecase";
import { createReponseValidation, getReponseSondageValidation, getReponsesValidation, getReponseValidation, updateReponseValidation } from "./validators/reponse-validator";
import { Reponse } from "../database/entities/reponse";
import { ReponseUseCase } from "../domain/reponse-usecase";
import { createTypeAdhesionValidation, getListTypeAdhesionValidation, getTypeAdhesionValidation, updateTypeAdhesionValidation } from "./validators/typeAdhesion-validator";
import { TypeAdhesionUseCase } from "../domain/typeAdhesion-usecase";
import { TypeAdhesion } from "../database/entities/typeAdhesion";
import { createDocumentValidation, getDocumentValidation, getListDocumentValidation, updateDocumentValidation } from "./validators/document-validator";
import { DocumentGED } from "../database/entities/document";
import { DocumentGEDUseCase } from "../domain/document-usecase";
import { Adhesion } from "../database/entities/adhesion";
import { getAdhesionValidation, getListAdhesionValidation, updateAdhesionValidation } from "./validators/adhesion-validator";
import { AdhesionUseCase } from "../domain/adhesion-usecase";
import { CompteTransaction } from "../database/entities/transaction";
import { createDonValidation } from "./validators/don-validator";
import { createDossierValidation, getDossierValidation, getListDossierValidation, updateDossierValidation } from "./validators/dossier-validator"
import { DossierUseCase } from "../domain/dossier-usecase";
import { Dossier } from "../database/entities/dossier";
import { createPlanningValidation, getPlanningsValidation, getPlanningValidation, updatePlanningValidation } from "./validators/planning-validator";
import { Planning } from "../database/entities/planning";
import { PlanningUseCase } from "../domain/planning-usecase";
import { User } from "../database/entities/user";
import { Sondage } from "../database/entities/sondage";
import { SondageUseCase } from "../domain/sondage-usecase";
import { createSondageValidation, getSondageValidation, getSondagesValidation, updateSondageValidation } from "./validators/sondage-validator";

export const initRoutes = (app: express.Express) => {

    //#region Routes Association
    /**
     * @swagger
     * /association/mine:
     *   patch:
     *     summary: Modifier l'environnement de l'association de l'utilisateur.
     *     description:  Modifier l'environnement de l'association de l'utilisateur en utilisant les données fournies dans le corps de la requête.
     *     tags:
     *       - Association Admin
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/definitions/UpdateMyAssociationRequest'
     *     responses:
     *       '201':
     *         description: Association modifiée avec succès.
     *       '400':
     *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
     *       '403':
     *         description: Non autorisé. L'utilisateur doit être un administrateur.
     *       '500':
     *         description: Erreur interne du serveur.
     */
    app.patch("/association/mine", authMiddlewareAdmin,async (req: Request, res: Response) => {
        const validation = updateMyAssociationValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateAssociationRequest = validation.value

        const userId: number = req.user.userId

        const userUseCase = new UserUseCase(AppDataSource)
        const userFound = await userUseCase.getUser(userId)
        if(!userFound) {
            res.status(404).send({error: "User not found"})
            return
        }

        try {
            const assoUseCase = new AssociationUseCase(AppDataSource)
            const updatedAsso = await assoUseCase.updateAssociation(userFound.association.id,{...updateAssociationRequest})
            res.status(201).send(updatedAsso)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Role Admin
   /**
 * @swagger
 * /association/mine/role:
 *   post:
 *     summary: Créer un nouveau rôle sur l'association de l'utilisateur.
 *     description: Crée un nouveau rôle en utilisant les données fournies dans le corps de la requête.
 *     tags:
 *       - Rôle Admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/CreateMyRoleRequest'
 *     responses:
 *       '201':
 *         description: Rôle créé avec succès.
 *       '400':
 *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
 *       '401':
 *         description: Non autorisé. L'utilisateur doit être un administrateur.
 *       '500':
 *         description: Erreur interne du serveur.
 */
    app.post('/association/mine/role', authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = createMyRoleValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createRoleRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId,AppDataSource)

        const roleRepo = AppDataSource.getRepository(Role)
        try {

            const roleCreated = await roleRepo.save(
                {...createRoleRequest, association: userFound?.association}
            )
            res.status(201).send(roleCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

/**
* @swagger
* /association/mine/role/{id}:
*   get:
*     summary: Récupérer un rôle par son ID sur l'association de l'utilisateur.
*     description: Récupère un rôle existant en fonction de l'ID spécifié.
*     tags:
*       - Rôle Admin
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
*         description: Non autorisé. L'utilisateur doit être un administrateur.
*       '404':
*         description: Le rôle spécifié n'a pas été trouvé.
*       '500':
*         description: Erreur interne du serveur.
*/
    app.get("/association/mine/role/:id", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = getMyRoleByIdValidation.validate({...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getRoleRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId,AppDataSource)

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const selectedRole = await roleUseCase.getRole(getRoleRequest.id, userFound?.association, false)
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
* /association/mine/role:
*   get:
*     summary: Récupérer la liste des rôles sur l'association de l'utilisateur.
*     description: Récupère une liste de rôles en fonction des paramètres de requête fournis.
*     tags:
*       - Rôle Admin
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
*         name: isAdmin
*         description: Filtre sur les rôles admin ou non
*         required: false
*         schema:
*           type: boolean
*         example: false
*     responses:
*       '200':
*         description: Succès - Retourne la liste des rôles demandée.
*       '400':
*         description: Requête invalide, voir le corps de la réponse pour plus de détails.
*       '401':
*         description: Non autorisé. L'utilisateur doit être un administrateur.
*       '500':
*         description: Erreur interne du serveur.
*/
    app.get("/association/mine/role", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getMyRolesValidation.validate(req.query)

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

        const userFound = await getConnectedUser(req.user.userId,AppDataSource)

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const selectedRole = await roleUseCase.getListRole({ ...listRolesRequest, page, limit, isSuperAdmin: false, associationId: userFound?.association.id})
            res.status(200).send(selectedRole)
        }catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

/**
* @swagger
* /association/mine/role/{id}:
*   patch:
*     summary: Mettre à jour un rôle existant sur l'association de l'utilisateur.
*     description: Met à jour un rôle existant en fonction de l'ID spécifié et des données fournies dans le corps de la requête.
*     tags:
*       - Rôle Admin
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
*             $ref: '#/definitions/UpdateMyRoleRequest'
*     responses:
*       '200':
*         description: Rôle mis à jour avec succès.
*       '400':
*         description: Requête invalide, voir le corps de la réponse pour plus de détails.
*       '401':
*         description: Non autorisé. L'utilisateur doit être un administrateur.
*       '404':
*         description: Le rôle spécifié n'a pas été trouvé.
*       '500':
*         description: Erreur interne du serveur.
*/
    app.patch("/association/mine/role/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {

        const validation = updateMyRoleValidation.validate({...req.params, ...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateRoleRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId,AppDataSource)

        try {
            const roleUsecase = new RoleUseCase(AppDataSource);
            const updatedRole = await roleUsecase.updateRole(updateRoleRequest.id, { ...updateRoleRequest }, userFound?.association, false)
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
* /association/mine/role/{id}:
*   delete:
*     summary: Supprimer un rôle existant sur l'association de l'utilisateur.
*     description: Supprime un rôle existant en fonction de l'ID spécifié.
*     tags:
*       - Rôle Admin
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
*         description: Non autorisé. L'utilisateur doit être un administrateur.
*       '404':
*         description: Le rôle spécifié n'a pas été trouvé.
*       '500':
*         description: Erreur interne du serveur.
*/
    app.delete("/association/mine/role/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getMyRoleByIdValidation.validate({...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getRoleRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId,AppDataSource)

        try {
            const roleUseCase = new RoleUseCase(AppDataSource)
            const deletedRole = await roleUseCase.deleteRole(getRoleRequest.id, userFound?.association, false)
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

    //#region Routes User
    /**
     * @swagger
     * /association/mine/user:
     *   get:
     *     summary: Récupérer la liste des utilisateurs.
     *     description: Récupère une liste d'utilisateurs en fonction des paramètres de requête fournis.
     *     tags:
     *       - Utilisateur Admin
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
     *         name: isMember
     *         description: Indique si l'utilisateur est un membre.
     *         required: false
     *         schema:
     *           type: boolean
     *         example: true
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
    app.get("/association/mine/user",authMiddlewareAdmin, async (req: Request, res: Response) => {
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

        const userFound = await getConnectedUser(req.user.userId,AppDataSource)

        try {
            const userUseCase = new UserUseCase(AppDataSource)
            const selectedUser = await userUseCase.getListUser({ ...listUsersRequest, page, limit, isSuperAdmin: false, associationId: userFound?.association.id })
            res.status(200).send(selectedUser)
        }catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    /**
 * @swagger
 * /association/mine/user/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par son ID.
 *     description: Récupère un utilisateur existant en fonction de l'ID spécifié.
 *     tags:
 *       - Utilisateur Admin
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
    app.get("/association/mine/user/:id",authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getUserByIdValidation.validate({...req.params})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getUserRequest = validation.value
        const userFound = await getConnectedUser(req.user.userId,AppDataSource)

        try {
            const userUseCase = new UserUseCase(AppDataSource)
            const selectedUser = await userUseCase.getUser(getUserRequest.id,userFound?.association,false)
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
 * /association/mine/user/{id}:
 *   patch:
 *     summary: Modifier un utilisateur par son ID.
 *     description: Modifier un utilisateur existant en fonction de l'ID spécifié.
 *     tags:
 *       - Utilisateur Admin
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
 *             $ref: '#/definitions/UpdateMyUserRequest'
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

    app.patch("/association/mine/user/:id", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = updateUserValidation.validate({...req.params, ...req.body})

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateUserRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId,AppDataSource)

        try {
            const userUseCase = new UserUseCase(AppDataSource)
            const selectedUser = await userUseCase.updateUser(updateUserRequest.id,{...updateUserRequest},userFound?.association,false)
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

        /**
 * @swagger
 * /association/mine/user/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur par son ID.
 *     description: Supprimer un utilisateur existant en fonction de l'ID spécifié.
 *     tags:
 *       - Utilisateur Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: L'ID de l'utilisateur à supprimer.
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

        app.delete("/association/mine/user/:id", authMiddlewareAdmin, async (req: Request, res: Response) => {
            const validation = getUserByIdValidation.validate(req.params)
    
            if(validation.error) {
                res.status(400).send(generateValidationErrorMessage(validation.error.details))
                return
            }
    
            const deleteUserRequest = validation.value
    
            const userFound = await getConnectedUser(req.user.userId,AppDataSource)
    
            try {
                const userUseCase = new UserUseCase(AppDataSource)
                const deletedUser = await userUseCase.deleteUser(deleteUserRequest.id,userFound?.association,false)
                if (deletedUser === null) {
                    res.status(404).send({"error": `User ${deleteUserRequest.id} not found`})
                    return
                }
                res.status(200).send(`User deleted : ${deletedUser.id}`)
            }catch(error) {
                console.log(error)
                res.status(500).send({error: "Internal error"})
            }
        })
    //#endregion

    //#region Routes Local
    app.post("/association/mine/local", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = createLocalValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createLocalRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdLocal = await AppDataSource.getRepository(Local).save({...createLocalRequest,association: userFound?.association})

            res.status(200).send(createdLocal)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/local/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getLocalValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const localRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const localUseCase = new LocalUseCase(AppDataSource)
            const localFound = await localUseCase.getLocal(localRequest.id,userFound?.association)
            if (localFound === null) {
                res.status(404).send({"error": `Local ${localRequest.id} not found`})
                return
            }
            res.status(200).send(localFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/local", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getListLocalValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListlocalRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getListlocalRequest.limit) {
            limit = getListlocalRequest.limit
        }
        const page = getListlocalRequest.page ?? 1

        try {
            const localUseCase = new LocalUseCase(AppDataSource)
            const localFound = await localUseCase.getListLocal({...getListlocalRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(localFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/association/mine/local/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updateLocalValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updatelocalRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const localUseCase = new LocalUseCase(AppDataSource)
            const localFound = await localUseCase.updateLocal(updatelocalRequest.id,{...updatelocalRequest},userFound?.association)
            if (localFound === null) {
                res.status(404).send({"error": `Local ${updatelocalRequest.id} not found`})
                return
            }
            res.status(200).send(localFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/local/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getLocalValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deletelocalRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const localUseCase = new LocalUseCase(AppDataSource)
            const localFound = await localUseCase.deleteLocal(deletelocalRequest.id,userFound?.association)
            if (localFound === null) {
                res.status(404).send({"error": `Local ${deletelocalRequest.id} not found`})
                return
            }
            res.status(200).send(localFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Routes Materiel
    app.post("/association/mine/materiel", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = createMaterielValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createMaterielRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdMateriel = await AppDataSource.getRepository(Materiel).save({...createMaterielRequest,association: userFound?.association})

            res.status(200).send(createdMateriel)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/materiel/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getMaterielValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const materielRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const materielUseCase = new MaterielUseCase(AppDataSource)
            const materielFound = await materielUseCase.getMateriel(materielRequest.id,userFound?.association)
            if (materielFound === null) {
                res.status(404).send({"error": `Materiel ${materielRequest.id} not found`})
                return
            }
            res.status(200).send(materielFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/materiel", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getListMaterielValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListMaterielRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getListMaterielRequest.limit) {
            limit = getListMaterielRequest.limit
        }
        const page = getListMaterielRequest.page ?? 1

        try {
            const materielUseCase = new MaterielUseCase(AppDataSource)
            const materielFound = await materielUseCase.getListMateriel({...getListMaterielRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(materielFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/association/mine/materiel/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updateMaterielValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateMaterielRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const materielUseCase = new MaterielUseCase(AppDataSource)
            const materielFound = await materielUseCase.updateMateriel(updateMaterielRequest.id,{...updateMaterielRequest},userFound?.association)
            if (materielFound === null) {
                res.status(404).send({"error": `Materiel ${updateMaterielRequest.id} not found`})
                return
            }
            res.status(200).send(materielFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/materiel/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getMaterielValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteMaterielRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const materielUseCase = new MaterielUseCase(AppDataSource)
            const materielFound = await materielUseCase.deleteMateriel(deleteMaterielRequest.id,userFound?.association)
            if (materielFound === null) {
                res.status(404).send({"error": `Materiel ${deleteMaterielRequest.id} not found`})
                return
            }
            res.status(200).send(materielFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion
    
    //#region Routes Evenements
    app.post("/association/mine/event/:id/participate", authMiddleware, async (req: Request, res: Response) => {
        const validation = getEvenementValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const eventRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)
        if(!userFound) {
            res.status(404).send({error: `User ${req.user.userId} not found`})
            return
        }

        try {
            const eventUseCase = new EvenementUseCase(AppDataSource)
            const eventFound = await eventUseCase.getEvenement(eventRequest.id,userFound?.association)
            if (eventFound === null) {
                res.status(404).send({"error": `Event ${eventRequest.id} not found`})
                return
            }
            eventFound.attendees.push(userFound)
            await AppDataSource.getRepository(Evenement).save(eventFound)

            res.status(200).send(eventFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.post("/association/mine/event", authMiddlewareAdmin , async (req: Request, res: Response) => {
        const validation = createEvenementValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createEvenementRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdEvent = await AppDataSource.getRepository(Evenement).save({...createEvenementRequest,association: userFound?.association})

            res.status(200).send(createdEvent)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/event/:id", authMiddleware, async (req:Request, res:Response) => {
        const validation = getEvenementValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const eventRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const eventUseCase = new EvenementUseCase(AppDataSource)
            const eventFound = await eventUseCase.getEvenement(eventRequest.id,userFound?.association)
            if (eventFound === null) {
                res.status(404).send({"error": `Event ${eventRequest.id} not found`})
                return
            }
            res.status(200).send(eventFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/event", authMiddleware, async (req: Request, res: Response) => {
        const validation = getEvenementsValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getEvenementsRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getEvenementsRequest.limit) {
            limit = getEvenementsRequest.limit
        }
        const page = getEvenementsRequest.page ?? 1

        try {
            const evenementUseCase = new EvenementUseCase(AppDataSource)
            const eventFound = await evenementUseCase.getListEvent({...getEvenementsRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(eventFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    })

    app.patch("/association/mine/event/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updateEvenementValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateEventRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const eventUseCase = new EvenementUseCase(AppDataSource)
            const eventFound = await eventUseCase.updateEvenement(updateEventRequest.id,{...updateEventRequest},userFound?.association)
            if (eventFound === null) {
                res.status(404).send({"error": `Event ${updateEventRequest.id} not found`})
                return
            }
            res.status(200).send(eventFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/event/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getEvenementValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteEventRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const eventUseCase = new EvenementUseCase(AppDataSource)
            const eventFound = await eventUseCase.deleteEvenement(deleteEventRequest.id,userFound?.association)
            if (eventFound === null) {
                res.status(404).send({"error": `Event ${deleteEventRequest.id} not found`})
                return
            }
            res.status(200).send(eventFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Routes Votes
    app.post("/association/mine/vote", authMiddlewareAdmin , async (req: Request, res: Response) => {
        const validation = createVoteValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createVoteRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdVote = await AppDataSource.getRepository(Vote).save({...createVoteRequest,association: userFound?.association})

            if(createVoteRequest.voteIdParent !== undefined) {
                const voteParentFound = await AppDataSource.getRepository(Vote).findOneBy({id: createVoteRequest.voteIdParent, association: userFound?.association})
                if(!voteParentFound) {
                    res.status(404).send({error : `Vote ${createVoteRequest.voteIdParent} not found`})
                    return
                }
    
                const createdVoteFinal = await AppDataSource.getRepository(Vote).save({...createdVote,parentVote: voteParentFound})

                res.status(200).send(createdVoteFinal)
            }

            if(createVoteRequest.voteIdParent === undefined) {
                res.status(200).send(createdVote)
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/vote/:id", authMiddleware, async (req:Request, res:Response) => {
        const validation = getVoteValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const voteRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const voteUseCase = new VoteUseCase(AppDataSource)
            const voteFound = await voteUseCase.getVote(voteRequest.id,userFound?.association)
            if (voteFound === null) {
                res.status(404).send({"error": `Vote ${voteRequest.id} not found`})
                return
            }
            res.status(200).send(voteFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/vote", authMiddleware, async (req: Request, res: Response) => {
        const validation = getVotesValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getVotesRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getVotesRequest.limit) {
            limit = getVotesRequest.limit
        }
        const page = getVotesRequest.page ?? 1

        try {
            const voteUseCase = new VoteUseCase(AppDataSource)
            const voteFound = await voteUseCase.getListVote({...getVotesRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(voteFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    })

    app.patch("/association/mine/vote/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updateVoteValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateVoteRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const voteUseCase = new VoteUseCase(AppDataSource)
            const voteFound = await voteUseCase.updateVote(updateVoteRequest.id,{...updateVoteRequest},userFound?.association)
            if (voteFound === null) {
                res.status(404).send({"error": `Vote ${updateVoteRequest.id} not found`})
                return
            }
            res.status(200).send(voteFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/vote/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getVoteValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteVoteRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const voteUseCase = new VoteUseCase(AppDataSource)
            const voteFound = await voteUseCase.deleteVote(deleteVoteRequest.id,userFound?.association)
            if (voteFound === null) {
                res.status(404).send({"error": `Vote ${deleteVoteRequest.id} not found`})
                return
            }
            res.status(200).send(voteFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Routes Sondages
    app.post("/association/mine/sondage", authMiddlewareAdmin , async (req: Request, res: Response) => {
        const validation = createSondageValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createSondageRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdSondage = await AppDataSource.getRepository(Sondage).save({...createSondageRequest,association: userFound?.association})

            res.status(200).send(createdSondage)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/sondage/:id", authMiddleware, async (req:Request, res:Response) => {
        const validation = getSondageValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const sondageRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const sondageUseCase = new SondageUseCase(AppDataSource)
            const sondageFound = await sondageUseCase.getSondage(sondageRequest.id,userFound?.association)
            if (sondageFound === null) {
                res.status(404).send({"error": `Sondage ${sondageRequest.id} not found`})
                return
            }
            res.status(200).send(sondageFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/sondage", authMiddleware, async (req: Request, res: Response) => {
        const validation = getSondagesValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getSondagesRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getSondagesRequest.limit) {
            limit = getSondagesRequest.limit
        }
        const page = getSondagesRequest.page ?? 1

        try {
            const sondageUseCase = new SondageUseCase(AppDataSource)
            const sondageFound = await sondageUseCase.getListSondage({...getSondagesRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(sondageFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    })

    app.patch("/association/mine/sondage/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updateSondageValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateSondageRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const sondageUseCase = new SondageUseCase(AppDataSource)
            const sondageFound = await sondageUseCase.updateSondage(updateSondageRequest.id,{...updateSondageRequest},userFound?.association)
            if (sondageFound === null) {
                res.status(404).send({"error": `Sondage ${updateSondageRequest.id} not found`})
                return
            }
            res.status(200).send(sondageFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/sondage/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getSondageValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteSondageRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const sondageUseCase = new SondageUseCase(AppDataSource)
            const sondageFound = await sondageUseCase.deleteSondage(deleteSondageRequest.id,userFound?.association)
            if (sondageFound === null) {
                res.status(404).send({"error": `Sondage ${deleteSondageRequest.id} not found`})
                return
            }
            res.status(200).send(sondageFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Routes Reponses
    app.post("/association/mine/sondage/:sondageId/response", authMiddlewareAdmin , async (req: Request, res: Response) => {
        const validation = createReponseValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createReponseRequest = validation.value
        const sondageId = +req.params.sondageId

        const userConnectedFound = await getConnectedUser(req.user.userId, AppDataSource)
        const sondageUseCase = new SondageUseCase(AppDataSource)
        const sondageFound = await sondageUseCase.getSondage(sondageId,userConnectedFound?.association)
        if(sondageFound === null) {
            res.status(404).send({error: `Sondage ${sondageId} not found`})
            return
        }
        
        try {
            const createdReponse = await AppDataSource.getRepository(Reponse).save({...createReponseRequest,sondage: sondageFound})
            
            if(createReponseRequest.applicantId) {
                const userUseCase = new UserUseCase(AppDataSource)
                const userFound = await userUseCase.getUser(createReponseRequest.applicantId,userConnectedFound?.association,false)
                if(userFound === null) {
                    res.status(404).send({error: `User ${createReponseRequest.applicantId} not found`})
                    return
                }

                createdReponse.applicants.push(userFound)
                await AppDataSource.getRepository(Reponse).save(createdReponse) 
            }
            
            res.status(200).send(createdReponse)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.post("/association/mine/sondage/:sondageId/response/:id", authMiddleware , async (req: Request, res: Response) => {
        const validation = getReponseSondageValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const chooseReponseRequest = validation.value

        const userConnectedFound = await getConnectedUser(req.user.userId, AppDataSource)
        if(!userConnectedFound) {
            res.status(404).send({error: "User not found"})
            return
        }
        const sondageUseCase = new SondageUseCase(AppDataSource)
        const sondageFound = await sondageUseCase.getSondage(chooseReponseRequest.sondageId,userConnectedFound?.association)
        if(sondageFound === null) {
            res.status(404).send({error: `Sondage ${chooseReponseRequest.sondageId} not found`})
            return
        }
        
        try {

            const reponseUseCase = new ReponseUseCase(AppDataSource)
            const selectedReponse = await reponseUseCase.getReponseSondage(chooseReponseRequest.id,sondageFound,userConnectedFound.association)
            if(selectedReponse === null) {
                res.status(404).send({error: `Reponse ${chooseReponseRequest.id} not found`})
                return
            }
            selectedReponse.voters.push(userConnectedFound)
            selectedReponse.nbVote += 1
            await AppDataSource.getRepository(Reponse).save(selectedReponse)

            res.status(200).send(selectedReponse)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/sondage/:sondageId/response/:id", authMiddleware, async (req:Request, res:Response) => {
        const validation = getReponseSondageValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const reponseRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        const sondageUseCase = new SondageUseCase(AppDataSource)
        const sondageFound = await sondageUseCase.getSondage(reponseRequest.sondageId,userFound?.association)
        if(sondageFound === null) {
            res.status(404).send({error: `Sondage ${reponseRequest.sondageId} not found`})
            return
        }

        try {
            console.log(reponseRequest.id)
            const reponseUseCase = new ReponseUseCase(AppDataSource)
            const reponseFound = await reponseUseCase.getReponseSondage(reponseRequest.id,sondageFound,userFound?.association)
            if (reponseFound === null) {
                res.status(404).send({"error": `Reponse ${reponseRequest.id} not found`})
                return
            }
            res.status(200).send(reponseFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/sondage/:sondageId/response", authMiddleware, async (req: Request, res: Response) => {
        const validation = getReponsesValidation.validate({...req.params,...req.query})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getReponsesRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getReponsesRequest.limit) {
            limit = getReponsesRequest.limit
        }
        const page = getReponsesRequest.page ?? 1

        try {
            const reponseUseCase = new ReponseUseCase(AppDataSource)
            const reponseFound = await reponseUseCase.getListReponseSondage({...getReponsesRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(reponseFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    })

    app.patch("/association/mine/sondage/:sondageId/response/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updateReponseValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateReponseRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const reponseUseCase = new ReponseUseCase(AppDataSource)
            const reponseFound = await reponseUseCase.updateReponseSondage(updateReponseRequest.id,{...updateReponseRequest},userFound?.association)
            if (reponseFound === null) {
                res.status(404).send({"error": `Reponse ${updateReponseRequest.id} not found`})
                return
            }
            res.status(200).send(reponseFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/sondage/:sondageId/response/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getReponseValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteReponseRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const reponseUseCase = new ReponseUseCase(AppDataSource)
            const reponseFound = await reponseUseCase.deleteReponseSondage(deleteReponseRequest.id,deleteReponseRequest.sondageId, userFound?.association)
            if (reponseFound === null) {
                res.status(404).send({"error": `Reponse ${deleteReponseRequest.id} not found`})
                return
            }
            res.status(200).send(reponseFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    //#endregion

    //#region Routes TypeAdhesion
    app.post("/association/mine/typeAdhesion", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = createTypeAdhesionValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createTypeAdhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdTypeAdhesion = await AppDataSource.getRepository(TypeAdhesion).save({...createTypeAdhesionRequest,association: userFound?.association})

            res.status(200).send(createdTypeAdhesion)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/typeAdhesion/:id", authMiddleware ,async (req: Request, res: Response) => {
        const validation = getTypeAdhesionValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const typeAdhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const typeAdhesionUseCase = new TypeAdhesionUseCase(AppDataSource)
            const typeAdhesionFound = await typeAdhesionUseCase.getTypeAdhesion(typeAdhesionRequest.id,userFound?.association)
            if (typeAdhesionFound === null) {
                res.status(404).send({"error": `TypeAdhesion ${typeAdhesionRequest.id} not found`})
                return
            }
            res.status(200).send(typeAdhesionFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/typeAdhesion", authMiddleware ,async (req: Request, res: Response) => {
        const validation = getListTypeAdhesionValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListTypeAdhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getListTypeAdhesionRequest.limit) {
            limit = getListTypeAdhesionRequest.limit
        }
        const page = getListTypeAdhesionRequest.page ?? 1

        try {
            const typeAdhesionUseCase = new TypeAdhesionUseCase(AppDataSource)
            const typeAdhesionFound = await typeAdhesionUseCase.getListTypeAdhesion({...getListTypeAdhesionRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(typeAdhesionFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/association/mine/typeAdhesion/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updateTypeAdhesionValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateTypeAdhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const typeAdhesionUseCase = new TypeAdhesionUseCase(AppDataSource)
            const typeAdhesionFound = await typeAdhesionUseCase.updateTypeAdhesion(updateTypeAdhesionRequest.id,{...updateTypeAdhesionRequest},userFound?.association)
            if (typeAdhesionFound === null) {
                res.status(404).send({"error": `TypeAdhesion ${updateTypeAdhesionRequest.id} not found`})
                return
            }
            res.status(200).send(typeAdhesionFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/typeAdhesion/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getTypeAdhesionValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteTypeAdhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const typeAdhesionUseCase = new TypeAdhesionUseCase(AppDataSource)
            const typeAdhesionFound = await typeAdhesionUseCase.deleteTypeAdhesion(deleteTypeAdhesionRequest.id,userFound?.association)
            if (typeAdhesionFound === null) {
                res.status(404).send({"error": `TypeAdhesion ${deleteTypeAdhesionRequest.id} not found`})
                return
            }
            res.status(200).send(typeAdhesionFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Routes Adhesion
    app.post("/association/mine/typeAdhesion/:idTypeAdhesion/adhesion", authMiddleware, async (req: Request, res: Response) => {

        const typeAdhesionId = +req.params.idTypeAdhesion

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)
        if(!userFound) {
            res.status(404).send({error: `User ${req.user.userId} not found`})
            return
        }

        const typeAdhesionUseCase = new TypeAdhesionUseCase(AppDataSource)
        const typeAdhesionFound = await typeAdhesionUseCase.getTypeAdhesion(typeAdhesionId,userFound?.association)
        if(!typeAdhesionFound) {
            res.status(404).send({error: `TypeAdhesion ${typeAdhesionId} not found`})
            return
        }

        const beginDate = new Date()
        const endDate = new Date(beginDate)

        switch(typeAdhesionFound.type) {
            case "monthly":
                endDate.setMonth(beginDate.getMonth() + 1)
                break
            case "quartly":
                endDate.setMonth(beginDate.getMonth() + 3)
                break
            case "yearly": 
                endDate.setFullYear(beginDate.getFullYear() + 1)
                break
        }

        try {
            const createdAdhesion = await AppDataSource.getRepository(Adhesion).save({
                beginDate: beginDate,
                endDate: endDate,
                users: [userFound],
                typeAdhesion: typeAdhesionFound
            })

            await AppDataSource.getRepository(CompteTransaction).save({
                type: "adhesion",
                montant: typeAdhesionFound.montant,
                association: userFound.association,
                user: userFound
            })

            res.status(200).send(createdAdhesion)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/adhesion/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getAdhesionValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const adhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const adhesionUseCase = new AdhesionUseCase(AppDataSource)
            const adhesionFound = await adhesionUseCase.getAdhesion(adhesionRequest.id,userFound?.association)
            if (adhesionFound === null) {
                res.status(404).send({"error": `Adhesion ${adhesionRequest.id} not found`})
                return
            }
            res.status(200).send(adhesionFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/adhesion", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getListAdhesionValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListAdhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getListAdhesionRequest.limit) {
            limit = getListAdhesionRequest.limit
        }
        const page = getListAdhesionRequest.page ?? 1

        try {
            const adhesionUseCase = new AdhesionUseCase(AppDataSource)
            const adhesionFound = await adhesionUseCase.getListAdhesion({...getListAdhesionRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(adhesionFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/association/mine/adhesion/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updateAdhesionValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateAdhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const adhesionUseCase = new AdhesionUseCase(AppDataSource)
            const adhesionFound = await adhesionUseCase.updateAdhesion(updateAdhesionRequest.id,{...updateAdhesionRequest},userFound?.association)
            if (adhesionFound === null) {
                res.status(404).send({"error": `Adhesion ${updateAdhesionRequest.id} not found`})
                return
            }
            res.status(200).send(adhesionFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/adhesion/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getAdhesionValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteAdhesionRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const adhesionUseCase = new AdhesionUseCase(AppDataSource)
            const adhesionFound = await adhesionUseCase.deleteAdhesion(deleteAdhesionRequest.id,userFound?.association)
            if (adhesionFound === null) {
                res.status(404).send({"error": `Adhesion ${deleteAdhesionRequest.id} not found`})
                return
            }
            res.status(200).send(adhesionFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Routes Documents
    app.post("/association/mine/ged/mine/document", authMiddlewareMember, async (req: Request, res: Response) => {
        const validation = createDocumentValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createDocumentRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdDocument = await AppDataSource.getRepository(DocumentGED).save({...createDocumentRequest,ged: userFound?.association.ged})

            res.status(200).send(createdDocument)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/ged/mine/document/:id", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = getDocumentValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const documentRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const documentUseCase = new DocumentGEDUseCase(AppDataSource)
            const documentFound = await documentUseCase.getDocumentGED(documentRequest.id,userFound?.association.ged)
            if (documentFound === null) {
                res.status(404).send({"error": `Document ${documentRequest.id} not found`})
                return
            }
            res.status(200).send(documentFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/ged/mine/document", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = getListDocumentValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListDocumentRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getListDocumentRequest.limit) {
            limit = getListDocumentRequest.limit
        }
        const page = getListDocumentRequest.page ?? 1

        try {
            const documentUseCase = new DocumentGEDUseCase(AppDataSource)
            const documentFound = await documentUseCase.getListDocumentGED({...getListDocumentRequest, page, limit, gedId: userFound?.association.ged.id})
            res.status(200).send(documentFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/association/mine/ged/mine/document/:id", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = updateDocumentValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateDocumentRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const documentUseCase = new DocumentGEDUseCase(AppDataSource)
            const documentFound = await documentUseCase.updateDocumentGED(updateDocumentRequest.id,{...updateDocumentRequest},userFound?.association.ged)
            if (documentFound === null) {
                res.status(404).send({"error": `Document ${updateDocumentRequest.id} not found`})
                return
            }
            res.status(200).send(documentFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/ged/mine/document/:id", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = getDocumentValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteDocumentRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const documentUseCase = new DocumentGEDUseCase(AppDataSource)
            const documentFound = await documentUseCase.deleteDocumentGED(deleteDocumentRequest.id,userFound?.association.ged)
            if (documentFound === null) {
                res.status(404).send({"error": `Document ${deleteDocumentRequest.id} not found`})
                return
            }
            res.status(200).send(documentFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Routes Dossier
    app.post("/association/mine/ged/mine/folder", authMiddlewareMember, async (req: Request, res: Response) => {
        const validation = createDossierValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createDossierRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdDossier = await AppDataSource.getRepository(Dossier).save({...createDossierRequest,ged: userFound?.association.ged})

            res.status(200).send(createdDossier)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.post("/association/mine/ged/mine/folder/:id/document", authMiddlewareMember, async (req: Request, res: Response) => {
        const validation = createDocumentValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createDocumentRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        const folderId = +req.params.id
        const folderFound = await AppDataSource.getRepository(Dossier).findOne({where: {id: folderId, ged: userFound?.association.ged}})
        if(!folderFound) {
            res.status(404).send({error: `Dossier ${folderId} not found`})
            return
        }

        try {
            const createdDocument = await AppDataSource.getRepository(DocumentGED).save({...createDocumentRequest,ged: userFound?.association.ged,folder: folderFound})

            res.status(200).send(createdDocument)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/ged/mine/folder/:id/document", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = getListDocumentValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListDocumentRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        const folderId = +req.params.id

        let limit = 20
        if (getListDocumentRequest.limit) {
            limit = getListDocumentRequest.limit
        }
        const page = getListDocumentRequest.page ?? 1

        try {
            const documentUseCase = new DocumentGEDUseCase(AppDataSource)
            const documentFound = await documentUseCase.getListDocumentGED({...getListDocumentRequest, page, limit, gedId: userFound?.association.ged.id, folderId: folderId})
            res.status(200).send(documentFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/ged/mine/folder/:id", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = getDossierValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const dossierRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const dossierUseCase = new DossierUseCase(AppDataSource)
            const dossierFound = await dossierUseCase.getDossier(dossierRequest.id,userFound?.association.ged)
            if (dossierFound === null) {
                res.status(404).send({"error": `Dossier ${dossierRequest.id} not found`})
                return
            }
            res.status(200).send(dossierFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/ged/mine/folder", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = getListDossierValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getListDossierRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getListDossierRequest.limit) {
            limit = getListDossierRequest.limit
        }
        const page = getListDossierRequest.page ?? 1

        try {
            const dossierUseCase = new DossierUseCase(AppDataSource)
            const dossierFound = await dossierUseCase.getListDossier({...getListDossierRequest, page, limit, gedId: userFound?.association.ged.id})
            res.status(200).send(dossierFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.patch("/association/mine/ged/mine/folder/:id", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = updateDossierValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateDossierRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const dossierUseCase = new DossierUseCase(AppDataSource)
            const dossierFound = await dossierUseCase.updateDossier(updateDossierRequest.id,{...updateDossierRequest},userFound?.association.ged)
            if (dossierFound === null) {
                res.status(404).send({"error": `Dossier ${updateDossierRequest.id} not found`})
                return
            }
            res.status(200).send(dossierFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/ged/mine/folder/:id", authMiddlewareMember ,async (req: Request, res: Response) => {
        const validation = getDossierValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deleteDossierRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const dossierUseCase = new DossierUseCase(AppDataSource)
            const dossierFound = await dossierUseCase.deleteDossier(deleteDossierRequest.id,userFound?.association.ged)
            if (dossierFound === null) {
                res.status(404).send({"error": `Dossier ${deleteDossierRequest.id} not found`})
                return
            }
            res.status(200).send(dossierFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion

    //#region Routes Transactions
/**
 * @swagger
 * /transaction:
 *   get:
 *     summary: Récupérer la liste des transactions de l'utilisateur.
 *     description: Renvoie la liste des transactions de l'utilisateur authentifié, filtrée par type si spécifié.
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Numéro de page pour la pagination (optionnel).
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: limit
 *         description: Nombre maximum d'éléments par page (optionnel).
 *         schema:
 *           type: integer
 *         example: 20
 *       - in: query
 *         name: type
 *         description: Type de transaction (optionnel).
 *         schema:
 *           type: string
 *           enum: [depot, retrait, achat_billet]
 *         example: depot
 *     responses:
 *       '200':
 *         description: Liste des transactions récupérée avec succès.
 *       '400':
 *         description: Requête invalide, voir le corps de la réponse pour plus de détails.
 *       '401':
 *         description: Non autorisé. L'utilisateur doit être authentifié.
 *       '404':
 *         description: Utilisateur non trouvé.
 *       '500':
 *         description: Erreur interne du serveur.
 */
    app.get("/transaction", authMiddleware, async (req: Request, res: Response) => {
        const validation = getTransactionsValidation.validate(req.query)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({"error": "Unauthorized"});

        const token = authHeader.split(' ')[1];
        if (token === null) return res.status(401).json({"error": "Unauthorized"});

        const getTransactionRequest = validation.value

        const userUseCase = new UserUseCase(AppDataSource)
        const userFound = await userUseCase.getUserByToken(token)

        if(!userFound) {
            res.status(404).send({"error": `User not found`})
            return
        }

        let limit = 20
        if (getTransactionRequest.limit) {
            limit = getTransactionRequest.limit
        }
        const page = getTransactionRequest.page ?? 1

        try {
            const transactionUseCase = new TransactionUseCase(AppDataSource)
            const transactions = await transactionUseCase.getListTransactions({ ...getTransactionRequest, page, limit }, userFound.id)
            res.status(200).send(transactions)
        }catch(error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.post("/association/mine/donate", authMiddleware, async (req: Request, res: Response) => {
        const validation = createDonValidation.validate(req.body)

        if(validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createDonRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)
        if(!userFound) {
            res.status(404).send({error: `User ${req.user.userId} not found`})
            return
        }

        try {
            const createdDocument = await AppDataSource.getRepository(CompteTransaction).save({
                ...createDonRequest,
                type: "don",
                association: userFound?.association,
                user: userFound
            })

            res.status(200).send(createdDocument)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }

    })
    //#endregion

    //#region Routes Planning
    app.post("/association/mine/planning", authMiddlewareAdmin, async (req: Request, res: Response) => {
        const validation = createPlanningValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const createPlanningRequest = validation.value

        const userConnectedFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const createdPlanning = await AppDataSource.getRepository(Planning).save({...createPlanningRequest, association: userConnectedFound?.association})
            createdPlanning.users = []
            const userUseCase = new UserUseCase(AppDataSource)
            createPlanningRequest.listUser?.forEach(async userId => {
                const userFound = await userUseCase.getUser(userId,userConnectedFound?.association,false)
                if(userFound !== null) {
                    createdPlanning.users.push(userFound)
                }
            })
            const createdPlanningFinal = await AppDataSource.getRepository(Planning).save(createdPlanning)

            res.status(200).send(createdPlanningFinal)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/planning/:id", authMiddlewareMember, async (req:Request, res:Response) => {
        const validation = getPlanningValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getPlanningRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const planningUseCase = new PlanningUseCase(AppDataSource)
            const planningFound = await planningUseCase.getPlanning(getPlanningRequest.id,userFound?.association)
            if (planningFound === null) {
                res.status(404).send({"error": `Planning ${getPlanningRequest.id} not found`})
                return
            }
            res.status(200).send(planningFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.get("/association/mine/planning", authMiddlewareMember, async (req: Request, res: Response) => {
        const validation = getPlanningsValidation.validate(req.query)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const getPlanningsRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        let limit = 20
        if (getPlanningsRequest.limit) {
            limit = getPlanningsRequest.limit
        }
        const page = getPlanningsRequest.page ?? 1

        try {
            const planningUseCase = new PlanningUseCase(AppDataSource)
            const planningFound = await planningUseCase.getListPlanning({...getPlanningsRequest, page, limit, associationId: userFound?.association.id})
            res.status(200).send(planningFound)

        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }

    })

    app.patch("/association/mine/planning/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = updatePlanningValidation.validate({...req.params,...req.body})

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updatePlanningRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const planningUseCase = new PlanningUseCase(AppDataSource)
            const planningFound = await planningUseCase.updatePlanning(updatePlanningRequest.id,{...updatePlanningRequest},userFound?.association)
            if (planningFound === null) {
                res.status(404).send({"error": `Planning ${updatePlanningRequest.id} not found`})
                return
            }
            res.status(200).send(planningFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    app.delete("/association/mine/planning/:id", authMiddlewareAdmin ,async (req: Request, res: Response) => {
        const validation = getPlanningValidation.validate(req.params)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const deletePlanningRequest = validation.value

        const userFound = await getConnectedUser(req.user.userId, AppDataSource)

        try {
            const planningUseCase = new PlanningUseCase(AppDataSource)
            const planningFound = await planningUseCase.deletePlanning(deletePlanningRequest.id,userFound?.association)
            if (planningFound === null) {
                res.status(404).send({"error": `Planning ${deletePlanningRequest.id} not found`})
                return
            }
            res.status(200).send(planningFound)

        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })
    //#endregion


    initRoutesSA(app)
    UserHandler(app)
}