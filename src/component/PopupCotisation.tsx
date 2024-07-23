import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import traduction from '../../traductions/traduction.json'
import { formatDateToLocalISOString } from '../utils/utils-function';
import { ReponseType } from '../request/requestReponse';
import { useAssoContext } from '../main';
import { SondageType } from '../request/requestSondage';
import { Cotisation } from '../request/requestCotisation';

export type PropsPopUp = {
    isOpen: boolean
    handleClose: () => void,
    onSave: (e: Cotisation) => void,
    cotisation?: Cotisation
}

const listType = ["monthly","quarterly","yearly"]

export function PopupCotisation ({ isOpen, handleClose, onSave, cotisation }: PropsPopUp) {
    const [type, setType] = useState<string>("")
    const [selectedType, setSelectedType] = useState<string>("")
    const [montant, setMontant] = useState<number>(0)
    const [id, setId] = useState<number>(0)
    const asso = useAssoContext()

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        onSave({id: id, type: selectedType, montant: montant })
        handleClose()
    }

    useEffect(() => {
        if(cotisation !== undefined) {
            setType(cotisation.type)
            setMontant(cotisation.montant)
            setId(cotisation.id)
            setSelectedType(cotisation.type)
        }
      }, []);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(e.target.value)
    }   

    return (
        <>
        { isOpen && (
            <div className="popup">
                <form onSubmit={handleSave} className="popup-inner">
                    <img src='/icone/return.png' onClick={handleClose} className='taille_icone clickable-image'></img>
                    <div className="div_list_2_column">
                        <label className='item_list_2_column'>{traduction.cotisation_form_amount}</label>
                        <input className='item_list_2_column input_popup' value={montant} onChange={(e) => setMontant(+e.target.value)} placeholder={traduction.title} required></input>
                    </div>
                    <div className="div_list_2_column">
                        <label className='item_list_2_column'>{traduction.cotisation_form_type}</label>
                        <select className="item_list_2_column select_class" value={selectedType} onChange={handleChange}>
                            {listType.map((type) => (
                                <option key={type} value={type}>{type === "yearly" ? traduction.yearly : (type === "quarterly" ? traduction.quarterly : traduction.monthly)}</option>
                            ))}
                        </select>
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