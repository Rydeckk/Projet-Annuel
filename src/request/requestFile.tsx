export type Fichier = {
    id: number,
    name: string,
    type: string,
    path: string,
    addedDate: Date
}

function buildUrlFile(baseUrl: string, parentFolderId?: number): string {
    const params = new URLSearchParams();
  
    if (parentFolderId !== undefined) {
      params.append('parentFolderId', String(parentFolderId));
    }
  
    return `${baseUrl}?${params.toString()}`;
  }

export async function getListFile(domainName: string, parentFolderId?: number): Promise<{file: Array<Fichier>}> {
    const url = buildUrlFile("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/ged/mine/file", parentFolderId);
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    })

    const data = await response.json()
    const files = data.fichiers

    return {
        file: files || []
    }
}


export async function downloadFile(domainName: string, file: Fichier): Promise<void> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/ged/mine/download/" + String(file.id))
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: headers
    })

    if(await response.status !== 404) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = file.name; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
    } else {
        console.log(await response.statusText)
    }
    
}

export async function upload(domainName: string, parentFolderId: number = 0): Promise<void> {
    const url = buildUrlFile("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/ged/mine/upload/folder/", parentFolderId);
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    
    const response = await fetch(url, {
        method: 'POST',
        headers: headers
    })

    const data = await response.json()
    const files = data.fichiers

}