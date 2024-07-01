import React, { useEffect, useState } from "react";
import { Evenement } from "./request";

export type EventProps = {
    event: Evenement
}

export function Event(props: EventProps) {
    const [beginDate, setBeginDate] = useState<string>("")
    const [endDate, setEndDate] = useState<string>("")

    useEffect(() => {
        setBeginDate(new Date(props.event.beginDate).toLocaleDateString('fr-FR').concat(" " + new Date(props.event.beginDate).toLocaleTimeString('fr-FR')));
        setEndDate(new Date(props.event.endDate).toLocaleDateString('fr-FR').concat(" " + new Date(props.event.endDate).toLocaleTimeString('fr-FR')));
      }, [props.event.beginDate, props.event.endDate]);

    return (
        <div className="event_card">
            <div className="div_padding5_vertical">
                <label>{props.event.name}</label>
            </div>
            <div className="div_padding5_vertical">
                <label>{props.event.type}</label>
            </div>
            <div className="div_padding5_vertical">
                <label>{beginDate}</label>
            </div>
            <div className="div_padding5_vertical">
                <label>{endDate}</label>
            </div>
        </div>
    )
}