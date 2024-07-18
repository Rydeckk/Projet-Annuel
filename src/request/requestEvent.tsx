export type Evenement = {
    id: number,
    name: string,
    type: string,
    isPublic: boolean,
    beginDate: Date,
    endDate: Date
}

export type EvenementWithoutId = {
    name: string,
    type: string,
    isPublic: boolean,
    beginDate: Date,
    endDate: Date
}

export async function getListEvent(domainName: string): Promise<{event: Array<Evenement>}> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/event", {
        
        method: 'GET',
        headers: headers
      })

      const data = await response.json()
      const events = data.events

      if(response.status === 403) {
        return getListEventPublic(domainName)
      }
      return {
        event: events || []
      }
  }

  export async function getListEventPublic(domainName: string): Promise<{event: Array<Evenement>}> {
    const headers = new Headers({'Content-Type': 'application/json'})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/eventpublic?" + new URLSearchParams({
        domainName: domainName
      }).toString(), {
        
        method: 'GET',
        headers: headers
      })

      const data = await response.json()
      const events = data.events

      return {
        event: events || []
      }
  }

export async function deleteEvent(eventId: number, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/event/"+eventId, {
    
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
}

export async function updateEvent(event: Evenement, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/event/"+event.id, {
    
    method: 'PATCH',
    headers: headers,
    body: JSON.stringify(event)
    })

    const data = await response.json()
}

export async function createEvent(event: EvenementWithoutId, domainName: string): Promise<Evenement> {
    console.log(JSON.stringify(event))
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/event", {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(event)
    })

    const data = await response.json()

    return data
}