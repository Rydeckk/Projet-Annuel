export type AssembleeType = {
    id: number,
    location: string,
    description: string,
    beginDate: Date,
    endDate: Date
}

export async function getListAssemblee(domainName: string): Promise<{assemblees: Array<AssembleeType>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/assemblee", {
        
    method: 'GET',
    headers: headers
    })

    const data = await response.json()
    const assemblees = data.assemblees

    return {
        assemblees: assemblees || []
    }
}