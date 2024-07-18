import React, { useEffect, useState } from "react";
import { useAssoContext } from "../main";
import { downloadFile, Fichier, getFile, getListFile } from "../request/requestFile";
import { FichierElement } from "../component/Fichier";
import traduction from "../../traductions/traduction.json"

const sortFiles = (files: Array<Fichier>): Array<Fichier> => {
    return files.sort((a, b) => {
        if (a.type === 'folder' && b.type === 'file') {
            return -1;
        }
        if (a.type === 'file' && b.type === 'folder') {
            return 1;
        }
        return 0;
    })
}

export function Ged() {
    const asso = useAssoContext()
    const [fileList, setFileList] = useState<Array<Fichier>>([])
    const [parentFolder, setParentFolder] = useState<Fichier | undefined>()

    useEffect(() => {
        const getFiles = async (parentFolderId?: number) => {
            try {
                if(asso.asso !== null) {
                    const response = await getListFile(asso.asso.domainName, parentFolderId)
                    setFileList(sortFiles(response.file))
                }
            } catch (error) {

            }
        }
        getFiles(parentFolder?.id)
    }, [parentFolder, asso.asso])

    const handleClickFile = async (file: Fichier) => {
        if(asso.asso !== null) {
            await downloadFile(asso.asso.domainName, file)
        }
    }

    const handleClickFolder = async (folder: Fichier) => {
        console.log(folder)
        setParentFolder(folder)
    }

    const handleClickPrevFolder = async () => {
        if(asso.asso !== null && parentFolder !== undefined) {
            if(parentFolder.parentFolder !== null) {
                const parentFolderFound = await getFile(asso.asso.domainName, parentFolder.parentFolder)
                if(parentFolderFound !== null) {
                    setParentFolder(parentFolderFound)
                }
            } else {
                setParentFolder(undefined)
            }
        }
    }

    return (
        <div className="div_ged">
            <div className="div_ged_header">
                <div style={{display: "flex", flexDirection: "column", marginRight:"15px", justifyContent: "center"}}>
                    <img src="/icone/add.png" className="clickable-image taille_icone50"></img>
                    <label>{traduction.add}</label>
                </div>
                <div style={{display: "flex", flexDirection: "column", marginRight:"15px", justifyContent: "center"}}>
                    <img src="/icone/fileImport.png"  className="clickable-image taille_icone50"></img>
                    <label>{traduction.upload}</label>
                </div>
            </div>
            <div className="div_ged_header_list">
                <label className="width_column">{traduction.file_folder}</label>
                <label className="width_column">{traduction.file_name}</label>
                <label className="width_column">{traduction.added_date}</label>
                <label className="width_column">{traduction.download}</label>
            </div>
            <div className="div_ged_content">
                { parentFolder && (<div className="div_file_ged clickable-image" onClick={handleClickPrevFolder}>
                    <div className="div_row_content">
                        <div className="width_column">
                            <img src="/icone/folder.png" className="taille_icone50"></img>
                        </div>
                        <label className="width_column">..</label>
                        <label className="width_column"></label>
                        <span className="width_column"></span>
                    </div>
                </div>)}
                {fileList.map((file) => (
                        <FichierElement 
                        key={file.id} 
                        file={file} 
                        handleClickFolder={handleClickFolder}
                        handleClickFile={handleClickFile}></FichierElement>
                    ))
                }
            </div>
        </div>
    )
}