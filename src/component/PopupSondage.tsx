import React, { FormEvent, useEffect, useState } from 'react';
import traduction from '../../traductions/traduction.json'
import { formatDateToLocalISOString } from '../utils/utils-function';
import { ReponseType } from '../request/requestReponse';
import { useAssoContext } from '../main';
import { SondageType } from '../request/requestSondage';

export type PropsPopUp = {
    isOpen: boolean
    handleClose: () => void,
    onSave: (e: SondageType) => void,
    onDelete?: () => void,
    sondage?: SondageType
}

export function PopupSondage ({ isOpen, handleClose, onSave, onDelete, sondage }: PropsPopUp) {
    const [beginDate, setBeginDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [responses, setResponses] = useState<Array<ReponseType>>([])
    const [id, setId] = useState<number>(0)
    const asso = useAssoContext()

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        onSave({name: name, beginDate: new Date(beginDate), endDate: new Date(endDate), id: id, reponses: responses })
        handleClose()
    }

    useEffect(() => {
        if(sondage !== undefined) {
            setBeginDate(formatDateToLocalISOString(sondage.beginDate));
            setEndDate(formatDateToLocalISOString(sondage.endDate));
            setName(sondage.name)
            setResponses(sondage.reponses)
            setId(sondage.id)
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
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.begin}</label>
                            <input className='item_list_2_column input_popup' type="datetime-local" value={beginDate} onChange={(e) => setBeginDate(e.target.value)} required></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.end}</label>
                            <input className='item_list_2_column input_popup' type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required></input>
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