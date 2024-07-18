import React from "react";
import { Fichier } from "../request/requestFile";
import { formatDateToLocalString } from "../utils/utils-function";

export type FichierProps = {
    handleClickFolder: () => void,
    handleClickFile: (f: Fichier) => void,
    file: Fichier
}

export function FichierElement({file, handleClickFolder, handleClickFile}: FichierProps) {

    const handleDownload = () => {
        handleClickFile(file)
    }

    return (
        <div className="div_file_ged clickable-image" onClick={file.type === "folder" ? handleClickFolder : handleDownload}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0px"}}>
                {file.type === "folder" ? (
                    <div className="width_column">
                        <img src="/icone/folder.png" className="taille_icone50"></img>
                    </div>
                ) : (
                    <div className="width_column">
                        <img src="/icone/file.png" className="taille_icone50"></img>
                    </div>
                )}
                <label className="width_column">{file.name}</label>
                <label className="width_column">{formatDateToLocalString(file.addedDate)}</label>
                {file.type === "file" ? (
                    <div className="width_column">
                        <img src="/icone/download.png" className="clickable-image taille_icone"></img>
                    </div>
                ) : (
                    <span className="width_column"></span>
                )}
            </div>
        </div>
    )
}