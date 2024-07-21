import { AssembleeType } from "./requestAssemble"
import { ReponseType } from "./requestReponse"

export type VoteType = {
    id: number,
    name: string,
    beginDate: Date,
    endDate: Date,
    reponses: ReponseType[],
    assemblee: AssembleeType | null,
    parentVote: VoteType | null
}

export type CreationVote = {
    name: string,
    beginDate: Date,
    endDate: Date,
    voteIdParent?: number,
    assembleeId?: number
}

export interface UpdateVote {
    id: number,
    name?: string,
    beginDate?: Date,
    endDate?: Date,
    voteIdParent?: number,
    assembleeId?: number
}

export async function getListVote(domainName: string, assembleeId?: number): Promise<{votes: Array<VoteType>}> {
    const urlQuery = new URLSearchParams()
    if(assembleeId !== undefined) {
        urlQuery.append("assembleeId", String(assembleeId))
    }
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote?" + urlQuery, {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const votes = data.Votes

    return {
        votes: votes || []
    }
}

export async function createVote(vote: CreationVote, domainName: string): Promise<VoteType> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote", {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(vote)
    })

    const data = await response.json()

    return data
}

export async function deleteVote(voteId: number, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote/"+voteId, {
    
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
}

export async function updateVote(vote: UpdateVote, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote/"+vote.id, {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(vote)
    })

    const data = await response.json()
}