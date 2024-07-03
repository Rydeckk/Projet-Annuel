import React, { useEffect, useState } from "react";
import traduction from "../traductions/traduction.json"
import { Association, Evenement, getListEvent } from "./request";
import { Event } from "./Event";
import { useAssoContext } from "./main";


export function Events() {
    const [eventList, setEventList] = useState<Array<Evenement>>([])
    const asso = useAssoContext()
    
    if(asso.asso !== null) {
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
        }, [asso.asso.domainName])
    
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
}