import React, { useEffect, useState } from "react";
import traduction from "../traductions/traduction.json"
import { Association, Evenement, getListEvent } from "./request";
import { Event } from "./Event";

export interface EventProps {
    asso: Association
}

export function Events(props: EventProps) {
    const [eventList, setEventList] = useState<Array<Evenement>>([])
    
    useEffect(() => {
        
        const getEvents = async () => {
            try {
            const response = await getListEvent(props.asso.domainName)
            setEventList(response.event)
            } catch (error) {
                setEventList([])
            }
        }
        getEvents()
    }, [props.asso.domainName])

    return (
        <div>
            <h1>{traduction.event}</h1>
            <div style={{paddingTop: "20px"}}>
                {eventList.map((event) => (
                    <Event key={event.id} event={event}></Event>
                ))}
            </div>
        </div>
    )
}