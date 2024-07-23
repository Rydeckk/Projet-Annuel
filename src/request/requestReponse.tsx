import { SondageType } from "./requestSondage"
import { UserInfoWithId } from "./requestUser"
import { VoteType } from "./requestVote"

export type ReponseType = {
    nbVote: number,
    id: number,
    name: string,
    vote?: VoteType,
    sondage?: SondageType,
    applicants: UserInfoWithId[],
    voters: UserInfoWithId[]
}

export type CreateResponse = {
    name: string,
    voteId?: number,
    sondageId?: number,
    applicantId?: Array<number>
}

export async function createResponseVote(createdResponse: CreateResponse, domainName: string): Promise<ReponseType> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote/"+createdResponse.voteId + "/response")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url, {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(createdResponse)
    })

    const data = await response.json()

    return data
}

export async function getListResponseVote(voteId: number, domainName: string): Promise<{responses: Array<ReponseType>}> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote/"+ voteId + "/response")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url, {
        
        method: 'GET',
        headers: headers
      })

      const data = await response.json()
      const responses = data.Reponses

      return {
        responses: responses || []
      }
}

export async function submitVote(voteId: number, responseId: number, domainName: string): Promise<ReponseType> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote/"+voteId + "/response/"+ responseId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url, {
    
    method: 'POST',
    headers: headers
    })

    const data = await response.json()

    return data
}

export async function updateResponseVote(voteId: number, responseUpdated: ReponseType, domainName: string): Promise<ReponseType> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote/"+voteId + "/response/"+ responseUpdated.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url , {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({name: responseUpdated.name, applicantId: responseUpdated.applicants.map((applicant) => applicant.id)})
    })

    const data = await response.json()
    return data
}

export async function deleteResponseVote(voteId: number, responseId: number, domainName: string) {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/vote/"+voteId + "/response/"+ responseId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url , {
    
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
}

export async function getListResponseSondage(sondageId: number, domainName: string): Promise<{responses: Array<ReponseType>}> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage/"+ sondageId + "/response")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url, {
        
        method: 'GET',
        headers: headers
      })

      const data = await response.json()
      const responses = data.Reponses

      return {
        responses: responses || []
      }
}

export async function createResponseSondage(createdResponse: CreateResponse, domainName: string): Promise<ReponseType> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage/" +createdResponse.sondageId + "/response")
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url, {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(createdResponse)
    })

    const data = await response.json()

    return data
}

export async function updateResponseSondage(sondageId: number, responseUpdated: ReponseType, domainName: string): Promise<ReponseType> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage/"+sondageId + "/response/"+ responseUpdated.id)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url , {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify({name: responseUpdated.name})
    })

    const data = await response.json()
    return data
}

export async function deleteResponseSondage(sondageId: number, responseId: number, domainName: string) {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage/"+sondageId + "/response/"+ responseId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url , {
    
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
}

export async function submitResponse(sondageId: number, responseId: number, domainName: string): Promise<ReponseType> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/sondage/"+sondageId + "/response/"+ responseId)
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url, {
    
    method: 'POST',
    headers: headers
    })

    const data = await response.json()

    return data
}