import { ChangeEvent, FormEvent, useState } from "react"
import { Fichier } from "../request/requestFile"
import traduction from '../../traductions/traduction.json'
import React from "react"


export type PopupFichierUploadProps = {
    isOpen: boolean,
    handleClose: () => void,
    onSave: (file: File) => void
}

export function PopupFichierUpload({isOpen, handleClose, onSave}: PopupFichierUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    }

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(file) {
            onSave(file)
            handleClose()
        }
        

        setFile(null);
        setPreview(null);
    }

    return (
        <>
            { isOpen && (
                <div className="popup">
                    <form onSubmit={handleSave} className="popup-inner">
                        <img src='/icone/return.png' onClick={handleClose} className='taille_icone'></img>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.select_file}</label>
                            <input type="file" className="item_list_2_column input_file" onChange={handleFileChange} required></input>
                        </div>
                        {preview && (<div className="div_flex_end">
                            <div>
                                <img className='item_list_2_column' src={preview} alt="Preview" style={{ width: '100px', height: '100px' }} />
                            </div>
                        </div>)}
                        <button id='btSave' type="submit" className="button_class">{traduction.upload}</button>
                    </form>
                </div>
            )}
        </>
    )
}