import { ReponseType } from "./requestReponse"

export type SondageType = {
    id: number,
    name: string,
    beginDate: Date,
    endDate: Date,
    reponses: ReponseType[]
}

export type CreationSondage = {
    name: string,
    beginDate: Date,
    endDate: Date
}

export interface UpdateSondage {
    id: number,
    name?: string,
    beginDate?: Date,
    endDate?: Date
}

export async function getListSondage(domainName: string): Promise<{sondages: Array<SondageType>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const sondages = data.Sondages

    return {
        sondages: sondages || []
    }
}

export async function createSondage(sondage: CreationSondage, domainName: string): Promise<SondageType> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage", {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(sondage)
    })

    const data = await response.json()

    return data
}

export async function deleteSondage(sondageId: number, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage/"+sondageId, {
    
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
}

export async function updateSondage(sondage: UpdateSondage, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage/"+sondage.id, {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(sondage)
    })

    const data = await response.json()
}