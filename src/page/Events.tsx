import React, { useEffect, useState } from "react";
import traduction from "../../traductions/traduction.json"
import { Event } from "../component/Event";
import { useAssoContext, useUserContext } from "../main";
import { createEvent, deleteEvent, Evenement, getListEvent, getListEventPublic, participateEvent, updateEvent } from "../request/requestEvent";
import { PopupEvent } from "../component/popupEvent";
import { getState } from "../utils/utils-function";

export function Events() {
    const [eventList, setEventList] = useState<Array<Evenement>>([])
    const [isOpen, setIsOpen] = useState(false);
    const asso = useAssoContext()
    const user = useUserContext()

    useEffect(() => {
    
        const getEvents = async () => {
            try {
                if(asso.asso !== null) {
                    const response = await getListEvent(asso.asso.domainName)
                    setEventList(response.event)
                }
            } catch (error) {
                if(asso.asso !== null) {
                    const response = await getListEventPublic(asso.asso.domainName)
                    setEventList(response.event)
                }
            }
        }
        getEvents()
    }, [])

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const onSave = async (eventCreate: Evenement) => {
        if(asso.asso) {
            const eventCreated = await createEvent({
                name: eventCreate.name,
                type: eventCreate.type,
                beginDate: eventCreate.beginDate,
                endDate: eventCreate.endDate,
                isPublic: eventCreate.isPublic
            },asso.asso.domainName)
            setEventList([...eventList,eventCreated])
        }
        
        setIsOpen(false)
    }

    const onUpdate = async (eventUpdated: Evenement) => {
        setEventList(eventList.map((event) => (event.id === eventUpdated.id ? eventUpdated : event)))
        if(asso.asso) {
            updateEvent(eventUpdated,asso.asso.domainName)
        }
    }

    const onDelete = async (eventDelete: Evenement) => {
        setEventList(eventList.filter((e) => e.id !== eventDelete.id))
        if(asso.asso) {
            deleteEvent(eventDelete.id,asso.asso.domainName)
        }
        
    }

    const handleParticipate = async (eventAssist: Evenement) => {
        if(asso.asso) {
            const eventAssisted = await participateEvent(eventAssist, asso.asso.domainName)
            setEventList(eventList.map((event) => event.id === eventAssisted.id ? eventAssisted : event))
        }
    }
    
    return (
        <div>
            <h1 className="title_section">{traduction.event}</h1>
            <div style={{display: "flex"}}>
                <div className="div_content_card">
                    {eventList.map((event) => (
                        <Event 
                        key={event.id} 
                        event={event} 
                        onSave={(event) => onUpdate(event)} 
                        onDelete={() => onDelete(event)}
                        onParticipate={(event) => handleParticipate(event)}></Event>
                    ))}
                </div>
                {user.user?.role.isAdmin && (<div style={{paddingTop: "35px"}}>
                    <img src="/icone/add.png" onClick={togglePopup} style={{height:"30px", width: "30px"}} className="clickable-image"></img>
                </div>)}
            </div>
            <PopupEvent 
                isOpen={isOpen} 
                handleClose={togglePopup}
                onSave={onSave}/>
        </div>
    )
}