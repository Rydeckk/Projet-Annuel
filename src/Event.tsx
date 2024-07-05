import React, { useEffect, useState } from "react";
import traduction from "../traductions/traduction.json"
import { Evenement } from "./request/requestEvent";
import { PopupEvent } from "./popupEvent";

export type EventProps = {
    event: Evenement,
    onDelete: () => void,
    onSave: (e: Evenement) => void
}

export function Event(props: EventProps) {
    const [beginDate, setBeginDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleSave = () => {
        props.onSave(props.event)
    }

    useEffect(() => {
        if(props.event) {
            setBeginDate(new Date(props.event.beginDate).toLocaleDateString('fr-FR') 
            + " " + new Date(props.event.beginDate).getHours().toLocaleString('fr-FR').padStart(2, '0')
            + ":" + new Date(props.event.beginDate).getMinutes().toLocaleString('fr-FR').padStart(2, '0'))
            setEndDate(new Date(props.event.endDate).toLocaleDateString('fr-FR')
            + " " + new Date(props.event.endDate).getHours().toLocaleString('fr-FR').padStart(2, '0')
            + ":" + new Date(props.event.endDate).getMinutes().toLocaleString('fr-FR').padStart(2, '0'))
        }
        
      }, [props.event]);

    return (
        <div className="event_card">
            <div className="div_flex_end">
                <img src="/icone/crayon.png" className="taille_icone" onClick={togglePopup}></img>
                <PopupEvent 
                    isOpen={isOpen} 
                    handleClose={togglePopup}
                    onSave={handleSave}
                    onDelete={props.onDelete}
                    event={props.event} />
            </div>
            <div className="div_align_center div_padding5_vertical">
                <label>{props.event?.name}</label>
            </div>
            <div className="div_align_center div_padding5_vertical">
                <label>{props.event?.type}</label>
            </div>
            <div className="div_align_center div_padding5_vertical">
                <label>{beginDate}</label>
            </div>
            <div className="div_align_center div_padding5_vertical">
                <label>{endDate}</label>
            </div>
            <div className="div_align_center div_padding5_vertical">
                <label>{props.event?.isPublic}</label>
            </div>
            <div className="div_align_center div_padding5_vertical">
                <div>
                    <button className="button_class" onClick={props.onDelete}>{traduction.delete}</button>
                </div>
            </div>
        </div>
    )
}