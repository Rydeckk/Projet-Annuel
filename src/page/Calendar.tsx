import React from "react";
import traduction from "../../traductions/traduction.json"
import { Association } from "../request/request";

export function Calendar() {
    return (
        <div>
            <h1>{traduction.calendar}</h1>
        </div>
    )
}