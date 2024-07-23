export type Fichier = {
    id: number,
    name: string,
    type: string,
    path: string,
    addedDate: Date,
    parentFolder: Fichier
}

export type CreateFichier = {
    name: string,
    type: string,
    parentFolderId?: number,
    content?: string
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

export async function upload(domainName: string, file: File, parentFolderId: number = 0): Promise<Fichier> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/ged/mine/upload/folder/" + String(parentFolderId))
    const formdata = new FormData();
    formdata.append("file",file)
    const headers = new Headers({'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    
    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: formdata
    })

    const data = await response.json()
    return {name: data.uploadedFile.name, 
        type: data.uploadedFile.type, 
        id: data.uploadedFile.id, 
        parentFolder: data.uploadedFile.parentFolder, 
        addedDate: data.uploadedFile.addedDate, 
        path: data.uploadedFile.path}
}

export async function getFile(domainName: string, file: Fichier): Promise<Fichier | null> {
    const url = new URL("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/ged/mine/file/" + String(file.id))
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    
    const response = await fetch(url, {
        method: 'GET',
        headers: headers
    })

    const data = await response.json()
    const fileFound = data

    return fileFound
}

export async function createFile(domainName: string, file: CreateFichier): Promise<Fichier> {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/ged/mine/file", {
    
    method: 'POST',
    headers: headers,
    body: JSON.stringify(file)
    })

    const data = await response.json()

    return data
}

export async function deleteFile(fileId: number, domainName: string) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer '+ localStorage.getItem(domainName+"-token")})
    const response = await fetch("http://vps-1d054ff8.vps.ovh.net:3000/association/mine/ged/mine/file/"+fileId, {
    
    method: 'DELETE',
    headers: headers
    })

    const data = await response.json()
}