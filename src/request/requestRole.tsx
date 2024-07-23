import { Role } from "./requestUser"

type CreateRole = {
    name: string,
    isMember: boolean,
    isAdmin: boolean
}

type UpdateRole = {
    id: number,
    name?: string,
    isMember?: boolean,
    isAdmin?: boolean
}

export async function getListRole(domainName: string): Promise<{roles: Array<Role>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/role", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const roles = data.roles

    return {
        roles: roles || []
    }
}

export async function deleteRole(roleId: number, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/role/"+roleId, {
    
    method: 'DELETE',
    headers: headers
    })

}

export async function updateRole(role: UpdateRole, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/role/"+role.id, {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(role)
    })

    const data = await response.json()
}

export async function createRole(role: CreateRole, domainName: string): Promise<Role> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/role", {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(role)
    })

    const data = await response.json()

    return data
}