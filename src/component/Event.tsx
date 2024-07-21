import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Evenement } from "../request/requestEvent";
import { PopupEvent } from "./popupEvent";
import { useUserContext } from "../main";
import { formatDateToLocalString } from "../utils/utils-function";

export type EventProps = {
    event: Evenement,
    onDelete: () => void,
    onSave: (e: Evenement) => void
}

export function Event({event, onDelete, onSave}: EventProps) {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserContext()

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleSave = (eventUpdated: Evenement) => {
        onSave(eventUpdated)
    }

    return (
        <div className="item_card">
            <div className="div_flex_end">
                {user.user?.role.isAdmin && (<img src="/icone/crayon.png" className="taille_icone" onClick={togglePopup}></img>)}
            </div>
            <div className="div_column">
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{traduction.event_title} : </label>
                    <label className="item_list_2_column">{event?.name}</label>
                </div>
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{traduction.event_type} : </label>
                    <label className="item_list_2_column">{event?.type}</label>
                </div>
                <div className="div_list_2_column" >
                    <label className="item_list_2_column">{traduction.event_begin} : </label>
                    <label className="item_list_2_column">{formatDateToLocalString(event.beginDate)}</label>
                </div>
                <div className="div_list_2_column" >
                    <label className="item_list_2_column">{traduction.event_end} : </label>
                    <label className="item_list_2_column">{formatDateToLocalString(event.endDate)}</label>
                </div>
                <div className="div_list_2_column">
                    <label className="item_list_2_column">{event?.isPublic ? traduction.event_public : traduction.event_no_public}</label>
                </div>
            </div>
            {user.user?.role.isAdmin && (<div className="div_align_center div_padding5_vertical">
                <div>
                    <button className="button_class" onClick={onDelete}>{traduction.delete}</button>
                </div>
            </div>)}
            <PopupEvent 
                    isOpen={isOpen} 
                    handleClose={togglePopup}
                    onSave={handleSave}
                    onDelete={onDelete}
                    event={event} />
        </div>
    )
}