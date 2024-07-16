import React, { useEffect, useState } from 'react';
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

    const handleSave = () => {
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
                    <div className="popup-inner">
                        <img src='/icone/return.png' onClick={handleClose} className='taille_icone'></img>
                        <div className="content">
                            <div className="div_padding5_vertical">
                                <input value={name} className="input" onChange={(e) => setName(e.target.value)}></input>
                            </div>
                            <div className="div_padding5_vertical">
                                <input value={type} className="input" onChange={(e) => setType(e.target.value)}></input>
                            </div>
                            <div className="div_padding5_vertical">
                                <input type="datetime-local" value={beginDate} className="input" onChange={(e) => setBeginDate(e.target.value)}></input>
                            </div>
                            <div className="div_padding5_vertical">
                                <input type="datetime-local" value={endDate} className="input" onChange={(e) => setEndDate(e.target.value)}></input>
                            </div>
                            <div className="div_padding5_vertical">
                                <label style={{width: "fit-content", paddingRight:"10px"}}>{traduction.isPublic}</label>
                                
                                <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)}></input>
                            </div>
                        </div>
                        <button id='btSave' className="button_class" onClick={handleSave}>{traduction.save}</button>
                        {event !== undefined && <button id='btSuppr' className="button_class" onClick={onDelete}>{traduction.delete}</button>}
                    </div>
                </div>
            )}
        </>
    );
};