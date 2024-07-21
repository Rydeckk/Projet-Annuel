import React, { FormEvent, useEffect, useState } from 'react';
import traduction from '../../traductions/traduction.json'
import { Evenement } from '../request/requestEvent';
import { formatDateToLocalISOString } from '../utils/utils-function';

export type PropsPopUp = {
    isOpen: boolean
    handleClose: () => void,
    onSave: (e: Evenement) => void,
    onDelete?: () => void,
    event?: Evenement
}

export function PopupEvent ({ isOpen, handleClose, onSave, onDelete, event }: PropsPopUp) {
    const [beginDate, setBeginDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [type, setType] = useState<string>("")
    const [isPublic, setIsPublic] = useState<boolean>(false)
    const [id, setId] = useState<number>(0)

    const handleSave = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onSave({name: name, type: type, beginDate: new Date(beginDate), endDate: new Date(endDate), isPublic: isPublic, id: id })
        handleClose()
    }

    useEffect(() => {
        if(event !== undefined) {
            setBeginDate(formatDateToLocalISOString(event.beginDate));
            setEndDate(formatDateToLocalISOString(event.endDate));
            setName(event.name)
            setType(event.type)
            setIsPublic(event.isPublic)
            setId(event.id)
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
                            <label className='item_list_2_column'>{traduction.type}</label>
                            <input className='item_list_2_column input_popup' value={type} onChange={(e) => setType(e.target.value)} placeholder={traduction.type} required></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.begin}</label>
                            <input className='item_list_2_column input_popup' type="datetime-local" value={beginDate} onChange={(e) => setBeginDate(e.target.value)} required></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.end}</label>
                            <input className='item_list_2_column input_popup' type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} required></input>
                        </div>
                        <div className="div_list_2_column">
                            <label className='item_list_2_column'>{traduction.isPublic}</label>
                            
                            <input className='item_list_2_column' type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}></input>
                        </div>
                        <div className='div_button_popup'>
                            <button id='btSave' className="button_class">{traduction.save}</button>
                            {event !== undefined && <button id='btSuppr' className="button_class" onClick={onDelete}>{traduction.delete}</button>}
                        </div>
                        
                    </form>
                </div>
            )}
        </>
    );
};