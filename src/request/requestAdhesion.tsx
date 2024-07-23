import { Cotisation } from "./requestCotisation"

export type Adhesion = {
    id: number,
    typeAdhesion: Cotisation,
    isActive: boolean,
    beginDate: Date,
    endDate: Date,
    createdAt: Date 
}

export async function getListAdhesion(domainName: string): Promise<{adhesions: Array<Adhesion>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/adhesion", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const adhesions = data.Adhesions

    return {
        adhesions: adhesions || []
    }
}