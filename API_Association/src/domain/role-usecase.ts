import { DataSource } from "typeorm";
import { Role } from "../database/entities/role";
import { Association } from "../database/entities/association";

export interface UpdateRoleParams {
    name?: string,
    isMember?: boolean,
    isAdmin?: boolean,
    isSuperAdmin?: boolean,
    associationId?: number
}

export interface ListRoleFilter {
    limit: number,
    page: number,
    isMember?: boolean,
    isAdmin?: boolean,
    isSuperAdmin?: boolean,
    associationId?: number
}

export class RoleUseCase {
    constructor(private readonly db: DataSource) { }

    async getRole(id: number, association?: Association, isSuperAdmin?: boolean): Promise<Role | null> {
        const repo = this.db.getRepository(Role)
        const roleFound = await repo.findOne({where : {id: id, isSuperAdmin: isSuperAdmin}})
        if (roleFound === null) return null

        return roleFound
    }

    async getListRole(listRoleFilter: ListRoleFilter): Promise<{ roles: Role[]; }> {
        const query = this.db.createQueryBuilder(Role, 'role')
        query.skip((listRoleFilter.page - 1) * listRoleFilter.limit)
        query.take(listRoleFilter.limit)

        if(listRoleFilter.isMember !== undefined) {
            query.andWhere("role.isMember = :isMember", {isMember: listRoleFilter.isMember})
        }

        if(listRoleFilter.isAdmin !== undefined) {
            query.andWhere("role.isAdmin = :isAdmin", {isAdmin: listRoleFilter.isAdmin})
        }

        if(listRoleFilter.isSuperAdmin !== undefined) {
            query.andWhere("role.isSuperAdmin = :isSuperAdmin", {isSuperAdmin: listRoleFilter.isSuperAdmin})
        }

        if(listRoleFilter.associationId !== undefined) {
            query.andWhere("role.associationId = :associationId", {associationId: listRoleFilter.associationId})
        }

        const roles = await query.getMany()
        return {
            roles
        }
    }

    async updateRole(id: number, roleParam: UpdateRoleParams, association?: Association, isSuperAdmin?: boolean): Promise<Role | null> {
        const repo = this.db.getRepository(Role)
        const roleFound = await repo.findOne({where: {id:id, association: association, isSuperAdmin: isSuperAdmin} })

        if (roleFound === null) return null

        if (roleParam.name) {
            roleFound.name = roleParam.name
        }

        if(roleParam.isMember !== undefined) {
            roleFound.isMember = roleParam.isMember
        }

        if(roleParam.isAdmin !== undefined) {
            roleFound.isAdmin = roleParam.isAdmin
        }

        if(roleParam.isSuperAdmin !== undefined) {
            roleFound.isSuperAdmin = roleParam.isSuperAdmin
        }

        if(roleParam.associationId !== undefined) {
            const associationFound = await this.db.getRepository(Association).findOneBy({id: roleParam.associationId})
            if(associationFound) {
                roleFound.association = associationFound
            }
        }

        const roleUpdate = await repo.save(roleFound)
        return roleUpdate
    }

    async deleteRole(id: number, association?: Association, isSuperAdmin?: boolean): Promise<Role | null> {
        const repo = this.db.getRepository(Role)
        const rolefound = await repo.findOne({where: {id:id, association: association, isSuperAdmin: isSuperAdmin} })
        if (rolefound === null) return null

        repo.delete({ id })
        return rolefound
    }
}