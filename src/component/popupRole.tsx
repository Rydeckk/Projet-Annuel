import React, { FormEvent, useEffect, useState } from 'react';
import traduction from '../../traductions/traduction.json'
import { ReponseType } from '../request/requestReponse';
import { useAssoContext } from '../main';
import { SondageType } from '../request/requestSondage';
import { Role } from '../request/requestUser';

export type PropsPopUp = {
    isOpen: boolean
    handleClose: () => void,
    onSave: (e: Role) => void,
    role?: Role
}

export function PopupRole ({ isOpen, handleClose, onSave, role}: PropsPopUp) {
    const [name, setName] = useState<string>("")
    const [id, setId] = useState<number>(0)
    const [isMember, setIsMember] = useState<boolean>(false)
    const [isAdmin, setIsAdmin] = useState<boolean>(false) 
    const asso = useAssoContext()

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSave({name: name, isMember: isMember, isAdmin: isAdmin, isSuperAdmin: false, id: id})
        setName("")
        setIsMember(false)
        setIsAdmin(false)
        handleClose()
    }

    useEffect(() => {
        if(role !== undefined) {
            setName(role.name)
            setId(role.id)
            setIsMember(role.isMember)
            setIsAdmin(role.isAdmin)
        }
      }, [role]);

    return (
        <>
            { isOpen && (
                <div className="popup">
                    <form onSubmit={handleSave} className="popup-inner">
                        <img src='/icone/return.png' onClick={handleClose} className='taille_icone clickable-image'></img>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.role_form_name}</label>
                            <input className='item_list_2_column input_popup' value={name} onChange={(e) => setName(e.target.value)} placeholder={traduction.title} required></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.role_form_isMember}</label>
                            <input className='item_list_2_column input_checkbox_round' checked={isMember} type="checkbox" onChange={(e) => setIsMember(e.target.checked)}></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.role_from_isAdmin}</label>
                            <input className='item_list_2_column input_checkbox_round' checked={isAdmin} type="checkbox" onChange={(e) => setIsAdmin(e.target.checked)}></input>
                        </div>
                        <div className='div_button_popup'>
                            <button id='btSave' type='submit' className="button_class">{traduction.save}</button>
                        </div>
                        
                    </form>
                </div>
            )}
        </>
    );
};