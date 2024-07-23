export type Cotisation = {
    id: number,
    type: string,
    montant: number
}

type CreateCotisation = {
    type: string,
    montant: number
}

export async function getListCotisation(domainName: string): Promise<{cotisations: Array<Cotisation>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/typeadhesion", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const cotisations = data.typeAdhesions

    return {
        cotisations: cotisations || []
    }
}

export async function deleteCotisation(cotisationId: number, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/typeadhesion/"+cotisationId, {
    
    method: 'DELETE',
    headers: headers
    })

}

export async function updateCotisation(cotisation: Cotisation, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/typeadhesion/"+cotisation.id, {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(cotisation)
    })

    const data = await response.json()
}

export async function createCotisation(cotisation: CreateCotisation, domainName: string): Promise<Cotisation> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/typeadhesion", {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(cotisation)
    })

    const data = await response.json()

    return data
}