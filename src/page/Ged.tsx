import React, { useEffect, useState } from "react";
import { useAssoContext } from "../main";
import { downloadFile, Fichier, getListFile } from "../request/requestFile";
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
    const [parentFolderId, setParentFolderId] = useState<number | undefined>()

    useEffect(() => {
        const getFiles = async (parentFolderId?: number) => {
            try {
                if(asso.asso !== null) {
                    const response = await getListFile(asso.asso.domainName)
                    setFileList(sortFiles(response.file))
                }
            } catch (error) {

            }
        }
        getFiles(parentFolderId)
    }, [parentFolderId])

    const handleClickFile = async (file: Fichier) => {
        if(asso.asso !== null) {
            await downloadFile(asso.asso.domainName, file)
        }
    }

    const handleClickFolder = () => {

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