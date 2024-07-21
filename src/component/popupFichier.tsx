import { ChangeEvent, FormEvent, useState } from "react"
import { CreateFichier, Fichier } from "../request/requestFile"
import traduction from '../../traductions/traduction.json'
import React from "react"


export type PopupFichierProps = {
    isOpen: boolean,
    handleClose: () => void,
    onSave: (file: CreateFichier) => void,
    parentFolder?: Fichier
}

export function PopupFichier({isOpen, handleClose, onSave, parentFolder}: PopupFichierProps) {
    const [name, setName] = useState<string>("")
    const [type, setType] = useState<string[]>(["file","folder"])
    const [selectedType, setSelectedType] = useState('');
    const [content, setContent] = useState<string>("")

    const handleChange = (type: ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(type.target.value)
    }

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSave({name: name, type: selectedType, parentFolderId: parentFolder?.id, content: content})
        handleClose()
    }

    return (
        <>
            { isOpen && (
                <div className="popup">
                    <form onSubmit={handleSave} className="popup-inner">
                        <img src='/icone/return.png' onClick={handleClose} className='taille_icone clickable-image'></img>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.file_name}</label>
                            <input value={name} className="input_popup item_list_2_column"  onChange={(e) => setName(e.target.value)} required></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.file_type}</label>
                            <select value={selectedType} className="input_popup item_list_2_column" onChange={handleChange} required>
                                <option value={""}>{traduction.select_type}</option>
                            {type.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                            </select>
                        </div>
                        {selectedType === "file" && 
                        (<div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.file_content}</label>
                            <textarea value={content} className="input_popup item_list_2_column"  onChange={(c) => setContent(c.target.value)} rows={5} cols={40} />
                        </div>)}
                        <button id='btSave' type="submit" className="button_class">{traduction.save}</button>
                    </form>
                </div>
            )}
        </>
    )
}