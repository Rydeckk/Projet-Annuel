import React, { useEffect, useState } from "react";
import { Fichier } from "../request/requestFile";
import { formatDateToLocalString } from "../utils/utils-function";

export type FichierProps = {
    handleClickFolder: (folder: Fichier) => void,
    handleClickFile: (f: Fichier) => void,
    file: Fichier,
    onContextMenuClick: (file: Fichier, menuPosition: { top: number; left: number}) => void
}

const listFormatImage = ["jpeg", "jpg", "png", "gif", "tif", "psd", "eps", "ai", "indd", "svg"]

function getFileExtension (filename: string): string {
    const dotIndex = filename.lastIndexOf('.');
    return dotIndex !== -1 ? filename.substring(dotIndex + 1) : '';
  };

function setIcon(type: string, name: string): string {
    const root = "/icone/"
    if(type === "folder") {
        return root + "folder.png"
    } else {
        const extFile = getFileExtension(name).toLowerCase()
        if(extFile === "txt") {
            return root + "fileTXT.png"
        } else if(extFile === "pdf") {
            return root + "filePDF.png"
        } else if (extFile === "doc" || extFile === "docx" || extFile === "odt") {
            return root + "fileDOCX.png"
        } else if (extFile === "xls" || extFile === "xlsx" || extFile === "ods") {
            return root + "fileXLS.png"
        } else if (extFile === "pptx" || extFile === "ppt" || extFile === "odp") {
            return root + "filePPTX.png"
        } else if (listFormatImage.includes(extFile)) {
            return root + "fileIMG.png"
        } else {
            return root + "file.png"
        }
    }
}

export function FichierElement({file, handleClickFolder, handleClickFile, onContextMenuClick}: FichierProps) {
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    
    const handleDownload = () => {
        handleClickFile(file)
    }

    const handleChangeFolder = () => {
        handleClickFolder(file)
    }

    const handleItemContextMenu = (file: Fichier, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        setMenuPosition({ top: event.clientY, left: event.clientX });
        if(menuPosition) {
            onContextMenuClick(file, menuPosition)
        }
        
    }

    return (
        <div className="div_file_ged clickable-image" onClick={file.type === "folder" ? handleChangeFolder : handleDownload} onContextMenu={(e) => {e.stopPropagation(); handleItemContextMenu(file, e);}}>
            <div className="div_row_content">
                <div className="width_column">
                    <img src={setIcon(file.type, file.name)} className="taille_icone50"></img>
                </div>
                <label className="width_column">{file.name}</label>
                <label className="width_column">{formatDateToLocalString(file.addedDate)}</label>
                <div className="width_column">
                    {file.type === "file" && (<img src="/icone/download.png" className="clickable-image taille_icone"></img>)}
                </div>
            </div>
        </div>
    )
}