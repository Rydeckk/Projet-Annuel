import React, { FormEvent, useEffect, useState } from 'react';
import traduction from '../../traductions/traduction.json'
import { ReponseType } from '../request/requestReponse';
import { useAssoContext } from '../main';
import { SondageType } from '../request/requestSondage';

export type PropsPopUp = {
    isOpen: boolean
    handleClose: () => void,
    onSave: (e: ReponseType) => void,
    onDelete?: () => void,
    response?: ReponseType,
    sondage: SondageType
}

export function PopupResponse ({ isOpen, handleClose, onSave, onDelete, response , sondage}: PropsPopUp) {
    const [name, setName] = useState<string>("")
    const [id, setId] = useState<number>(0)
    const asso = useAssoContext()

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if(response) {
            onSave({nbVote: response.nbVote, id: id, name: name, sondage: sondage, voters: response.voters, applicants: response.applicants})
        } else {
            onSave({nbVote: 0, id: id, name: name, sondage: sondage, voters: [], applicants: []})
        }
        
        handleClose()
    }

    useEffect(() => {
        if(response !== undefined) {
            setName(response.name)
            setId(response.id)
        }
      }, []);

    return (
        <>
            { isOpen && (
                <div className="popup">
                    <form onSubmit={handleSave} className="popup-inner">
                        <img src='/icone/return.png' onClick={handleClose} className='taille_icone clickable-image'></img>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.title}</label>
                            <input className='item_list_2_column input_popup' value={name} onChange={(e) => setName(e.target.value)} placeholder={traduction.title} required></input>
                        </div>
                        <div className='div_button_popup'>
                            <button id='btSave' type='submit' className="button_class">{traduction.save}</button>
                            {sondage !== undefined && <button id='btSuppr' className="button_class" onClick={onDelete}>{traduction.delete}</button>}
                        </div>
                        
                    </form>
                </div>
            )}
        </>
    );
};