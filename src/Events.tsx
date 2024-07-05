import React, { useEffect, useState } from "react";
import traduction from "../traductions/traduction.json"
import { Event } from "./Event";
import { useAssoContext } from "./main";
import { createEvent, deleteEvent, Evenement, getListEvent, updateEvent } from "./request/requestEvent";
import { PopupEvent } from "./popupEvent";


export function Events() {
    const [eventList, setEventList] = useState<Array<Evenement>>([])
    const asso = useAssoContext()
    const [isOpen, setIsOpen] = useState(false);

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

    useEffect(() => {
    
        const getEvents = async () => {
            try {
                if(asso.asso !== null) {
                    const response = await getListEvent(asso.asso.domainName)
                    setEventList(response.event)
                }
            } catch (error) {
                setEventList([])
            }
        }
        getEvents()
    }, [])
    
    return (
        <div>
            <h1>{traduction.event}</h1>
            <div>
                <div style={{paddingTop: "20px"}}>
                    {eventList.map((event) => (
                        <Event 
                        key={event.id} 
                        event={event} 
                        onSave={(event) => onUpdate(event)} 
                        onDelete={() => onDelete(event)}></Event>
                    ))}
                </div>
                <div>
                    <img src="/icone/add.png" onClick={togglePopup}></img>
                </div>

                <PopupEvent 
                isOpen={isOpen} 
                handleClose={togglePopup}
                onSave={onSave}/>
            </div>
        </div>
    )
}