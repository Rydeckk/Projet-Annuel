import { DataSource } from "typeorm";
import { User } from "../database/entities/user";
import { Token } from "../database/entities/token";
import { Association } from "../database/entities/association";
import { Role } from "../database/entities/role";
import { Assemblee } from "../database/entities/assemblee";

export interface ListUserFilter {
    page: number,
    limit: number,
    isMember?: boolean,
    isAdmin?: boolean,
    isSuperAdmin?: boolean,
    associationId?: number
}

export interface UpdateUserParams {
    password?: string,
    roleId?: number,
    associationId?: number
}

export class UserUseCase {
    constructor(private readonly db: DataSource) { }

    async getListUser(listUserFilter: ListUserFilter): Promise<{ users: User[]; }> {
        const query = this.db.createQueryBuilder(User, 'user')
        query.skip((listUserFilter.page - 1) * listUserFilter.limit)
        query.take(listUserFilter.limit)
        query.innerJoinAndSelect('user.role','role')

        if(listUserFilter.isAdmin !== undefined) {
            query.andWhere('role.isAdmin= :isAdmin', {isAdmin: listUserFilter.isAdmin})
        }

        if(listUserFilter.isMember !== undefined) {
            query.andWhere('role.isMember= :isMember', {isMember: listUserFilter.isMember})
        }

        if(listUserFilter.isSuperAdmin !== undefined) {
            query.andWhere("role.isSuperAdmin = :isSuperAdmin", {isSuperAdmin: listUserFilter.isSuperAdmin})
        }

        if(listUserFilter.associationId) {
            const assoFound = await this.db.getRepository(Association).findOneBy({id: listUserFilter.associationId})
            if(assoFound) {
                query.andWhere("user.association = :assoId", {assoId: listUserFilter.associationId})
            }
        }

        const users = await query.getMany()
        return {
            users
        }
    }

    async getUser(id: number, association?: Association, isSuperAdmin?: boolean): Promise<User | null> {
        const query = this.db.createQueryBuilder(User, "user")
        query.innerJoinAndSelect("user.association","association")
        query.innerJoinAndSelect("user.role","role")
        query.innerJoinAndSelect("association.ged","ged")
        query.where("user.id = :id", {id: id})
        if(association) {
            query.andWhere("association.id = :assoId", {assoId: association.id})
        }

        if(isSuperAdmin !== undefined) {
            query.andWhere("role.isSuperAdmin = :isSuperAdmin", {isSuperAdmin: isSuperAdmin})
        } 

        const userFound = await query.getOne()
        if (!userFound) return null

        return userFound
    }

    async getUserByToken(token: string): Promise<User | null> {
        const queryToken = this.db.createQueryBuilder(Token, 'token')
        queryToken.innerJoinAndSelect('token.user','user')
        queryToken.where('token.token= token',{token: token})
        const tokenFound = await queryToken.getOne()

        if(!tokenFound) {
            return null
        }

        const queryUser = this.db.createQueryBuilder(User, 'user')
        queryUser.innerJoinAndSelect('user.role','role')
        queryUser.where('user.id= :userId',{userId: tokenFound.user.id})

        const user = await queryUser.getOne()

        if (!user) {
            return null
        }

        return user
    }

    async updateUser(id: number, updateUser: UpdateUserParams, association?: Association, isSuperAdmin?: boolean): Promise<User | null> {
        const query = this.db.createQueryBuilder(User,"user")
        query.innerJoinAndSelect("user.role","role")
        query.innerJoinAndSelect("user.association","asso")
        query.where("user.id = :userId", {userId: id})
        if(isSuperAdmin !== undefined) {

            query.andWhere("role.isSuperAdmin = :isSuperAdmin", {isSuperAdmin: isSuperAdmin})
        }
        if(association !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: association.id})
        }
        const userFound = await query.getOne()

        if (userFound === null) return null

        if (updateUser.password) {
            userFound.password = updateUser.password
        }

        if(updateUser.roleId !== undefined) {
            const roleFound = await this.db.getRepository(Role).findOne({where: {id:updateUser.roleId, association: association, isSuperAdmin: isSuperAdmin} })
            if(roleFound) {
                userFound.role = roleFound
            }
        }

        if(updateUser.associationId !== undefined) {
            const associationFound = await this.db.getRepository(Association).findOneBy({id: updateUser.associationId})
            if(associationFound) {
                userFound.association = associationFound
            }
        }

        const repo = this.db.getRepository(User)
        const userUpdate = await repo.save(userFound)
        return userUpdate
    }

    async deleteUser(id: number, association?: Association, isSuperAdmin?: boolean): Promise<User | null> {
        const query = this.db.createQueryBuilder(User,"user")
        query.innerJoinAndSelect("user.role","role")
        query.innerJoinAndSelect("user.association","asso")
        query.where("user.id = :userId", {userId: id})
        if(isSuperAdmin !== undefined) {

            query.andWhere("role.isSuperAdmin = :isSuperAdmin", {isSuperAdmin: isSuperAdmin})
        }
        if(association !== undefined) {
            query.andWhere("asso.id = :assoId", {assoId: association.id})
        }
        const userFound = await query.getOne()

        if(userFound === null) return null

        const deletedUser = userFound

        await this.db.getRepository(User).remove(userFound)
        return deletedUser
    }

    async getListAdherant(asso?: Association, isSuperAdmin?: boolean, assemblee?: Assemblee): Promise<{ users: User[]; }> {
        const query = this.db.createQueryBuilder(User, 'user')
        query.innerJoin('user.role','role')
        query.innerJoinAndSelect('user.adhesion', 'adhesion')
        query.innerJoin('user.association','asso')
        query.where('adhesion.isActive = :isActive', {isActive: true})

        if(isSuperAdmin !== undefined) {
            query.andWhere("role.isSuperAdmin = :isSuperAdmin", {isSuperAdmin: isSuperAdmin})
        }

        if(asso) {
            query.andWhere("asso.id = :assoId", {assoId: asso.id})
        }

        if(assemblee) {
            query.andWhere('adhesion.endDate >= :endDateAssemblee', {endDateAssemblee: assemblee.endDate})
        }

        const users = await query.getMany()
        return {
            users
        }
    }
}

export async function getConnectedUser(userId: number,db: DataSource): Promise<User | null> {

    const userUseCase = new UserUseCase(db)
    const userFound = await userUseCase.getUser(userId)
    if(!userFound) {
        return null
    }

    return userFound
}