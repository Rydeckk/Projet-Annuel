import React from "react";
import traduction from "../traductions/traduction.json"
import { Association } from "./request";

export interface CalendarProps {
    asso: Association
}

export function Calendar(props: CalendarProps) {
    return (
        <div>
            <h1>{traduction.calendar}</h1>
        </div>
    )
}