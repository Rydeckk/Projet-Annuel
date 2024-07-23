export type Role = {
    id: number,
    name: string,
    isMember: boolean,
    isAdmin: boolean,
    isSuperAdmin: boolean
}

export type UserInfo = {
    firstname: string,
    lastname: string,
    address: string,
    email: string,
    role: Role
}

export type UserInfoWithId = {
    id: number,
    firstName: string,
    lastName: string,
    address: string,
    email: string,
    role: Role
}

export async function getUser(domainName: string): Promise<UserInfoWithId | null> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/auth/info")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
    })

    if(await response.status !== 404) {
        return await response.json()
    } else {
        console.log(await response.statusText)
        return null
    }
}

export async function getListUser(domainName: string): Promise<{users: Array<UserInfoWithId>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/user", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const users = data.users

    return {
        users: users || []
    }
}

export async function updateUser(user: UserInfoWithId, domainName: string) {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/user/"+user.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url , {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({roleId: user.role.id})
    })

    const data = await response.json()
    console.log(data)
    return data
}