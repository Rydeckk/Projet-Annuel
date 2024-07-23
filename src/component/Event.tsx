import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Evenement } from "../request/requestEvent";
import { PopupEvent } from "./popupEvent";
import { useUserContext } from "../main";
import { formatDateToLocalString, getState } from "../utils/utils-function";

export type EventProps = {
    event: Evenement,
    onDelete: () => void,
    onSave: (e: Evenement) => void,
    onParticipate: (e: Evenement) => void
}

export function Event({event, onDelete, onSave, onParticipate}: EventProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState<"not_begin" | "pending" | "finish">("not_begin")
    const [isEnabled, setIsEnabled] = useState<boolean>(true)
    const user = useUserContext()

    useEffect(() => {
        setState(getState(event.beginDate, event.endDate))
    }, [])

    useEffect(() => {
        //Verif si l'utilisateur ne participe pas déjà
    }, [event])

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleSave = (eventUpdated: Evenement) => {
        onSave(eventUpdated)
    }

    const handleParticipate = () => {
        onParticipate(event)
    }

    return (
        <div className="item_card">
            {user.user?.role.isAdmin && state === "not_begin" && (<div className="div_flex_end">
                {user.user?.role.isAdmin && (<img src="/icone/crayon.png" className="taille_icone" onClick={togglePopup}></img>)}
            </div>)}
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
                <div className="div_list_2_column" >
                    <label className="item_list_2_column">{traduction.state} : </label>
                    <label className="item_list_2_column">{state === "finish" ? traduction.finish : (state === "pending" ? traduction.pending : traduction.not_begin)}</label>
                </div>
            </div>
            {user.user?.role.isAdmin && state === "not_begin" && (<div className="div_align_center div_padding5_vertical">
                <div>
                    <button className="button_class" onClick={onDelete}>{traduction.delete}</button>
                    <button className="button_class" onClick={handleParticipate} disabled={!isEnabled}>{traduction.event_assist}</button>
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