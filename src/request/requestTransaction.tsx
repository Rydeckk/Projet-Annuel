import { ReponseType } from "./requestReponse"
import { UserInfoWithId } from "./requestUser"

export type TransactionType = {
    id: number,
    montant: number,
    type: string,
    didAt: Date,
    user: UserInfoWithId
}

export async function getListTransaction(domainName: string, userId?: number): Promise<{transactions: Array<TransactionType>}> {
    let url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/transaction?")
    if(userId) {
        url = new URL(url + new URLSearchParams({userId: String(userId)}).toString())
    }

    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch(url , {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const transactions = data.transactions

    return {
        transactions: transactions || []
    }
}
