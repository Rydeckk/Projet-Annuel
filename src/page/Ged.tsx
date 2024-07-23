import React, { useEffect, useState } from "react";
import { useAssoContext } from "../main";
import { CreateFichier, createFile, deleteFile, downloadFile, Fichier, getFile, getListFile, upload } from "../request/requestFile";
import { FichierElement } from "../component/Fichier";
import traduction from "../../traductions/traduction.json"
import { PopupFichier } from "../component/popupFichier";
import { PopupFichierUpload } from "../component/popupFichierUpload";

const sortFiles = (files: Array<Fichier>): Array<Fichier> => {
    const folders = files.filter(file => file.type === 'folder');
    const filesOnly = files.filter(file => file.type === 'file');

    const sortedFolders = folders.sort((a, b) => a.name.localeCompare(b.name));
    const sortedFiles = filesOnly.sort((a, b) => a.name.localeCompare(b.name));

    return [...sortedFolders, ...sortedFiles];
}

export function Ged() {
    const asso = useAssoContext()
    const [fileList, setFileList] = useState<Array<Fichier>>([])
    const [parentFolder, setParentFolder] = useState<Fichier | undefined>()
    const [isOpenPopupFichier, setIsOpenPopupFichier] = useState(false);
    const [isOpenPopupFichierUpload, setIsOpenPopupFichierUpload] = useState(false);
    const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
    const [fileDelete, setFileDelete] = useState<Fichier | null>(null)
    const [isPopupDeleteHidden, setIsPopupDeleteHidden] = useState<boolean>(true)

    const togglePopupFichier = () => {
        setIsOpenPopupFichier(!isOpenPopupFichier);
    }

    const togglePopupFichierUpload = () => {
        setIsOpenPopupFichierUpload(!isOpenPopupFichierUpload);
    }

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

    useEffect(() => {
        if(menuPosition) {
            setIsPopupDeleteHidden(false)
        } else {
            setIsPopupDeleteHidden(true)
        }
        
    }, [menuPosition, fileDelete])

    const handleClickFile = async (file: Fichier) => {
        if(asso.asso !== null) {
            await downloadFile(asso.asso.domainName, file)
        }
    }

    const handleClickFolder = async (folder: Fichier) => {
        setParentFolder(folder)
        setMenuPosition(null)
        setFileDelete(null)
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

    const handleSave = async (file: CreateFichier) => {
        if(asso.asso) {
            const fileCreated = await createFile(asso.asso.domainName, file)
            console.log(fileCreated)
            setFileList(sortFiles([...fileList,fileCreated]))
        }
        
        setIsOpenPopupFichier(false)
    }

    const handleSaveUpload = async (file: File) => {
        if(asso.asso) {
            const fileCreated = await upload(asso.asso.domainName, file, parentFolder?.id)
            setFileList(sortFiles([...fileList,fileCreated]))
        }
        
        setIsOpenPopupFichierUpload(false)
    }

    const handleContextMenu = (file: Fichier, menuPosition: { top: number; left: number }) => {
        setMenuPosition(menuPosition)
        setFileDelete(file)
    }

    const handleDelete = async () => {
        if(asso.asso && fileDelete) {
            await deleteFile(fileDelete.id, asso.asso.domainName)
            setFileList(fileList.filter((file) => file.id !== fileDelete.id))
            setMenuPosition(null)
            setFileDelete(null)
        }
    }

    return (
        <div className="div_ged">
            <div className="div_ged_header">
                <div style={{display: "flex", flexDirection: "column", marginRight:"15px", justifyContent: "center", alignItems: "center"}}>
                    <img src="/icone/add.png" className="clickable-image taille_icone50" onClick={togglePopupFichier}></img>
                    <label>{traduction.add}</label>
                </div>
                <div style={{display: "flex", flexDirection: "column", marginRight:"15px", justifyContent: "center", alignItems: "center"}}>
                    <img src="/icone/fileImport.png"  className="clickable-image taille_icone50" onClick={togglePopupFichierUpload}></img>
                    <label>{traduction.upload}</label>
                </div>
            </div>
            <div className="div_ged_content">
                <div className="div_ged_header_list">
                    <label className="width_column">{traduction.file_folder}</label>
                    <label className="width_column">{traduction.file_name}</label>
                    <label className="width_column">{traduction.added_date}</label>
                    <label className="width_column">{traduction.download}</label>
                </div>
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
                        handleClickFile={handleClickFile}
                        onContextMenuClick={(file, menuPosition) => handleContextMenu(file, menuPosition)}></FichierElement>
                    ))
                }
            </div>

            {!isPopupDeleteHidden && menuPosition && (
                <div
                    className="context-menu"
                    style={{ top: menuPosition.top, left: menuPosition.left  }}>
                    <button className="button_close" onClick={() => handleDelete()} onBlur={() => {setMenuPosition(null)}}>Supprimer X</button>
                </div>
            )}
            <PopupFichier isOpen={isOpenPopupFichier} handleClose={togglePopupFichier} onSave={handleSave} parentFolder={parentFolder}></PopupFichier>
            <PopupFichierUpload isOpen={isOpenPopupFichierUpload} handleClose={togglePopupFichierUpload} onSave={handleSaveUpload}></PopupFichierUpload>
        </div>
    )
}