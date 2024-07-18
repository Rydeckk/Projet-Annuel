
export type Association = {
    id: number,
    description: string,
    domainName: string,
    name: string
  }

export type UserConnexion = {
    email: string,
    password: string
}

export type UserInscription = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    address: string
}
  
  export async function getAssoByDomainName(domainName: string): Promise<Association | null> {
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association?" + new URLSearchParams({
      domainName: domainName
    }).toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow'
    })
  
    const data = await response.json()
  
    if(data.associations.length > 0) {
      return data.associations[0]
    }
  
    return null
  }

  export async function signUp(domainName: string, user: UserInscription) {
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/auth/signup?" + new URLSearchParams({
      domainName: domainName
    }).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify({email: user.email, password: user.password, firstName: user.firstName, lastName: user.lastName, address: user.address})
    })
    
  }

  export async function login(domainName: string, user: UserConnexion) {
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/auth/login?" + new URLSearchParams({
        domainName: domainName
      }).toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({email: user.email, password: user.password})
      })
    
      const data = await response.json()
      localStorage.setItem(domainName + '-token', data.token)
  }

  export async function logout(domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/auth/logout", {
        
        method: 'DELETE',
        headers: headers
      })

      localStorage.removeItem(domainName+'-token')
  }